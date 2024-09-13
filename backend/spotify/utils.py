from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from .credenials import CLIENT_ID ,CLIENT_SECRET
from requests import post

def update_or_create_user_token(username,refresh_token,access_token,token_type):
    expires_in=timezone.now()+timedelta(seconds=3600) #set the the expires is in 1 hour from now
    user_token=SpotifyToken.objects.filter(username=username).first()
    
    # user_token=SpotifyToken.objects.all().delete()

    if user_token==None:
        # create
        token=SpotifyToken.objects.create(
        username=username,
        refresh_token=refresh_token,
        access_token=access_token,
        expires_in=expires_in,
        token_type=token_type
        ).save() 
        return token.user_token_id
    else:
        # update 

        user_token.username=username
        user_token.access_token=access_token
        user_token.refresh_token=refresh_token
        user_token.expires_in=expires_in
        user_token.token_type=token_type
        user_token.save()
        return user_token.user_token_id

def set_username_in_spotify(token_id,username):
    user_instance=  SpotifyToken.objects.filter(user_token_id=token_id).first()
    if user_instance == None :
        return False
    else:
        user_instance.username = username
        user_instance.save()
        return True


def is_spotify_authenticated(username):
    token=SpotifyToken.objects.filter(username=username).first()
    if token:
        expiry = token.expires_in
        if expiry <= timezone.now():
            refresh_spotify_token(username)
        return True
    
    return False


def refresh_spotify_token(username):
    refresh_token = SpotifyToken.objects.filter(username=username).first().refresh_token

    response = post('https://accounts.spotify.com/api/token', data={
    'grant_type': 'refresh_token',
    'refresh_token': refresh_token,
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')
    refresh_token = response.get('refresh_token')

    update_or_create_user_token(username,refresh_token,access_token,token_type)

