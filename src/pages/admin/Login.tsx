import React from "react";
import { Redirect, withRouter } from "react-router";
import { alertService } from "../../services/alert.service";
import { useAuth } from "../../services/auth.service";

interface LoginElements extends HTMLFormControlsCollection {
  usernameInput: HTMLInputElement;
  passwordInput: HTMLInputElement;
  rememberToggle: HTMLInputElement;
  submitButton: HTMLInputElement;
}

interface LoginFormElement extends HTMLFormElement {
  readonly elements: LoginElements;
}

const AdminLogin = (): JSX.Element => {
  const { login } = useAuth();
  const [redirectToReferrer, setRedirectToReferrer] = React.useState(false);

  const onSubmit = (event: React.FormEvent<LoginFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const { usernameInput, passwordInput, rememberToggle, submitButton } =
      form.elements;

    submitButton.disabled = true;

    login(usernameInput.value, passwordInput.value, rememberToggle.checked)
      .then(() => {
        setRedirectToReferrer(true);
      })
      .catch((error) => {
        console.error(`error sending login request: ${error}`);
        alertService.error(`Error trying to log in: ${error}`, false);
      })
      .finally(() => {
        submitButton.disabled = false;
        form.reset();
      });
  };

  if (redirectToReferrer) {
    return <Redirect to="/admin" />;
  }

  return (
    <div className="container border border-solid border-white rounded-lg text-center mx-auto px-8 py-6 max-w-sm">
      <div className="mb-5">
        <h1 className="font-bold text-lg">Log In</h1>
      </div>
      <form id="login" onSubmit={onSubmit}>
        <input
          id="usernameInput"
          type="text"
          name="username"
          placeholder="Username"
          pattern="^(\w+)$"
          required
          className="rounded text-black text-center mb-3 w-full"
        />
        <input
          id="passwordInput"
          type="password"
          name="password"
          placeholder="Password"
          required
          className="rounded text-black text-center mb-3 w-full"
        />
        <div className="mb-3">
          <div>
            <label htmlFor="rememberToggle" className="checkbox text-left">
              <input
                id="rememberToggle"
                type="checkbox"
                name="remember"
                className="cursor-pointer rounded"
              />
              Remember me
            </label>
          </div>
        </div>
        <input
          id="submitButton"
          type="submit"
          value="Log In"
          className="btn rounded text-black text-center m-0 w-full"
        />
      </form>
    </div>
  );
};

export default withRouter(AdminLogin);
