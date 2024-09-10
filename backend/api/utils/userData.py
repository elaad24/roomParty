from api.models.roomModel import RoomModel
from rest_framework.response import Response
from rest_framework import status


def check_user_in_room_and_room_exist(user_instance,room_key):
    #check that the user is in the room that he tring to suggest song to 
    if user_instance.room !="null" and  room_key !=user_instance.room:
        return Response({"message":"user is not in that room , cant offer songs to different room!"}, status=status.HTTP_401_UNAUTHORIZED)

    # check that the room is exist 
    room_instance=RoomModel.objects.filter(code=user_instance.room).first()
    if room_instance==None:
        return Response({"message":"the room is not active!"}, status=status.HTTP_400_BAD_REQUEST)
            