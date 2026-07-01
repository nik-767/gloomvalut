from django.test import TestCase
from django.contrib.auth.models import User


class RegisterViewTests(TestCase):
    def test_duplicate_username_shows_error_message(self):
        User.objects.create_user(username="existing", password="secret123")

        response = self.client.post(
            "/",
            {"username": "existing", "password": "secret123"},
        )

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Username already exists")
