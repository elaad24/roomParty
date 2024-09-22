from api.authentication import CookieJWTAuthentication
from api.models.customUserModel import CustomUserModel
from api.models.songs_queue import SongsQueueModel
from api.serializers.songs_queue_serializer import Songs_queue_serializer
from api.utils.songQueueUtils import add_song_to_queue
from rest_framework import generics, mixins, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


class songQueueView(generics.ListAPIView):
    queryset = SongsQueueModel.objects.all()
    serializer_class = Songs_queue_serializer
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):

        user = request.user
        user_instance = CustomUserModel.objects.filter(username=user.username).first()

        song_queue_instate = SongsQueueModel.objects.filter(room_key=user_instance.room)
        if song_queue_instate != None:
            return Response(
                {"data": Songs_queue_serializer(song_queue_instate, many=True).data},
                status=status.HTTP_200_OK,
            )
        return Response(
            {"message": "didnt find items"}, status=status.HTTP_400_BAD_REQUEST
        )
