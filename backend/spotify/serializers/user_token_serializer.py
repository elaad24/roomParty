from rest_framework import serializers,status
from spotify.models import models
from api.models.votesModel import VotesModel
from api.models.VoteUserModel import UserVotesModel
from rest_framework.response import Response

class UserTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = models
        fields = [
            "id",
            "username",
            "created_at",
            "refresh_token",
            "access_token",
            "expires_in",
            "token_type"
] 
        extra_kwargs={
            "username":{"required":False},

        }
    
 
