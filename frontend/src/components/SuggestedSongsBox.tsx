import React from "react";
import { List, ListItem, Stack } from "@mui/material";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { voteForSuggestSong } from "../api/roomRequsets";

interface suggestedSong {
  suggestedBy: string;
  active_song_id: string;
  active_song_img: string;
  likes: number;
}

interface suggestedSongsProps {
  room_key: string;
  songs: suggestedSong[];
}
export default function SuggestedSongsBox({
  room_key,
  songs,
}: suggestedSongsProps) {
  const handelPress = async (suggested_songs_id: string) => {
    // need to build a function that retrive all of the votes for suggestoin for songs
    try {
      await voteForSuggestSong({ room_key, suggested_songs_id });
    } catch (error) {}
  };
  return (
    <Grid>
      <Box sx={{ border: "1px dashed grey", padding: 2, borderRadius: 2 }}>
        <Typography variant="h6">Suggested Songs</Typography>
        <List>
          {songs.map((song, index) => (
            <>
              <ListItem
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  width={"100%"}
                  gap={"1rem"}
                >
                  <Stack direction={"column"}>
                    <Typography>suggetedby:{song.suggestedBy}</Typography>
                    <Typography>song: {song.active_song_id}</Typography>
                  </Stack>
                  <Button
                    onClick={() => handelPress(song.active_song_id)}
                    variant="outlined"
                    sx={{ marginLeft: "auto" }}
                  >
                    Like
                  </Button>
                </Stack>
                <Typography
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignSelf: "center",
                  }}
                >
                  liked:{song.likes}
                </Typography>
              </ListItem>
              {index < songs.length - 1 && <Divider />}
            </>
          ))}
        </List>
      </Box>
    </Grid>
  );
}
