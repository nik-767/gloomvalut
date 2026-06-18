from django.shortcuts import render , redirect 
from .models import *
from django.http import HttpResponse , HttpResponseForbidden
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout 
from django.shortcuts import get_object_or_404
from django.db.models import Q
from rest_framework.views import APIView , Response 
from rest_framework import viewsets , status
from .serializer import gloomvalutseralizer , Registerseralizer , loginseralizer , Reviewseralizer , Profileseralizer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from django.db.models import Avg  
from django.core.paginator import Paginator
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied


# Create your views here.

from django.shortcuts import render, redirect
from django.db.models import Avg
from .models import Destination

@login_required
def home(request):
    # 1. Agar user form submit kare (POST Request)
    if request.method == "POST":
        castle = request.POST.get("castle")
        country = request.POST.get("country")
        description = request.POST.get("description")
        image = request.FILES.get("image")
        atmosphere = request.POST.get("atmosphere")
        
        
        # Naya castle object banaya aur save kiya
        add_dest = Destination(
            posted_by=request.user,  # when the user create a destination, it will be linked to that user and saved automatically in the database.
            country=country,
            castle=castle,
            atmosphere=atmosphere,
            description=description,
            image=image,
        )
        add_dest.save()
        return redirect('home') # Refresh bug se bachne ke liye redirect
    
    # 2. Page par data dikhane ka logic (GET Request)
    search = request.GET.get("castle")
    
    if search:
        # Agar search kiya, toh filtered data dikhao (Bina rating ke)
        dest = Destination.objects.filter(castle__icontains=search)
    else:
        # Agar search nahi kiya, toh saare castles par live Avg Rating chipkao
        dest = Destination.objects.annotate(Avg_rate=Avg('review__rating'))

    paginator = Paginator(dest,6)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    return render(request, "core/home.html",{"page_obj" : page_obj, "search":search})

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
        Profile.objects.create(user=user)
        
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
    

def review_view(request, Destination_id):
    # 1. URL se aayi hui ID ke hisab se database se Destination (Castle/Jaga) nikaalo. Agar nahi mili toh 404 error de do.
    watching = get_object_or_404(Destination, id=Destination_id)
    
    # 2. Database mein check karo ki kya IS current user ne IS specific destination par pehle se koi review diya hai.
    rev = Review.objects.filter(user=request.user, destination=watching)
    
    # 3. Agar user ne form submit kiya hai (Submit button dabane par POST request aati hai)
    if request.method == "POST":
        
        # 4. Agar upar lagaya hua filter sach ho gaya (matlab review pehle se database mein mil gaya)
        if rev.exists():
            # 5. User ko aage badhne se rok do aur screen par error message dikha do
            return HttpResponse("review already exist")

        # 6. Agar pehle se review nahi hai, toh form se bheji gayi rating aur comment ko utha lo
        rating = request.POST.get("rating")
        comment = request.POST.get("comment")

        # 7. Review model ka ek naya object banao aur usmein saara data fill (map) kar do
        adding = Review(
            comment=comment,
            rating=rating,
            user=request.user,          # Jisne login kiya hua hai
            destination=watching         # Jis destination ka page khula hai
        )
        
        # 8. Is naye review data ko database ke andar hamesha ke liye save kar do
        adding.save()
        
        # 9. [PRG Pattern]: Save karne ke baad user ko dobara ISI page ke URL par redirect (bhej) do.
        # Isse user agar page refresh (F5) karega, toh duplicate review submit nahi hoga.
        return redirect('review_view', Destination_id=Destination_id)

    # 10. Agar request POST nahi hai (matlab user ne sirf pehli baar page khola hai - GET request)
    # Toh chupchap user ko 'review.html' ka web page load karke dikha do.
    return render(request, 'core/review.html', {'watching': watching})

@login_required
def Update_view(request, id):
    update = get_object_or_404(Review, id=id)
 
    # FIX 3: was "else: update.user != request.user" which does nothing
    # and "return Response()" which crashes in a regular view
    if update.user != request.user:
        return HttpResponseForbidden("You can only edit your own reviews.")
 
    if request.method == "POST":
        update.comment = request.POST.get('comment')
        update.rating  = request.POST.get('rating')
        update.save()
        return redirect('review_view', Destination_id=update.destination_id)
 
    # FIX 4: was 'update.html' — missing core/ prefix
    return render(request, 'core/update.html', {'update': update})
 

@login_required
def delete_review(request, id):
    # 1. Fetch the review object
    review = get_object_or_404(Review, id=id)
    if review.user != request.user:
        raise PermissionDenied
    if request.method == "POST":
    # 2. Save the destination ID so we know where to redirect back to
    # (Assumes your Review model has a foreign key to Destination, adjust field name if necessary)
        destination_id = review.destination.id 
    # 3. Delete from database
        review.delete()
        return redirect('review_view', Destination_id=destination_id)
    # 4. Agar koi direct URL open kare (GET request), to bina delete kiye wapas bhej do
    return redirect('review_view', Destination_id=review.destination_id)

@login_required
def Update_castle(request, id):
    data = get_object_or_404(Destination, id=id)

    if request.method == "POST":
        data.castle = request.POST.get('castle')
        data.country = request.POST.get('country')
        data.description = request.POST.get('description')
        if request.FILES.get('image'):
            data.image = request.FILES.get('image')
        data.atmosphere = request.POST.get('atmosphere')

        data.save()

        return redirect('home')
    
    return render(request, 'core/update_card.html', {'dest': data})

def delete_castle(request, id):
    delete_data = get_object_or_404(Destination , id=id)
    

    delete_data.delete()

    return redirect('home')

@login_required
def Profiles(request):
    profile, created = Profile.objects.get_or_create(user=request.user)
     # 2. Related Name ('destinations') use karke sirf is logged-in user ke saare posts nikaalein
    user_posts = request.user.destinations.all() #Give me all destinations created by this user.

    return render(
        request,
        "core/profile.html",
        {"profile": profile,
        "user_posts" : user_posts}
    )

@login_required
def Profile_upd(request):
    update = get_object_or_404(Profile, user=request.user)
    if request.method == 'POST':
        update.bio = request.POST.get('bio')
        if request.FILES.get('pic'):
            update.pic = request.FILES.get('pic')
        
        update.save()

        return redirect('profile')

    return render(request,'core/profile_upd.html', {'profile': update} )



# apis 
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

class Reviewview(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = Reviewseralizer

class Profileview(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = Profileseralizer