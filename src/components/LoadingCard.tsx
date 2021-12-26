import React from "react";

import { Box, Flex, Spinner } from "@chakra-ui/react";

export const LoadingCard: React.FC = () => {
  return (
    <Box position="fixed" maxHeight="40vh" width="40vw" top="30vh" left="30vw" paddingY="10vh">
      <Flex alignItems="center" justifyContent="center">
        <Box>
          <Spinner size="xl" />
        </Box>
      </Flex>
    </Box>
  );
};
