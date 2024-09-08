from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework.permissions import AllowAny
from datetime import timedelta
from django.utils import timezone


class RefreshAccessTokenView(APIView):
    permission_classes = [AllowAny]

    def get(self,request):
        refresh_token = request.COOKIES.get("refresh_token")
        if not refresh_token:
            print("Refresh token missing")
            return Response({"error":"Refresh token missing"},status=status.HTTP_401_UNAUTHORIZED)

        try:
            refresh = RefreshToken(refresh_token)
            new_access_token=  refresh.access_token
            response =  Response({"access":str(new_access_token)})
            

            response.set_cookie(
            key="access_token",
            max_age=1800,  # 30 minutes in seconds
            value=str(new_access_token),
            samesite="Lax",
            secure=False
            )
            return response
        except InvalidToken:
            return Response({"error":"Invalid refresh token "},status=status.HTTP_401_UNAUTHORIZED)
