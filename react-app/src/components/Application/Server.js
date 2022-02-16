import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Chat from "../LiveChat/Chat";
import AddChannelOverlay from "./AddChannelOverlay/AddChannelOverlay";

function Server({ server }) {
  const [channels, setChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [addChannelOverlayed, setAddChannelOverlayed] = useState(false);
  const user = useSelector((state) => state.session.user);
  useEffect(() => {
    setChannels(server.channels);
  }, [server]);
  useEffect(() => {
    setActiveChannel(server.channels[0]);
  }, [channels]);
  return (
    <div className="server-container">
      {addChannelOverlayed && (
        <AddChannelOverlay
          server={server}
          setOverlay={setAddChannelOverlayed}
          overlayed={addChannelOverlayed}
        />
      )}
      <div>
        <h1>{server.name}</h1>
        <span>
          Channels{" "}
          <span
            className="pointer"
            onMouseDown={() => setAddChannelOverlayed(true)}
          >
            +
          </span>
        </span>

        {channels.length > 0 &&
          channels.map((channel) => (
            <div
              className="pointer"
              onMouseDown={() => setActiveChannel(channel)}
              key={channel.id}
            >
              {channel.name}
            </div>
          ))}
      </div>

      {activeChannel ? (
        <Chat chat={activeChannel} />
      ) : (
        <h1 className="chat-container">No active chat</h1>
      )}
    </div>
  );
}

export default Server;
