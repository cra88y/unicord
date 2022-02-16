import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Server from "./Server";
import ServerCard from "./ServerCard";
import "./app.css";
import AddServerOverlay from "./AddServerOverlay/AddServerOverlay";
import { loadServers } from "../../store/servers";
import { socketConnect, socketDisconnect } from "../../store/session";
function Application() {
  const user = useSelector((state) => state.session.user);
  const servers = useSelector((state) => state.servers.servers);
  const [activeServer, setActiveServer] = useState(null);
  const [addServerOverlayed, setAddServerOverlayed] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadServers());
    dispatch(socketConnect());
    return () => socketDisconnect();
  }, []);

  useEffect(() => {
    setActiveServer(Object.values(servers)[0]);
    console.log(Object.values(servers)[0]);
  }, [servers]);

  return (
    <div className="app-container">
      {addServerOverlayed && (
        <AddServerOverlay
          setOverlay={setAddServerOverlayed}
          overlayed={addServerOverlayed}
        />
      )}
      <div>
        <h1>Server Browser</h1>
        <span>
          Servers{" "}
          <span
            className="pointer"
            onMouseDown={() => setAddServerOverlayed(true)}
          >
            +
          </span>
        </span>
        {Object.keys(servers) != 0 &&
          Object.values(servers).map((server) => (
            <div
              className="pointer"
              onMouseDown={() => {
                setActiveServer(server);
              }}
              key={server.id}
            >
              <ServerCard server={server} />
            </div>
          ))}
      </div>

      {activeServer && <Server server={activeServer} />}
    </div>
  );
}

export default Application;
