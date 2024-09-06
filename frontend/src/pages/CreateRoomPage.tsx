import React, { useState } from "react";
import {
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  TextField,
  Box,
  Stack,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateRoomPage() {
  const [ableToControlState, setAbleToControlState] = useState<boolean>(true);
  const [votes, setVotes] = useState<number>(2);
  const navigation = useNavigate();
  const handleControlChange = () => {
    setAbleToControlState((prev) => !prev);
  };

  const handleVotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVotes(parseInt(event.target.value));
  };

  const createRoom = async () => {
    const { data } = await axios.post("http://127.0.0.1:8000/api/create-room", {
      guest_can_pause: ableToControlState,
      votes_to_skip: votes,
    });
    navigation(`/room/${data.code}`);
    console.log("data", data);
  };

  const handleBack = () => {
    navigation(`/`);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      height="100vh"
    >
      <Typography variant="h4" gutterBottom>
        Create A Room
      </Typography>

      <Typography variant="subtitle1" gutterBottom>
        Guest Control of Playback State
      </Typography>

      <RadioGroup
        row
        value={ableToControlState ? "play-pause" : "no-control"}
        onChange={handleControlChange}
      >
        <FormControlLabel
          value="play-pause"
          control={<Radio />}
          label="Play/Pause"
        />
        <FormControlLabel
          value="no-control"
          control={<Radio />}
          label="No Control"
        />
      </RadioGroup>

      <TextField
        label="Votes Required To Skip Song"
        type="number"
        value={votes}
        onChange={handleVotesChange}
        sx={{ my: 2 }}
      />
      <Stack direction="row" gap={"2em"}>
        <Button
          onClick={() => createRoom()}
          variant="contained"
          color="primary"
          size="large"
        >
          Create A Room
        </Button>

        <Button
          onClick={handleBack}
          variant="contained"
          color="error"
          size="large"
        >
          Back
        </Button>
      </Stack>
    </Box>
  );
}
