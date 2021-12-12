import React from "react";
import { AiOutlineClose } from "react-icons/ai";

import { Login } from "../declarations";

interface LoginElements extends HTMLFormControlsCollection {
  username: HTMLInputElement;
  password: HTMLInputElement;
  remember: HTMLInputElement;
}

interface LoginFormElement extends HTMLFormElement {
  readonly elements: LoginElements;
}

interface ILoginModalProps extends Object {
  login: (login: Login) => void;
}

export const LoginModal: React.FC<ILoginModalProps> = ({ login }) => {
  const onSubmit = (event: React.FormEvent<LoginFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const { username, password, remember } = form.elements;

    login({ username: username.value, password: password.value, remember: remember.checked });
    form.reset();
  };

  return (
    <>
      <a href="/admin#login">Log In</a>
      <div id="login" className="modal">
        <div className="modal-box">
          <div className="absolute right-6 top-6">
            <div data-tip="Close" className="tooltip">
              <a href="/admin#" className="btn btn-ghost btn-sm">
                <AiOutlineClose className="inline-block stroke-current w-6 h-6" />
              </a>
            </div>
          </div>

          <h1 className="font-bold text-xl text-center">Log In</h1>
          <br />

          <form id="login-form" onSubmit={onSubmit} className="p-6">
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

              <div className="modal-action">
                <a href="/admin#" className="w-full">
                  <button id="submit" type="submit" className="btn btn-outline btn-primary m-0 w-full">
                    Log In
                  </button>
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
