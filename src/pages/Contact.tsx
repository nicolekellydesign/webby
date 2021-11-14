import { alertService } from "../services/alert.service";

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
        submit.disabled = false;
        form.reset();
      });
  };

  return (
    <div className="container mx-auto">
      <div className="max-w-max mx-auto my-8">
        <div className="card lg:card-side bordered">
          <form id="form" onSubmit={onSubmit} className="card-body">
            <h2 className="card-title">Contact Form</h2>

            <div className="form-control lg:flex-row">
              <div className="form-control">
                <label htmlFor="firstname" className="label">
                  <span className="label-text">First Name</span>
                </label>
                <input
                  id="firstname"
                  type="text"
                  name="firstname"
                  placeholder="John"
                  required
                  className="input input-bordered"
                />
              </div>
              <div className="form-control">
                <label htmlFor="lastname" className="label">
                  <span className="label-text">Last Name</span>
                </label>
                <input
                  id="lastname"
                  type="text"
                  name="lastname"
                  placeholder="Doe"
                  required
                  className="input input-bordered"
                />
              </div>
            </div>

            <div className="form-control">
              <label htmlFor="email" className="label">
                <span className="label-text">Email Address</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                className="input input-bordered"
              />
            </div>

            <div className="form-control">
              <label htmlFor="message" className="label">
                <span className="label-text">Message</span>
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Write your message for me here"
                required
                className="textarea textarea-bordered h-64"
              />
            </div>

            <div className="card-actions">
              <div className="input-group">
                <button type="reset" className="btn btn-outline">
                  Clear form
                </button>
                <button
                  id="submit"
                  type="submit"
                  className="btn btn-outline btn-primary"
                >
                  Send message
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
