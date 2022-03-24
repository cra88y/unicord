import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { leaveServerById } from "../../../store/servers";
import ServerSettingsOverlay from "../SettingsOverlays/ServerSettingsOverlay";
import "./dropdown.css";
function ServerDropdown({ server, setDropdown, setSettingsOverlay }) {
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const handleMDown = (e) => {
    e.preventDefault();
  };
  const handleClick = (e) => {
    setDropdown(false);
  };
  return (
    <>
      <div className="dropdown-container">
        <ul>
          {server.owner.id == user.id ? (
            <li
              className="dd-item"
              onMouseDown={handleMDown}
              onClick={() => {
                handleClick();
                setSettingsOverlay(true);
              }}
            >
              Server Settings
            </li>
          ) : (
            <li
              className="dd-item dd-item-red"
              onMouseDown={(e) => {
                e.preventDefault();
                dispatch(leaveServerById(server.id));
                handleClick();
              }}
            >
              Leave Server
            </li>
          )}
        </ul>
      </div>
    </>
  );
}

export default ServerDropdown;
