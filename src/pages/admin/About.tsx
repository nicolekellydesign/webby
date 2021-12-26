import axios, { AxiosError } from "axios";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { Container, Flex, Image, VStack } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/layout";

import { Card, CardBody } from "@Components/Card";
import { Dropzone } from "@Components/Dropzone";
import { Form } from "@Components/Form";
import { LoadingCard } from "@Components/LoadingCard";
import { MarkdownInput } from "@Components/MarkdownInput";
import BlankAvatar from "@Icons/blank-avatar.svg";
import { alertService } from "@Services/alert.service";
import { About, APIError } from "../../declarations";
import { AboutQuery } from "../../Queries";

interface StatementElements extends HTMLFormControlsCollection {
  statement: HTMLInputElement;
  submit: HTMLInputElement;
}

interface StatementFormElement extends HTMLFormElement {
  readonly elements: StatementElements;
}

export const AdminAboutView: React.FC = () => {
  const queryClient = useQueryClient();
  const aboutQuery = useQuery("about", AboutQuery);

  const mutation = useMutation(
    (update) => {
      return axios.patch("/api/v1/admin/about", update);
    },
    {
      onMutate: async (newAbout: About) => {
        await queryClient.cancelQueries("about");

        const previousAbout = queryClient.getQueryData("about");

        queryClient.setQueryData("about", newAbout);

        return { previousAbout, newAbout };
      },
      onSuccess: () => {
        alertService.success("About info updated successfully!", true);
      },
      onError: (error: AxiosError, _, context) => {
        const err: APIError = error.response?.data;
        queryClient.setQueryData("about", context?.previousAbout);

        console.error("error updating about info", { err });
        alertService.error(`Error updating About page: ${err.message}`, false);
      },
      onSettled: () => {
        queryClient.invalidateQueries("about");
        window.scrollTo(0, 0);
      },
    }
  );

  if (aboutQuery.isLoading) {
    return <LoadingCard />;
  }

  if (aboutQuery.isError) {
    console.error("error getting about info", aboutQuery.error);
    alertService.error(`Error getting about info: ${aboutQuery.error}`, false);
  }

  const about = aboutQuery.data as About;

  const updatePortrait = (portrait: string) => {
    mutation.mutate({ portrait: portrait });
  };

  const updateStatement = (event: React.FormEvent<StatementFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const { statement } = form.elements;

    mutation.mutate({ statement: statement.value });
  };

  const updateResume = (resume: string) => {
    mutation.mutate({ resume: resume });
  };

  return (
    <Container>
      <Heading as="h1" textAlign="center">
        About Page Settings
      </Heading>

      <VStack marginTop={8} spacing={4}>
        <Card>
          <Flex>
            {about.portrait && (
              <Image
                alt="portrait"
                src={`/images/${about.portrait}`}
                fallbackSrc={BlankAvatar}
                borderLeftRadius={12}
                boxSize={256}
              />
            )}
          </Flex>

          <CardBody>
            <Heading as="h2" size="md" marginBottom={4}>
              Update Portrait
            </Heading>

            <Flex wrap="wrap" align="start" marginTop={6}>
              <Dropzone
                onSubmit={(files) => {
                  updatePortrait(files[0].name);
                }}
                accept="image/*"
                maxSize={8 * 1024 * 1024}
                multiple={false}
                disabled={mutation.isLoading}
              />
            </Flex>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Heading as="h2" size="md" marginBottom={4}>
              Designer Statement
            </Heading>

            <Form disabled={mutation.isLoading} onSubmit={updateStatement} submitText="Update statement">
              <MarkdownInput inputId="statement" inputName="statement" startingText={about.statement} />
            </Form>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Heading as="h2" size="md" marginBottom={4}>
              Update Résumé
            </Heading>

            <Flex wrap="wrap" align="start" marginTop={6}>
              <Dropzone
                onSubmit={(files) => {
                  updateResume(files[0].name);
                }}
                accept="application/pdf"
                multiple={false}
                maxSize={8 * 1024 * 1024}
                disabled={mutation.isLoading}
              />
            </Flex>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};
