import React from "react";
import { useSelector } from "react-redux";
import { NavLink, Redirect } from "react-router-dom";
import LogoutButton from "./auth/LogoutButton";
import "./nav.css";
const NavBar = () => {
  return (
    <nav className="nav-bar-container">
      <ul>
        <li>
          <div className="logo">UNiCORD</div>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
