import React, { useState } from "react";
import { useSelector } from "react-redux";
import UserSettingsOverlay from "./SettingsOverlays/UserSettingsOverlay";

function UserBar() {
  const user = useSelector((state) => state.session.user);
  const [userSettingsOverlayed, setUserSettingsOverlay] = useState(false);
  return (
    <>
      {userSettingsOverlayed ? (
        <UserSettingsOverlay setOverlay={setUserSettingsOverlay} />
      ) : (
        <></>
      )}
      <div className="username">{user.username}</div>
      <div onClick={() => setUserSettingsOverlay(true)}>settings</div>
    </>
  );
}

export default UserBar;
