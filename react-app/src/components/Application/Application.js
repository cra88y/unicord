import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Server from "./Server";
import ServerCard from "./ServerCard";
import "./app.css";
import AddServerOverlay from "./AddServerOverlay/AddServerOverlay";
import { loadServers, setActiveServer } from "../../store/servers";
import { socketConnect, socketDisconnect } from "../../store/session";
function Application() {
  const user = useSelector((state) => state.session.user);
  const activeServer = useSelector((state) => state.servers.activeServer);
  const activeChannel = useSelector((state) => state.servers.activeChannel);
  const servers = useSelector((state) => state.servers.servers);
  const [addServerOverlayed, setAddServerOverlayed] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadServers());
    dispatch(socketConnect());
    return () => socketDisconnect();
  }, []);

  useEffect(() => {
    if (!activeServer) {
      if (Object.values(servers).length)
        dispatch(setActiveServer(Object.values(servers)[0]));
    } else dispatch(setActiveServer(servers[activeServer.id]));
  }, [servers]);
  if (Object.values(servers).length == 0) return <></>;
  return (
    <div className="app-container">
      {addServerOverlayed && (
        <AddServerOverlay
          setOverlay={setAddServerOverlayed}
          overlayed={addServerOverlayed}
        />
      )}
      <div className="server-browser">
        <div>Servers </div>
        {Object.keys(servers) != 0 &&
          Object.values(servers).map((server) => (
            <div
              className="pointer"
              onMouseDown={() => {
                dispatch(setActiveServer(server));
              }}
              key={server.id}
            >
              <ServerCard server={server} />
            </div>
          ))}
        <div
          className="pointer"
          onMouseDown={() => setAddServerOverlayed(true)}
        >
          +
        </div>
      </div>

      {activeServer && <Server server={activeServer} />}
    </div>
  );
}

export default Application;
