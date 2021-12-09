import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";

interface IPrivateRouteProps extends RouteProps {
  authed: boolean;
}

export const PrivateRoute: React.FC<IPrivateRouteProps> = ({ authed, ...rest }) => {
  if (!authed) {
    return (
      <Redirect
        to={{
          pathname: "/admin",
        }}
      />
    );
  }

  return <Route {...rest} />;
};
