import React, { useState, useEffect } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SignUpForm from "./components/auth/SignUpForm";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UsersList from "./components/UsersList";
import User from "./components/User";
import { authenticate } from "./store/session";
import Application from "./components/Application/Application";
import LoginPrompt from "./components/Application/Prompts/LoginPrompt";
import RegisterPrompt from "./components/Application/Prompts/RegisterPrompt";
import Splash from "./components/Splash/Splash";
import { splashSvg } from "./components/utils";

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);

  useEffect(() => {
    (async () => {
      await dispatch(authenticate());
      setLoaded(true);
    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }
  return (
    <>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "var(--background-tertiary)",
        }}
      >
        <BrowserRouter>
          <Switch>
            <Route path="/" exact={true}>
              <NavBar />
              <div
                style={{
                  height: "120vh",
                  width: "100vw",
                  position: "absolute",
                  zIndex: "0",
                  objectFit: "fill",
                }}
              >
                {splashSvg()}
              </div>
              <Splash />
            </Route>
            <ProtectedRoute path="/app" exact={true}>
              <Application />
            </ProtectedRoute>
            <Route>
              <Redirect to="/" />
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
