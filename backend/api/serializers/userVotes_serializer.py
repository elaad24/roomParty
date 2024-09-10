from rest_framework import serializers
from api.models.VoteUserModel import UserVotesModel
class UserVotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserVotesModel
        fields = [
            "room_key",
            "username",
            "active_song_id",
            "vote_type"
        ]
        extra_kwargs={
            "username":{"required":False},
                    }
      

