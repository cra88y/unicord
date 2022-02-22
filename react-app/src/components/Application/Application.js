import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Server from "./Server";
import ServerCard from "./ServerCard";
import "./app.css";
import AddServerOverlay from "./AddServerOverlay/AddServerOverlay";
import {
  loadServers,
  loadUserServers,
  setActiveServer,
} from "../../store/servers";
import { socketConnect, socketDisconnect } from "../../store/session";
import { splashSvg } from "../utils";
function Application() {
  const user = useSelector((state) => state.session.user);
  const activeServer = useSelector((state) => state.servers.activeServer);
  const activeChannel = useSelector((state) => state.servers.activeChannel);
  const socket = useSelector((state) => state.session.socket);
  const servers = useSelector((state) => state.servers.servers);
  const [addServerOverlayed, setAddServerOverlayed] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user) {
      dispatch(loadUserServers());
      dispatch(socketConnect());
    }
    return () => socketDisconnect();
  }, []);

  useEffect(() => {
    if (!activeServer) {
      if (Object.values(servers).length)
        dispatch(setActiveServer(Object.values(servers)[0]));
    } else dispatch(setActiveServer(servers[activeServer.id]));
  }, [servers, activeServer]);
  if (Object.values(servers).length == 0)
    return (
      <>
        <div
          style={{
            height: "100vh",
            width: "100vw",
            position: "absolute",
            zIndex: "0",
            objectFit: "fill",
            background: "#5865f2",
          }}
        >
          {splashSvg()}
        </div>
        <AddServerOverlay
          setOverlay={setAddServerOverlayed}
          overlayed={addServerOverlayed}
        />
      </>
    );
  // if (activeServer == null) return <></>;
  return (
    <div className="app-container">
      {addServerOverlayed && (
        <AddServerOverlay
          setOverlay={setAddServerOverlayed}
          overlayed={addServerOverlayed}
        />
      )}
      <div className="server-browser">
        {Object.keys(servers) != 0 &&
          Object.values(servers).map((server) => (
            <ServerCard key={server.id} server={server} />
          ))}

        <div
          className="pointer server-bubble add-server-bubble"
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
