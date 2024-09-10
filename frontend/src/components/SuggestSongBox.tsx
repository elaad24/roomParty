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
import { debounce } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";

interface Option {
  label: string;
  value: string;
}

export default function SuggestSongBox() {
  const [inputValue, setInputValue] = useState(""); // Stores the user input
  const [options, setOptions] = useState<Option[]>([]); // Options for the Autocomplete
  const [loading, setLoading] = useState(false); // Loading state for async search

  // Function to fetch data from the API
  const fetchOptions = async (query: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/search?q=${query}`);
      const fetchedOptions = response.data.map((item: any) => ({
        label: item.name, // Customize based on the response structure
        value: item.id,
      }));
      setOptions(fetchedOptions);
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
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.label} // Display the label in the dropdown
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue); // Update input value as user types
      }}
      loading={loading} // Show loading spinner when data is being fetched
      renderInput={(params) => (
        <TextField
          {...params}
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
  );
}
