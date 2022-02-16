import React from "react";

function DefaultOverlay({ setOverlayType }) {
  return (
    <>
      <h1>Create or Join a Server</h1>
      <p>
        A server is where you and your friends hang out. Make yours or join one
        to start chatting.
      </p>
      <div onMouseDown={() => setOverlayType(1)}>Create My Own</div>
      <div onMouseDown={() => setOverlayType(2)}>Join a server</div>
    </>
  );
}

export default DefaultOverlay;
