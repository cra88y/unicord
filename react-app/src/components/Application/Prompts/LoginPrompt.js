import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { login } from "../../../store/session";
import "./prompt.css";
import "../SettingsOverlays/overlay.css";
const LoginPrompt = () => {
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
    return <Redirect to="/" />;
  }

  return (
    <>
      <div className="prompt-background">
        <div className="prompt-container">
          <div className="prompt-top">
            <div className="prompt-header centered">Welcome back!</div>
            <div className="prompt-subtext  centered">
              We're so excited to see you again!
            </div>
            <div className="prompt-options">
              <form onSubmit={onLogin}>
                <div>
                  {errors.map((error, ind) => (
                    <div key={ind}>{error}</div>
                  ))}
                </div>
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
                    onChange={updatePassword}
                  />
                  <button
                    style={{ width: "100%" }}
                    type="submit"
                    className="done-button pointer"
                  >
                    Login
                  </button>
                </div>
              </form>
              <div>Just here to look around? Demo</div>
              <div>Need an account? Register</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPrompt;
