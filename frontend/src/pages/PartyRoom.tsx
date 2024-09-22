import React, { useEffect, useState } from "react";
import { getUser } from "../api/userRequsets";
import { useNavigate, useParams } from "react-router-dom";
import {
  checkRoomIsExist,
  getRoomSongsQueue,
  getSuggestedSongs,
  RoomResponse,
  roomSongsQueueInterface,
} from "../api/roomRequsets";

import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import CurrentSongBox from "../components/CurrentSongBox";
import SuggestedSongsBox from "../components/SuggestedSongsBox";
import SongsQueue from "../components/SongsQueue";
import SuggestSongBox from "../components/SuggestSongBox";
import { authenticateSpotify, getCurrentSong } from "../api/spotify";

export interface currentSongDataInterface {
  title: string;
  artist: string;
  image_url: string;
  is_playing: boolean;
  id: string;
  like: number;
  dislike: number;
}

export interface suggestedSongsInterface {
  id: number;
  likes: number;
  room_key: string;
  suggested_song_title: string;
  suggested_songs_id: string;
  suggested_songs_img: string;
  suggested_by: string;
}

export default function PartyRoom() {
  const [roomInfo, setRoomInfo] = useState<RoomResponse | null>(null);
  const [userInfo, setUserInfo] = useState<RoomResponse | null>(null);
  const [spotifyAuthenticated, setSpotifyAuthenticated] =
    useState<boolean>(false);
  const [currentSongData, setCurrentSongData] =
    useState<currentSongDataInterface | null>(null);
  const [suggestedSongs, setSuggestedSongs] = useState<
    suggestedSongsInterface[] | null
  >(null);
  const [roomSongsQueue, setRoomSongsQueue] = useState<
    roomSongsQueueInterface[] | null
  >(null);

  const navigate = useNavigate();

  const returnToHomePage = () => {
    navigate(`/`);
  };
  const { roomCode } = useParams();

  useEffect(() => {
    const run = async () => {
      // check that the room exist and the user is connected to that room
      if (typeof roomCode !== "string") {
        return returnToHomePage();
      }
      const roomData = await checkRoomIsExist({ room_key: roomCode });
      if (!roomData) {
        returnToHomePage();
      }
      const userData = await getUser();
      if (userData.room !== roomData.code) {
        returnToHomePage();
      } else {
        //check that the user is the host - so it will connect him to spotify
        if (roomData.host == userData.username) {
          await authenticateSpotify({
            spotifyAuthenticatedStateSetter: setSpotifyAuthenticated,
          });
        }
      }
      const data = await getCurrentSong();
      setCurrentSongData(data);

      setUserInfo(userData);

      const suggestedSongsData = await getSuggestedSongs();
      console.log("suggestedSongsData.data.data", suggestedSongsData);

      setSuggestedSongs(suggestedSongsData.data.data);

      const roomSongsQueue = await getRoomSongsQueue();
      console.log("roomSongsQueue", roomSongsQueue);

      setRoomSongsQueue(roomSongsQueue.data);
    };
    run();

    //! continuew
    //implement song queeu in front and back
  }, []);

  return (
    <Box sx={{ padding: 2, backgroundColor: "#f0f4ff", minHeight: "100vh" }}>
      <Grid container spacing={2}>
        <CurrentSongBox
          room_key={roomCode ? roomCode : "0"}
          currentSongData={
            currentSongData
              ? currentSongData
              : {
                  title: "",
                  artist: "",
                  image_url: "",
                  is_playing: false,
                  id: "",
                  like: 0,
                  dislike: 0,
                }
          }
        />
        <SuggestedSongsBox
          room_key={roomCode ? roomCode : ""}
          songs={suggestedSongs}
        />
        {/* Songs Queue Section */}
        <SongsQueue
          queue={
            roomSongsQueue
              ? roomSongsQueue
              : [
                  {
                    id: 0,
                    room_key: "",
                    songs_id: "",
                    song_title: "",
                    songs_img: "",
                  },
                ]
          }
        />
        <SuggestSongBox room_key={roomCode as string} />
        {/* Suggest Song Section */}
        {/* Connect with Spotify Section */}
        {/* <ConnectToSpotifybox /> */}
      </Grid>
    </Box>
  );
}
