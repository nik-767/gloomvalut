from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Destination(models.Model):
    # with this evey destination now has a user who posted it, and if the user is deleted, the destination will remain but the posted_by field will be set to null.
    posted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='destinations' )
    castle = models.CharField(max_length=100, unique=True)
    country = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to="images/", blank=True, null=True)
    atmosphere = models.FloatField()



    tags = models.ManyToManyField('Tag',related_name="destinations", blank=True)

    def __str__(self):
        return self.castle

class Review(models.Model):
    comment = models.TextField()
    rating = models.IntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE)

    def __str__(self):
        return f"review for{self.destination.castle}"

class Tag(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name
    
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    pic = models.ImageField(upload_to="images/" ,blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        # Isse aap admin panel mein direct username dekh payenge
        return f"{self.user.username}'s Profile"

