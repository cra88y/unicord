import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Chat from "../LiveChat/Chat";

function Server({ server }) {
  const [channels, setChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const user = useSelector((state) => state.session.user);
  useEffect(() => {
    setChannels(server.channels);
    //fetch channels for server
  }, []);
  useEffect(() => {
    setActiveChannel(server.channels[0]);
  }, [channels]);
  return (
    <div className="server-container">
      <div>
        {" "}
        <h1>{server.name}</h1>
        {channels.length > 0 &&
          channels.map((channel) => (
            <div onMouseDown={() => setActiveChannel(channel)} key={channel.id}>
              {channel.name}
            </div>
          ))}
      </div>

      {activeChannel && <Chat chat={activeChannel} />}
    </div>
  );
}

export default Server;
