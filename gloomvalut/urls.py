"""
URL configuration for gloomvalut project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from core.views import * 
from rest_framework import routers
from core import views
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)

router = routers.DefaultRouter()
router.register(r'gloomvalutview', views.gloomvalutview)
router.register(r'Reviewview', views.Reviewview)
router.register(r'profileview', views.Profileview)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', Register, name='register'),
    path('login/', login_view, name='login'),
    path('home/', home , name='home' ),
    path('review/<int:Destination_id>/', review_view, name='review_view'),
    path('delete/<int:id>/', views.delete_review, name='delete_review'),
    path('review/<int:id>/update.html', Update_view, name='Update_view'),
    path('update/<int:id>/', views.Update_castle, name='update_card'),
    path('delete_card/<int:id>/', views.delete_castle, name='delete_castle'),
    path('profile/', views.Profiles, name='profile'),
    path('profile_update', views.Profile_upd, name='Profile_upd'),
    path('follow/<int:user_id>/', views.Follows, name='follow'),
    path('profile_view/<int:user_id>/', views.Public_profile, name='public_profile'),
    path('feed/', views.Feed, name='feed'),
    path('api/register/',Register_api.as_view(), name='auth_register'),
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/reviews/<int:destination_id>/', ReviewAPI.as_view(), name='reviews'),
    path('api/', include(router.urls)),



]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
