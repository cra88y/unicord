import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { xDDSvg, xSvg } from "../../utils";
import CreateServer from "./CreateServer";
import DefaultOverlay from "./DefaultOverlay";

function AddServerOverlay({ setOverlay, overlayed }) {
  const servers = useSelector((state) => state.servers.servers);
  const activeServer = useSelector((state) => state.servers.activeServer);
  const [overlayType, setOverlayType] = useState(0);

  return (
    <div className="overlay-background">
      {overlayType == 1 ? (
        <div
          className="overlay-content"
          style={{ height: "300px", position: "relative" }}
        >
          <CreateServer
            setOverlay={setOverlay}
            setOverlayType={setOverlayType}
          />
        </div>
      ) : (
        <div className="overlay-content">
          <DefaultOverlay
            setOverlay={setOverlay}
            setOverlayType={setOverlayType}
          />
        </div>
      )}
    </div>
  );
}

export default AddServerOverlay;
