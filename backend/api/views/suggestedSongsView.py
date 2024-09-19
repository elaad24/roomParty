from api.authentication import CookieJWTAuthentication
from api.models.customUserModel import CustomUserModel
from api.models.suggetedSongsModel import suggestedSongsModel
from api.serializers.suggested_songs_serializer import Suggested_songs_serializer
from api.utils.songQueueUtils import add_song_to_queue
from api.utils.userData import check_user_in_room_and_room_exist
from rest_framework import generics, mixins, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


class suggestedSongsView(
    mixins.CreateModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView
):
    queryset = suggestedSongsModel.objects.all()
    serializer_class = Suggested_songs_serializer
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = Suggested_songs_serializer(data=request.data)
        user = request.user

        if serializer.is_valid():
            room_key = serializer.validated_data.get("room_key", None)
            suggested_songs_id = serializer.validated_data.get(
                "suggested_songs_id", None
            )
            check_user_in_room_and_room_exist(user, room_key)

            isTheSongAlreadySuggested = suggestedSongsModel.objects.filter(
                room_key=room_key, suggested_songs_id=suggested_songs_id
            ).first()
            if isTheSongAlreadySuggested == None:
                validated_data = serializer.validated_data
                validated_data["suggested_by"] = user.username
                suggest_instance = serializer.save()
                return Response(
                    {"message": "added to suggestions!"}, status=status.HTTP_201_CREATED
                )
            else:
                return Response(
                    {"message": "song already suggested"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

    def get(self, request, *args, **kwargs):
        user = request.user
        user_instance = CustomUserModel.objects.filter(username=user.username).first()
        add_song_to_queue(request, user_instance.room)

        suggested_song_room_instance = suggestedSongsModel.objects.filter(
            room_key=user_instance.room
        ).order_by("-likes")
        if suggested_song_room_instance != None:
            return Response(
                {
                    "data": Suggested_songs_serializer(
                        suggested_song_room_instance, many=True
                    ).data
                },
                status=status.HTTP_200_OK,
            )
        return Response(
            {"message": "didnt find items"}, status=status.HTTP_400_BAD_REQUEST
        )
