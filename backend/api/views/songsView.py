from rest_framework import generics,status
from api.models.roomModel import RoomModel
from api.serializers.room_serializer import RoomSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from api.authentication import CookieJWTAuthentication
from api.models.customUserModel import CustomUserModel
from api.models.votesModel import VotesModel
from api.models.VoteUserModel import UserVotesModel

class ChangeSong(generics.CreateAPIView):
    queryset=RoomModel.objects.all()
    serializer_class=RoomSerializer
    authentication_classes=[CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):

        data = self.request.data
        room_key = data.get("room_key",None)
        active_song_id=data.get("active_song_id",None)
        active_song_img=data.get("active_song_img",None)

        #update the RoomModel instance 
        room_instance = RoomModel.objects.filter(code=room_key).first()
        prev_active_song_id=room_instance.active_song_id
        if room_instance and self.request.user.username==room_instance.host:
            room_instance.active_song_id=active_song_id
            room_instance.active_song_img=active_song_img
            room_instance.save()
        else:
            return Response({"message":"couldn't find the instance "},status=status.HTTP_400_BAD_REQUEST)

        #update the  votesModel instance 
        votesModelInstance=VotesModel.objects.filter(room_key=room_key).first()
        if votesModelInstance and self.request.user.username==room_instance.host:
            votesModelInstance.active_song_id=active_song_id
            votesModelInstance.active_song_img=active_song_img
            votesModelInstance.like=0
            votesModelInstance.dislike=0
            votesModelInstance.save()
        else:
            return Response({"message":"couldn't find the instance "},status=status.HTTP_400_BAD_REQUEST)