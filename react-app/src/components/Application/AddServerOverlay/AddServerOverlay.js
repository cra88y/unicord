import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import CreateServer from "./CreateServer";
import DefaultOverlay from "./DefaultOverlay";

function AddServerOverlay({ setOverlay, overlayed }) {
  const servers = useSelector((state) => state.servers.servers);
  const activeServer = useSelector((state) => state.servers.activeServer);
  const [overlayType, setOverlayType] = useState(0);

  return (
    <div className="overlay-background">
      <div className="overlay-content">
        <div className="pointer" onMouseDown={() => setOverlay(false)}>
          close
        </div>
        {overlayType == 1 ? (
          <CreateServer setOverlay={setOverlay} />
        ) : overlayType == 2 ? (
          <div>Find Server</div>
        ) : (
          <DefaultOverlay
            setOverlay={setOverlay}
            setOverlayType={setOverlayType}
          />
        )}
      </div>
    </div>
  );
}

export default AddServerOverlay;
