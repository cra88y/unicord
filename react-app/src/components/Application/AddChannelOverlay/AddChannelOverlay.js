import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { createChannel } from "../../../store/servers";
import { xDDSvg } from "../../utils";
import "../app.css";
import "../Prompts/prompt.css";
function AddChannelOverlay({ server, setOverlay, overlayed }) {
  const [overlayType, setOverlayType] = useState(0);
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  const onClickCancel = (e) => {
    e.preventDefault();
    setOverlay(false);
  };
  const onClickDone = async (e) => {
    if (name.length < 1 || name.length > 20) return;
    dispatch(createChannel({ server_id: server.id, name: name }));
    setOverlay(false);
  };
  return (
    <div className="prompt-background">
      <div className="prompt-container">
        <div
          className="pointer overlay-close"
          onMouseDown={() => setOverlay(false)}
        >
          {xDDSvg()}
        </div>
        <div className="prompt-top">
          <div
            className="prompt-header centered"
            style={{ paddingBottom: "24px" }}
          >
            Create Text Channel
          </div>
          <div className="prompt-options">
            <div className="option-header">CHANNEL NAME</div>
            <input
              maxLength={20}
              minLength={1}
              className="option-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <div className="prompt-bottom">
          <button className="reset-button pointer" onClick={onClickCancel}>
            Cancel
          </button>
          <button
            className={`done-button pointer ${
              name.length > 0 ? "" : "disabled"
            }`}
            onClick={onClickDone}
          >
            Create Channel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddChannelOverlay;
