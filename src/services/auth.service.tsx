import React from "react";

interface AuthProps {
  authed: boolean;
  login(username: string, password: string, extended: boolean): Promise<void>;
  logout(): Promise<void>;
}

const authContext = React.createContext({});

export function useAuth(): AuthProps {
  const [authed, setAuthed] = React.useState(false);

  fetch("/api/v1/check", {
    headers: { Method: "GET" },
  })
    .then(async (response) => {
      const body = await response.json();

      if (!response.ok) {
        return Promise.reject(body);
      }

      setAuthed(body.valid);
    })
    .catch((error) => {
      console.error("error checking for valid login session", error);
      setAuthed(false);
    });

  return {
    authed,

    async login(username: string, password: string, extended: boolean) {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, extended }),
      };

      return await fetch("/api/v1/login", options).then(async (response) => {
        if (!response.ok) {
          return Promise.reject(await response.json());
        }

        setAuthed(true);
      });
    },

    async logout() {
      return await fetch("/api/v1/logout", {
        method: "POST",
      }).then(async (response) => {
        if (!response.ok) {
          return Promise.reject(await response.json());
        }

        setAuthed(false);
      });
    },
  };
}

export function AuthProvider({ children }: any) {
  const auth = useAuth;

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export default function AuthConsumer() {
  return React.useContext(authContext);
}
