import React, { useEffect, useState } from "react";
import { getUser } from "../api/userRequsets";
import { useNavigate, useParams } from "react-router-dom";
import {
  checkRoomIsExist,
  getRoomSongsQueue,
  getSuggestedSongs,
  RoomResponse,
  roomSongsQueueInterface,
  sseUrl,
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

export interface currentSongVoteInterface {
  active_song_id: string;
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
  const [userInfo, setUserInfo] = useState<any | null>(null);
  const [spotifyAuthenticated, setSpotifyAuthenticated] =
    useState<boolean>(false);
  const [currentSongData, setCurrentSongData] =
    useState<currentSongDataInterface | null>(null);
  const [currentSongVote, setCurrentSongVote] =
    useState<currentSongVoteInterface | null>(null);
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
  const eventType = {
    VotesModel: "VotesModel",
    UserVotesModel: "UserVotesModel",
    SuggestedSongsVotesModal: "SuggestedSongsVotesModal",
    suggestedSongsModel: "suggestedSongsModel",
    SongsQueueModel: "SongsQueueModel",
  };

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
      // console.log("suggestedSongsData.data.data", suggestedSongsData);

      setSuggestedSongs(suggestedSongsData.data.data);

      const roomSongsQueue = await getRoomSongsQueue();
      // console.log("roomSongsQueue", roomSongsQueue);

      setRoomSongsQueue(roomSongsQueue.data);
    };

    run();

    return () => {};
    //! continuew
    // make it better the live conection for the front
    // implemnt the animations
    // implemt that when song change it notidift the server
  }, []);

  //useEffect for socket
  useEffect(() => {
    // Create a new WebSocket instance
    const socket = new WebSocket(`ws://localhost:8000/ws/updates/${roomCode}/`);

    // Handle connection open
    socket.onopen = () => {
      console.log("WebSocket connection established");

      // Optionally send a message to the server
      socket.send(
        JSON.stringify({
          message: `Hello server! user ${userInfo?.username} has connect`,
        })
      );
    };

    // Handle received messages from the server
    socket.onmessage = (event) => {
      console.log("Message from server:", event.data);
      // Parse the data if necessary

      const info = JSON.parse(event.data);
      const messageType = JSON.parse(event.data).event_type;

      if (messageType == "VotesModel") {
        const data = info.data.VotesModel;
        console.log("Data", typeof data, data);
        setCurrentSongVote({
          active_song_id: data.active_song_id,
          like: data.like,
          dislike: data.dislike,
        });
      } else if (messageType == "UserVotesModel") {
        //! continuew
        // implemnt the animations
      } else if (messageType == "SuggestedSongsVotesModal") {
        //! continuew
        // implemnt the animations
      } else if (messageType == "suggestedSongsModel") {
        // implemnt the animations

        const data = info.data.suggestedSongsModel;
        console.log("Data", typeof data, data);

        setSuggestedSongs(
          data.all_data.map((i: suggestedSongsInterface) => {
            return {
              id: i.id,
              likes: i.likes,
              room_key: i.room_key,
              suggested_song_title: i.suggested_song_title,
              suggested_songs_id: i.suggested_songs_id,
              suggested_songs_img: i.suggested_songs_img,
              suggested_by: i.suggested_by,
            };
          })
        );
      } else if (messageType == "SongsQueueModel") {
        const data = info.data.SongsQueueModel;
        console.log("Data", typeof data, data);
        setRoomSongsQueue(
          data.SongsQueueModel.map((i: roomSongsQueueInterface) => {
            return {
              id: i.id,
              room_key: i.room_key,
              songs_id: i.songs_id,
              song_title: i.song_title,
              songs_img: i.songs_img,
            };
          })
        );
      }
    };

    // Handle errors
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Handle connection close
    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Clean up when the component unmounts
    return () => {
      socket.close();
    };
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
          currentSongVotes={currentSongVote}
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
