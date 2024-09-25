from api.views.deleteQueue import delateQueue
from django.urls import path

from .views.authView import RefreshAccessTokenView
from .views.roomView import CreateRoomView, JoinRoomView, getRoomInfo
from .views.songsQueueView import songQueueView
from .views.songsView import ChangeSong
from .views.sseView import SSEView
from .views.suggestedSongsView import suggestedSongsView
from .views.suggestedSongsVotesView import (
    suggestedSongsUserVotesView,
    suggestedSongsVotesView,
)
from .views.userViews import CheckIfUserInRoom, CreateUserView, getUserInfo
from .views.userVotesView import UserVotesView

urlpatterns = [
    path("createUser", CreateUserView.as_view(), name="create-user"),
    path("newAccessToken", RefreshAccessTokenView.as_view(), name="new-access-token"),
    path("createRoom", CreateRoomView.as_view(), name="create-room"),
    path("joinRoom/", JoinRoomView.as_view(), name="join-room"),
    path("vote", UserVotesView.as_view(), name="vote"),
    path("changeSong", ChangeSong.as_view(), name="change-song"),
    path("isUserInRoom", CheckIfUserInRoom.as_view(), name="is-user-in-room"),
    path("getUserInfo", getUserInfo.as_view(), name="get-user-info"),
    path("getRoomInfo/", getRoomInfo.as_view(), name="get-room-info"),
    path("suggestSong", suggestedSongsView.as_view(), name="suggest-song"),
    path(
        "suggestSongVote", suggestedSongsVotesView.as_view(), name="suggest-song-vote"
    ),
    path(
        "suggestSongUserVote/",
        suggestedSongsUserVotesView.as_view(),
        name="suggest-song-user-vote",
    ),
    path("songsQueue/", songQueueView.as_view(), name="songs-queue"),
    path("sse", SSEView.as_view(), name="sse"),
    path("deleteQueue", delateQueue.as_view(), name="deleteQueue"),
]

# in the futcher to replace evry implamantion of fach for getting the user room by req.user.room
