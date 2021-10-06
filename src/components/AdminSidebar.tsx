import { Link, useHistory } from "react-router-dom";
import { alertService } from "../services/alert.service";
import { useAuth } from "../services/auth.service";
import { adminNavbarData } from "./adminNavbarData";

const AdminSidebar = (): JSX.Element => {
  const { authed, logout } = useAuth();
  const history = useHistory();

  const handleLogout = () => {
    logout()
      .then(() => {
        history.push("/admin");
      })
      .catch((error) => {
        console.error(`error sending logout request: ${error}`);
        alertService.error(`Error trying to log out: ${error}`, false);
      });
  };

  return (
    <section className="bg-yellow-600 fixed left-0 overflow-x-hidden text-center text-lg rounded-r py-5 top-1/3 w-48">
      {adminNavbarData.map((item) => {
        if ((item.privileged && authed) || !item.privileged) {
          return (
            <Link
              to={item.path}
              className="block hover:bg-yellow-700 transition px-3 py-2"
            >
              {item.title}
            </Link>
          );
        } else {
          return <></>;
        }
      })}
      {authed ? (
        <Link
          to="/admin"
          onClick={handleLogout}
          className="block hover:bg-yellow-700 transition px-3 py-2"
        >
          Logout
        </Link>
      ) : (
        <Link
          to="/admin/login"
          className="block hover:bg-yellow-700 transition px-3 py-2"
        >
          Log In
        </Link>
      )}
    </section>
  );
};

export default AdminSidebar;
