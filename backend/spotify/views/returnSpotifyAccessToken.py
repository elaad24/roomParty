from datetime import timedelta

from api.authentication import CookieJWTAuthentication
from api.models.customUserModel import CustomUserModel
from api.models.roomModel import RoomModel
from api.models.votesModel import VotesModel
from api.utils.roomSongUtils import updateRoomSongData
from django.shortcuts import redirect, render
from django.utils import timezone
from requests import Request, post
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from spotify.models import SpotifyToken
from spotify.serializers.user_token_serializer import UserTokenSerializer

from ..credenials import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI
from ..models import SpotifyToken
from ..utils import *


class returnSpotifyAccessToken(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        username = request.user.username
        SpotifyToken_instance = SpotifyToken.objects.filter(username=username).first()
        response = Response()
        naive_expire_in = SpotifyToken_instance.expires_in.replace(tzinfo=None)

        if SpotifyToken_instance != None:
            response = Response(status=status.HTTP_200_OK)
            timedelta = datetime_to_seconds_without_timezone(naive_expire_in)
            response.set_cookie(
                key="spotify_access_token",
                max_age=timedelta,
                value=SpotifyToken_instance.access_token,
                samesite="Lax",
                secure=False,
            )
        else:
            response = Response(
                {"message": "coudnt get the spotifuTokenAceest token"},
                status=status.HTTP_409_CONFLICT,
            )

        return response
