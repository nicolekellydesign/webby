import React from "react";
import { NavLink } from "react-router-dom";
import { useQuery } from "react-query";

import { Box, Container, Flex, Heading, Link, Text } from "@chakra-ui/react";

import { LoadingCard } from "@Components/LoadingCard";
import { SmoothImage } from "@Components/SmoothImage";
import { alertService } from "@Services/alert.service";
import { Project } from "../declarations";
import { ProjectsQuery } from "../Queries";

export const Home: React.FC = () => {
  const projectsQuery = useQuery("projects", ProjectsQuery);

  if (projectsQuery.isLoading) {
    return <LoadingCard />;
  }

  if (projectsQuery.isError) {
    console.error("error getting projects", projectsQuery.error);
    alertService.error(`Error getting projects: ${projectsQuery.error}`, false);
  }

  const projects = projectsQuery.data as Project[];

  return (
    <Container>
      <Box minHeight="60px" textAlign="center">
        <Text textStyle="bold" fontSize="xl" paddingY={8}>
          “If you can design one thing, you can design everything.” &mdash; Massimo Vignelli
        </Text>
      </Box>

      <Flex wrap="wrap">
        {projects.map((project, idx) => (
          <Box key={idx} padding={4} width={{ base: "full", xl: "50%" }}>
            <SmoothImage alt={project.title} src={`/images/${project.thumbnail}`}>
              <Link
                as={NavLink}
                to={`/project/${project.name}`}
                opacity={0}
                position="absolute"
                overflow="hidden"
                transitionProperty="background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter"
                transitionTimingFunction="cubic-bezier(0.4, 0, 0.2, 1)"
                transitionDuration="150ms"
                transform="auto"
                translateY="-100%"
                width="full"
                height="full"
                _hover={{ backgroundColor: "black", opacity: 0.7 }}
              >
                <Box textColor="white" boxSizing="border-box" padding={5} maxWidth={80} height="full">
                  <Heading as="h2" marginBottom={0} fontStyle="bold" fontSize="2xl">
                    {project.title}
                  </Heading>
                  <Text fontSize="xl" marginTop={4}>
                    {project.caption}
                  </Text>
                </Box>
              </Link>
            </SmoothImage>
          </Box>
        ))}
      </Flex>
    </Container>
  );
};
