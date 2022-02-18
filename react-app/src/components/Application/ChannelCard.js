import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveChannel } from "../../store/servers";
import { cogSvg, hashSvg } from "../utils";
import "./app.css";
import ChannelSettingsOverlay from "./SettingsOverlays/ChannelSettingsOverlay";
function ChannelCard({ channel }) {
  const [editChannelOverlayed, setEditChannelOverlay] = useState(false);
  const activeChannel = useSelector((state) => state.servers.activeChannel);
  const dispatch = useDispatch();
  const onClick = () => {
    dispatch(setActiveChannel(channel));
  };
  return (
    <>
      {editChannelOverlayed && (
        <ChannelSettingsOverlay
          channel={channel}
          setOverlay={setEditChannelOverlay}
          overlayed={editChannelOverlayed}
        />
      )}
      <div className="channel-bar">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
          className={`pointer channel-button ${
            activeChannel == channel ? "active-channel" : ""
          }`}
          onMouseDown={onClick}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="hash" style={{ paddingRight: "6px" }}>
              {hashSvg()}
            </div>
            <div style={{ height: "100%" }}>{channel.name}</div>
          </div>

          <div
            style={{ height: "12px", display: "flex", alignItems: "center" }}
            className="pointer"
            onClick={() => setEditChannelOverlay(true)}
          >
            {cogSvg()}
          </div>
        </div>
      </div>
    </>
  );
}

export default ChannelCard;
