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
        fields = ['user', 'venue','id']

    def to_representation(self, obj):
        representation = super().to_representation(obj)
        user_representation = representation.pop('user')
        for key in user_representation:
            representation[key] = user_representation[key]

        return representation

    def to_internal_value(self, data):
        user_internal = {}
        for key in patientSerializer.Meta.fields:
            if key in data:
                user_internal[key] = data.pop(key)

        internal = super().to_internal_value(data)
        internal['user'] = user_internal
        return internal

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user')
        super().update(instance, validated_data)

        user = instance.user
        for attr, value in user_data.items():
            setattr(user, attr, value)
        user.save()

        return instance

class hospitalSerializer(serializers.ModelSerializer):
    class Meta:
        model = hospital
        fields = ['id', 'name']
