from rest_framework import serializers
from .models import Destination , Review , Profile , Follow , Tag
from django.contrib.auth.models import User

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = "__all__"

class gloomvalutseralizer(serializers.ModelSerializer):
    tags_detail = TagSerializer(source='tags', many=True, read_only=True)
    posted_by_username = serializers.CharField(source='posted_by.username', read_only=True, allow_null=True)

    class Meta:
        model = Destination
        fields = "__all__"

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


