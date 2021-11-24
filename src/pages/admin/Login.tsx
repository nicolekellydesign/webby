import React from "react";
import { Redirect, withRouter } from "react-router";
import { alertService } from "@Services/alert.service";
import { useAuth } from "@Services/auth.service";

interface LoginElements extends HTMLFormControlsCollection {
  usernameInput: HTMLInputElement;
  passwordInput: HTMLInputElement;
  rememberToggle: HTMLInputElement;
  submitButton: HTMLInputElement;
}

interface LoginFormElement extends HTMLFormElement {
  readonly elements: LoginElements;
}

export function AdminLogin() {
  const { login } = useAuth();
  const [redirectToReferrer, setRedirectToReferrer] = React.useState(false);

  const onSubmit = (event: React.FormEvent<LoginFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const { usernameInput, passwordInput, rememberToggle, submitButton } = form.elements;

    submitButton.disabled = true;

    login(usernameInput.value, passwordInput.value, rememberToggle.checked)
      .then(() => {
        setRedirectToReferrer(true);
      })
      .catch((error) => {
        console.error("error sending login request", error);
        alertService.error(`Error trying to log in: ${error.message}`, false);
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
    <div className="container mx-auto">
      <div className="card lg:card-side bordered mx-auto max-w-sm">
        <div className="card-body">
          <h1 className="card-title text-center">Log In</h1>
          <form id="login" onSubmit={onSubmit}>
            <div className="form-control">
              <input
                id="usernameInput"
                type="text"
                name="username"
                placeholder="Username"
                pattern="^(\w+)$"
                required
                className="input input-bordered mb-3 w-full"
              />
              <input
                id="passwordInput"
                type="password"
                name="password"
                placeholder="Password"
                required
                className="input input-bordered mb-3 w-full"
              />
              <div>
                <label className="cursor-pointer label justify-start">
                  <input id="rememberToggle" type="checkbox" name="remember" className="checkbox checkbox-primary" />
                  <span className="label-text ml-4">Remember me</span>
                </label>
              </div>
              <div className="card-actions">
                <button id="submitButton" type="submit" className="btn btn-primary m-0 w-full">
                  Log In
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default withRouter(AdminLogin);
