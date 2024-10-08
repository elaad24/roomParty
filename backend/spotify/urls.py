from django.urls import path
from spotify.views import *

urlpatterns = [
    path("get-auth-url", AuthURL.as_view()),
    path("redirect", spotify_callback),
    path("is-Authenticated", IsAuthenticated.as_view()),
    path("set-spotify-username", set_spotify_username.as_view()),
    path("current-song", CurrentSong.as_view()),
    path("search-song", SearchSong.as_view()),
    path("return-spotify-access-token", returnSpotifyAccessToken.as_view()),
]
