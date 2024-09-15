from django.shortcuts import render,redirect
from ..credenials import REDIRECT_URI,CLIENT_SECRET,CLIENT_ID
from rest_framework.views import APIView
from rest_framework import status,generics
from requests import Request, post
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from ..models import SpotifyToken
from spotify.serializers.user_token_serializer import UserTokenSerializer
from rest_framework.permissions import IsAuthenticated
from api.authentication import CookieJWTAuthentication
from ..utils import *
from api.models.customUserModel import CustomUserModel
from api.models.roomModel import RoomModel
from api.utils.roomSongUtils import updateRoomSongData
from api.models.votesModel import VotesModel

class CurrentSong(APIView):

    def get(self,request):
        user = request.user
        userInstance = CustomUserModel.objects.filter(username=user.username).first()
        if userInstance == None:
            return Response({"error":"user didn't found "},status=status.HTTP_400_BAD_REQUEST)
        # update the data this function updateRoomSongData
        # sand that data 
        # ! need tp dp when doing subscriptopn to send data from votemodel table 
        
        roomInstance = RoomModel.objects.filter(code=userInstance.room).first()
        if roomInstance == None:
            return Response({"error":"room didn't found "},status=status.HTTP_400_BAD_REQUEST)


        if roomInstance !=None:
            endpoint = "player/currently-playing"
            response = execute_spotify_api_request(roomInstance.host,endpoint)
            print(response)

            if 'error' in response or "item" not in response:
                return Response({},status=status.HTTP_204_NO_CONTENT)
            item = response.get('item')
            album_cover = item.get('album').get('images')[0].get('url')
            is_playing = response.get('is_playing')
            song_id = item.get('id')

            # in case of multiple artists joining them together
            artist_string = ""

            for i, artist in enumerate(item.get('artists')):
                if i > 0:
                    artist_string += ", "
                name = artist.get('name')
                artist_string += name

            song = {
                'title': item.get('name'),
                'artist': artist_string,
                'image_url': album_cover,
                'is_playing': is_playing,
                "id" : song_id
            }   
            altered_data = request.data.copy()
            

            altered_data["room_key"]=roomInstance.code
            altered_data["active_song_id"]=song_id
            altered_data["active_song_img"]=album_cover
            altered_data["active_song_artists"]=artist_string
            altered_data["active_song_is_playing"]=is_playing
            altered_data["active_song_name"]=item.get('name')

            updateRoomSongData(request,altered_data)

            roomVotesInstance= VotesModel.objects.filter(room_key=roomInstance.code).first()
            song["like"]=roomVotesInstance.like
            song["dislike"]=roomVotesInstance.dislike
            
            return Response(song,status=status.HTTP_200_OK)

        else:
            Response(song,status=status.HTTP_404_NOT_FOUND)
         