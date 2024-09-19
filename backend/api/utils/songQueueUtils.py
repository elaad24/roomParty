from itertools import groupby
from operator import attrgetter

from api.models.songs_queue import SongsQueueModel
from api.models.suggetedSongsModel import suggestedSongsModel
from api.serializers.songs_queue_serializer import Songs_queue_serializer


# ! need to cuntinuw work on it and also to fix the doubble  reqserst from the frontend
def add_song_to_queue(request, room_key):
    song_queue_instate = SongsQueueModel.objects.filter(room_key=room_key)
    # song_queue_instate = SongsQueueModel.objects.all().delete()
    suggested_songs_instance = suggestedSongsModel.objects.filter(
        room_key=room_key
    ).order_by("-likes")[:5]

    if not suggested_songs_instance:
        print("no suggested songs ")
        return
    grouped_suggested_songs_by_likes = [
        list(group)
        for key, group in groupby(
            list(suggested_songs_instance), key=attrgetter("likes")
        )
    ]

    song_id_of_songs_that_added_to_queue = []
    songs_to_add = 2 if len(song_queue_instate) < 5 else 1
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
            print("just before save ")
            add_song_to_queue_serializer.save()
            print("just after save ")
            song_id_of_songs_that_added_to_queue.append(data["songs_id"])
            songs_to_add -= 1
    print("songs added to queue")
    suggestedSongsModel.objects.filter(
        room_key == room_key,
        suggested_songs_id__in=song_id_of_songs_that_added_to_queue,
    ).delete()
    print("songs deleted for the queue")
