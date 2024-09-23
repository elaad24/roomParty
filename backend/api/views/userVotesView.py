from api.authentication import CookieJWTAuthentication
from api.models.roomModel import RoomModel
from api.models.VoteUserModel import UserVotesModel
from api.serializers.userVotes_serializer import UserVotesSerializer
from rest_framework import generics, mixins, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


class UserVotesView(
    mixins.CreateModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView
):
    queryset = UserVotesModel.objects.all()
    serializer_class = UserVotesSerializer
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        username = request.user.username
        room_key_field_value = request.data.get("room_key", None)
        active_song_id_field_value = request.data.get("active_song_id", None)
        vote_type_value = request.data.get("vote_type", None)
        user_in_room = request.user.room
        room_instance = RoomModel.objects.filter(
            code=user_in_room, active_song_id=active_song_id_field_value
        ).first()

        # checked that the user in this spesific room and the song he send req is current
        if room_instance != None:
            UserVotesModel_instance = UserVotesModel.objects.filter(
                room_key=room_key_field_value,
                active_song_id=active_song_id_field_value,
                username=username,
            ).first()
            # there isn't instance - its a new vote
            if not UserVotesModel_instance:
                UserVotesModel.objects.create(
                    room_key=room_key_field_value,
                    username=request.user.username,
                    active_song_id=active_song_id_field_value,
                    vote_type=vote_type_value,
                )
                return Response({}, status=status.HTTP_201_CREATED)
            # there is a vote and its the same - so it remove that comment
            elif UserVotesModel_instance.vote_type == vote_type_value:
                UserVotesModel_instance.delete()
                return Response(
                    {"message": "the vote has been deleted"},
                    status=status.HTTP_202_ACCEPTED,
                )
            # there is a vote and its not the same
            elif (
                UserVotesModel_instance
                and UserVotesModel_instance.vote_type != vote_type_value
            ):
                UserVotesModel_instance.vote_type = vote_type_value
                UserVotesModel_instance.save()
                return Response(
                    {"message": "vote updated"}, status=status.HTTP_201_CREATED
                )
        # the user not in the room_key / it's not the active song
        else:
            return Response(
                {
                    "message": "error couldn't find the instance,user isn't in the room song id isn't active"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

    def get(self, request, *args, **kwargs):
        username = request.user.username
        user_vote_instance = UserVotesModel.objects.filter(username=username).first()
        if user_vote_instance == None:
            return Response({"vote": None}, status=status.HTTP_200_OK)
        return Response(
            {
                "vote": user_vote_instance.vote_type,
                "active_song_id": user_vote_instance.active_song_id,
            },
            status=status.HTTP_200_OK,
        )
