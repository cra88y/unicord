import React, { useState, useEffect } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UsersList from "./components/UsersList";
import User from "./components/User";
import { authenticate } from "./store/session";
import Application from "./components/Application/Application";

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
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "var(--background-tertiary)",
      }}
    >
      <BrowserRouter>
        <Switch>
          <Route path="/login" exact={true}>
            <NavBar />
            <LoginForm />
          </Route>
          <Route path="/sign-up" exact={true}>
            <NavBar />
            <SignUpForm />
          </Route>
          <ProtectedRoute path="/" exact={true}>
            <Application />
          </ProtectedRoute>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
