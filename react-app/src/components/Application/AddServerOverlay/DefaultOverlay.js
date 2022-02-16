import React from "react";

function DefaultOverlay({ setOverlayType }) {
  return (
    <>
      <h2>Create or Join a Server</h2>
      <p style={{ textAlign: "center" }}>
        A server is where you and your friends hang out. Make yours or join one
        to start chatting.
      </p>
      <div className="pointer" onMouseDown={() => setOverlayType(1)}>
        Create My Own
      </div>
      <div className="pointer" onMouseDown={() => setOverlayType(2)}>
        Join a server
      </div>
    </>
  );
}

export default DefaultOverlay;
