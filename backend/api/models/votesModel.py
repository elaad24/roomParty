from django.db import models

# table to saving the currnt data about the curent status of votes for currnt song 
# you dont send data trow api to this table , the table update itslef by getting
# data from different tables 
# this table also act as single source of truth about 
# the data about the information about the current song , artist ... 


class VotesModel(models.Model):
    host_username=models.CharField(max_length=100)
    dislike=models.IntegerField(default=0)
    like=models.IntegerField(default=0)
    # users_in_room= models.IntegerField(default=1)
    request_to_change_genre= models.IntegerField(default=0)
    room_key=models.CharField(max_length=20, unique=True)
    active_song_id=models.CharField(max_length=100, default="")
    active_song_name=models.CharField(max_length=100, default="")
    active_song_img=models.CharField(max_length=1000 , default="")
    active_song_artists=models.CharField(max_length=1000 , default="")
    active_song_is_playing=models.BooleanField( default=False)