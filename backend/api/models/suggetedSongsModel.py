from django.db import models

class suggestedSongsModel(models.Model):
    room_key=models.CharField(max_length=20)
    suggested_songs_id=models.CharField(max_length=100, default="")
    suggested_song_title=models.CharField(max_length=100, default="")
    suggested_songs_img=models.CharField(max_length=1000 , default="")
    suggested_by=models.CharField(max_length=20)
    likes=models.IntegerField(default=0)