from django.urls import path
from .views.userViews import CreateUserView
urlpatterns = [path("createUser",CreateUserView.as_view(),name="create-user")]
