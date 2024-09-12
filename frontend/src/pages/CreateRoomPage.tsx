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
import { useNavigate } from "react-router-dom";
import { createRoom } from "../api/roomRequsets";

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

  const handelCreate = async () => {
    const { data } = await createRoom({
      user_can_pass_songs: ableToControlState,
      votes_to_switch: votes,
      votes_to_switch_type_is_num: true,
    });
    if (data.code !== null) {
      navigation(`/partyRoom/${data.code}`);
    }
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
          onClick={() => handelCreate()}
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
