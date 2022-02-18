import React from "react";
import { useSelector } from "react-redux";
import { NavLink, Redirect } from "react-router-dom";
import LogoutButton from "./auth/LogoutButton";

const NavBar = () => {
  return (
    <nav>
      <ul
        style={{
          display: "flex",
          justifyContent: "space-between",
          listStyle: "none",
          height: "2vh",
        }}
      >
        <li>
          <NavLink to="/" exact={true} activeClassName="active">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/login" exact={true} activeClassName="active">
            Login
          </NavLink>
        </li>
        <li>
          <NavLink to="/sign-up" exact={true} activeClassName="active">
            Sign Up
          </NavLink>
        </li>
        <li>
          <LogoutButton />
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
