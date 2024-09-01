from rest_framework import generics
from api.models.customUserModel import CustomUserModel
from api.serializers.user_serializer import UserSerializer
from rest_framework.permissions import AllowAny


class CreateUserView(generics.CreateAPIView):
    queryset = CustomUserModel.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]