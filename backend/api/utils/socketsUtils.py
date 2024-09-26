from asgiref.sync import async_to_sync
from channels.db import database_sync_to_async

# ----------
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer


def broadcast_to_group(room_key, event_type, data):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"room_{room_key}",  # The group name format used in your consumer
        {"type": "send_group_message", "event_type": event_type, "data": data},
    )
