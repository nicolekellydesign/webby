import React from "react";
import { Link, Route, RouteComponentProps, useHistory, withRouter } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios, { AxiosError } from "axios";

import { adminNavbarData } from "@Components/adminNavbarData";
import { LoadingCard } from "@Components/LoadingCard";
import { LoginModal } from "@Components/LoginModal";
import { PrivateRoute } from "@Components/PrivateRoute";

import { alertService } from "@Services/alert.service";

import { AdminAboutView } from "@Pages/admin/About";
import { AdminGalleryView } from "@Pages/admin/Gallery";
import { AdminHome } from "@Pages/admin/Home";
import { AdminPhotos } from "@Pages/admin/Photos";
import { ProjectSettings } from "@Pages/admin/ProjectSettings";
import { AdminUsers } from "@Pages/admin/Users";

import { APIError, Login, Session } from "../../declarations";
import { SessionQuery } from "../../Queries";

interface RouterProps {
  path: string;
}

type RouterDetailProps = RouteComponentProps<RouterProps>;

const Admin: React.FC<RouterDetailProps> = () => {
  const queryClient = useQueryClient();
  const sessionQuery = useQuery("session", SessionQuery, { refetchOnMount: "always" });
  const history = useHistory();

  const loginMutation = useMutation(
    async (login: Login) => {
      await queryClient.cancelQueries("session");
      return axios.post("/api/v1/login", login);
    },
    {
      onSuccess: () => {
        alertService.success("Logged in successfully", true);
      },
      onError: (error: AxiosError) => {
        const err: APIError = error.response?.data;

        if (err.code === 401) {
          alertService.warn("Invalid login credentials", false);
        } else {
          console.error("error sending login request", { err });
          alertService.error(`Error trying to log in: ${err.message}`, false);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries("session");
      },
    }
  );

  const logoutMutation = useMutation(
    async () => {
      await queryClient.cancelQueries("session");
      return axios.post("/api/v1/logout");
    },
    {
      onSuccess: () => {
        alertService.success("Logged out successfully", true);
        history.push("/admin");
      },
      onError: (error: AxiosError) => {
        const err: APIError = error.response?.data;
        console.error("error sending logout request", { err });
        alertService.error(`Error trying to log out: ${err.message}`, false);
      },
      onSettled: () => {
        queryClient.invalidateQueries("session");
      },
    }
  );

  if (sessionQuery.isLoading) {
    return <LoadingCard />;
  }

  const session = sessionQuery.data as Session;

  return (
    <div>
      <section className="absolute pl-4">
        <ul className="menu p-4 shadow-lg bg-base-200 w-40 rounded-box text-base-content">
          <li className="menu-title">
            <span>Admin Pages</span>
          </li>
          {adminNavbarData.map(
            (item) =>
              ((item.privileged && session.valid) || !item.privileged) && (
                <li>
                  <Link to={item.path}>{item.title}</Link>
                </li>
              )
          )}
          <li>
            {session.valid ? (
              <Link to="/admin" onClick={() => logoutMutation.mutate()}>
                Logout
              </Link>
            ) : (
              <LoginModal login={loginMutation.mutate} />
            )}
          </li>
        </ul>
      </section>

      <div className="mt-8 px-48">
        {logoutMutation.isLoading ? (
          <LoadingCard />
        ) : (
          <>
            <PrivateRoute path="/admin/gallery/:name" authed={session.valid} component={ProjectSettings} />
            <PrivateRoute exact path="/admin/gallery" authed={session.valid} component={AdminGalleryView} />
            <PrivateRoute exact path="/admin/photos" authed={session.valid} component={AdminPhotos} />
            <PrivateRoute exact path="/admin/about" authed={session.valid} component={AdminAboutView} />
            <PrivateRoute exact path="/admin/users" authed={session.valid} component={AdminUsers} />
            <Route exact path="/admin" component={AdminHome} />
          </>
        )}
      </div>
    </div>
  );
};

export default withRouter(Admin);
