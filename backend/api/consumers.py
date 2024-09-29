import json

from asgiref.sync import async_to_sync
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer


class MyConsumer(AsyncWebsocketConsumer):

    @database_sync_to_async
    def get_room_instance(self):
        from api.models.roomModel import RoomModel

        return RoomModel.objects.filter(code=self.room_key).first()

    async def connect(self):
        from api.models.roomModel import RoomModel

        # Get the room_key from the URL or scope (you can modify the connection path to pass this)

        self.room_key = self.scope["url_route"]["kwargs"]["room_key"]
        self.room_group_name = f"room_{self.room_key}"
        roomInstance = await self.get_room_instance()
        if roomInstance is None:
            await self.close(code=404)
            return

        # Add the user to the group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        # Remove the user from the group on disconnect
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data["message"]

        # Broadcast the message to all users in the group
        await self.channel_layer.group_send(
            self.room_group_name, {"type": "chat_message", "message": message}
        )

    async def chat_message(self, event):
        message = event["message"]

        # Send the message to WebSocket
        await self.send(text_data=json.dumps({"message": message}))

    async def send_group_message(self, event):
        event_type = event["event_type"]
        data = event["data"]

        # Send the message to the WebSocket
        await self.send(
            text_data=json.dumps(
                {
                    "event_type": event_type,
                    "data": data,
                }
            )
        )
