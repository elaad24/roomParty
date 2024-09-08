import React, { useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkIfUSerInRoom = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/api/user-in-room`
        );
        console.log(data);
        if (data.code !== null) {
          navigate(`/room/${data.code}`);
        }
      } catch (err) {
        console.log(err);
      }
    };

    checkIfUSerInRoom();
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
