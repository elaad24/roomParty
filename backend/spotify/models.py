from django.db import models
import random
import time

def random_id():
    timestamp = int(time.time())  # Get current time in seconds
    random_number = random.randint(1000, 9999)  # Generate a random 4-digit number
    unique_id = f"{timestamp}{random_number}"  # Combine timestamp and random number
    return unique_id

class SpotifyToken(models.Model):
    username = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    refresh_token = models.CharField(max_length=150)
    access_token = models.CharField(max_length=150)
    expires_in = models.DateTimeField()
    token_type = models.CharField(max_length=50)
    user_token_id =models.CharField(max_length=100, default=random_id)
# the token id is to get a uniq reandom var so i caould find it after it in the db 