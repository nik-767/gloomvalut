from django.shortcuts import render , redirect
from .models import *
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout 
from django.shortcuts import get_object_or_404
from django.db.models import Q
# Create your views here.

def home(request):
    if request.method == "POST":
        castle = request.POST.get("castle")
        country = request.POST.get("country")
        description = request.POST.get("description")
        image = request.FILES.get("image")
        atmosphere = request.POST.get("atmosphere")

        add_dest = Destination(
            country=country,
            castle=castle,
            atmosphere=atmosphere,
            description=description,
            image=image
        )
        add_dest.save()
        return redirect('home')
    
    search = request.GET.get("castle")
    if search:
        dest = Destination.objects.filter(
            castle__icontains=search
        )
    else:
        dest = Destination.objects.all()


    return render(request, "core/home.html", {"dest": dest})

def Register(request):
    if request.method == "POST":  # 1. Did the user click 'Submit' on the register form?
        username = request.POST.get('username')  # 2. Grab the text they typed into <input name="username">
        password = request.POST.get("password")  # 3. Grab the text they typed into <input name="password">

        # 4. Create the new user. 
        # Crucial concept: We use .create_user() instead of standard .create() 
        # because Django automatically converts the plain text password into a secure hash.
        user = User.objects.create_user(
            username=username,
            password=password
        )
        
        return redirect('login')  # 5. Send them straight to the login page
    
    return render(request, "core/register.html")  # 6. If they just arrived (GET), show them the blank signup form

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

