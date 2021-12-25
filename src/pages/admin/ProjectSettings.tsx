import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import { Redirect, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "react-query";

import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

import { Card, CardBody } from "@Components/Card";
import { Dropzone } from "@Components/Dropzone";
import { Form } from "@Components/Form";
import { ImageManager } from "@Components/ImageManager";
import { LoadingCard } from "@Components/LoadingCard";
import { MarkdownInput } from "@Components/MarkdownInput";
import { NotFound } from "@Pages/NotFound";
import { alertService } from "@Services/alert.service";
import { APIError, Project } from "../../declarations";
import { ProjectQuery } from "../../Queries";

interface ParamTypes {
  name: string;
}

interface UpdateProjectElements extends HTMLFormControlsCollection {
  title: HTMLInputElement;
  caption: HTMLInputElement;
  projectInfo: HTMLInputElement;
  embedURL: HTMLInputElement;
}

interface UpdateProjectFormElement extends HTMLFormElement {
  readonly elements: UpdateProjectElements;
}

export const ProjectSettings: React.FC = () => {
  const { name } = useParams<ParamTypes>();
  const queryClient = useQueryClient();
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const projectQuery = useQuery(["projects", name], () => ProjectQuery(name));

  const thumbMutation = useMutation(
    async (data: string) => {
      await queryClient.cancelQueries(["projects", name]);
      return axios.patch(`/api/v1/admin/gallery/${name}/thumbnail`, { thumbnail: data });
    },
    {
      onSuccess: () => {
        alertService.success("Thumbnail uploaded successfully!", true);
      },
      onError: (error: AxiosError) => {
        const err: APIError = error.response?.data;
        console.error("error updating project thumbnail", { err });
        alertService.error(`Error updating thumbnail: ${err.message}`, false);
      },
      onSettled: () => {
        queryClient.invalidateQueries(["projects", name]);
        window.scrollTo(0, 0);
      },
    }
  );

  const detailsMutation = useMutation(
    async (data: Project) => {
      await queryClient.cancelQueries(["projects", name]);
      return axios.put(`/api/v1/admin/gallery/${name}`, data);
    },
    {
      onSuccess: () => {
        alertService.success("Project settings updated successfully!", true);
      },
      onError: (error: AxiosError) => {
        const err: APIError = error.response?.data;
        console.error(`error updating project settings for '${name}'`, { err });
        alertService.error(`Error updating project settings: ${err.message}`, false);
      },
      onSettled: () => {
        queryClient.invalidateQueries(["projects", name]);
        window.scrollTo(0, 0);
      },
    }
  );

  const addImagesMutation = useMutation(
    async (images: string[]) => {
      await queryClient.cancelQueries(["projects", name]);
      return axios.post(`/api/v1/admin/gallery/${name}/images`, images);
    },
    {
      onSuccess: () => {
        alertService.success("Images uploaded successfully!", true);
      },
      onError: (error: AxiosError) => {
        const err: APIError = error.response?.data;
        console.error("error uploading project images", { err });
        alertService.error(`Error uploading images: ${err.message}`, false);
      },
      onSettled: () => {
        queryClient.invalidateQueries(["projects", name]);
        window.scrollTo(0, 0);
      },
    }
  );

  const deleteImagesMutation = useMutation(
    async (images: string[]) => {
      await queryClient.cancelQueries(["projects", name]);
      return axios({
        url: `/api/v1/admin/gallery/${name}/images`,
        method: "DELETE",
        data: images,
      });
    },
    {
      onSuccess: () => {
        alertService.success("Image(s) deleted successfully!", true);
      },
      onError: (error: AxiosError) => {
        const err: APIError = error.response?.data;
        console.error(`error removing images from project '${name}'`, { err });
        alertService.error(`Error removing images: ${err.message}`, false);
      },
      onSettled: () => {
        queryClient.invalidateQueries(["projects", name]);
        window.scrollTo(0, 0);
      },
    }
  );

  const deleteProjectMutation = useMutation(
    async () => {
      await queryClient.cancelQueries("projects");
      return axios.delete(`/api/v1/admin/gallery/${name}`);
    },
    {
      onSuccess: () => {
        setRedirectToReferrer(true);
        alertService.success("Project deleted successfully!", true);
      },
      onError: (error: AxiosError) => {
        const err: APIError = error.response?.data;
        console.error(`error deleting project '${name}'`, { err });
        alertService.error(`Error deleting project: ${err.message}`, false);
      },
      onSettled: () => {
        queryClient.invalidateQueries("projects");
        window.scrollTo(0, 0);
      },
    }
  );

  const onSubmit = (event: React.FormEvent<UpdateProjectFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const { title, caption, projectInfo, embedURL } = form.elements;

    const updatedProject: Project = {
      name: name,
      title: title.value,
      caption: caption.value,
      projectInfo: projectInfo.value,
      embedURL: embedURL.value,
    };

    detailsMutation.mutate(updatedProject);
  };

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

  if (redirectToReferrer) {
    return <Redirect to="/admin/gallery" />;
  }

  return (
    <Container maxWidth="72rem">
      <Heading as="h1" textAlign="center">
        About Page Settings
      </Heading>

      <VStack marginTop="2rem" spacing="1rem">
        <Card>
          <Flex>
            {thumbMutation.isLoading ? (
              <LoadingCard />
            ) : (
              <Image alt={project.title} src={`/images/${project.thumbnail}`} borderLeftRadius={12} boxSize={256} />
            )}
          </Flex>

          <CardBody>
            <Heading as="h2" size="md" marginBottom="1rem">
              Update Thumbnail
            </Heading>

            <Flex wrap="wrap" align="start" marginTop="2rem">
              <Dropzone
                onSubmit={(files) => {
                  thumbMutation.mutate(files[0].name);
                }}
                accept="image/*"
                maxSize={8 * 1024 * 1024}
                multiple={false}
                disabled={thumbMutation.isLoading}
              />
            </Flex>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Form
              disabled={detailsMutation.isLoading}
              header="Project Details"
              onSubmit={onSubmit}
              submitText="Update project"
            >
              <FormControl isRequired>
                <FormLabel htmlFor="title">Title</FormLabel>
                <Input id="title" name="title" type="text" placeholder="Project Title" defaultValue={project.title} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel htmlFor="caption">Caption</FormLabel>
                <Input
                  id="caption"
                  name="caption"
                  type="text"
                  placeholder="Short thumbnail caption"
                  defaultValue={project.caption}
                />
              </FormControl>
              <MarkdownInput
                inputId="projectInfo"
                inputName="projectInfo"
                label="Project info"
                startingText={project.projectInfo}
              />
              <FormControl>
                <FormLabel htmlFor="videoKey">Embed URL (optional)</FormLabel>
                <InputGroup>
                  <InputLeftAddon>https://youtube.com/embed/</InputLeftAddon>
                  <Input id="videoKey" name="videoKey" type="text" placeholder="video-key" />
                </InputGroup>
              </FormControl>
            </Form>
          </CardBody>
        </Card>

        {addImagesMutation.isLoading || deleteImagesMutation.isLoading ? (
          <LoadingCard />
        ) : (
          <ImageManager
            images={project.images}
            title="Project Images"
            deleteImages={(images) => deleteImagesMutation.mutate(images)}
            uploadFunc={(images) => addImagesMutation.mutate(images)}
          />
        )}

        <Box marginTop="2rem">
          <Button onClick={onOpen} leftIcon={<DeleteIcon />} variant="outline" colorScheme="red">
            Delete project
          </Button>
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Delete Project</ModalHeader>

              <ModalBody>
                <Text>Are you sure you want to delete this project?</Text>
                <Text>This action cannot be reversed.</Text>
              </ModalBody>

              <ModalFooter>
                <Button variant="outline" marginRight="1rem" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  colorScheme="red"
                  onClick={() => {
                    deleteProjectMutation.mutate();
                    onClose();
                  }}
                >
                  Delete
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      </VStack>
    </Container>
  );
};
