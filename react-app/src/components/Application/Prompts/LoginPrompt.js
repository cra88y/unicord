import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, Redirect } from "react-router-dom";
import { demoLogin, login } from "../../../store/session";
import "./prompt.css";
import "../SettingsOverlays/overlay.css";
const LoginPrompt = ({ setRegisterPrompt, setLoginPrompt }) => {
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();

  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    }
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  if (user) {
    return <Redirect to="/app" />;
  }

  return (
    <>
      <div
        className="prompt-background"
        onMouseDown={() => setLoginPrompt(false)}
      >
        <div
          className="prompt-container"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="prompt-top">
            <div className="prompt-header centered">Welcome back!</div>
            <div className="prompt-subtext  centered">
              We're so excited to see you again!
            </div>
            <div className="prompt-options">
              <form onSubmit={onLogin}>
                <div>
                  <div className="option-header">EMAIL</div>
                  <input
                    className={`option-input ${
                      errors.length != 0 ? "bad-input" : ""
                    }`}
                    name="email"
                    type="text"
                    value={email}
                    onChange={updateEmail}
                    required={true}
                  />
                </div>
                <div>
                  <div className="option-header">PASSWORD</div>
                  <input
                    className={`option-input ${
                      errors.length != 0 ? "bad-input" : ""
                    }`}
                    name="password"
                    value={password}
                    type="password"
                    onChange={updatePassword}
                    required={true}
                  />
                  <button
                    style={{ width: "100%" }}
                    type="submit"
                    className="done-button pointer"
                  >
                    Login
                  </button>
                </div>
              </form>{" "}
              <div className="prompt-option-subtext">
                Need an account?{" "}
                <span
                  onClick={() => setRegisterPrompt(true)}
                  className="blue-link"
                >
                  Register
                </span>
              </div>
              <div className="prompt-option-subtext">
                Just here to look around?{" "}
                <span
                  className="blue-link"
                  onClick={() => dispatch(demoLogin())}
                >
                  Demo
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPrompt;
