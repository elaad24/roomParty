from rest_framework import serializers,status
from api.models.roomModel import RoomModel
from api.models.votesModel import VotesModel
from api.models.VoteUserModel import UserVotesModel
from rest_framework.response import Response

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomModel
        fields = [
                    "id",
                    "code", 
                    "host",
                    "user_can_pass_songs",
                    "votes_to_switch_type_is_num",
                    "votes_to_switch",
                ]
        extra_kwargs={
            # "code":{"required":False},
            # "host":{"required":False},
            "is_active":{"required":False},
            "users_in_room":{"required":False}
        }
    


# need to add an function that update the active song and the img 
# and another one tho update the user in room 
