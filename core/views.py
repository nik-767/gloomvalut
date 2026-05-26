from django.shortcuts import render
from .models import *
# Create your views here.

def home(request):
    dest = Destination.objects.all()
    return render(request, "core/home.html", {"dest": dest})

