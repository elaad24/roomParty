import React, { useEffect, useState } from "react";
import { checkUserInRoom, getUser } from "../api/userRequsets";
import { useNavigate, useParams } from "react-router-dom";
import { checkRoomIsExist, RoomResponse } from "../api/roomRequsets";
import {
  Box,
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import CurrentSongBox from "../components/CurrentSongBox";
import SuggestedSongsBox from "../components/SuggestedSongsBox";
import SongsQueue from "../components/SongsQueue";
import ConnectToSpotifybox from "../components/ConnectToSpotifybox";
import SuggestSongBox from "../components/SuggestSongBox";
import axios from "axios";
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

export default function PartyRoom() {
  const [roomInfo, setRoomInfo] = useState<RoomResponse | null>(null);
  const [userInfo, setUserInfo] = useState<RoomResponse | null>(null);
  const [spotifyAuthenticated, setSpotifyAuthenticated] =
    useState<boolean>(false);
  const [currentSongData, setCurrentSongData] =
    useState<currentSongDataInterface | null>(null);
  const navigate = useNavigate();

  //check the room exist
  // check the user in that room

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
      console.log("datatttttt", data);

      setUserInfo(userData);
    };
    run();

    //! continuew
    // implemnt and connect he adde song to suggestions
    // implemnt getting the data from the back for hte suggested songs
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
          room_key="BSBCCI"
          songs={[
            {
              active_song_id: "this new song1122",
              active_song_img: "er",
              likes: 0,
              suggestedBy: "userTest",
            },
            {
              active_song_id: "2sav",
              active_song_img: "e12r",
              likes: 22,
              suggestedBy: "fdsuserTest",
            },
          ]}
        />
        {/* Songs Queue Section */}
        {/* <SongsQueue /> */}
        <SuggestSongBox room_key={roomCode as string} />
        {/* Suggest Song Section */}
        {/* Connect with Spotify Section */}
        {/* <ConnectToSpotifybox /> */}
      </Grid>
    </Box>
  );
}
