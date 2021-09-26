import { alertService } from "../services/alert.service";

interface FormElements extends HTMLFormControlsCollection {
  firstNameInput: HTMLInputElement;
  lastNameInput: HTMLInputElement;
  emailInput: HTMLInputElement;
  messageInput: HTMLTextAreaElement;
  submitButton: HTMLInputElement;
}

interface MessageFormElement extends HTMLFormElement {
  // now we can override the elements type to be an HTMLFormControlsCollection
  // of our own design...
  readonly elements: FormElements;
}

const Contact = (): JSX.Element => {
  const onSubmit = (event: React.FormEvent<MessageFormElement>) => {
    event.preventDefault();

    // Make sure we have a token to use
    const token = process.env.REACT_APP_EMAIL_TOKEN;
    if (!token || token === "") {
      alertService.error(
        "No email token set! Please contact a website administrator.",
        false
      );
      return;
    }

    const form = event.currentTarget;
    const {
      firstNameInput,
      lastNameInput,
      emailInput,
      messageInput,
      submitButton,
    } = form.elements;

    submitButton.disabled = true;
    alertService.info("Submitting form information...", true);

    // Build the email parts
    const name = `${firstNameInput.value} ${lastNameInput.value}`;
    const subject = `${name} - Contact Form Submission`;
    const body = `Sender: ${name};\nEmail Address: ${emailInput.value}\n\n${messageInput.value}`;

    // Send to the email sender
    const params = new URLSearchParams();
    params.append("access_token", encodeURIComponent(token));
    params.append("subject", encodeURIComponent(subject));
    params.append("text", encodeURIComponent(body));

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    };

    fetch("https://postmail.invotes.com/send", options)
      .then(async (response: Response) => {
        const isJson = response.headers
          .get("content-type")
          ?.includes("application/json");
        const data = isJson && (await response.json());

        if (!response.ok) {
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }

        alertService.success(
          "Form submitted! Thank you for your message.",
          false
        );
      })
      .catch((error) => {
        console.error(`error sending email message: ${error}`);
        alertService.error(
          `Error processing contact form submission: ${error}`,
          false
        );
      })
      .finally(() => {
        submitButton.disabled = false;
        form.reset();
      });
  };

  return (
    <>
      <div className="container mx-auto">
        <h1 className="text-lg text-center">Use this form to contact me</h1>
        <div className="container mx-auto pt-4">
          <form id="form" onSubmit={onSubmit}>
            <div className="md:flex md:justify-center p-2">
              <div className="p-2">
                <label htmlFor="firstname">First Name</label>
                <br />
                <input
                  id="firstNameInput"
                  type="text"
                  name="firstname"
                  placeholder="John"
                  required
                  className="w-full text-black"
                />
              </div>

              <div className="p-2">
                <label htmlFor="lastname">Last Name</label>
                <br />
                <input
                  id="lastNameInput"
                  type="text"
                  name="lastname"
                  placeholder="Doe"
                  required
                  className="w-full text-black"
                />
              </div>
            </div>
            <div className="md:flex md:justify-center p-2">
              <div className="p-2">
                <label htmlFor="email">Email Address</label>
                <br />
                <input
                  id="emailInput"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  className="w-full md:w-email text-black"
                />
              </div>
            </div>
            <div className="md:flex md:justify-center p-2">
              <div className="p-2">
                <label htmlFor="message">Message</label>
                <br />
                <textarea
                  id="messageInput"
                  name="message"
                  placeholder="Write your message for me here"
                  required
                  className="w-full md:min-w-textLarge min-h-textLarge text-black"
                />
              </div>
            </div>
            <div className="md:flex md:justify-center p-2">
              <div className="p-2">
                <input type="reset" className="btn w-full text-black" />
              </div>
              <div className="p-2">
                <input
                  id="submitButton"
                  type="submit"
                  value="Submit"
                  className="btn w-full text-black"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Contact;
