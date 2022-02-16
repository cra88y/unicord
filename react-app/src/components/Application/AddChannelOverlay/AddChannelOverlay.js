import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { createChannel } from "../../../store/servers";
import "../app.css";
function AddChannelOverlay({ server, setOverlay, overlayed }) {
  const [overlayType, setOverlayType] = useState(0);
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(createChannel({ server_id: server.id, name: name }));
  };
  return (
    <div className="overlay-background">
      <div className="overlay-content">
        <div onMouseDown={() => setOverlay(false)}>close</div>
        <h2>Create a new channel</h2>
        <form onSubmit={onSubmit}>
          <label htmlFor="name">Name</label>
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit">Create</button>
        </form>
      </div>
    </div>
  );
}

export default AddChannelOverlay;
