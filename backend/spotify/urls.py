from django.urls import path
from spotify.views import AuthURL , spotify_callback, IsAuthenticated,set_spotify_username

urlpatterns = [
    path('get-auth-url', AuthURL.as_view()),
    path('redirect',spotify_callback),
    path('is-Authenticated',IsAuthenticated.as_view()),
    path('set-spotify-username',set_spotify_username.as_view()),
]
