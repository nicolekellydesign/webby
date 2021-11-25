import { Redirect, Route, RouteProps } from "react-router-dom";

interface Props extends RouteProps {
  authed: boolean;
}

export function PrivateRoute({ authed, children, ...rest }: Props) {
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
