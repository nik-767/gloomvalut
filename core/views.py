from django.shortcuts import render , redirect
from .models import *
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout 
from django.shortcuts import get_object_or_404
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
        
        return redirect('login')
    
    return render(request, "core/register.html")

def login_view(request):

    error = None
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            error = 'Invalid username or password.'

    return render(request, 'core/login.html', {'error': error})
    

def review_view(request , Destination_id ):
    watching = get_object_or_404(Destination, id=Destination_id)

    if request.method == "POST":
        rating = request.POST.get("rating")
        comment = request.POST.get("comment")

        adding = Review(
            comment = comment,
            rating = rating,
            user=request.user,          # The currently logged-in user
            destination=watching 
        )
        adding.save()

    return render(request, 'core/review.html', {'watching': watching})