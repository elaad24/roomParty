from django.db.models.signals import post_delete, post_save, pre_save
from django.dispatch import receiver

from .models.songs_queue import SongsQueueModel
from .models.suggestedSongsVotesModel import SuggestedSongsVotesModal
from .models.suggetedSongsModel import suggestedSongsModel
from .models.votesModel import VotesModel
from .models.VoteUserModel import UserVotesModel
from .serializers.songs_queue_serializer import Songs_queue_serializer
from .serializers.suggested_songs_serializer import Suggested_songs_serializer
from .serializers.suggested_songs_votes_serializer import (
    Suggested_songs_votes_serializer,
)
from .utils.songQueueUtils import add_song_to_queue
from .utils.sseDataFunction import send_event_to_group
from .utils.updateVoteCountSignal import (
    update_vote_count_in_vote_model_by_voteUserModel_function,
)


@receiver(post_save, sender=UserVotesModel)
def update_vote_count_in_vote_model_by_voteUserModel(sender, instance, **kwargs):
    triggered_instance = instance
    update_vote_count_in_vote_model_by_voteUserModel_function(instance, **kwargs)


@receiver(post_delete, sender=UserVotesModel)
def update_vote_count_after_delete(sender, instance, **kwargs):
    triggered_instance = instance
    update_vote_count_in_vote_model_by_voteUserModel_function(instance, **kwargs)


@receiver(pre_save, sender=VotesModel)
def cleanup_in_UserVotesModel_when_song_change(sender, instance, **kwargs):

    prev_DB_instance = VotesModel.objects.filter(room_key=instance.room_key).first()
    if prev_DB_instance and prev_DB_instance.active_song_id != instance.active_song_id:
        UserVotesModel.objects.filter(
            room_key=instance.room_key, active_song_id=prev_DB_instance.active_song_id
        ).delete()
    fetch_songs_from_suggestion_list_to_songs_queue_when_song_change(
        sender, instance, **kwargs
    )


def fetch_songs_from_suggestion_list_to_songs_queue_when_song_change(
    sender, instance, **kwargs
):
    prev_DB_instate = VotesModel.objects.filter(room_key=instance.room_key).first()
    if (
        prev_DB_instate
        and prev_DB_instate.active_song_id != instance != instance.active_song_id
    ):
        add_song_to_queue(prev_DB_instate.room_key)


# connected votes_table - for tracking song changes
@receiver(post_save, sender=VotesModel)
# to track the user voting on currnt song
@receiver(post_save, sender=UserVotesModel)
# to track the user voting on suggested songs
@receiver(post_save, sender=SuggestedSongsVotesModal)
# to track the suggested songs
@receiver(post_save, sender=suggestedSongsModel)
# to track the songs queue
@receiver(post_save, sender=SongsQueueModel)
def trigger_sse(sender, instance, **kwargs):
    room_key = instance.room_key
    model_name = sender.__name__
    modal_type = ""
    data_to_pass = ""
    data = {modal_type: data_to_pass}
    modal_type = model_name

    if model_name == "VotesModel":
        # replace the old data
        data_to_pass = instance

    elif model_name == "UserVotesModel":
        #  get the new data only
        data_to_pass = instance

    elif model_name == "SuggestedSongsVotesModal":
        # replace the old data
        # get only the current data  the new data
        suggested_song_votes_instance = SuggestedSongsVotesModal.objects.filter(
            room_key=room_key
        )

        if suggested_song_votes_instance:
            data_to_pass = {
                "all_data": Suggested_songs_votes_serializer(
                    suggested_song_votes_instance, many=True
                ).data,
                "the_new_instance": instance,
            }
        else:
            data_to_pass = None

    elif model_name == "suggestedSongsModel":
        # replace the old data
        # ? maybe to add the current data as well for displacing
        suggested_song_room_instance = suggestedSongsModel.objects.filter(
            room_key=room_key
        ).order_by("-likes")
        if suggested_song_room_instance != None:
            data_to_pass = {
                "all_data": Suggested_songs_serializer(
                    suggested_song_room_instance, many=True
                ).data,
                "the_new_instance": instance,
            }
        else:
            data_to_pass = None

    elif model_name == "SongsQueueModel":
        # replace the old data
        song_queue_instate = SongsQueueModel.objects.filter(room_key=room_key)
        if song_queue_instate != None:
            data_to_pass = Songs_queue_serializer(song_queue_instate, many=True).data
        else:
            data_to_pass = None

    send_event_to_group(room_key, modal_type, data)
