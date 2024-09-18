from rest_framework import generics,status,mixins
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from api.authentication import CookieJWTAuthentication
from api.serializers.suggested_songs_votes_serializer import Suggested_songs_votes_serializer
from api.models.suggestedSongsVotesModel import SuggestedSongsVotesModal
from api.models.suggetedSongsModel import suggestedSongsModel
from ..utils.userData import check_user_in_room_and_room_exist

class suggestedSongsVotesView(generics.CreateAPIView):

    queryset = SuggestedSongsVotesModal.objects.all()
    serializer_class = Suggested_songs_votes_serializer
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = Suggested_songs_votes_serializer(data=request.data)
        user = request.user
        if serializer.is_valid():
           
            room_key = serializer.validated_data.get("room_key",None)
            suggested_songs_id = serializer.validated_data.get("suggested_songs_id",None)
            
            check_user_in_room_and_room_exist(user,room_key)

            # check that the songs that the user tring to vote for is exist in the suggestion for the room
            suggested_song_instance = suggestedSongsModel.objects.filter(room_key=room_key,suggested_songs_id=suggested_songs_id).first()
            if(suggested_song_instance):
                # try to find if the user already voted on this song
                song_user_votes_instance = SuggestedSongsVotesModal.objects.filter(room_key=room_key,suggested_songs_id=suggested_songs_id,username=user.username).first()
                
                if(song_user_votes_instance):
                    song_user_votes_instance.delete()
                    suggested_song_instance.likes-=1
                    suggested_song_instance.save()
                    return Response({"message":"deleted the prev vote!"}, status=status.HTTP_202_ACCEPTED)
                else:
                    user_suggest_song_vote_instance = serializer.save()   
                    user_suggest_song_vote_instance.username=user.username
                    user_suggest_song_vote_instance.save()
                    suggested_song_instance.likes+=1
                    suggested_song_instance.save()
                    return Response({"message":"added the vote!"}, status=status.HTTP_201_CREATED)

class suggestedSongsUserVotesView(generics.ListAPIView):

    queryset = SuggestedSongsVotesModal.objects.all()
    serializer_class = Suggested_songs_votes_serializer
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get (self, request, *args, **kwargs):
        user = request.user
        room_key = request.GET.get('room_key')
       
        if room_key!=None:
            check_user_in_room_and_room_exist(user,room_key)
            song_user_votes_instance = SuggestedSongsVotesModal.objects.filter(room_key=room_key,username=user.username)
            
            if song_user_votes_instance:
                return Response(Suggested_songs_votes_serializer(song_user_votes_instance, many=True).data,status=status.HTTP_200_OK)
            else:
                return Response({},status=status.HTTP_200_OK)