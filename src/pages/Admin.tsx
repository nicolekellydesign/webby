import { Route, RouteComponentProps, withRouter } from "react-router-dom";
import AdminGallery from "../components/AdminGallery";
import AdminHome from "../components/AdminHome";
import AdminPhotos from "../components/AdminPhotos";
import AdminSidebar from "../components/AdminSidebar";
import AdminUsers from "../components/AdminUsers";

interface RouterProps {
  path: string;
}

interface RouterDetailProps extends RouteComponentProps<RouterProps> {}

const Admin: React.FC<RouterDetailProps> = ({ match }): JSX.Element => {
  return (
    <>
      <AdminSidebar />
      <div>
        <Route exact path="/admin" component={AdminHome} />
        <Route path="/admin/gallery" component={AdminGallery} />
        <Route path="/admin/photos" component={AdminPhotos} />
        <Route path="/admin/users" component={AdminUsers} />
      </div>
    </>
  );
};

export default withRouter(Admin);
