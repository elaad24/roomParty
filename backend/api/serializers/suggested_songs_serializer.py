from rest_framework import serializers
from api.models.suggetedSongs import suggestedSongs
class Suggested_songs_serializer(serializers.ModelSerializer):
    class Meta:
        model = suggestedSongs
        fields = [
            "id",
            "room_key",
            "suggested_songs_id",
            "suggested_songs_img",
            "likes"
            ]
        extra_kwargs={
        
            "suggested_by":{"required":False},
            "likes":{"required":False}
            }