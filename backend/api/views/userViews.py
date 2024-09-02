from rest_framework import generics
from api.models.customUserModel import CustomUserModel
from api.serializers.user_serializer import UserSerializer
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

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
            samesite="Strict"
        )
        response.set_cookie(
            key="access_token",
            value=str(refresh.access_token),
            samesite="Strict"
        )

        return response