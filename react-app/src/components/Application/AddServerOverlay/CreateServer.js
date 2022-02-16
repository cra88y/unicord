import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { createServer } from "../../../store/servers";

function CreateServer() {
  const [picture, setPicture] = useState("");
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(createServer({ name: name }));
  };
  return (
    <div>
      <h1>Create your server!</h1>
      <form className="create-server-form" onSubmit={onSubmit}>
        <div>
          <label for="pic">Picture </label>
          <input
            name="pic"
            type="file"
            value={picture}
            onChange={(e) => setPicture(e.target.value)}
          />
        </div>
        <div>
          <label for="name">Name </label>
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
