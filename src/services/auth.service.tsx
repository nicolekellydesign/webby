import axios, { AxiosError } from "axios";
import React from "react";

import { Login } from "../declarations";

interface AuthProps {
  authed: boolean;
  login(data: Login): Promise<void>;
  logout(): Promise<void>;
}

const authContext = React.createContext({});

export const useAuth = (): AuthProps => {
  const [authed, setAuthed] = React.useState(false);

  axios
    .get("/api/v1/check")
    .then(async (response) => {
      const ret = response.data;

      setAuthed(ret.valid);
    })
    .catch((error: AxiosError) => {
      if (error.response) {
        const err = error.response.data;
        console.error("error checking for valid login session", { err });
      }

      setAuthed(false);
    });

  return {
    authed,

    async login(data: Login) {
      const res = await axios.post("/api/v1/login", data);

      if (res.status === 200) {
        setAuthed(true);
      }

      return res.data;
    },

    async logout() {
      const res = await axios.post("/api/v1/logout");

      if (res.status === 200) {
        setAuthed(false);
      }

      return res.data;
    },
  };
};

export const AuthProvider = ({ children }: any) => {
  const auth = useAuth;

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

export default function AuthConsumer() {
  return React.useContext(authContext);
}
