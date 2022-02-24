import React, { useEffect, useRef, useState } from "react";
import "./AddServerOverlay.css";
import "../Prompts/prompt.css";
import { useDispatch, useSelector } from "react-redux";
import { joinServerById, loadJoinableServers } from "../../../store/servers";
import { xDDSvg } from "../../utils";
function DefaultOverlay({ setOverlayType, setOverlay }) {
  // const servers = useSelector((state) => state.servers.servers);
  const [joinableServers, setJoinableServers] = useState([]);

  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);
  const dispatch = useDispatch();
  useEffect(() => {
    const getServers = async () => {
      const loadedServers = await dispatch(loadJoinableServers());
      if (isMounted.current) setJoinableServers(loadedServers);
    };
    getServers();
  }, []);
  return (
    <>
      <div
        className="pointer overlay-close"
        onMouseDown={() => setOverlay(false)}
      >
        {xDDSvg()}
      </div>
      <div>
        <div className="overlay-header">Create or Join a Server</div>
      </div>
      <div
        className="prompt-subtext"
        style={{ textAlign: "center", fontWeight: "500 !important" }}
      >
        A server is where you and your friends hang out. Make yours or join one
        to start talking.
      </div>
      <div className="items-container">
        <div
          className="pointer overlay-item"
          onMouseDown={() => setOverlayType(1)}
        >
          Create My Own
        </div>
        <div className="items-header">JOIN A SERVER THAT ALREADY EXISTS</div>
        {Object.keys(joinableServers) != 0 &&
          Object.values(joinableServers).map((server) => (
            <ServerItem
              key={server.id}
              server={server}
              setOverlay={setOverlay}
            />
          ))}
      </div>
    </>
  );
}

function ServerItem({ server, setOverlay }) {
  const dispatch = useDispatch();
  const onClick = () => {
    dispatch(joinServerById(server.id));
    setOverlay(false);
  };
  return (
    <div
      className="pointer overlay-item"
      onMouseDown={() => {
        onClick();
      }}
    >
      {server.name}
    </div>
  );
}

export default DefaultOverlay;
