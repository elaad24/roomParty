from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models.votesModel import VotesModel
from.models.VoteUserModel import UserVotesModel

@receiver(post_save,sender=UserVotesModel)
def update_vote_count_in_vote_model_by_voteUserModel(sender, instance, created, **kwargs):
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




@receiver(pre_save,sender=VotesModel)
def cleanup_in_UserVotesModel_when_song_change(sender, instance,**kwargs):

    DB_instance=VotesModel.objects.filter(room_key=instance.room_key).first()

    if DB_instance and  DB_instance.active_song_id !=instance.active_song_id:
        UserVotesModel.filter(room_key=instance.room_key , active_song_id=instance.active_song_id).delete()
      


