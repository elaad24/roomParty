from rest_framework import serializers
from api.models.customUserModel import CustomUserModel



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUserModel
        fields = ["username","password","room","host"]
        extra_kwargs={
            "password":{"write_only":True},
            "room":{"required":False}
            }
    def create(self, validated_data):
        # hashing the password 
        # the password normally being hashed automaticly because in model you use AbstractUser
        # but because you using serializer  and dont use set_password() it isn't being hash automaticly 
        # so you overid the create function 
        user= CustomUserModel.objects.create_user(**validated_data)
        return user