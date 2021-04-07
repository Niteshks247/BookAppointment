from django.shortcuts import render
from django.contrib.auth.models import User
from main.serializers import UserSerializer, AppointmentSerializer, hospitalSerializer
from rest_framework import viewsets,permissions
from main.permissions import IsRelatedToHospital
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from main import models
import datetime
from django.utils import timezone
import pytz
timezone.now()

@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def checkToken(request):
    """
    To verify saved tokens
    """
    token = request.headers['Authorization'].split()[1]
    try:
        print(token)
        obj = Token.objects.get(key = token)
        status = True
    except Token.DoesNotExist:
        status = False
    try:
        type = 2
        hosp = obj.user.hospital
    except models.User.hospital.RelatedObjectDoesNotExist:
        type = 1
    return Response({'status':status,'type':type})

@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def availableTime(request):
    """
    To find free schedule of Hospital and Patient on designated date and hospital.
    """
    date = list(map(int,request.data.get('date',"").split('/')))
    hosp = request.data.get('hosp',"")
    date = datetime.date(date[2], date[0], date[1])
    print(date,hosp)
    taken = models.appointment.objects.filter(venue__date=date,hospital__id=hosp)
    print(taken)
    total = [f"{i}:{j}" for i in range(24) for j in ['0','30']]
    taken = [f"{i.venue.hour}:{i.venue.minute}" for i in taken]
    print(taken)
    times = list(set(total).difference(set(taken)))
    print("times",times)
    times.sort()
    return Response({'times':times})

@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def hospitalList(request):
    """
    TO get the names of all Hospitals registered on the App.
    """
    hosps = models.hospital.objects.all()
    serializer = hospitalSerializer(hosps,many=True,context={'request':request})
    return Response({'hospitals':serializer.data})

@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def reqAppointment(request):
    """
    For the Patient to send appointment request to.
    """
    date = request.data.get('date',"").lower()
    time = request.data.get('time',"")
    hosp = request.data.get('hosp',"")
    hosp = models.hospital.objects.get(id=int(hosp))
    status = False
    error = None
    if date!="" and time != "" and hosp != "":
        #checkDateTimeEmpty(date,time)
        date = list(map(int,date.split("/")))
        time = list(map(int,time.split(":")))
        moment = datetime.datetime(date[2], date[0], date[1], time[0], 30*(time[1]//30), 0, 0,tzinfo=pytz.UTC) #eg: (2015, 10, 09, 23, 55, 59, 342380)
        existing = models.appointment.objects.filter(venue=moment,hospital__id=hosp.id).first()
        print(existing)
        if not existing:
            #checkPatientEmpty(date,time)
            existing = models.appointment.objects.filter(venue=moment,user__email__id=request.user.id).first()

            if not existing:
                #createModel
                newAppointment = models.appointment(user=request.user.patient,
                    hospital=hosp,
                    venue=moment)
                newAppointment.save()
                status = True
            else:
                error = "Patient busy"
        else:
            error = "hospital busy"

    return Response({'status':status,'error':error})

@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated,IsRelatedToHospital])
def checkBookings(request):
    """
    For hospitals to check all bookings for the same.
    """
    date = request.data.get('date',"").lower()
    try:
        hosp = request.user.hospital
    except models.User.hospital.RelatedObjectDoesNotExist:
        status = False
        return Response({'error':'Not Authorized'})
    if date!="" and hosp is not None:
        #checkDateTimeEmpty(date,time)
        date = list(map(int,date.split("/")))
        moment = datetime.date(date[2], date[0], date[1]) #eg: (2015, 10, 09, 23, 55, 59, 342380)
        bookings = models.appointment.objects.filter(venue__date=moment,hospital__id=hosp.id)
        serializer = AppointmentSerializer(bookings,many=True,context={'request':request})
    else:
        return Response({'error':'Invalid Data'})
    return Response({'bookings':serializer.data})

#Tokenizer for authentication purpose
class GetAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        try:
            type = 2
            hosp = user.hospital
        except models.User.hospital.RelatedObjectDoesNotExist:
            type = 1
        return Response({
            'token': token.key,
            'type': type
        })
