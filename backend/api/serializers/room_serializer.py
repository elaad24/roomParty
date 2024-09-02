from rest_framework import serializers
from api.models.roomModel import RoomModel

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
            "host":{"required":False}
        }
    
    def create(self,validated_data):
        user = self.context['request'].user
        validated_data['room_name']=f"{user.username}-room"
        validated_data['host']=user.username
        return super().create(validated_data)

