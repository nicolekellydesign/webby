import { Route, RouteComponentProps, withRouter } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import PrivateRoute from "../components/PrivateRoute";
import AdminGallery from "./AdminGallery";
import AdminHome from "./AdminHome";
import AdminLogin from "./AdminLogin";
import AdminPhotos from "./AdminPhotos";
import ProjectSettings from "./AdminProjectSettings";
import AdminUsers from "./AdminUsers";

interface RouterProps {
  path: string;
}

interface RouterDetailProps extends RouteComponentProps<RouterProps> {}

const Admin: React.FC<RouterDetailProps> = (): JSX.Element => {
  // const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  // useEffect(() => {
  //   getGalleryItems()
  //     .then((galleryItem) => {
  //       setGalleryItems(galleryItem);
  //     })
  //     .catch((error) => {
  //       console.error(`error getting gallery items: ${error}`);
  //       alertService.error(`Error getting gallery items: ${error}`, false);
  //     });
  // }, []);

  return (
    <>
      <AdminSidebar />
      <div className="mt-10 px-48">
        <Route exact path="/admin" component={AdminHome} />

        <PrivateRoute path="/admin/gallery/:name" component={ProjectSettings} />
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
