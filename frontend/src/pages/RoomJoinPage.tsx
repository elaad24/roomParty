import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function RoomJoinPage() {
  const [roomCode, setRoomCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigation = useNavigate();
  const handleRoomCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomCode(event.target.value);
  };

  const handleEnterRoom = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/join-room", {
        code: roomCode,
      });
      console.log(res);
      navigation(`/room/${roomCode}`);
    } catch (error: any) {
      setError(error.response.data.message);
      console.log(error.response.data);
      console.error(error);
    }
  };

  const handleBack = () => {
    console.log("Back button clicked");
    navigation("/room");
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Typography variant="h4" gutterBottom>
        Join a Room
      </Typography>

      <TextField
        label="Code"
        value={roomCode}
        onChange={handleRoomCodeChange}
        variant="outlined"
        fullWidth
        error={error.length > 0}
        helperText={error}
        sx={{ my: 2, maxWidth: "300px" }}
      />

      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleEnterRoom}
        sx={{ mb: 2, width: "100%", maxWidth: "300px" }}
      >
        Enter Room
      </Button>

      <Button
        variant="contained"
        color="error"
        size="large"
        onClick={handleBack}
        sx={{ width: "100%", maxWidth: "300px" }}
      >
        Back
      </Button>
    </Box>
  );
}
