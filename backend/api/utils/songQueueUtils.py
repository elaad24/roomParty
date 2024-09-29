from itertools import groupby
from operator import attrgetter

from api.models.customUserModel import CustomUserModel
from api.models.songs_queue import SongsQueueModel
from api.models.suggetedSongsModel import suggestedSongsModel
from api.serializers.songs_queue_serializer import Songs_queue_serializer
from spotify.utils import execute_spotify_api_request


def add_song_to_queue(room_key):
    song_queue_instate = SongsQueueModel.objects.filter(room_key=room_key)
    suggested_songs_instance = suggestedSongsModel.objects.filter(
        room_key=room_key
    ).order_by("-likes")[:5]

    if not suggested_songs_instance:
        return
    grouped_suggested_songs_by_likes = [
        list(group)
        for key, group in groupby(
            list(suggested_songs_instance), key=attrgetter("likes")
        )
    ]

    song_id_of_songs_that_added_to_queue = []
    if len(song_queue_instate) >= 6:
        songs_to_add = 0
    elif len(song_queue_instate) <= 3:
        songs_to_add = 2
    else:
        songs_to_add = 1
    for i in grouped_suggested_songs_by_likes:
        for j in i:
            if songs_to_add <= 0:
                break

            data = {
                "room_key": j.room_key,
                "songs_id": j.suggested_songs_id,
                "song_title": j.suggested_song_title,
                "songs_img": j.suggested_songs_img,
            }
            add_song_to_queue_serializer = Songs_queue_serializer(data=data)
            add_song_to_queue_serializer.is_valid()
            add_song_to_queue_serializer.save()
            song_id_of_songs_that_added_to_queue.append(data["songs_id"])

            roomHostInstace = CustomUserModel.objects.filter(
                room=room_key, host=True
            ).first()
            execute_spotify_api_request(
                roomHostInstace,
                f"me/player/queue?uri=spotify:track:{j.suggested_songs_id}",
                True,
            )

            songs_to_add -= 1
    suggestedSongsModel.objects.filter(
        room_key=room_key,
        suggested_songs_id__in=song_id_of_songs_that_added_to_queue,
    ).delete()
