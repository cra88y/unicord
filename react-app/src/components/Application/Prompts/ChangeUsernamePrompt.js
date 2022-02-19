import React, { useEffect, useState } from "react";
import "./prompt.css";
import "../SettingsOverlays/overlay.css";
import { useDispatch, useSelector } from "react-redux";
import { deleteChannelById } from "../../../store/servers";
import "../SettingsOverlays/overlay.css";
import "../SettingsOverlays/user-settings.css";
import { updateUser } from "../../../store/session";
function ChangeUsernamePrompt({ setOverlay }) {
  const user = useSelector((state) => state.session.user);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    setUsername(user.username);
  }, [user]);
  const onClickCancel = (e) => {
    e.preventDefault();
    setOverlay(false);
  };
  const onClickDone = async (e) => {
    e.preventDefault();
    const resErrors = await dispatch(updateUser(username, password));
    setErrors(resErrors);
    if (resErrors.length == 0) {
      setOverlay(false);
    }
  };
  return (
    <div className="prompt-background">
      <div className="prompt-container">
        <div className="prompt-top">
          <div className="prompt-header centered">Change your username</div>
          <div className="prompt-subtext  centered">
            Enter a new username and your existing password.
          </div>
          <div className="prompt-options">
            <div className="option-header">USERNAME</div>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="option-input"
              spellCheck={false}
            />
          </div>
          <div className="prompt-options">
            <div className="option-header">CURRENT PASSWORD</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`option-input ${
                errors.length != 0 ? "bad-input" : ""
              }`}
            />
          </div>
        </div>
        <div className="prompt-bottom">
          <button className="reset-button pointer" onClick={onClickCancel}>
            Cancel
          </button>
          <button className="done-button pointer" onClick={onClickDone}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangeUsernamePrompt;
