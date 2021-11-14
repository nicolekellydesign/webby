import { Redirect, Route } from "react-router-dom";

const PrivateRoute = ({ authed, children, ...rest }: any) => {
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

export default PrivateRoute;
