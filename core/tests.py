from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Destination, Review, Profile, Follow


class RegisterViewTests(TestCase):
    def test_duplicate_username_shows_error_message(self):
        User.objects.create_user(username="existing", password="secret123")

        response = self.client.post(
            "/",
            {"username": "existing", "password": "secret123"},
        )

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Username already exists")


class DestinationSearchViewTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="password")
        self.client.force_login(self.user)
        self.dest1 = Destination.objects.create(
            posted_by=self.user,
            castle="Neuschwanstein",
            country="Germany",
            description="Famous fairytale castle.",
            atmosphere=4.8
        )
        self.dest2 = Destination.objects.create(
            posted_by=self.user,
            castle="Bran Castle",
            country="Romania",
            description="Dracula's castle.",
            atmosphere=4.2
        )
        # Create reviews for dest1 to check rating average
        Review.objects.create(comment="Amazing!", rating=10, user=self.user, destination=self.dest1)
        Review.objects.create(comment="Cool", rating=8, user=self.user, destination=self.dest1)

    def test_destination_search_retains_average_rating(self):
        # GET request home with search parameter matching 'Neuschwanstein'
        response = self.client.get(reverse('home'), {'castle': 'Neuschwanstein'})
        self.assertEqual(response.status_code, 200)
        
        # Check if the page_obj contains dest1 and its average rating is annotated correctly
        page_obj = response.context['page_obj']
        self.assertEqual(len(page_obj), 1)
        self.assertEqual(page_obj[0].castle, "Neuschwanstein")
        self.assertEqual(page_obj[0].Avg_rate, 9.0)  # (10 + 8) / 2 = 9.0


class FollowCountsTests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username="user1", password="password")
        self.user2 = User.objects.create_user(username="user2", password="password")
        # Profiles are created via signals or manually. Let's make sure they exist:
        self.profile1, _ = Profile.objects.get_or_create(user=self.user1)
        self.profile2, _ = Profile.objects.get_or_create(user=self.user2)
        
        # User 1 follows User 2
        Follow.objects.create(followers=self.user1, following=self.user2)

    def test_public_profile_counts(self):
        # Check profile of user2 (should have 1 follower, 0 following)
        response = self.client.get(reverse('public_profile', kwargs={'user_id': self.user2.id}))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.context['followers_count'], 1)
        self.assertEqual(response.context['following_count'], 0)

        # Check profile of user1 (should have 0 followers, 1 following)
        response = self.client.get(reverse('public_profile', kwargs={'user_id': self.user1.id}))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.context['followers_count'], 0)
        self.assertEqual(response.context['following_count'], 1)

    def test_profile_api_counts(self):
        # Force authentication for DRF API view
        self.client.force_authenticate(user=self.user1)
        
        # Check ProfileAPI for user2
        response = self.client.get(reverse('profile_API', kwargs={'user_id': self.user2.id}))
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['followers_count'], 1)
        self.assertEqual(data['following_count'], 0)

    def test_follow_api_keys(self):
        # Force authentication for DRF API view
        self.client.force_authenticate(user=self.user1)
        response = self.client.get(reverse('follow_api', kwargs={'user_id': self.user2.id}))
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # 'followerse' counts the followers of user2 (user1).
        # 'following' counts the users user2 follows (none).
        self.assertEqual(len(data['followerse']), 1)
        self.assertEqual(len(data['following']), 0)


class DeleteReviewTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="password")
        self.client.force_login(self.user)
        self.dest = Destination.objects.create(
            posted_by=self.user,
            castle="Neuschwanstein",
            country="Germany",
            description="Famous fairytale castle.",
            atmosphere=4.8
        )
        self.review = Review.objects.create(
            comment="Amazing!",
            rating=10,
            user=self.user,
            destination=self.dest
        )

    def test_delete_review_via_get_request(self):
        # Verify review exists
        self.assertTrue(Review.objects.filter(id=self.review.id).exists())
        
        # Call delete_review via GET request
        response = self.client.get(reverse('delete_review', kwargs={'id': self.review.id}))
        
        # Assert redirected to review_view
        self.assertRedirects(response, reverse('review_view', kwargs={'Destination_id': self.dest.id}))
        
        # Assert review is deleted
        self.assertFalse(Review.objects.filter(id=self.review.id).exists())
