from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Destination(models.Model):
    castle = models.CharField(max_length=100, unique=True)
    country = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to="static")
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