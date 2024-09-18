import React, { useEffect, useState } from "react";
import { List, ListItem, Stack } from "@mui/material";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import {
  getUserVoteOnSuggestedSongs,
  userSuggestSongsVotes,
  voteForSuggestSong,
} from "../api/roomRequsets";
import { suggestedSongsInterface } from "../pages/PartyRoom";

interface suggestedSongsProps {
  room_key: string;
  songs: suggestedSongsInterface[] | null;
}
export default function SuggestedSongsBox({
  room_key,
  songs,
}: suggestedSongsProps) {
  const [userVotesData, setUserVotesData] = useState<any[] | null>(null);

  useEffect(() => {
    const getData = async () => {
      const data = await getUserVoteOnSuggestedSongs({ room_key });
      setUserVotesData(data);
    };

    getData();
  }, []);

  const handelPress = async (suggested_songs_id: string) => {
    try {
      await voteForSuggestSong({ room_key, suggested_songs_id });
    } catch (error) {}
  };

  return (
    <Grid>
      <Box sx={{ border: "1px dashed grey", padding: 2, borderRadius: 2 }}>
        <Typography variant="h6">Suggested Songs</Typography>
        {songs?.length ? (
          <List
            key={"listOfItems"}
            sx={{ maxHeight: "55vh", overflowY: "auto" }}
          >
            {songs.map((song, index) => (
              <div key={song.suggested_songs_id}>
                <ListItem
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Stack
                    direction="row"
                    gap="1rem"
                    width="100%"
                    maxWidth="22rem"
                  >
                    <Box
                      component="img"
                      src={song.suggested_songs_img}
                      alt="song album photo"
                      sx={{
                        width: 75,
                        height: 75,
                        borderRadius: 5,
                        objectFit: "cover",
                      }}
                    />
                    <Stack
                      direction={"row"}
                      justifyContent={"space-between"}
                      width={"100%"}
                      gap={"1rem"}
                    >
                      <Stack direction={"column"}>
                        <Typography>suggetedby: {song.suggested_by}</Typography>
                        <Typography>
                          song: {song.suggested_song_title}
                        </Typography>
                      </Stack>
                      <Button
                        onClick={() => handelPress(song.suggested_songs_id)}
                        variant={
                          userVotesData?.some(
                            (i) =>
                              i.suggested_songs_id == song.suggested_songs_id
                          )
                            ? "contained"
                            : "outlined"
                        }
                        sx={{
                          marginLeft: "auto",
                          width: "min-content",
                          height: "min-content",
                          alignSelf: "center",
                        }}
                      >
                        {userVotesData?.some(
                          (i) => i.suggested_songs_id == song.suggested_songs_id
                        )
                          ? "Liked"
                          : "Like"}
                      </Button>
                    </Stack>
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
              </div>
            ))}
          </List>
        ) : (
          <Typography>no suggested Songs</Typography>
        )}
      </Box>
    </Grid>
  );
}
