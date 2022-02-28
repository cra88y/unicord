import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUserServers, setActiveChannel } from "../../store/servers";
import Chat from "../LiveChat/Chat";
import { downArrSvg, hashSvg, plusSvg, xDDSvg, xSvg } from "../utils";
import AddChannelOverlay from "./AddChannelOverlay/AddChannelOverlay";
import ChannelCard from "./ChannelCard";
import ServerDropdown from "./DropdownMenus/ServerDropdown";
import FullOverlay from "./SettingsOverlays/ChannelSettingsOverlay";
import ServerSettingsOverlay from "./SettingsOverlays/ServerSettingsOverlay";
import UserBar from "./UserBar";

function Server({ server }) {
  const [channels, setChannels] = useState([]);
  const activeServer = useSelector((state) => state.servers.activeServer);
  const activeChannel = useSelector((state) => state.servers.activeChannel);
  const servers = useSelector((state) => state.servers.servers);
  const [addChannelOverlayed, setAddChannelOverlayed] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [settingsOverlay, setSettingsOverlay] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  useEffect(() => {
    setChannels(server.channels);
    setDropdown(false);
    setSettingsOverlay(false);

    // setSettingsOverlay(false);
  }, [server]);
  // useEffect(() => {

  // }, []);
  useEffect(() => {
    if (channels.length) {
      if (activeChannel) {
        dispatch(
          setActiveChannel(
            server.channels.find((v, idx) => v.id == activeChannel.id) ||
              server.channels[0]
          )
        );
      } else dispatch(setActiveChannel(server.channels[0]));
    } else dispatch(setActiveChannel(null));
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
      {settingsOverlay && (
        <ServerSettingsOverlay
          server={server}
          setOverlay={setSettingsOverlay}
        />
      )}
      {dropdown && (
        <ServerDropdown
          server={server}
          setSettingsOverlay={setSettingsOverlay}
          setDropdown={setDropdown}
        />
      )}
      <div className="server-container">
        <div className="server-container-top">
          <div>
            <div className="white box-header">
              {server.name}

              <button
                onClick={() => setDropdown((prev) => !prev)}
                onBlur={() => setDropdown(false)}
              >
                {dropdown ? xDDSvg() : downArrSvg()}
              </button>
            </div>
            <div className="text-channels-header">
              TEXT CHANNELS
              {user.id == activeServer.owner.id ? (
                <span
                  className="pointer"
                  onMouseDown={() => setAddChannelOverlayed(true)}
                >
                  <div className="channel-plus">{plusSvg()}</div>
                </span>
              ) : (
                <></>
              )}
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
        <div className="chat-container">No active chat</div>
      )}
    </>
  );
}

export default Server;
