from rest_framework import generics,status
from api.models.roomModel import RoomModel
from api.serializers.room_serializer import RoomSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from api.authentication import CookieJWTAuthentication
from api.models.customUserModel import CustomUserModel
from api.models.votesModel import VotesModel
from api.models.VoteUserModel import UserVotesModel


class CreateRoomView(generics.CreateAPIView):
    queryset = RoomModel.objects.all()
    serializer_class = RoomSerializer
    authentication_classes=[CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
       
        user = self.request.user
        existing_instance= RoomModel.objects.filter(host=user.username).first()

        if existing_instance != None:
            # clean up
            prev_room_key=existing_instance.code
            VotesModel.objects.filter(room_key=prev_room_key).delete()      
            UserVotesModel.objects.filter(room_key=prev_room_key).delete()
            usersInRoom=CustomUserModel.objects.filter(room=existing_instance.code).update(room="")
            existing_instance.delete()
        
        #setting the new room data
        new_room_instance = RoomModel.objects.create(**serializer.validated_data)
        new_room_instance.room_name=f"{user.username}-room"
        new_room_instance.host=user.username
        new_room_instance.active_song_id="def"

        new_room_instance.save()
        self.room_instance=new_room_instance

        #updating data in the user instance
        user = self.request.user
        user.room=new_room_instance.code
        user.host=True
        user.save()

        #create votes instance  based on the room  
        VotesModel.objects.create(
        room_key=new_room_instance.code,
        host_username=new_room_instance.host,
        active_song_id="def"
        ).save()
    

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True) 
        self.perform_create(serializer)  
        serialized_data = RoomSerializer(self.room_instance).data

        return Response(serialized_data)



  
 


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
    
        

class getRoomInfo(generics.ListAPIView):
    queryset=RoomModel.objects.all()
    serializer_class=RoomSerializer
    authentication_classes = [CookieJWTAuthentication]
    permission_classes=[IsAuthenticated]

    def get(self,request, *args, **kwargs):
        room_key= request.GET.get('room_key')
        if room_key != None:
            room= RoomModel.objects.filter(code=room_key).first()
            if room != None :
                response =Response(RoomSerializer(room).data,status=status.HTTP_200_OK)
                return response

            return Response({"error":f"room {room_key} is not active or not exist" },status=status.HTTP_404_NOT_FOUND)
        return Response({"error":"you didn't pass room code " },status=status.HTTP_400_BAD_REQUEST)