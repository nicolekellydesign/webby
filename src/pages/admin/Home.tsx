import { Container, Heading, Text } from "@chakra-ui/react";
import React from "react";

export const AdminHome: React.FC = () => {
  return (
    <Container textAlign="center">
      <Heading as="h1" marginBottom={8}>
        Welcome!
      </Heading>

      <Text fontSize="lg">This is the admin configuration and settings area for Webby.</Text>
      <Text fontSize="lg">All pages and functions are hidden until you have logged in.</Text>
    </Container>
  );
};
