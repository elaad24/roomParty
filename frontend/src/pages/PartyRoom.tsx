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

export default function PartyRoom() {
  const [roomInfo, setRoomInfo] = useState<RoomResponse | null>(null);
  const [userInfo, setUserInfo] = useState<RoomResponse | null>(null);

  const navigate = useNavigate();

  //check the room exist
  // check the user in that room

  const returnToHomePage = () => {
    navigate(`/}`);
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
      setRoomInfo(roomData);

      const userData = await getUser();
      if (userData.room !== roomData.code) {
        returnToHomePage();
      }
      setUserInfo(userData);
    };
    // run();
  }, []);

  return (
    <Box sx={{ padding: 2, backgroundColor: "#f0f4ff", minHeight: "100vh" }}>
      <Grid container spacing={2}>
        {/* Current Song Section */}
        <CurrentSongBox />
        {/* Suggested Songs Section */}
        {/* <SuggestedSongsBox /> */}
        {/* Songs Queue Section */}
        {/* <SongsQueue /> */}
        {/* Suggest Song Section */}
        {/* <SuggestedSongsBox /> */}
        {/* Connect with Spotify Section */}
        {/* <ConnectToSpotifybox /> */}{" "}
      </Grid>
    </Box>
  );
}
