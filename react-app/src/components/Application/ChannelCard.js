import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setActiveChannel } from "../../store/servers";
import { hashSvg } from "../utils";
import "./app.css";
import ChannelSettingsOverlay from "./SettingsOverlays/ChannelSettingsOverlay";
function ChannelCard({ channel }) {
  const [editChannelOverlayed, setEditChannelOverlay] = useState(false);
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
          style={{ display: "flex", alignItems: "center" }}
          className="pointer"
          onMouseDown={onClick}
        >
          <div className="hash">{hashSvg()}</div>
          <div style={{ height: "100%" }}>{channel.name}</div>
        </div>
        <div className="pointer" onClick={() => setEditChannelOverlay(true)}>
          settings
        </div>
      </div>
    </>
  );
}

export default ChannelCard;
