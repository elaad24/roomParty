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

export default function SuggestedSongsBox() {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Box sx={{ border: "1px dashed grey", padding: 2, borderRadius: 2 }}>
        <Typography variant="h6">Suggested Songs</Typography>
        <List>
          <ListItem>
            <Typography>User_X : SongName</Typography>
            <Button variant="outlined" sx={{ marginLeft: "auto" }}>
              Like
            </Button>
          </ListItem>
        </List>
      </Box>
    </Grid>
  );
}
