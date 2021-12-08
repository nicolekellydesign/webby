import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";

interface IPrivateRouteProps extends RouteProps {
  authed: boolean;
}

export const PrivateRoute: React.FC<IPrivateRouteProps> = ({ authed, children, ...rest }) => {
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
};
