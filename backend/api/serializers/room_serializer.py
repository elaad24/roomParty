from rest_framework import serializers
from api.models.roomModel import RoomModel
from api.models.votesModel import VotesModel

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomModel
        fields = [
                    "code", 
                    "host",
                    "user_can_pass_songs",
                    "votes_to_switch_type_is_num",
                    "votes_to_switch",
                ]
        extra_kwargs={
            "code":{"required":False},
            "host":{"required":False},
            "is_active":{"required":False},
            "users_in_room":{"required":False}
        }
    
    def create(self,validated_data):
        user = self.context['request'].user
        validated_data['room_name']=f"{user.username}-room"
        validated_data['host']=user.username
        room_instance =  super().create(validated_data)

#  create votes instance  based on the room  
        VotesModel.objects.create(
            room_key=room_instance.code,
            host_username=room_instance.host
        )
        return room_instance


# need to add an function that update the active song and the img 
# and another one tho update the user in room 
