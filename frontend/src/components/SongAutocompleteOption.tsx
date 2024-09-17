import React from "react";
import { Box, Typography, Avatar } from "@mui/material";

interface OptionProps {
  renderOptionsProps: any;
  imgSrc: string;
  title: string;
  subtitle: string;
}

const AutocompleteOption: React.FC<OptionProps> = ({
  renderOptionsProps,
  imgSrc,
  title,
  subtitle,
}) => {
  return (
    <Box display="flex" alignItems="center" p={1} {...renderOptionsProps}>
      <Avatar
        src={imgSrc}
        alt={title}
        sx={{ width: 40, height: 40, marginRight: 2 }}
      />
      <Box>
        <Typography variant="body1">{title}</Typography>

        <Typography variant="body2" color="textSecondary">
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
};

export default AutocompleteOption;
