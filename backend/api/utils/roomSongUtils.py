from api.models.roomModel import RoomModel
from api.models.votesModel import VotesModel
from rest_framework.response import Response
from rest_framework import status



def updateRoomSongData(request, altered_data):
    data = altered_data
    room_key = data.get("room_key",None)
    active_song_id=data.get("active_song_id",None)
    active_song_img=data.get("active_song_img",None)
    active_song_name=data.get("active_song_name",None)
    active_song_artists=data.get("active_song_artists",None)
    active_song_is_playing=data.get("active_song_is_playing",None)
        
    #update the RoomModel instance 
    room_instance = RoomModel.objects.filter(code=room_key).first()
    prev_active_song_id=room_instance.active_song_id
    if room_instance and request.user.username==room_instance.host:
        room_instance.active_song_id=active_song_id
        room_instance.active_song_name=active_song_name
        room_instance.active_song_img=active_song_img
        room_instance.save()
    else:
        return Response({"message":"couldn't find the instance "},status=status.HTTP_400_BAD_REQUEST)

    #update the  votesModel instance 
    votesModelInstance=VotesModel.objects.filter(room_key=room_key).first()
    likes=0
    dislike=0
    # in case that the song didn't change just the data init 
    if votesModelInstance.active_song_id==active_song_id:
        likes=votesModelInstance.like
        dislike=votesModelInstance.dislike
    if votesModelInstance and request.user.username==room_instance.host:
        votesModelInstance.active_song_id=active_song_id
        votesModelInstance.active_song_img=active_song_img
        votesModelInstance.active_song_artists=active_song_artists
        votesModelInstance.active_song_name=active_song_name
        votesModelInstance.active_song_is_playing=active_song_is_playing
        votesModelInstance.like=likes
        votesModelInstance.dislike=dislike
        votesModelInstance.save()
    else:
        return Response({"message":"couldn't find the instance "},status=status.HTTP_400_BAD_REQUEST)    