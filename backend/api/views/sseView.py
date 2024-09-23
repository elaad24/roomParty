from api.authentication import CookieJWTAuthentication
from api.models.customUserModel import CustomUserModel
from api.models.roomModel import RoomModel
from api.models.votesModel import VotesModel
from api.models.VoteUserModel import UserVotesModel
from api.serializers.room_serializer import RoomSerializer
from django.http import StreamingHttpResponse
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

event_data = {
    "VotesModel": None,
    "UserVotesModel": None,
    "SuggestedSongsVotesModal": None,
    "suggestedSongsModel": None,
    "SongsQueueModel": None,
}

# Dictionary to store connected clients by group
clients_by_group = {}


def sse_view(request):
    user = request.user
    user_instance = CustomUserModel.objects.filter(username=user.username).first()
    user_room = user_instance.room

    # Add the user to their group in the client dictionary
    if user_room not in clients_by_group:
        clients_by_group[user_room] = []
    clients_by_group[user_room].append(request)

    def event_stream():
        try:
            while True:
                yield ""  # Keep connection open
        except GeneratorExit:
            # Remove the client from the group on disconnect
            clients_by_group[user_room].remove(request)

    return StreamingHttpResponse(event_stream(), content_type="text/event-stream")
