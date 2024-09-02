from django.urls import path
from .views.userViews import CreateUserView
from .views.authView import RefreshAccessTokenView
from .views.roomView import CreateRoomView

urlpatterns = [
    path("createUser",CreateUserView.as_view(),name="create-user"),
    path("newAccessToken",RefreshAccessTokenView.as_view(),name="new-access-token"),
    path("createRoom",CreateRoomView.as_view(),name="create-room")
        ]
