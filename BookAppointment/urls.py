"""BookAppointment URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
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
from django.urls import path, include
from django.contrib.auth.models import User
from rest_framework import routers
from main import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('ReqAppointment/',views.reqAppointment), #request Appointment here
    path('checkAppointments/',views.checkBookings), #check appointments here
    path('login/', views.GetAuthToken.as_view()), #sends token to client when valid username password provided
    path('hospitalList/', views.hospitalList), # get hospital list
    path('checkToken/', views.checkToken), # check token validity
    path('availableTime/', views.availableTime), # check availableTime
]
