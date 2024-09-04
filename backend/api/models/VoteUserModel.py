from django.db import models

# a table for saving all of the data ablout the liked/dislaked  

class UserVotesModel(models.Model):
    room_key=models.CharField(max_length=100)
    username=models.CharField(max_length=100)
    active_song_id=models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    vote_type = models.CharField(max_length=10)  # '1' or '0'

