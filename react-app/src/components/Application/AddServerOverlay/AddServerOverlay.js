import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import CreateServer from "./CreateServer";
import DefaultOverlay from "./DefaultOverlay";

function AddServerOverlay({ setOverlay, overlayed }) {
  const [overlayType, setOverlayType] = useState(0);

  return (
    <div className="overlay-background">
      <div className="overlay-content">
        <div onMouseDown={() => setOverlay(false)}>close</div>
        {overlayType == 1 ? (
          <CreateServer />
        ) : overlayType == 2 ? (
          <div>Find Server</div>
        ) : (
          <DefaultOverlay setOverlayType={setOverlayType} />
        )}
      </div>
    </div>
  );
}

export default AddServerOverlay;
