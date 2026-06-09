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


router = routers.DefaultRouter()
router.register(r'gloomvalutview', views.gloomvalutview)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', Register, name='register'),
    path('login/', login_view, name='login'),
    path('home/', home , name='home' ),
    path('review/<int:Destination_id>/', review_view, name='review_view'),
    path('review/<int:id>/update.html', Update_view, name='Update_view'),
    path('api/', include(router.urls)),



]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
