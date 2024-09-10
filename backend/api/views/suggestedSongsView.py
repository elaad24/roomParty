from rest_framework import generics,status,mixins
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from api.authentication import CookieJWTAuthentication
from api.serializers.suggested_songs_serializer import Suggested_songs_serializer
from api.models.suggetedSongs import suggestedSongs
from api.models.roomModel import RoomModel

class suggestedSongsView(mixins.CreateModelMixin,mixins.UpdateModelMixin, generics.GenericAPIView):
    queryset = suggestedSongs.objects.all()
    serializer_class = Suggested_songs_serializer
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = Suggested_songs_serializer(data=request.data)
        user = request.user
        if serializer.is_valid():
            room_key = serializer.validated_data.get("room_key",None)
            suggested_songs_id = serializer.validated_data.get("suggested_songs_id",None)
            suggested_songs_img = serializer.validated_data.get("suggested_songs_img",None)
            # suggested_by = serializer.validated_data.get("suggested_by",None)
            likes = serializer.validated_data.get("likes",None)
            
            #check that the user is in the room that he tring to suggest song to 
            if room_key !=user.room:
                return Response({"message":"user is not in that room , cant offer songs to different room!"}, status=status.HTTP_401_UNAUTHORIZED)
            

            # check that the room is exist 
            room_instance=RoomModel.objects.filter(code=user.room).first()
            if user.room !="null" and room_instance==None:
                return Response({"message":"the room is not active!"}, status=status.HTTP_400_BAD_REQUEST)
            
            isTheSongAlreadySuggested = suggestedSongs.objects.filter(room_key=room_key,suggested_songs_id=suggested_songs_id).first()
            if isTheSongAlreadySuggested == None:
                suggeste_instance =  serializer.save()
                suggeste_instance.suggested_by=user.username
                suggeste_instance.save()
                return Response({"message":"added to suggestions!"}, status=status.HTTP_201_CREATED)
                
            # else:
                # add like to the song 

