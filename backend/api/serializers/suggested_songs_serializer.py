from rest_framework import serializers
from api.models.suggetedSongsModel import suggestedSongsModel
class Suggested_songs_serializer(serializers.ModelSerializer):
    class Meta:
        model = suggestedSongsModel
        fields = [
            "id",
            "room_key",
            "suggested_songs_id",
            "suggested_songs_img",
            "suggested_song_title",
            "likes",
            "suggested_by"
            ]
        extra_kwargs={
        
            "suggested_by":{"required":False},
            "likes":{"required":False}
            }