import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveChannel } from "../../store/servers";
import Chat from "../LiveChat/Chat";
import { hashSvg } from "../utils";
import AddChannelOverlay from "./AddChannelOverlay/AddChannelOverlay";
import ChannelCard from "./ChannelCard";
import FullOverlay from "./SettingsOverlays/ChannelSettingsOverlay";

function Server({ server }) {
  const [channels, setChannels] = useState([]);
  const activeServer = useSelector((state) => state.servers.activeServer);
  const activeChannel = useSelector((state) => state.servers.activeChannel);
  const servers = useSelector((state) => state.servers.servers);
  const [addChannelOverlayed, setAddChannelOverlayed] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  useEffect(() => {
    setChannels(server.channels);
  }, [server]);
  useEffect(() => {
    if (channels.length && !activeChannel)
      dispatch(setActiveChannel(server.channels[0]));
  }, [channels]);
  return (
    <>
      <div className="server-container">
        <div className="server-container-top">
          {addChannelOverlayed && (
            <AddChannelOverlay
              server={server}
              setOverlay={setAddChannelOverlayed}
              overlayed={addChannelOverlayed}
            />
          )}
          <div>
            <h1 className="white">{server.name}</h1>
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
                <ChannelCard key={channel.id} channel={channel} />
              ))}
          </div>
        </div>
        <div className="server-container-bottom">
          <div className="username">{user.username}</div>
          <div>settings</div>
        </div>
      </div>
      {activeChannel ? (
        <Chat chat={activeChannel} />
      ) : (
        <h1 className="chat-container">No active chat</h1>
      )}
    </>
  );
}

export default Server;
