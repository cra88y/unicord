import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveServer } from "../../store/servers";
import "./app.css";
function ServerCard({ server }) {
  const activeServer = useSelector((state) => state.servers.activeServer);
  const dispatch = useDispatch();
  const acronym = server?.name
    .split(/\s/)
    .reduce((response, word) => (response += word.slice(0, 1)), "");
  return (
    <>
      <div
        className="pointer server-bubble-container"
        onMouseDown={() => {
          dispatch(setActiveServer(server));
        }}
      >
        {server == activeServer ? (
          <span className="active-server-indicator"></span>
        ) : (
          <></>
        )}
        <div
          className={`server-bubble ${
            server == activeServer ? "active-bubble" : ""
          }`}
        >
          {server.imgUrl ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundImage: `url(${server.imgUrl})`,
              }}
            ></div>
          ) : (
            acronym
          )}
        </div>
      </div>
    </>
  );
}

export default ServerCard;
