from rest_framework import serializers
from api.models.suggestedSongsVotesModel import SuggestedSongsVotesModal

class Suggested_songs_votes_serializer(serializers.ModelSerializer):
    class Meta:
        model = SuggestedSongsVotesModal
        fields = [
            "room_key",
            "suggested_songs_id",
            "username"
        ]
        extra_kwargs={
            "username":{"required":False},
                    }
