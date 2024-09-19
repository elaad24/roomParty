from rest_framework import serializers
from api.models.songs_queue import SongsQueueModel

class Songs_queue_serializer(serializers.ModelSerializer):
    class Meta:
        model = SongsQueueModel
        fields = [
            "id",
            "room_key",
            "songs_id",
            "song_title",
            "songs_img",
          
            ]
        extra_kwargs={}