from django.db.models.signals import post_save, pre_save,post_delete
from django.dispatch import receiver
from .models.votesModel import VotesModel
from.models.VoteUserModel import UserVotesModel
from .utils.updateVoteCountSignal import update_vote_count_in_vote_model_by_voteUserModel_function


@receiver(post_save,sender=UserVotesModel)
def update_vote_count_in_vote_model_by_voteUserModel(sender, instance,  **kwargs):
    triggered_instance=instance
    update_vote_count_in_vote_model_by_voteUserModel_function( instance,  **kwargs)

@receiver(post_delete, sender=UserVotesModel)
def update_vote_count_after_delete(sender, instance,  **kwargs):
    triggered_instance = instance
    update_vote_count_in_vote_model_by_voteUserModel_function( instance,  **kwargs)


@receiver(pre_save,sender=VotesModel)
def cleanup_in_UserVotesModel_when_song_change(sender, instance, **kwargs):

    prev_DB_instance=VotesModel.objects.filter(room_key=instance.room_key).first()
    if prev_DB_instance and  prev_DB_instance.active_song_id !=instance.active_song_id:
        UserVotesModel.objects.filter(room_key=instance.room_key , active_song_id=prev_DB_instance.active_song_id).delete()
      


