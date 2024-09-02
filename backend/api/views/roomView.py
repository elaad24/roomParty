from rest_framework import generics,status
from api.models.roomModel import RoomModel
from api.serializers.room_serializer import RoomSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from api.authentication import CookieJWTAuthentication

class CreateRoomView(generics.CreateAPIView):
    queryset = RoomModel.objects.all()
    serializer_class = RoomSerializer
    authentication_classes=[CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
