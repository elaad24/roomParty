from rest_framework import generics,status,mixins
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from api.authentication import CookieJWTAuthentication
from api.models.VoteUserModel import UserVotesModel
from api.serializers.userVotes_serializer import UserVotesSerializer
from api.models.roomModel import RoomModel


class UserVotesView(mixins.CreateModelMixin,mixins.UpdateModelMixin, generics.GenericAPIView):
    queryset=UserVotesModel.objects.all()
    serializer_class = UserVotesSerializer
    authentication_classes=[CookieJWTAuthentication]
    permission_classes=[IsAuthenticated]

    def post(self, request, *args, **kwargs):
        username = request.user.username
        room_key_field_value = request.data.get("room_key",None)
        active_song_id_field_value = request.data.get("active_song_id",None)
        vote_type_value=request.data.get("vote_type",None)
        user_in_room=request.user.room
        room_instance=RoomModel.objects.filter(code=user_in_room,active_song_id=active_song_id_field_value).first()

        #checked that the user in this spesific room and the song he send req is current
        if room_instance != None:
            UserVotesModel_instance=UserVotesModel.objects.filter(room_key=room_key_field_value , active_song_id=active_song_id_field_value, username=username).first()
            #there isn't instance - its a new vote 
            if not UserVotesModel_instance:
               return self.create(request, *args, **kwargs)
            #there is a vote and its the save
            elif UserVotesModel_instance.vote_type==vote_type_value:
                print(2)
                return Response({"message":"same vote already existing"},status=status.HTTP_200_OK)
            #there is a vote and its not the same 
            elif UserVotesModel_instance and UserVotesModel_instance.vote_type!=vote_type_value:
                UserVotesModel_instance.vote_type=vote_type_value
                UserVotesModel_instance.save()
                return Response({"message":"vote updated"},status=status.HTTP_201_CREATED)
        #the user not in the room_key / it's not the active song
        else:
            return Response({"message":"error couldn't find the instance,user isn't in the room song id isn't active"},status=status.HTTP_400_BAD_REQUEST)


    def put(self, request, *args, **kwargs):
        username = request.user.username
        room_key_field_value = request.data.get("room_key",None)
        active_song_id_field_value = request.data.get("active_song_id",None)
        vote_type_value=request.data.get("vote_type",None)
        instance = self.queryset.filter(username=username,
        room_key=room_key_field_value,
        active_song_id=active_song_id_field_value).first()

        if not instance:
            return Response({"message":"error couldn't find the instance, passed wrong room_key or active_song_id"},status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(instance,data=request.data, partial=True)

        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

