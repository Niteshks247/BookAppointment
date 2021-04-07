from django.contrib.auth.models import User
from rest_framework import serializers
from main.models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email']

class patientSerializer(serializers.ModelSerializer):
    email = serializers.StringRelatedField()

    class Meta:
        model = patient
        fields = ['email', 'name']

class AppointmentSerializer(serializers.ModelSerializer):
    user = patientSerializer()

    class Meta:
        model = appointment
        fields = ['user', 'venue']
        depth=1

class hospitalSerializer(serializers.ModelSerializer):
    class Meta:
        model = hospital
        fields = ['id', 'name']
