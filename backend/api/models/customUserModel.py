from django.db import models
from django.contrib.auth.models import AbstractUser



class CustomUserModel(AbstractUser):
    username = models.CharField(max_length=50, unique=True)
    host = models.BooleanField(False)
    room = models.CharField(max_length=100)