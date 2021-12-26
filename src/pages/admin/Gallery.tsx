import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";

import {
  Box,
  Button,
  Collapse,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Link,
  List,
  ListItem,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { AddIcon, SettingsIcon } from "@chakra-ui/icons";

import { Card, CardBody } from "@Components/Card";
import { Form } from "@Components/Form";
import { LoadingCard } from "@Components/LoadingCard";
import { MarkdownInput } from "@Components/MarkdownInput";
import { alertService } from "@Services/alert.service";
import { APIError, Project } from "../../declarations";
import { ProjectsQuery } from "../../Queries";

interface AddProjectElements extends HTMLFormControlsCollection {
  name: HTMLInputElement;
  title: HTMLInputElement;
  caption: HTMLInputElement;
  projectInfo: HTMLInputElement;
  embedURL: HTMLInputElement;
  thumbnail: HTMLInputElement;
}

interface AddProjectFormElement extends HTMLFormElement {
  readonly elements: AddProjectElements;
}

export const AdminGalleryView: React.FC = () => {
  const queryClient = useQueryClient();
  const projectsQuery = useQuery("projects", ProjectsQuery);

  const [selectedFile, setSelectedFile] = useState<File>();
  const [isFilePicked, setIsFilePicked] = useState(false);

  const { isOpen, onToggle } = useDisclosure();

  const mutation = useMutation(
    (data: FormData) => {
      return axios.post("/api/v1/admin/gallery", data);
    },
    {
      onSuccess: () => {
        onToggle();
        alertService.success("Project list updated successfully!", true);
      },
      onError: (error: AxiosError) => {
        const err: APIError = error.response?.data;
        console.error("error adding or deleting project", { err });
        alertService.error(`Error updating project list: ${err.message}`, false);
      },
      onSettled: () => {
        queryClient.invalidateQueries("projects");
        window.scrollTo(0, 0);
      },
    }
  );

  if (projectsQuery.isLoading) {
    return <LoadingCard />;
  }

  if (projectsQuery.isError) {
    console.error("error getting projects", projectsQuery.error);
    alertService.error(`Error getting projects: ${projectsQuery.error}`, false);
  }

  const projects = projectsQuery.data as Project[];

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    if (!files) {
      return;
    }

    setSelectedFile(files[0]);
    setIsFilePicked(true);
  };

  const onSubmit = (event: React.FormEvent<AddProjectFormElement>) => {
    event.preventDefault();

    if (!isFilePicked || !selectedFile) {
      return;
    }

    const form = event.currentTarget;
    const data = new FormData(form);
    data.append("thumbnail", selectedFile, selectedFile.name);

    mutation.mutate(data);
    form.reset();
  };

  return (
    <Container>
      <Heading as="h1" fontSize="4xl" fontWeight="bold" textAlign="center">
        Portfolio Gallery Settings
      </Heading>

      <VStack marginY="2rem" spacing="1rem">
        <Card>
          <CardBody>
            <Heading as="h2" size="md" marginBottom={4}>
              Gallery Projects
            </Heading>

            <List
              display="flex"
              borderRadius="1rem"
              maxWidth="72rem"
              maxHeight="20rem"
              gap="1rem"
              padding="1rem"
              className="image-scroller"
            >
              {projects.map((project, idx) => (
                <ListItem
                  key={idx}
                  boxSizing="content-box"
                  display="flex"
                  flex="none"
                  borderRadius="1rem"
                  backgroundImage={`url("/images/${project.thumbnail}")`}
                  backgroundSize="cover"
                  backgroundPosition="center"
                  backgroundRepeat="no-repeat"
                  cursor="pointer"
                  justifyContent="center"
                  width="12rem"
                  height="12rem"
                >
                  <Link
                    as={NavLink}
                    to={`/admin/gallery/${project.name}`}
                    borderRadius="1rem"
                    position="relative"
                    flex="1 1 0%"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    verticalAlign="middle"
                    overflow="hidden"
                    transitionProperty="background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter"
                    transitionTimingFunction="cubic-bezier(0.4, 0, 0.2, 1)"
                    transitionDuration="150ms"
                    opacity={0}
                    _hover={{ backgroundColor: "black", opacity: 0.7 }}
                  >
                    <Box
                      boxSizing="border-box"
                      display="flex"
                      flexDirection="column"
                      fontSize="lg"
                      fontWeight="bold"
                      marginX="auto"
                      width="max-content"
                    >
                      <SettingsIcon width="2rem" height="2rem" marginX="auto" />
                      <Text marginTop="0.5rem">Project Settings</Text>
                    </Box>
                  </Link>
                </ListItem>
              ))}
            </List>
          </CardBody>
        </Card>

        <Button leftIcon={<AddIcon />} onClick={onToggle} variant="outline">
          Add new project
        </Button>
        <Collapse in={isOpen} style={{ width: "full" }} animate>
          <Form disabled={mutation.isLoading} onSubmit={onSubmit} submitText="Add project" className="text-left">
            <FormControl isRequired>
              <FormLabel htmlFor="name">Project name</FormLabel>
              <Input
                id="name"
                name="name"
                type="text"
                pattern="[A-z\d\-_]+"
                placeholder="project-name"
                title="Only use letters, numbers, - and _ characters."
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="title">Project title</FormLabel>
              <Input id="title" name="title" type="text" placeholder="Project Title" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="caption">Caption</FormLabel>
              <Input id="caption" name="caption" type="text" placeholder="Short thumbnail caption" />
            </FormControl>
            <MarkdownInput inputId="projectInfo" inputName="projectInfo" label="Project info" />
            <FormControl>
              <FormLabel htmlFor="videoKey">Embed URL (optional)</FormLabel>
              <InputGroup>
                <InputLeftAddon>https://youtube.com/embed/</InputLeftAddon>
                <Input id="videoKey" name="videoKey" type="text" placeholder="video-key" />
              </InputGroup>
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="thumbnail">Project thumbnail</FormLabel>
              <Input
                id="thumbnail"
                name="thumbnail"
                type="file"
                accept="image/*"
                title="Only images allowed."
                onChange={changeHandler}
                requierd
              />
            </FormControl>
          </Form>
        </Collapse>
      </VStack>
    </Container>
  );
};
