from rest_framework import generics,status
from api.models.roomModel import RoomModel
from api.serializers.room_serializer import RoomSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from api.authentication import CookieJWTAuthentication
from api.models.customUserModel import CustomUserModel
from api.models.votesModel import VotesModel
from api.models.VoteUserModel import UserVotesModel
from api.utils.roomSongUtils import updateRoomSongData
class ChangeSong(generics.CreateAPIView):
    queryset=RoomModel.objects.all()
    serializer_class=RoomSerializer
    authentication_classes=[CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        return updateRoomSongData(self)
       