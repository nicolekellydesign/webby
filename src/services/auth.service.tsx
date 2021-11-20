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
      const isJson = response.headers.get("Content-Type")?.includes("application/json");
      const body = isJson && (await response.json());

      if (!response.ok) {
        const error = (body && body.message) || response.status;
        return Promise.reject(error);
      }

      setAuthed(body.valid);
    })
    .catch((error) => {
      console.error(`error checking for valid login session: ${error}`);
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
        const isJson = response.headers.get("Content-Type")?.includes("application/json");
        const body = isJson && (await response.json());

        if (!response.ok) {
          const error = (body && body.message) || response.status;
          return Promise.reject(error);
        }

        setAuthed(true);
      });
    },

    async logout() {
      return await fetch("/api/v1/logout", {
        method: "POST",
      }).then(async (response) => {
        const isJson = response.headers.get("content-type")?.includes("application/json");
        const data = isJson && (await response.json());

        if (!response.ok) {
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
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
