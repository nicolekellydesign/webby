import { Link } from "react-router-dom";
import { adminNavbarData } from "./adminNavbarData";

const AdminSidebar = (): JSX.Element => {
  return (
    <section className="bg-yellow-600 fixed left-0 overflow-x-hidden text-center text-lg rounded-r py-5 top-1/3 w-48">
      {adminNavbarData.map((item) => {
        if ((item.privileged && false) || !item.privileged) {
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
    </section>
  );
};

export default AdminSidebar;
