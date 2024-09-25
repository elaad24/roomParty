from api.models.votesModel import VotesModel
from api.serializers.room_votes_serializer import RoomVotesSerializer


def get_current_votes(room_key):
    room_votes_model = VotesModel.objects.filter(room_key=room_key).first()
    return RoomVotesSerializer(room_votes_model).data
