from django.shortcuts import render , redirect
from .models import *
from django.contrib.auth.models import User
# Create your views here.

def home(request):
    dest = Destination.objects.all()

    return render(request, "core/home.html", {"dest": dest})

def Register(request):
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get("password")

        user = User.objects.create_user(
            username=username,
            password= password
        )

        
        
        return redirect('home')
    
    return render(request, "core/register.html")