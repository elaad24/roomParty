import React, { useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import { Card, CardMedia } from "@mui/material";

import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { voteForCurrentSong } from "../api/roomRequsets";
import { currentSongDataInterface } from "../pages/PartyRoom";

export interface currentSongDataInterfaceProps {
  currentSongData: currentSongDataInterface;
  room_key: string;
}

export default function CurrentSongBox({
  currentSongData: { title, artist, image_url, is_playing, id, like, dislike },
  room_key,
}: currentSongDataInterfaceProps) {
  const [submitComment, setSubmitComment] = useState<"like" | "dislike" | null>(
    null
  );

  const active_song_id = id;
  const songName = title;
  const likes = like;
  const dislikes = dislike;

  const ButtonChecker = (value: string) => {
    if (submitComment == null) return true;
    if (value == submitComment) return true;
    return false;
  };

  const handleSubmitBtn = async (value: "like" | "dislike") => {
    if (submitComment == value) {
      setSubmitComment(null);
    } else {
      setSubmitComment(value);
      let voteType: "0" | "1" = "0";
      if (value == "like") {
        voteType = "1";
      }
      await voteForCurrentSong({
        room_key,
        active_song_id,
        vote_type: voteType || "0",
      });
    }
  };
  return (
    <Grid>
      <Box
        alignItems={"center"}
        alignContent={"center"}
        sx={{
          border: "1px dashed grey",
          padding: 2,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6">Current Song</Typography>
        <Typography>{songName}</Typography>
        <Box
          sx={{
            height: 150,
            width: 150,
            backgroundColor: "#e0e0e0",
            margin: "16px auto",
          }}
        >
          <Card>
            <CardMedia
              component="img"
              image="https://i.scdn.co/image/ab67616d0000b273eaa10fffa60de320846c28be"
              alt="Album Cover"
            />
          </Card>
        </Box>
        <Typography>Current Stats:</Typography>
        <Typography>Likes: {likes}</Typography>
        <Typography>Dislikes: {dislikes}</Typography>
        <Button
          startIcon={<ThumbUpIcon />}
          variant="contained"
          sx={{ mr: 1 }}
          disabled={ButtonChecker("like") ? false : true}
          color="primary"
          onClick={() => handleSubmitBtn("like")}
        >
          Like
        </Button>
        <Button
          disabled={ButtonChecker("dislike") ? false : true}
          color="secondary"
          startIcon={<ThumbDownIcon />}
          variant="contained"
          onClick={() => handleSubmitBtn("dislike")}
        >
          Dislike
        </Button>
      </Box>
    </Grid>
  );
}
