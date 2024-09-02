from django.urls import path
from .views.userViews import CreateUserView
from .views.authView import RefreshAccessTokenView
urlpatterns = [
    path("createUser",CreateUserView.as_view(),name="create-user"),
    path("newAccessToken",RefreshAccessTokenView.as_view(),name="new-access-token")    
           ]
