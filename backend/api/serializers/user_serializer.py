from rest_framework import serializers
from api.models.customUserModel import CustomUserModel



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUserModel
        fields = ["username","password"]
        extra_kwargs={"password":{"write_only":True}}