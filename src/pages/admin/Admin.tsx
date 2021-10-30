import { Route, RouteComponentProps, withRouter } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import PrivateRoute from "../../components/PrivateRoute";
import AdminGallery from "./Gallery";
import AdminHome from "./Home";
import AdminLogin from "./Login";
import AdminPhotos from "./Photos";
import ProjectSettings from "./ProjectSettings";
import AdminUsers from "./Users";

interface RouterProps {
  path: string;
}

interface RouterDetailProps extends RouteComponentProps<RouterProps> {}

const Admin: React.FC<RouterDetailProps> = (): JSX.Element => {
  return (
    <>
      <AdminSidebar />
      <div className="mt-10 px-48">
        <PrivateRoute path="/admin/gallery/:name" component={ProjectSettings} />
        <PrivateRoute exact path="/admin/gallery" component={AdminGallery} />
        <PrivateRoute exact path="/admin/photos" component={AdminPhotos} />
        <PrivateRoute exact path="/admin/users" component={AdminUsers} />

        <Route exact path="/admin/login" component={AdminLogin} />
        <Route exact path="/admin" component={AdminHome} />
      </div>
    </>
  );
};

export default withRouter(Admin);
