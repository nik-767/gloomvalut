import os

from rest_framework import serializers
from .models import Destination , Review , Profile , Follow , Tag
from django.contrib.auth.models import User
from django.conf import settings

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = "__all__"

class gloomvalutseralizer(serializers.ModelSerializer):
    tags_detail = TagSerializer(source='tags', many=True, read_only=True)
    posted_by_username = serializers.CharField(
        source='posted_by.username',
        read_only=True,
        allow_null=True
    )

    image = serializers.SerializerMethodField()

    class Meta:
        model = Destination
        fields = "__all__"

    def get_image(self, obj):
        if not obj.image:
            return None
            
        request = self.context.get("request")

        # 1. ALWAYS PREFER THE STORAGE LAYER URL (Essential for Cloudinary / AWS / Render Disks)
        try:
            if obj.image.url:
                # If it's already an absolute cloud URL, return it directly
                if obj.image.url.startswith('http://') or obj.image.url.startswith('https://'):
                    return obj.image.url
                # Otherwise, let Django build the proper domain path
                return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        except Exception:
            pass

        # 2. LOCAL FALLBACK: Look inside your static repository paths
        filename = os.path.basename(obj.image.name or '')
        if filename:
            static_filepath = os.path.join(settings.BASE_DIR, 'static', 'core', 'images', filename)
            if os.path.exists(static_filepath):
                static_url = settings.STATIC_URL.rstrip('/') + f'/core/images/{filename}'
                return request.build_absolute_uri(static_url) if request else static_url

        # 3. FINAL FALLBACK: Map straight to generic static layout pathing
        fallback = settings.STATIC_URL.rstrip('/') + f'/core/images/{filename}'
        return request.build_absolute_uri(fallback) if request else fallback


class Registerseralizer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    class Meta:
        model = User
        fields =  ('id', 'username','email','password')
        extra_kwargs = {      # iska kamm hai exta rules and properties  likhna bina pura fields k pura seralizer likha
        'password' : {'write_only':True}
        }

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value

    def create(self,validated_data):
    # hash the plan text pass automatically 
        user = User.objects.create_user(
        username= validated_data['username'],
        password= validated_data['password'],
        email= validated_data['email']
    )
        Profile.objects.create(user=user)
        return user

class loginseralizer(serializers.Serializer):
    username = serializers.CharField(required = True)
    password = serializers.CharField(required = True, write_only= True)

class Reviewseralizer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    destination_name = serializers.CharField(source='destination.castle', read_only=True)

    class Meta:
        model = Review
        fields = "__all__"
        read_only_fields = ['user', 'destination']

class Profileseralizer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)

    class Meta:
        model = Profile
        fields = "__all__"

class Followseralizer(serializers.ModelSerializer):

    class Meta:
        model = Follow
        fields = '__all__'


