from django.db import models
from django.contrib.auth.models import User

from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)

# Create your models here.
class patient(models.Model):
	email 	= models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient')
	name 	= models.CharField(max_length=50, blank=False)

	def __str__(self):
		return self.name

class hospital(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='hospital')
	name = models.CharField(max_length=50,blank=False)
	def __str__(self):
		return self.name


class appointment(models.Model):
	user = models.ForeignKey(patient, on_delete=models.CASCADE, related_name='appointments')
	venue = models.DateTimeField(primary_key=True,blank=False)
	hospital = models.ForeignKey(hospital, on_delete=models.CASCADE, related_name='appointments')

	def __str__(self):
		return str(self.user)
