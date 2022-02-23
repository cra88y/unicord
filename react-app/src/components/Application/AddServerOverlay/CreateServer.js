import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { createServer } from "../../../store/servers";

function CreateServer({ setOverlay }) {
  const [picture, setPicture] = useState("");
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(createServer({ name: name }));
    setOverlay(false);
  };
  return (
    <div>
      <div className="overlay-header">Create your server!</div>
      <form className="create-server-form" onSubmit={onSubmit}>
        <div>
          <label htmlFor="pic">Picture </label>
          <input
            name="pic"
            type="file"
            value={picture}
            onChange={(e) => setPicture(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="name">Name </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            name="name"
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default CreateServer;
