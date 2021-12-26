import React from "react";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router";
import { useQuery } from "react-query";

import { Box, Button, Collapse, Container, Flex, Heading, Text, useDisclosure } from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";

import remarkGfm from "remark-gfm";

import { LoadingCard } from "@Components/LoadingCard";
import { SmoothImage } from "@Components/SmoothImage";
import { NotFound } from "@Pages/NotFound";
import { alertService } from "@Services/alert.service";
import { Project } from "../declarations";
import { ProjectQuery } from "../Queries";

interface ParamTypes {
  name: string;
}

export const ProjectView: React.FC = () => {
  const { name } = useParams<ParamTypes>();
  const projectQuery = useQuery(["projects", name], () => ProjectQuery(name));
  const { isOpen, onToggle } = useDisclosure();

  if (typeof name !== "string" || name === "") {
    return <NotFound />;
  }

  if (projectQuery.isLoading) {
    return <LoadingCard />;
  }

  if (projectQuery.isError) {
    console.error("error getting projects", projectQuery.error);
    alertService.error(`Error getting project: ${projectQuery.error}`, false);
  }

  const project = projectQuery.data as Project;

  const markdownTheme = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    p: (props: any) => {
      const { children } = props;
      return (
        <Text fontSize="xl" marginBottom="1.5rem">
          {children}
        </Text>
      );
    },
  };

  return (
    <Container>
      <Box>
        <Button leftIcon={isOpen ? <MinusIcon /> : <AddIcon />} onClick={onToggle} size="lg" variant="ghost">
          Project Information
        </Button>
        <Collapse in={isOpen} animate>
          <Box fontSize="2xl" paddingTop="2rem">
            <Heading as="h1" fontWeight={700}>
              {project.title}
            </Heading>

            <Box paddingTop="1.5rem">
              <ReactMarkdown components={ChakraUIRenderer(markdownTheme)} remarkPlugins={[remarkGfm]}>
                {project.projectInfo}
              </ReactMarkdown>
            </Box>
          </Box>
        </Collapse>
      </Box>

      <Box marginTop="2rem">
        <Flex wrap="wrap">
          {project.embedURL && project.embedURL?.length > 0 && (
            <Box boxSizing="border-box" paddingX="0.5rem" width="full">
              <Box position="relative" padding={0} width="full">
                <iframe
                  src={project.embedURL}
                  title="0"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  style={{
                    position: "absolute",
                    borderStyle: "none",
                    top: 0,
                    left: 0,
                    width: "full",
                    height: "full",
                  }}
                />
              </Box>
            </Box>
          )}
          {project.images?.map((image, idx) => (
            <Box key={idx} marginBottom="1.25rem">
              <SmoothImage alt={image} src={`/images/${image}`} />
            </Box>
          ))}
        </Flex>
      </Box>
    </Container>
  );
};
