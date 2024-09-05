from rest_framework import generics,status
from api.models.roomModel import RoomModel
from api.serializers.room_serializer import RoomSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from api.authentication import CookieJWTAuthentication
from api.models.customUserModel import CustomUserModel
from api.models.votesModel import VotesModel

class CreateRoomView(generics.CreateAPIView):
    queryset = RoomModel.objects.all()
    serializer_class = RoomSerializer
    authentication_classes=[CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        instance = serializer.save()
        room_key= instance.code
        instance.active_song_id="def"
        instance.save()
        #need to add that it check for different active room by same person 
        # then just replace its data and not create new one 
        
        user = self.request.user
        user.room=room_key
        user.host=True
        user.save()

        #create votes instance  based on the room  
        VotesModel.objects.create(
        room_key=instance.code,
        host_username=instance.host,
        active_song_id="def"

        ).save()
 


class JoinRoomView(generics.ListAPIView):
    queryset = RoomModel.objects.all()
    authentication_classes=[CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self,request, *args, **kwargs):
        room_key= request.GET.get('room_key')
        if  room_key != None:
            room= RoomModel.objects.filter(code=room_key).first()
            # print (room.is_active)
            if room != None and room.is_active ==True:
                user = request.user
                user.room=room_key 
                user.host=False
                user.save()
                return Response({"message":f"user joined room {room_key}" },status=status.HTTP_200_OK)
            return Response({"error":f"room {room_key} is not active or not exist" },status=status.HTTP_404_NOT_FOUND)
        return Response({"error":"you didn't pass room code " },status=status.HTTP_400_BAD_REQUEST)
    
        
