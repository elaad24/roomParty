from ..models.VoteUserModel import UserVotesModel
from ..models.votesModel import VotesModel


def update_vote_count_in_vote_model_by_voteUserModel_function(instance,  **kwargs):
    triggered_instance=instance

    all_instance = UserVotesModel.objects.filter(
        room_key=triggered_instance.room_key,
        active_song_id=triggered_instance.active_song_id
        )
    
    liked_instances= list(filter(lambda i : i.vote_type=="1",all_instance))
    disliked_instance_num=len(all_instance)-len(liked_instances)
    votes_table_instance=VotesModel.objects.filter(room_key=triggered_instance.room_key).first()
    votes_table_instance.like=len(liked_instances)
    votes_table_instance.dislike=disliked_instance_num
    votes_table_instance.save()