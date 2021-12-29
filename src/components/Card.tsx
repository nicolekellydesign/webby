import React from "react";

import { Flex } from "@chakra-ui/react";

interface ICardProps extends Object {
  marginTop?: number | string;
}

export const CardBody: React.FC = ({ children }) => {
  return (
    <Flex flex="1 1 auto" flexDirection="column" padding={8}>
      {children}
    </Flex>
  );
};

export const Card: React.FC<ICardProps> = ({ children, marginTop = 8 }) => {
  return (
    <Flex
      borderWidth={1}
      borderColor="white.700"
      direction={{ base: "column", lg: "row" }}
      rounded="lg"
      spacing={4}
      marginTop={marginTop}
      marginX="auto"
      width={{ base: "full", lg: "3xl" }}
    >
      {children}
    </Flex>
  );
};
