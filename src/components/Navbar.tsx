import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { slideToggle } from "./slider";
import { NavbarData } from "./navbarData";
import logo from "../icons/logo_white.png";
import "./Navbar.css";

export function Navbar() {
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
          <img
            src={logo}
            alt="Nicole Kelly Design"
            className="max-h-logo max-w-logo"
          />
        </div>

        <div className="flex-none hidden lg:block self-end">
          <ul className="menu horizontal">
            {NavbarData.map((item, index) => (
              <li
                key={index}
                className="font-lighter lowercase no-underline p-0 relative"
              >
                <Link to={item.path} className="navbar-link block">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-none lg:hidden">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              className="btn btn-ghost rounded-btn"
              onClick={toggleNavMenu}
            >
              {navOpen ? (
                <AiOutlineClose className="inline-block w-10 h-10 stroke-current" />
              ) : (
                <AiOutlineMenu className="inline-block w-10 h-10 stroke-current" />
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
}
