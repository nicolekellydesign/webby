import axios, { AxiosError, AxiosResponse } from "axios";
import React from "react";

import { Form } from "@Components/Form";
import { TextArea } from "@Components/TextArea";
import { TextInput } from "@Components/TextInput";
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
    <div className="container mx-auto">
      <div className="max-w-max mx-auto my-8">
        <div className="card lg:card-side bordered">
          <Form
            id="form"
            header="Contact Form"
            onSubmit={onSubmit}
            hasReset
            resetText="Clear form"
            submitText="Send message"
            className="card-body"
          >
            <div className="form-control lg:flex-row">
              <TextInput id="firstname" name="firstname" label="First Name" placeholder="John" required />
              <TextInput id="lastname" name="lastname" label="Last Name" placeholder="Doe" required />
            </div>

            <TextInput id="email" name="email" label="Email Address" placeholder="you@example.com" required />
            <TextArea
              id="message"
              name="message"
              label="Message"
              placeholder="Write your message for me here"
              required
            />
          </Form>
        </div>
      </div>
    </div>
  );
};