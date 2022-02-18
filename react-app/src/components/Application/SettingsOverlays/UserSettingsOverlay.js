import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hashSvg, xSvg } from "../../utils";
import "./overlay.css";
function UserSettingsOverlay({ setOverlay }) {
  const user = useSelector((state) => state.session.user);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [logoutPrompt, setLogoutPrompt] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    setUsername(user.username);
  }, [user]);

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
      {/* {deleteOverlay ? (
        <DeleteChannelPrompt channel={channel} setOverlay={setDeleteOverlay} />
      ) : (
        <></>
      )} */}
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
        <div style={{ color: "white", marginBottom: "20px" }}>My Account</div>
        <div className="single-option-header">USERNAME</div>
        <input
          className="option-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="close-button" onClick={() => setOverlay(false)}>
        {xSvg()}
      </div>
    </div>
  );
}

export default UserSettingsOverlay;
