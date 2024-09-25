import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import { Card, CardMedia } from "@mui/material";

import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { getUserVote, voteForCurrentSong } from "../api/roomRequsets";
import {
  currentSongDataInterface,
  currentSongVoteInterface,
} from "../pages/PartyRoom";

export interface currentSongDataInterfaceProps {
  currentSongData: currentSongDataInterface;
  room_key: string;
  currentSongVotes: currentSongVoteInterface | null;
}

export default function CurrentSongBox({
  currentSongData: { title, artist, image_url, is_playing, id, like, dislike },
  room_key,
  currentSongVotes,
}: currentSongDataInterfaceProps) {
  const [submitComment, setSubmitComment] = useState<"like" | "dislike" | null>(
    null
  );
  const [likeBtnIsDisabled, setlikeBtnIsDisabled] = useState<boolean>(false);
  const [dislikeBtnIsDisabled, setDislikeBtnIsDisabled] =
    useState<boolean>(false);
  useEffect(() => {
    if (submitComment !== null) {
      ButtonChecker(submitComment);
    }
  }, [submitComment, likeBtnIsDisabled, dislikeBtnIsDisabled]);

  useEffect(() => {
    const run = async () => {
      const { data } = await getUserVote();

      if (data.active_song_id == id) {
        setSubmitComment(
          data.vote == "1" ? "like" : data.vote == "0" ? "dislike" : null
        );
      }
    };

    run();
  }, [id]);

  const ButtonChecker = (value?: "like" | "dislike" | undefined) => {
    let checkBy = submitComment;

    if (value != undefined) checkBy = value;

    if (checkBy == null) {
      setlikeBtnIsDisabled(false);
      setDislikeBtnIsDisabled(false);
    } else if ("like" == checkBy) {
      setDislikeBtnIsDisabled(true);
      setlikeBtnIsDisabled(false);
    } else if ("dislike" == checkBy) {
      setlikeBtnIsDisabled(true);
      setDislikeBtnIsDisabled(false);
    }
  };
  const active_song_id = id;
  const songName = title;
  const likes = currentSongVotes?.like || like;
  const dislikes = currentSongVotes?.dislike || dislike;

  const handleSubmitBtn = async (value: "like" | "dislike") => {
    let voteType: "0" | "1" = "0";
    if (submitComment == value) {
      if (submitComment == "like") {
        voteType = "1";
      }
      setSubmitComment(null);
    } else {
      setSubmitComment(value);
      if (value == "like") {
        voteType = "1";
      }
      ButtonChecker(value);
    }

    await voteForCurrentSong({
      room_key,
      active_song_id,
      vote_type: voteType || "0",
    });
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
        <Typography>
          {songName.length > 25 ? songName.slice(0, 23) + ".." : songName}
        </Typography>
        <Typography>{artist}</Typography>
        <Box
          sx={{
            height: 150,
            width: 150,
            backgroundColor: "#e0e0e0",
            margin: "16px auto",
          }}
        >
          <Card>
            <CardMedia component="img" image={image_url} alt="Album Cover" />
          </Card>
        </Box>
        <Typography>Current Stats:</Typography>
        <Typography>Likes: {likes}</Typography>
        <Typography>Dislikes: {dislikes}</Typography>
        <Button
          startIcon={<ThumbUpIcon />}
          variant="contained"
          sx={{ mr: 1 }}
          disabled={likeBtnIsDisabled}
          color="primary"
          onClick={() => handleSubmitBtn("like")}
        >
          Like
        </Button>
        <Button
          disabled={dislikeBtnIsDisabled}
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
