import React, { useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";

import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

export interface CurrentSongBoxProps {
  songName: string;
  imgUrl: string;
  likes: number;
  dislikes: number;
}

export default function CurrentSongBox({
  songName,
  imgUrl,
  likes,
  dislikes,
}: CurrentSongBoxProps) {
  const [submitComment, setSubmitComment] = useState<"like" | "dislike" | null>(
    null
  );

  const ButtonChecker = (value: string) => {
    if (submitComment == null) return true;
    if (value == submitComment) return true;
    return false;
  };

  const handleSubmitBtn = (value: "like" | "dislike") => {
    if (submitComment == value) {
      setSubmitComment(null);
    } else {
      setSubmitComment(value);
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
            margin: "16px 0",
          }}
        >
          <Typography>Song Image</Typography>
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
