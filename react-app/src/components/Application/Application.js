import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Server from "./Server";
import ServerCard from "./ServerCard";
import "./app.css";
import AddServerOverlay from "./AddServerOverlay/AddServerOverlay";
import { loadServers } from "../../store/servers";
function Application() {
  const user = useSelector((state) => state.session.user);
  const servers = useSelector((state) => state.servers.servers);
  const [activeServer, setActiveServer] = useState(null);
  const [addServerOverlayed, setAddServerOverlayed] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadServers());
  }, []);

  useEffect(() => {
    setActiveServer(Object.values(servers)[0]);
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
        {Object.keys(servers) > 0 &&
          Object.values(servers).map((server) => (
            <div
              onMouseDown={() => {
                setActiveServer(server);
              }}
              key={server.id}
            >
              <ServerCard server={server} />
            </div>
          ))}
        <div onMouseDown={() => setAddServerOverlayed(true)}>+</div>
      </div>

      {activeServer && <Server server={activeServer} />}
    </div>
  );
}

export default Application;
