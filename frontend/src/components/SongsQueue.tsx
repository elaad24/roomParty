import React from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  List,
  ListItem,
  IconButton,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

export default function SongsQueue() {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Box sx={{ border: "1px dashed grey", padding: 2, borderRadius: 2 }}>
        <Typography variant="h6">Songs Queue</Typography>
        <List>
          <ListItem>Song Name 1</ListItem>
          <ListItem>Song Name 2</ListItem>
          <ListItem>Song Name 3</ListItem>
          <ListItem>Song Name 4</ListItem>
        </List>
      </Box>
    </Grid>
  );
}
