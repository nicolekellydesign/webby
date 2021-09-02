import { alertService } from '../services/alert.service'

interface FormElements extends HTMLFormControlsCollection {
  firstNameInput: HTMLInputElement,
  lastNameInput: HTMLInputElement,
  emailInput: HTMLInputElement,
  messageInput: HTMLTextAreaElement,
  submitButton: HTMLInputElement,
}

interface MessageFormElement extends HTMLFormElement {
  // now we can override the elements type to be an HTMLFormControlsCollection
  // of our own design...
  readonly elements: FormElements
}

const Contact = (): JSX.Element => {
  const onSubmit = (event: React.FormEvent<MessageFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const elements = form.elements ;

    elements.submitButton.disabled = true;
    alertService.info("Submitting form information...");

    // TODO: Email stuffs
    window.setTimeout(() => {
      elements.submitButton.disabled = false;
      form.reset();
    }, 5000);
  }

  return (
    <>
      <div className="container mx-auto">
        <h1 className="text-lg text-center">Use this form to contact me</h1>
        <div className="container mx-auto pt-4">
          <form id="form" onSubmit={onSubmit}>
            <div className="md:flex md:justify-center p-2">
              <div className="p-2">
                <label htmlFor="firstname">First Name</label><br />
                <input id="firstNameInput" type="text" name="firstname" placeholder="John" required className="w-full text-black" />
              </div>

              <div className="p-2">
                <label htmlFor="lastname">Last Name</label><br />
                <input id="lastNameInput" type="text" name="lastname" placeholder="Doe" required className="w-full text-black" />
              </div>
            </div>
            <div className="md:flex md:justify-center p-2">
              <div className="p-2">
                <label htmlFor="email">Email Address</label><br />
                <input id="emailInput" type="email" name="email" placeholder="you@example.com" required className="w-full md:w-email text-black" />
              </div>
            </div>
            <div className="md:flex md:justify-center p-2">
              <div className="p-2">
                <label htmlFor="message">Message</label><br />
                <textarea
                  id="messageInput"
                  name="message" 
                  placeholder="Write your message for me here" 
                  required 
                  className="w-full md:min-w-textLarge min-h-textLarge text-black" />
              </div>
            </div>
            <div className="md:flex md:justify-center p-2">
              <div className="p-2">
                <input type="reset" className="btn w-full text-black" />
              </div>
              <div className="p-2">
                <input id="submitButton" type="submit" value="Submit" className="btn w-full text-black" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Contact;
