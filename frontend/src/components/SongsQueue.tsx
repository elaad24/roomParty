import React, { useEffect, useState } from "react";
import { List, ListItem, Stack } from "@mui/material";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { roomSongsQueueInterface } from "../api/roomRequsets";

interface songQueue {
  queue: roomSongsQueueInterface[];
}
export default function SongsQueue({ queue }: songQueue) {
  return (
    <Grid>
      <Box sx={{ border: "1px dashed grey", padding: 2, borderRadius: 2 }}>
        <Typography variant="h6">Songs Queue</Typography>
        {queue ? (
          <List
            sx={{ maxHeight: "55vh", overflowX: "hidden", overflowY: "auto" }}
          >
            {queue.map((item, index) => {
              return (
                <div key={item.id}>
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
                        src={item.songs_img}
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
                        <Stack direction={"column"} paddingTop={1.5}>
                          <Typography>{item.song_title}</Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </ListItem>
                  {index < queue.length - 1 && <Divider />}
                </div>
              );
            })}
          </List>
        ) : (
          <Typography variant="h5">no songs in queue</Typography>
        )}
      </Box>
    </Grid>
  );
}
