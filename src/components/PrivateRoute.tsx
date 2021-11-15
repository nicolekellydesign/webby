import { Redirect, Route } from "react-router-dom";

export function PrivateRoute({ authed, children, ...rest }: any) {
  return (
    <Route
      {...rest}
      render={() =>
        authed ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/admin",
            }}
          />
        )
      }
    />
  );
}
