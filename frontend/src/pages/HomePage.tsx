import React, { useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { checkUserInRoom } from "../api/userRequsets";
import { setSpotifyUserName } from "../api/spotify";

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation(); // Access the URL
  const queryParams = new URLSearchParams(location.search); // Parse the query parameters

  const token_id = queryParams.get("token_id"); // Get the value of 'room_key'

  useEffect(() => {
    const run = async () => {
      debugger;
      if (token_id && typeof token_id == "string") {
        console.log("token_id from main", token_id);
        await setSpotifyUserName({ encryptedToken: token_id });
      }

      const data = await checkUserInRoom();
      if (data.code !== null) {
        navigate(`/partyRoom/${data.code}`);
      }
    };
    run();
  }, []);

  const handleJoinRoom = () => {
    navigate("/joinRoom");
    console.log("Join a Room clicked");
  };

  const handleCreateRoom = () => {
    // Logic to navigate to Create Room
    navigate("/createRoom");
    console.log("Create a Room clicked");
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      height="100vh"
    >
      <Typography variant="h3" gutterBottom>
        House Party
      </Typography>

      <Box display="flex" justifyContent="center" mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleJoinRoom}
          sx={{ mr: 1 }}
        >
          Join a Room
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={handleCreateRoom}
          sx={{ ml: 1 }}
        >
          Create a Room
        </Button>
      </Box>
    </Box>
  );
}
