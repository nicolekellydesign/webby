import { Redirect, Route } from "react-router-dom";
import { useAuth } from "../services/auth.service";

const PrivateRoute = ({ children, ...rest }: any) => {
  const { authed } = useAuth();

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
