import asyncio
from datetime import timedelta

from api.authentication import CookieJWTAuthentication
from django.shortcuts import redirect, render
from django.utils import timezone
from requests import Request, post
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from spotify.serializers.user_token_serializer import UserTokenSerializer

from ..credenials import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI
from ..models import SpotifyToken
from ..utils import (
    is_spotify_authenticated,
    set_username_in_spotify,
    update_or_create_user_token,
)
from ..utils_encrypt import decrypt_token, encrypt_token


class AuthURL(APIView):
    # return a url to authnticate our spotify application/acount
    def get(self, request):
        queryset = SpotifyToken.objects.all()
        serializer_class = UserTokenSerializer
        authentication_classes = [CookieJWTAuthentication]
        permission_classes = [IsAuthenticated]

        scopes = "user-read-playback-state user-modify-playback-state user-read-currently-playing app-remote-control streaming user-read-recently-played user-library-read"

        url = (
            Request(
                "GET",
                "https://accounts.spotify.com/authorize",
                params={
                    "scope": scopes,
                    "response_type": "code",
                    "redirect_uri": REDIRECT_URI,
                    "client_id": CLIENT_ID,
                },
            )
            .prepare()
            .url
        )
        return Response({"url": url}, status=status.HTTP_200_OK)


def spotify_callback(request, format=None):
    code = request.GET.get("code")
    error = request.GET.get("error")
    user = request.user

    response = post(
        "https://accounts.spotify.com/api/token",
        data={
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": REDIRECT_URI,
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
        },
    ).json()

    access_token = response.get("access_token")
    token_type = response.get("token_type")
    refresh_token = response.get("refresh_token")
    expires_in = response.get("expires_in")
    error = response.get("error")

    instance_token_id = update_or_create_user_token(
        user.username, refresh_token, access_token, token_type
    )
    encrypted = encrypt_token(instance_token_id)
    return redirect(f"http://localhost:5173?token_id={encrypted}")


class IsAuthenticated(APIView):
    def get(self, request):
        is_authenticated = is_spotify_authenticated(request.user.username)
        return Response({"status": is_authenticated}, status=status.HTTP_200_OK)


class set_spotify_username(APIView):
    def post(self, request):
        secret_token = request.data.get("secret_token")
        # need to decript it
        if secret_token == None:
            return Response(
                {"message": "error - need token_id query parm"},
                status=status.HTTP_406_NOT_ACCEPTABLE,
            )
        decrypted = decrypt_token(secret_token)
        user = request.user
        res = set_username_in_spotify(decrypted, user.username)
        if res == False:
            return Response(
                {"message": "error bad token_id "}, status=status.HTTP_400_BAD_REQUEST
            )
        else:
            return Response({"message": "success "}, status=status.HTTP_200_OK)
