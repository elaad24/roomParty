from django.db import models


class SuggestedSongsVotesModal(models.Model):
    room_key=models.CharField(max_length=20)
    suggested_songs_id=models.CharField(max_length=100, default="")
    username= models.CharField(max_length=100)