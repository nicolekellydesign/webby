import { Route, RouteComponentProps, withRouter } from "react-router-dom";
import AdminGallery from "../components/AdminGallery";
import AdminHome from "../components/AdminHome";
import AdminLogin from "../components/AdminLogin";
import AdminPhotos from "../components/AdminPhotos";
import AdminSidebar from "../components/AdminSidebar";
import AdminUsers from "../components/AdminUsers";
import PrivateRoute from "../components/PrivateRoute";

interface RouterProps {
  path: string;
}

interface RouterDetailProps extends RouteComponentProps<RouterProps> {}

const Admin: React.FC<RouterDetailProps> = (): JSX.Element => {
  return (
    <>
      <AdminSidebar />
      <div className="mt-10 px-48">
        <Route exact path="/admin" component={AdminHome} />

        <PrivateRoute path="/admin/gallery">
          <AdminGallery />
        </PrivateRoute>
        <PrivateRoute path="/admin/photos">
          <AdminPhotos />
        </PrivateRoute>
        <PrivateRoute path="/admin/users">
          <AdminUsers />
        </PrivateRoute>

        <Route path="/admin/login" component={AdminLogin} />
      </div>
    </>
  );
};

export default withRouter(Admin);
