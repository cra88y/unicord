import { Avatar } from "@material-ui/core";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { cogSvg } from "../utils";
import UserSettingsOverlay from "./SettingsOverlays/UserSettingsOverlay";
import "./app.css";
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
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ paddingRight: "8px" }}>
          <Avatar style={{ width: "32px", height: "32px" }} />
        </div>

        <div className="username">{user.username}</div>
      </div>
      <div
        className="pointer user-cog"
        onClick={() => setUserSettingsOverlay(true)}
      >
        {cogSvg()}
      </div>
    </>
  );
}

export default UserBar;
