import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { NavbarData } from './navbarData';
import logo from '../logo_white.png';
import './Navbar.css';

interface NavbarToggleProps {
  isShowing: boolean,
  onClick: React.MouseEventHandler<HTMLAnchorElement> | undefined,
}

const NavbarToggle = (props: NavbarToggleProps): JSX.Element => {
  const {isShowing, onClick} = props;

  if (isShowing) {
    return (
      <Link to="#" id="navbar-toggle" className="hidden absolute right-0 top-16 w-16 h-16" onClick={onClick}>
        <AiIcons.AiOutlineClose />
      </Link>
    )
  } else {
    return (
      <Link to="#" id="navbar-toggle" className="navbar-toggle absolute right-0 top-16 w-16 h-16" onClick={onClick}>
        <FaIcons.FaBars />
      </Link>
    )
  }
}

const Navbar = (): JSX.Element => {
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);

  return (
      <section className="h-nav">
        <div className="mx-auto my-0">
          <div className="absolute float-left p-5">
            <img src={logo} alt="Nicole Kelly Design" className="max-h-logo max-w-logo" />
          </div>

          <nav className="float-right">
            <div className="nav-mobile absolute hidden top-16 right-0 w-16 h-16">
              <NavbarToggle isShowing={sidebar} onClick={showSidebar} />
            </div>
            <ul id="nav-list" className="list-none m-0 p-0" onClick={showSidebar}>
              {NavbarData.map((item, index) => {
                // Map each navbar item info to a link element
                return (
                  <li key={index} className={"float-left font-lighter lowercase no-underline p-0 relative"}>
                    <Link to={item.path} className="navbar-link block pt-1.5">
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </section>
  )
};

export default Navbar;
