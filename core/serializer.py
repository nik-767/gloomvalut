from rest_framework import serializers
from .models import Destination

class gloomvalutseralizer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = '__all__'