import { AxiosError } from "axios";
import React from "react";
import { Redirect, withRouter } from "react-router";
import { useMutation } from "react-query";

import { alertService } from "@Services/alert.service";
import { useAuth } from "@Services/auth.service";
import { APIError, Login } from "../../declarations";

interface LoginElements extends HTMLFormControlsCollection {
  username: HTMLInputElement;
  password: HTMLInputElement;
  remember: HTMLInputElement;
}

interface LoginFormElement extends HTMLFormElement {
  readonly elements: LoginElements;
}

export const AdminLogin: React.FC = () => {
  const { login } = useAuth();
  const [redirectToReferrer, setRedirectToReferrer] = React.useState(false);

  const mutation = useMutation(
    (data: Login) => {
      return login(data);
    },
    {
      onSuccess: () => {
        alertService.success("Logged in successfully", true);
        setRedirectToReferrer(true);
      },
      onError: (error: AxiosError) => {
        const err: APIError = error.response?.data;

        if (err.code === 401) {
          alertService.warn("Invalid login credentials", false);
        } else {
          console.error("error sending login request", { err });
          alertService.error(`Error trying to log in: ${err.message}`, false);
        }
      },
    }
  );

  const onSubmit = (event: React.FormEvent<LoginFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const { username, password, remember } = form.elements;

    mutation.mutate({ username: username.value, password: password.value, remember: remember.checked });
    form.reset();
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
                id="username"
                type="text"
                name="username"
                placeholder="Username"
                pattern="^(\w+)$"
                required
                className="input input-bordered mb-3 w-full"
              />
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Password"
                required
                className="input input-bordered mb-3 w-full"
              />
              <div>
                <label className="cursor-pointer label justify-start">
                  <input id="remember" type="checkbox" name="remember" className="checkbox checkbox-primary" />
                  <span className="label-text ml-4">Remember me</span>
                </label>
              </div>
              <div className="card-actions">
                <button id="submit" type="submit" className="btn btn-outline btn-primary m-0 w-full">
                  Log In
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default withRouter(AdminLogin);
