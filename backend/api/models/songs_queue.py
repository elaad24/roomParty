from django.db import models

class SongsQueueModel(models.Model):
    room_key=models.CharField(max_length=20)
    songs_id=models.CharField(max_length=100, default="")
    song_title=models.CharField(max_length=100, default="")
    songs_img=models.CharField(max_length=1000 , default="")