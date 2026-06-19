from django.contrib import admin
from .models import Destination , Review , Tag , Follow

# Register your models here.
admin.site.register(Destination)
admin.site.register(Review)
admin.site.register(Tag)
admin.site.register(Follow)
