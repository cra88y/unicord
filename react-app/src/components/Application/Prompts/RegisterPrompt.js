import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import "./prompt.css";
import "../SettingsOverlays/overlay.css";
import { demoLogin, signUp } from "../../../store/session";
const RegisterPrompt = ({ setRegisterPrompt, setLoginPrompt }) => {
  const [errors, setErrors] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();

  const onSignUp = async (e) => {
    e.preventDefault();
    const data = await dispatch(
      signUp(username, email, password, repeatPassword)
    );
    if (data) {
      setErrors(data);
    }
  };

  const updateUsername = (e) => {
    setUsername(e.target.value);
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const updateRepeatPassword = (e) => {
    setRepeatPassword(e.target.value);
  };

  if (user) {
    return <Redirect to="/app" />;
  }

  return (
    <>
      <div
        className="prompt-background"
        onMouseDown={() => setRegisterPrompt(false)}
      >
        <div
          className="prompt-container"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="prompt-top">
            <div
              className="prompt-header centered"
              style={{ marginBottom: "20px" }}
            >
              Create an account
            </div>
            <div className="prompt-options">
              <form onSubmit={onSignUp}>
                <div>
                  {errors.map((error, ind) => (
                    <div key={ind}>{error}</div>
                  ))}
                </div>
                <div>
                  <div className="option-header">USERNAME</div>
                  <input
                    className={`option-input ${
                      errors.length != 0 ? "bad-input" : ""
                    }`}
                    type="text"
                    name="username"
                    value={username}
                    onChange={updateUsername}
                    required={true}
                  />
                </div>
                <div className="option-header">EMAIL</div>
                <input
                  className={`option-input ${
                    errors.length != 0 ? "bad-input" : ""
                  }`}
                  name="email"
                  type="email"
                  value={email}
                  onChange={updateEmail}
                  required={true}
                />
                <div className="option-header">PASSWORD</div>
                <input
                  className={`option-input ${
                    errors.length != 0 ? "bad-input" : ""
                  }`}
                  name="email"
                  value={password}
                  type="password"
                  onChange={updatePassword}
                  required={true}
                />
                <div className="option-header">REPEAT PASSWORD</div>
                <input
                  className={`option-input ${
                    errors.length != 0 ? "bad-input" : ""
                  }`}
                  name="email"
                  type="password"
                  value={repeatPassword}
                  onChange={updateRepeatPassword}
                  required={true}
                />
                <button
                  style={{ width: "100%" }}
                  type="submit"
                  className="done-button pointer"
                >
                  Continue
                </button>
              </form>
              <div className="prompt-option-subtext">
                <span
                  className="blue-link"
                  onClick={() => {
                    setLoginPrompt(true);
                  }}
                >
                  Already have an account?
                </span>{" "}
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
      </div>
    </>
  );
};

export default RegisterPrompt;
