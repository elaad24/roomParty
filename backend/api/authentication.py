from django.contrib.auth import get_user_model
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import AccessToken


class CookieJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get("access_token")
        if not access_token:
            return None

        try:
            # validate the token
            validated_token = AccessToken(access_token)
            User = get_user_model()
            current_user = User.objects.get(id=validated_token["user_id"])
            request.userData = current_user
            return (current_user, None)
        except Exception as e:
            raise AuthenticationFailed("Invalid or expired token.")
