import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { NavbarData } from './navbarData';
import { slideToggle } from './slider';
import logo from '../logo_white.png';
import './Navbar.css';

interface NavbarToggleProps {
  isShowing: boolean,
  onClick: React.MouseEventHandler<HTMLAnchorElement> | undefined,
}

const NavbarToggle = (props: NavbarToggleProps): JSX.Element => {
  const {isShowing, onClick} = props;
  const classes = `md:hidden absolute cursor-pointer p-2 right-1 top-14`;

  if (isShowing) {
    return (
      <Link to="#" id="navbar-toggle" className={classes} onClick={onClick}>
        <AiIcons.AiOutlineClose className="w-10 h-10" />
      </Link>
    )
  } else {
    return (
      <Link to="#" id="navbar-toggle" className={classes} onClick={onClick}>
        <FaIcons.FaBars className="w-10 h-10" />
      </Link>
    )
  }
}

const Navbar = (): JSX.Element => {
  const [navOpen, setNavOpen] = useState(false);
  const toggleNavMenu = () => {
    const toggle = document.getElementById('navbar-toggle')
    if (!toggle) {
      return;
    }

    const menu = document.getElementById('nav-list')
    if (!menu) {
      return;
    }

    toggle.classList.toggle('active');
    slideToggle(menu, navOpen, 300);
    setNavOpen(!navOpen);
  };

  return (
      <section className="h-nav">
        <div className="mx-auto my-0">
          <div className="absolute float-left p-5">
            <img src={logo} alt="Nicole Kelly Design" className="max-h-logo max-w-logo" />
          </div>

          <nav className="float-right">
            {/* <div className="block md:hidden absolute top-16 right-0 w-16 h-16">
              <NavbarToggle isShowing={navOpen} onClick={toggleNavMenu} />
            </div> */}
            <NavbarToggle isShowing={navOpen} onClick={toggleNavMenu} />
            <ul id="nav-list" className="list-none hidden m-0 p-0 md:block md:pt-16" onClick={toggleNavMenu}>
              {NavbarData.map((item, index) => {
                // Map each navbar item info to a link element
                return (
                  <li key={index} className={"float-none md:float-left font-lighter lowercase no-underline p-0 relative md:mx-5 md:my-8"}>
                    <Link to={item.path} className="navbar-link block md:pt-1.5">
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
