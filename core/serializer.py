from rest_framework import serializers
from .models import Destination , Review , Profile , Follow
from django.contrib.auth.models import User

class gloomvalutseralizer(serializers.ModelSerializer):
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

    def create(self,validated_data):
    # hash the plan text pass automatically 
        return User.objects.create_user(
        username= validated_data['username'],
        password= validated_data['password'],
        email= validated_data['email']
    )

class loginseralizer(serializers.Serializer):
    username = serializers.CharField(required = True)
    password = serializers.CharField(required = True, write_only= True)

class Reviewseralizer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"
    
class Profileseralizer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = "__all__"

class Followseralizer(serializers.ModelSerializer):

    class Meta:
        model = Follow
        fields = '__all__'

