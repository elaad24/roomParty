from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r"^ws/updates/(?P<room_key>\w+)/$", consumers.MyConsumer.as_asgi()),
]
