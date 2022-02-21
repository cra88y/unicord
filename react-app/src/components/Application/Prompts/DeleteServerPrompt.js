import React from "react";
import "./prompt.css";
import "../SettingsOverlays/overlay.css";
import { useDispatch } from "react-redux";
import { deleteServerById } from "../../../store/servers";
function DeleteServerPrompt({ server, setOverlay }) {
  const dispatch = useDispatch();
  const onClickCancel = (e) => {
    e.preventDefault();
    setOverlay(false);
  };
  const onClickDelete = (e) => {
    e.preventDefault();
    dispatch(deleteServerById(server.id));
    setOverlay(false);
  };
  return (
    <div className="prompt-background">
      <div className="prompt-container">
        <div className="prompt-top">
          <div className="prompt-header">Delete Server</div>
          <div className="prompt-subtext">
            Are you sure you want to delete {<strong>{server.name}</strong>}?
            This cannot be undone.
          </div>
        </div>
        <div className="prompt-bottom">
          <button className="reset-button pointer" onClick={onClickCancel}>
            Cancel
          </button>
          <button className="delete-button pointer" onClick={onClickDelete}>
            Delete Server
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteServerPrompt;
