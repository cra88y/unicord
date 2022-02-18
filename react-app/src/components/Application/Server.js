import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveChannel } from "../../store/servers";
import Chat from "../LiveChat/Chat";
import { hashSvg } from "../utils";
import AddChannelOverlay from "./AddChannelOverlay/AddChannelOverlay";
import ChannelCard from "./ChannelCard";
import FullOverlay from "./SettingsOverlays/ChannelSettingsOverlay";
import UserBar from "./UserBar";

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
      {addChannelOverlayed && (
        <AddChannelOverlay
          server={server}
          setOverlay={setAddChannelOverlayed}
          overlayed={addChannelOverlayed}
        />
      )}
      <div className="server-container">
        <div className="server-container-top">
          <div>
            <div className="white box-header">{server.name}</div>
            <div className="text-channels-header">
              TEXT CHANNELS
              <span
                className="pointer"
                onMouseDown={() => setAddChannelOverlayed(true)}
              >
                +
              </span>
            </div>

            {channels.length > 0 &&
              channels.map((channel) => (
                <ChannelCard key={channel.id} channel={channel} />
              ))}
          </div>
        </div>
        <div className="server-container-bottom">
          <UserBar />
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
