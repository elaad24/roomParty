from queue import Queue

from api.authentication import CookieJWTAuthentication
from api.models.customUserModel import CustomUserModel
from django.contrib.auth.decorators import login_required
from django.http import StreamingHttpResponse
from django.views import View

event_data = {
    "VotesModel": None,
    "UserVotesModel": None,
    "SuggestedSongsVotesModal": None,
    "suggestedSongsModel": None,
    "SongsQueueModel": None,
}

# Dictionary to store connected clients by group
clients_by_group = {}


event_queue = Queue()  # Create a queue for this client


class SSEView(View):

    def event_stream(self, user_room, event_queue):
        clients_by_group[user_room].append(event_queue)
        try:
            while True:
                # Check for new events in the queue (this will block until an event is available)
                event_data = event_queue.get(
                    block=True
                )  # Wait until an event is pushed
                yield f"data: {event_data}\n\n"  # Send the event to the client
        except GeneratorExit:
            # Remove the client from the group on disconnect
            clients_by_group[user_room].remove(event_queue)

    def get(self, request, *args, **kwargs):
        authenticator = CookieJWTAuthentication()
        user_auth_tuple = authenticator.authenticate(request)

        if user_auth_tuple is None:
            return StreamingHttpResponse("Unauthorized", status=401)

        user, _ = user_auth_tuple
        request.user = user
        user = request.user
        user_instance = CustomUserModel.objects.filter(username=user.username).first()
        user_room = user_instance.room

        # Add the user to their group in the client dictionary
        if user_room not in clients_by_group:
            clients_by_group[user_room] = []
        clients_by_group[user_room].append(request)

        response = StreamingHttpResponse(
            self.event_stream(user_room, event_queue), content_type="text/event-stream"
        )
        response["Cache-Control"] = "no-cache"
        return response
