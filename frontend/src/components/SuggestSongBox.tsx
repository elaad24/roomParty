import React, { ReactElement, useCallback, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { debounce, Stack } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import SendIcon from "@mui/icons-material/Send";
import { spotifySearchItem } from "../api/spotify";
import { currentSongDataInterface } from "../pages/PartyRoom";
import AutocompleteOption from "./SongAutocompleteOption";
import { suggestSong } from "../api/roomRequsets";

interface SuggestSongBox {
  room_key: string;
}

export default function SuggestSongBox({ room_key }: SuggestSongBox) {
  const [inputValue, setInputValue] = useState(""); // Stores the user input
  const [userPicked, setUserPicked] = useState<
    Partial<currentSongDataInterface> | undefined
  >(undefined); // Stores the user pick
  const [options, setOptions] = useState<Partial<currentSongDataInterface>[]>(
    []
  ); // Options for the Autocomplete
  const [loading, setLoading] = useState(false); // Loading state for async search

  // Function to fetch data from the API
  const fetchOptions = async (query: string) => {
    setLoading(true);
    try {
      const data = await spotifySearchItem({ text: query });
      if (data?.tracks) {
        const organizedData = data.tracks.items.map((i) => {
          return {
            title: i.name,
            artist: i.artists[0].name,
            image_url: i.album.images[0].url,
            is_playing: false,
            id: i.id,
          };
        });
        setOptions(organizedData);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced version of the fetchOptions function
  const debouncedFetchOptions = useCallback(debounce(fetchOptions, 500), []);

  // Update options when input value changes with debounce
  useEffect(() => {
    if (inputValue.length > 2) {
      debouncedFetchOptions(inputValue); // Use the debounced function
    } else {
      setOptions([]); // Clear options if input length is too s/hort
    }
  }, [inputValue, debouncedFetchOptions]);

  const submitSongSuggestions = async () => {
    const { data } = await suggestSong({
      room_key: room_key,
      title: userPicked!.title as string,
      image_url: userPicked!.image_url as string,
      id: userPicked!.id as string,
    });
  };

  return (
    <Box>
      <Stack direction={"row"} gap={"1rem"}>
        <Autocomplete
          sx={{ width: "15rem" }}
          filterOptions={(x) => x}
          autoComplete
          options={options}
          getOptionLabel={(option) => {
            return options.length > 0 ? (option.title as string) : "no data";
          }}
          renderOption={(props, option) => {
            const { key, ...optionProps } = props;

            return (
              <AutocompleteOption
                key={key}
                renderOptionsProps={optionProps}
                imgSrc={option.image_url as string}
                title={option.title as string}
                subtitle={option.artist as string}
              />
            );
          }}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          onChange={(e, v) => setUserPicked(v)}
          loading={loading}
          renderInput={(params) => (
            <TextField
              {...params}
              onClick={() => {
                console.log("user picked - ", params.InputProps);
              }}
              label="Search"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
        <Button
          disabled={userPicked != undefined ? false : true}
          color="success"
          endIcon={<SendIcon />}
          variant="contained"
          onClick={() => submitSongSuggestions()}
        >
          Send
        </Button>{" "}
      </Stack>
    </Box>
  );
}
