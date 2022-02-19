import { Avatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hashSvg, xSvg } from "../../utils";
import ChangeUsernamePrompt from "../Prompts/ChangeUsernamePrompt";
import LogoutPrompt from "../Prompts/LogoutPrompt";
import "./overlay.css";
import "./user-settings.css";
function UserSettingsOverlay({ setOverlay }) {
  const user = useSelector((state) => state.session.user);
  // const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [logoutPrompt, setLogoutPrompt] = useState(false);
  const [usernamePrompt, setUsernamePrompt] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) setOverlay(false);
  }, [user]);
  const onSave = (e) => {
    e.preventDefault();
  };
  const onClickLogout = (e) => {
    e.preventDefault();
    setLogoutPrompt(true);
  };
  return (
    <div className="full-overlay-container">
      {usernamePrompt ? (
        <ChangeUsernamePrompt setOverlay={setUsernamePrompt} />
      ) : (
        <></>
      )}
      {logoutPrompt ? <LogoutPrompt setOverlay={setLogoutPrompt} /> : <></>}
      <div className="left-container">
        <div className="settings-options">
          <div className="options-header">
            {
              <div
                style={{
                  padding: "0 .5em",
                  color: "var(--text-muted)",
                  fontWeight: "600",
                }}
              >
                {"USER SETTINGS"}
              </div>
            }
          </div>
          <div className="option selected">My Account</div>
          <div className="separator" />
          <div onClick={onClickLogout} className="option danger-action">
            Log Out
          </div>
        </div>
      </div>
      <div className="right-container">
        <div
          style={{
            color: "white",
            marginBottom: "20px",
            fontSize: "20px",
            fontFamily: "var(--font-display)",
            fontWeight: "600",
          }}
        >
          My Account
        </div>
        <div className="user-card">
          <div className="user-card-banner"></div>
          <div className="user-card-bottom">
            <div className="user-avatar-bar">
              <div className="user-avatar">
                <Avatar style={{ width: "80px", height: "80px" }} />
              </div>

              <div
                style={{
                  color: "white",
                  marginBottom: "20px",
                  fontSize: "20px",
                  fontFamily: "var(--font-display)",
                  fontWeight: "600",
                }}
              >
                {user.username}
              </div>
            </div>
            <div className="user-card-options">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div className="option-header">USERNAME</div>
                  <div style={{ color: "var(--header-primary)" }}>
                    {user.username}
                  </div>
                </div>
                <button
                  className="edit-button"
                  onClick={() => setUsernamePrompt(true)}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="close-button" onClick={() => setOverlay(false)}>
        {xSvg()}
      </div>
    </div>
  );
}

export default UserSettingsOverlay;
