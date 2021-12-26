import { Box, Grid, Text } from "@chakra-ui/react";
import React from "react";

export const Footer: React.FC = () => {
  return (
    <Grid
      role="contentinfo"
      padding="1rem"
      placeItems="center"
      textAlign="center"
      autoFlow="row"
      fontSize="smaller"
      marginTop="2rem"
      width="full"
    >
      <Box>
        <Text>&copy; 2020 &ndash; {new Date().getFullYear()} Nicole Kelly Design</Text>
      </Box>
    </Grid>
  );
};
