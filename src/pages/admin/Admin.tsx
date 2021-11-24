import { Link, Route, RouteComponentProps, useHistory, withRouter } from "react-router-dom";
import { adminNavbarData } from "@Components/adminNavbarData";
import { PrivateRoute } from "@Components/PrivateRoute";
import { alertService } from "@Services/alert.service";
import { useAuth } from "@Services/auth.service";
import { About } from "@Pages/admin/About";
import { AdminGallery } from "@Pages/admin/Gallery";
import { AdminHome } from "@Pages/admin/Home";
import { AdminLogin } from "@Pages/admin/Login";
import { AdminPhotos } from "@Pages/admin/Photos";
import { ProjectSettings } from "@Pages/admin/ProjectSettings";
import { AdminUsers } from "@Pages/admin/Users";

interface RouterProps {
  path: string;
}

interface RouterDetailProps extends RouteComponentProps<RouterProps> {}

const Admin: React.FC<RouterDetailProps> = () => {
  const { authed, logout } = useAuth();
  const history = useHistory();

  const handleLogout = () => {
    logout()
      .then(() => {
        history.push("/admin");
      })
      .catch((error) => {
        console.error("error sending logout request", error);
        alertService.error(`Error trying to log out: ${error.message}`, false);
      });
  };

  return (
    <div>
      <section className="absolute pl-4">
        <ul className="menu p-4 shadow-lg bg-base-200 w-40 rounded-box text-base-content">
          <li className="menu-title">
            <span>Admin Pages</span>
          </li>
          {adminNavbarData.map(
            (item) =>
              ((item.privileged && authed) || !item.privileged) && (
                <li>
                  <Link to={item.path}>{item.title}</Link>
                </li>
              )
          )}
          <li>
            {authed ? (
              <Link to="/admin" onClick={handleLogout}>
                Logout
              </Link>
            ) : (
              <Link to="/admin/login">Log In</Link>
            )}
          </li>
        </ul>
      </section>

      <div className="mt-8 px-48">
        <PrivateRoute path="/admin/gallery/:name" authed={authed} component={ProjectSettings} />
        <PrivateRoute exact path="/admin/gallery" authed={authed} component={AdminGallery} />
        <PrivateRoute exact path="/admin/photos" authed={authed} component={AdminPhotos} />
        <PrivateRoute exact path="/admin/about" authed={authed} component={About} />
        <PrivateRoute exact path="/admin/users" authed={authed} component={AdminUsers} />

        <Route exact path="/admin/login" component={AdminLogin} />
        <Route exact path="/admin" component={AdminHome} />
      </div>
    </div>
  );
};

export default withRouter(Admin);
