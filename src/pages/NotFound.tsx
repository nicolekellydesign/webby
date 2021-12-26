import React from "react";
import { useLocation } from "react-router";
import { Link as ReactLink } from "react-router-dom";

import { Box, Container, Heading, Link, Text } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";

export const NotFound: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.includes("/admin");

  const link = (
    <Link
      as={ReactLink}
      to={isAdminRoute ? "/admin/home" : "/"}
      display="flex"
      alignItems="center"
      justifyContent="center"
      fontSize="2xl"
      marginTop="1rem"
      marginX="auto"
      width="fit-content"
    >
      <ArrowBackIcon width="3rem" height="2rem" />
      <Text>{isAdminRoute ? "Go to admin home" : "Go to home"}</Text>
    </Link>
  );

  return (
    <Container marginTop="15vh">
      <Box marginX="auto" textAlign="center">
        <Heading as="h2" fontSize="5xl">
          Page Not Found
        </Heading>
        <Text fontSize="2xl" paddingTop="1.5rem">
          Sorry, that page doesn&apos;t exist!
        </Text>
        {link}
      </Box>
    </Container>
  );
};
