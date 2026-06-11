from django.shortcuts import render , redirect 
from .models import *
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout 
from django.shortcuts import get_object_or_404
from django.db.models import Q
from rest_framework.views import APIView , Response
from rest_framework import viewsets , status
from .serializer import gloomvalutseralizer , Registerseralizer , loginseralizer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny

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
            castle__icontains = search
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

def Update_view(request, id):
    update = get_object_or_404(Review, id=id)
    if request.method == "POST":
        update.comment = request.POST.get('comment')
        update.rating = request.POST.get('rating')

        update.save()
        return redirect('review_view' ,Destination_id=update.destination_id)

    return render(request, 'update.html', {'update': update})

    

class gloomvalutview(viewsets.ModelViewSet):
    queryset = Destination.objects.all()
    
    serializer_class = gloomvalutseralizer

# creating a function to genrate tokens first 
def genrate_token(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access' :str(refresh.access_token),
    }

class Register_api(APIView):
    
    permission_classes = [AllowAny]    # Is endpoint par koi bhi bina token ke aa sakta hai
    authentication_classes = [] #gloabal settings allow kragega

    def post(self,request):
        serializer = Registerseralizer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            tokens = genrate_token(user)
            return Response({
                "message" : "register successfully",
                "tokens" : tokens
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
def delete_review(request, id):
    # 1. Fetch the review object
    review = get_object_or_404(Review, id=id)
    
    # 2. Save the destination ID so we know where to redirect back to
    # (Assumes your Review model has a foreign key to Destination, adjust field name if necessary)
    destination_id = review.destination.id 
    
    # 3. Delete from database
    review.delete()
    
    # 4. Redirect back to the review page with its required ID argument
    return redirect('review_view', Destination_id=destination_id)