import React from "react";
import "./prompt.css";
import "../SettingsOverlays/overlay.css";
import { useDispatch } from "react-redux";
import { deleteChannelById } from "../../../store/servers";
import { logout } from "../../../store/session";
function LogoutPrompt({ setOverlay }) {
  const dispatch = useDispatch();
  const onClickCancel = (e) => {
    e.preventDefault();
    setOverlay(false);
  };
  const onClickDelete = (e) => {
    e.preventDefault();
    dispatch(logout());
    setOverlay(false);
  };
  return (
    <div className="prompt-background">
      <div className="prompt-container">
        <div className="prompt-top">
          <div className="prompt-header">Log Out</div>
          <div className="prompt-subtext">Are you sure you want to logout?</div>
        </div>
        <div className="prompt-bottom">
          <button className="reset-button pointer" onClick={onClickCancel}>
            Cancel
          </button>
          <button className="delete-button pointer" onClick={onClickDelete}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutPrompt;
