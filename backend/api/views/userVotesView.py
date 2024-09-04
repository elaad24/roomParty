from rest_framework import generics,status,mixins
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from api.authentication import CookieJWTAuthentication
from api.models.VoteUserModel import UserVotesModel
from api.serializers.userVotes_serializer import UserVotesSerializer


class UserVotesView(mixins.CreateModelMixin,mixins.UpdateModelMixin, generics.GenericAPIView):
    queryset=UserVotesModel.objects.all()
    serializer_class = UserVotesSerializer
    authentication_classes=[CookieJWTAuthentication]
    permission_classes=[IsAuthenticated]

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


    def put(self, request, *args, **kwargs):
        username = request.user.username
        room_key_field_value = request.data.get("room_key",None)
        active_song_id_field_value = request.data.get("active_song_id",None)
        instance = self.queryset.filter(username=username,
        room_key=room_key_field_value,
        active_song_id=active_song_id_field_value).first()

        if not instance:
            return Response({"message":"error couldn't find the instance, passed wrong room_key or active_song_id"},status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(instance,data=request.data, partial=True)

        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

