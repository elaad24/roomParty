from rest_framework import generics,status,mixins
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from api.authentication import CookieJWTAuthentication
from api.serializers.suggested_songs_serializer import Suggested_songs_serializer
from api.models.suggetedSongsModel import suggestedSongsModel
from api.utils.userData import check_user_in_room_and_room_exist

class suggestedSongsView(mixins.CreateModelMixin,mixins.UpdateModelMixin, generics.GenericAPIView):
    queryset = suggestedSongsModel.objects.all()
    serializer_class = Suggested_songs_serializer
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = Suggested_songs_serializer(data=request.data)
        user = request.user
        if serializer.is_valid():
            room_key = serializer.validated_data.get("room_key",None)
            suggested_songs_id = serializer.validated_data.get("suggested_songs_id",None)
            
            check_user_in_room_and_room_exist(user,room_key)

            isTheSongAlreadySuggested = suggestedSongsModel.objects.filter(room_key=room_key,suggested_songs_id=suggested_songs_id).first()
            if isTheSongAlreadySuggested == None:
                suggest_instance =  serializer.save()
                suggest_instance.suggested_by=user.username
                suggest_instance.save()
                return Response({"message":"added to suggestions!"}, status=status.HTTP_201_CREATED)

