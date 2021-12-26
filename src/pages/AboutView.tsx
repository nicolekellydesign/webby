import React from "react";
import { useQuery } from "react-query";

import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

import { Box, Button, Container, Flex, Heading, Image, Stack, Text } from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";

import { LoadingCard } from "@Components/LoadingCard";
import BlankAvatar from "@Icons/blank-avatar.svg";
import { alertService } from "@Services/alert.service";
import { About } from "../declarations";
import { AboutQuery } from "../Queries";

export const AboutView: React.FC = () => {
  const aboutQuery = useQuery("about", AboutQuery);

  if (aboutQuery.isLoading) {
    return <LoadingCard />;
  }

  if (aboutQuery.isError) {
    console.error("error getting about page", aboutQuery.error);
    alertService.error(`Error getting about page: ${aboutQuery.error}`, false);
  }

  const about = aboutQuery.data as About;

  const markdownTheme = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    p: (props: any) => {
      const { children } = props;
      return (
        <Text fontSize="medium" lineHeight="22px" marginBottom="1.5rem">
          {children}
        </Text>
      );
    },
  };

  return (
    <Container>
      <Stack
        direction={{ base: "column", lg: "row" }}
        spacing={{ base: "2rem", lg: "6rem" }}
        marginTop="2rem"
        marginX="auto"
        width="full"
      >
        <Box width="auto" maxWidth="none" height="full">
          <Image
            alt="portrait"
            src={`/images/${about.portrait}`}
            fallback={
              <Image
                alt="portrait"
                src={BlankAvatar}
                backgroundColor="white"
                padding="1rem"
                borderRadius="1rem"
                height={{ lg: "48rem" }}
              />
            }
            borderRadius="1rem"
            width="auto"
            height={{ lg: "48rem" }}
          />
        </Box>

        <Flex flex="1 1 auto" direction="column" maxWidth="56rem">
          <Heading as="h2" size="md">
            Designer Statement
          </Heading>

          {about.statement && (
            <Box marginTop="2rem">
              <ReactMarkdown components={ChakraUIRenderer(markdownTheme)} remarkPlugins={[remarkGfm]} skipHtml>
                {about.statement}
              </ReactMarkdown>
            </Box>
          )}

          {about.resume && (
            <Box paddingTop="1rem">
              <Button
                variant="outline"
                colorScheme="blue"
                leftIcon={<DownloadIcon />}
                onClick={() => {
                  window.open(`/resources/${about.resume}`);
                }}
              >
                Download résumé
              </Button>
            </Box>
          )}
        </Flex>
      </Stack>
    </Container>
  );
};
