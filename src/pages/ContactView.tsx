import axios, { AxiosError, AxiosResponse } from "axios";
import React from "react";

import {
  Button,
  ButtonGroup,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Textarea,
  VStack,
} from "@chakra-ui/react";

import { Card, CardBody } from "@Components/Card";
import { alertService } from "@Services/alert.service";

interface FormElements extends HTMLFormControlsCollection {
  firstname: HTMLInputElement;
  lastname: HTMLInputElement;
  email: HTMLInputElement;
  message: HTMLTextAreaElement;
  submit: HTMLInputElement;
}

interface MessageFormElement extends HTMLFormElement {
  // now we can override the elements type to be an HTMLFormControlsCollection
  // of our own design...
  readonly elements: FormElements;
}

export const ContactView: React.FC = () => {
  const onSubmit = (event: React.FormEvent<MessageFormElement>) => {
    event.preventDefault();

    // Make sure we have a token to use
    const token = import.meta.env.VITE_EMAIL_TOKEN;
    if (!token || token === "") {
      alertService.error("No email token set! Please contact a website administrator.", false);
      return;
    }

    const form = event.currentTarget;
    const { firstname, lastname, email, message, submit } = form.elements;

    submit.disabled = true;
    alertService.info("Submitting form information...", true);

    // Build the email parts
    const name = `${firstname.value} ${lastname.value}`;
    const subject = `${name} - Contact Form Submission`;
    const body = `Sender: ${name};\nEmail Address: ${email.value}\n\n${message.value}`;

    // Send to the email sender
    const params = new URLSearchParams();
    params.append("access_token", encodeURIComponent(token));
    params.append("subject", encodeURIComponent(subject));
    params.append("text", encodeURIComponent(body));

    axios
      .post("https://postmail.invotes.com/send", params)
      .then((response: AxiosResponse) => {
        if (response.status === 200) {
          alertService.success("Form submitted! Thank you for your message.", false);
        }
      })
      .catch((error: AxiosError) => {
        console.error("error sending email message", error);
        alertService.error(`Error processing contact form submission: ${error.message}`, false);
      })
      .finally(() => {
        submit.disabled = false;
        form.reset();
      });
  };

  return (
    <Container>
      <Heading as="h1" textAlign="center">
        Contact Form
      </Heading>

      <Card>
        <CardBody>
          <form onSubmit={onSubmit}>
            <VStack spacing="1rem">
              <Stack direction={{ base: "column", lg: "row" }} spacing="1rem" width="full">
                <FormControl isRequired>
                  <FormLabel htmlFor="firstname">First Name</FormLabel>
                  <Input id="firstname" name="firstname" type="text" placeholder="John" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="lastname">Last Name</FormLabel>
                  <Input id="lastname" name="lastname" type="text" placeholder="Doe" />
                </FormControl>
              </Stack>

              <FormControl isRequired>
                <FormLabel htmlFor="email">Email Address</FormLabel>
                <Input id="email" name="email" type="email" placeholder="you@example.com" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel htmlFor="message">Message</FormLabel>
                <Textarea id="message" name="message" resize="none" height="24rem" />
              </FormControl>
            </VStack>

            <ButtonGroup variant="outline" spacing="1rem" marginTop="1rem" width={{ base: "full", lg: "auto" }}>
              <Button type="reset" width={{ base: "full", lg: "auto" }}>
                Reset
              </Button>
              <Button type="submit" colorScheme="blue" width={{ base: "full", lg: "auto" }}>
                Send
              </Button>
            </ButtonGroup>
          </form>
        </CardBody>
      </Card>
    </Container>
  );
};
