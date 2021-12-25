import React from "react";
import { Route, RouteComponentProps, withRouter } from "react-router-dom";
import { useQuery } from "react-query";

import { Box } from "@chakra-ui/react";

import { LoadingCard } from "@Components/LoadingCard";
import { PrivateRoute } from "@Components/PrivateRoute";

import { AdminAboutView } from "@Pages/admin/About";
import { AdminGalleryView } from "@Pages/admin/Gallery";
import { AdminHome } from "@Pages/admin/Home";
import { AdminPhotos } from "@Pages/admin/Photos";
import { ProjectSettings } from "@Pages/admin/ProjectSettings";
import { AdminUsers } from "@Pages/admin/Users";

import { Session } from "../../declarations";
import { SessionQuery } from "../../Queries";

interface RouterProps {
  path: string;
}

type RouterDetailProps = RouteComponentProps<RouterProps>;

const Admin: React.FC<RouterDetailProps> = () => {
  const sessionQuery = useQuery("session", SessionQuery, { refetchOnMount: "always" });

  if (sessionQuery.isLoading) {
    return <LoadingCard />;
  }

  const session = sessionQuery.data as Session;

  return (
    <Box paddingTop="2rem">
      <PrivateRoute path="/admin/gallery/:name" authed={session.valid} component={ProjectSettings} />
      <PrivateRoute exact path="/admin/gallery" authed={session.valid} component={AdminGalleryView} />
      <PrivateRoute exact path="/admin/photos" authed={session.valid} component={AdminPhotos} />
      <PrivateRoute exact path="/admin/about" authed={session.valid} component={AdminAboutView} />
      <PrivateRoute exact path="/admin/users" authed={session.valid} component={AdminUsers} />
      <Route exact path="/admin" component={AdminHome} />
    </Box>
  );
};

export default withRouter(Admin);
