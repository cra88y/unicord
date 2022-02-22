import React, { useEffect, useState } from "react";
import LoginPrompt from "../Application/Prompts/LoginPrompt.js";
import RegisterPrompt from "../Application/Prompts/RegisterPrompt.js";
import { splashSvg } from "../utils.js";
import "./splash.css";
function Splash() {
  const [loginPrompt, setLoginPrompt] = useState(false);
  const [registerPrompt, setRegisterPrompt] = useState(false);
  useEffect(() => {
    if (registerPrompt == loginPrompt) setRegisterPrompt(false);
  }, [loginPrompt]);
  useEffect(() => {
    if (registerPrompt == loginPrompt) setLoginPrompt(false);
  }, [registerPrompt]);

  return (
    <>
      {loginPrompt && (
        <LoginPrompt
          setRegisterPrompt={setRegisterPrompt}
          setLoginPrompt={setLoginPrompt}
        />
      )}
      {registerPrompt && (
        <RegisterPrompt
          setRegisterPrompt={setRegisterPrompt}
          setLoginPrompt={setLoginPrompt}
        />
      )}
      <div className="splash-container">
        <div className="splash-header">IMAGINE A PLACE...</div>
        <div className="splash-subheader">
          ...where you can belong to a school club, a gaming group, or a
          worldwide art community. Where just you and a handful of friends can
          spend time together. A place that makes it easy to talk every day and
          hang out more often.
        </div>
        <button
          onClick={() => setRegisterPrompt(true)}
          className="button-white"
        >
          Register or Demo
        </button>{" "}
        <button
          onClick={() => setLoginPrompt(true)}
          className="splash-dark-button"
        >
          Login
        </button>
      </div>
    </>
  );
}

export default Splash;
