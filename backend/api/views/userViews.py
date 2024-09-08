from rest_framework import generics
from api.models.customUserModel import CustomUserModel
from api.serializers.user_serializer import UserSerializer
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import timedelta
from django.utils import timezone

class CreateUserView(generics.CreateAPIView):
    queryset = CustomUserModel.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        response =  super().create(request, *args, **kwargs)
        user = response.data
        user_instance = CustomUserModel.objects.get(username=user['username'])


        # generate tokens
        refresh = RefreshToken.for_user(user_instance)

        # add tokens to the responce 
        response.data['access'] = str(refresh.access_token)

        #setting the tokens into cookies 

        response.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True,
            max_age=60 * 60 * 24 * 7, # 7 days ub seconds
            samesite="Lax",
            secure=False
        )

        response.set_cookie(
            key="access_token",
            max_age=1800,  # 30 minutes in seconds
            value=str(refresh.access_token),
            samesite="Lax",
            secure=False
        )

        return response