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


class SearchSong(APIView):
    authentication_classes=[CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self,request):
        username= request.user.username
        user_instance= CustomUserModel.objects.filter(username=username).first()
        room_instance= RoomModel.objects.filter(code = user_instance.room).first()
        query=request.GET.get("q")
        endpoint= f"search?q={query}&type=track&limit=5&offset=0&include_external=audio"
        response=execute_spotify_api_request(room_instance.host,endpoint)
        return Response(response)