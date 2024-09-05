from django.urls import path
from .views.userViews import CreateUserView
from .views.authView import RefreshAccessTokenView
from .views.roomView import CreateRoomView,JoinRoomView
from .views.userVotesView import UserVotesView
from .views.songsView import ChangeSong

urlpatterns = [
    path("createUser",CreateUserView.as_view(),name="create-user"),
    path("newAccessToken",RefreshAccessTokenView.as_view(),name="new-access-token"),
    path("createRoom",CreateRoomView.as_view(),name="create-room"),
    path("joinRoom/",JoinRoomView.as_view(),name="join-room"),
    path("vote",UserVotesView.as_view(),name="vote"),
    path("changeSong",ChangeSong.as_view(),name="change-song")
        ]