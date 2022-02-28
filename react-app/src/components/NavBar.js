import React from "react";
import { useSelector } from "react-redux";
import { NavLink, Redirect } from "react-router-dom";
import LogoutButton from "./auth/LogoutButton";
import "./nav.css";
import { openInNewTab } from "./utils";
const NavBar = () => {
  return (
    <nav className="nav-bar-container">
      <ul>
        <li>
          <div className="logo">UNiCORD</div>
        </li>
        <li style={{ display: "flex" }}>
          <div
            className="logo splash-link"
            style={{ marginRight: "24px" }}
            onClick={() => openInNewTab("https://www.linkedin.com/in/camer0n/")}
          >
            LINKEDIN
          </div>
          <div
            className="logo splash-link"
            onClick={() => openInNewTab("https://github.com/cra88y/unicord/")}
          >
            GITHUB
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
