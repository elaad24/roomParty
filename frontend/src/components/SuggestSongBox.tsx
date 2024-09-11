import React, { ReactElement, useCallback, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import NativeSelect from "@mui/material/NativeSelect";
import InputBase from "@mui/material/InputBase";
import { debounce, Stack } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import SendIcon from "@mui/icons-material/Send";

interface Option {
  label: string;
  value: string;
}

const top100Films = [
  { label: "The Shawshank Redemption", year: 1994 },
  { label: "The Godfather", year: 1972 },
  { label: "The Godfather: Part II", year: 1974 },
  { label: "The Dark Knight", year: 2008 },
  { label: "12 Angry Men", year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: "Pulp Fiction", year: 1994 },
];

export default function SuggestSongBox() {
  const [inputValue, setInputValue] = useState(""); // Stores the user input
  const [userPicked, setUserPicked] = useState<string | undefined>(""); // Stores the user pick
  // const [options, setOptions] = useState<Option[]>([]); // Options for the Autocomplete
  const [options, setOptions] = useState<string>(""); // Options for the Autocomplete
  const [loading, setLoading] = useState(false); // Loading state for async search

  // Function to fetch data from the API
  const fetchOptions = async (query: string) => {
    setLoading(true);
    try {
      // const response = await axios.get(`/api/search?q=${query}`);
      // const fetchedOptions = response.data.map((item: any) => ({
      //   label: item.name, // Customize based on the response structure
      //   value: item.id,
      // }));
      setOptions(query);
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
      setOptions([]); // Clear options if input length is too short
    }
  }, [inputValue, debouncedFetchOptions]);

  return (
    <Box>
      <Stack direction={"row"} gap={"1rem"}>
        <Autocomplete
          sx={{ width: "15rem" }}
          options={top100Films}
          getOptionLabel={(option) => option.label} // Display the label in the dropdown
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue); // Update input value as user types
          }}
          onChange={(e, v) => setUserPicked(v?.label)}
          loading={loading} // Show loading spinner when data is being fetched
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
          disabled={inputValue != "" ? false : true}
          color="success"
          endIcon={<SendIcon />}
          variant="contained"
          onClick={() => "dislike"}
        >
          Send
        </Button>{" "}
      </Stack>
    </Box>
  );
}
