import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";

import { slideToggle } from "@Components/slider";
import { NavbarData } from "@Components/navbarData";
import "@Components/Navbar.css";
import logo from "@Icons/logo_white.png";

export const Navbar: React.FC = () => {
  const [navOpen, setNavOpen] = useState(false);
  const history = useHistory();

  const toggleNavMenu = () => {
    const menu = document.getElementById("nav-list");
    if (!menu) {
      return;
    }

    slideToggle(menu, navOpen, 300);
    setNavOpen(!navOpen);
  };

  // Use a history hook to toggle the nav menu closed on nav change
  useEffect(() => {
    const historyUnlisten = history.listen(() => {
      if (navOpen) {
        toggleNavMenu();
      }
    });

    return () => {
      historyUnlisten();
    };
  });

  return (
    <nav>
      <div className="w-full h-nav navbar p-5">
        <div className="flex-1">
          <img src={logo} alt="Nicole Kelly Design" className="max-h-logo max-w-logo" />
        </div>

        <div className="flex-none hidden lg:block self-end">
          <ul className="menu horizontal">
            {NavbarData.map((item, index) => (
              <li key={index} className="font-lighter lowercase no-underline p-0 relative">
                <Link to={item.path} className="navbar-link block">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-none lg:hidden">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="btn btn-ghost rounded-btn" onClick={toggleNavMenu}>
              {navOpen ? (
                <AiOutlineClose className="icon-md inline-block" />
              ) : (
                <AiOutlineMenu className="icon-md inline-block" />
              )}
            </div>
          </div>
        </div>
      </div>

      <ul id="nav-list" tabIndex={0} className="p-4 menu hidden w-full">
        {NavbarData.map((item, index) => (
          <li key={index} className="font-lighter lowercase no-underline">
            <Link to={item.path} className="navbar-link">
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
