from django.db import models
import string
import random

def generate_unique_code():
    length = 6

    while True:
        code = ''.join(random.choices(string.ascii_uppercase, k=length))
        if RoomModel.objects.filter(code=code).count() == 0:
            break

    return code

class RoomModel(models.Model):
    code= models.CharField(max_length=100, default=generate_unique_code, unique=True)
    room_name=models.CharField(max_length=100 ,default=" ")
    host=models.CharField(max_length=100 ,default=" ")
    user_can_pass_songs=models.BooleanField(default=False)
    votes_to_switch_type_is_num=models.BooleanField(default=True)
    votes_to_switch=models.IntegerField(default=1)
    is_active=models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    users_in_room= models.IntegerField(default=1)
