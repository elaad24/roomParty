from datetime import timedelta

from api.models.customUserModel import CustomUserModel
from django.utils import timezone
from requests import get, post, put

from .credenials import CLIENT_ID, CLIENT_SECRET
from .models import SpotifyToken

BASE_URL = "https://api.spotify.com/v1/"


def update_or_create_user_token(username, refresh_token, access_token, token_type):
    expires_in = timezone.now() + timedelta(
        seconds=3600
    )  # set the the expires is in 1 hour from now
    user_token = SpotifyToken.objects.filter(username=username).first()

    # user_token=SpotifyToken.objects.all().delete()

    if user_token == None:
        # create
        token = SpotifyToken.objects.create(
            username=username,
            refresh_token=refresh_token,
            access_token=access_token,
            expires_in=expires_in,
            token_type=token_type,
        ).save()
        return token.user_token_id
    else:
        # update

        user_token.username = username
        user_token.access_token = access_token
        user_token.refresh_token = refresh_token
        user_token.expires_in = expires_in
        user_token.token_type = token_type
        user_token.save()
        return user_token.user_token_id


def set_username_in_spotify(token_id, username):
    user_instance = SpotifyToken.objects.filter(user_token_id=token_id).first()
    if user_instance == None:
        return False
    else:
        user_instance.username = username
        user_instance.save()
        return True


def is_spotify_authenticated(username):
    token = SpotifyToken.objects.filter(username=username).first()
    if token:
        expiry = token.expires_in
        if expiry <= timezone.now():
            refresh_spotify_token(username)
        return True

    return False


def refresh_spotify_token(username):
    refresh_token = SpotifyToken.objects.filter(username=username).first().refresh_token

    response = post(
        "https://accounts.spotify.com/api/token",
        data={
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
        },
    ).json()

    access_token = response.get("access_token")
    token_type = response.get("token_type")

    update_or_create_user_token(username, refresh_token, access_token, token_type)


def get_user_tokens(username):
    spotifyUserInstance = SpotifyToken.objects.filter(username=username).first()
    if spotifyUserInstance != None:
        return spotifyUserInstance
    else:
        return None


def execute_spotify_api_request(room_host_username, endpoint, post_=False, put_=False):
    tokens = get_user_tokens(room_host_username)
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + tokens.access_token,
    }
    response = None
    if post_:
        response = post(BASE_URL + endpoint, headers=headers)
    if put_:
        response = put(BASE_URL + endpoint, headers=headers)
    print(BASE_URL + endpoint)
    if not post_ and not put_:
        response = get(BASE_URL + endpoint, {}, headers=headers)
    try:
        return response.json()
    except:
        return {"Error": "Issue with request"}
