from api.models.votesModel import VotesModel
from rest_framework import serializers, status


class RoomVotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = VotesModel
        fields = [
            "id",
            "host_username",
            "dislike",
            "like",
            "request_to_change_genre",
            "room_key",
            "active_song_id",
            "active_song_name",
            "active_song_img",
            "active_song_artists",
            "active_song_is_playing",
        ]
        extra_kwargs = {}
