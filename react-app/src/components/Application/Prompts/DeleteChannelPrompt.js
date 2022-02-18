import React from "react";
import "./prompt.css";
import "../SettingsOverlays/overlay.css";
import { useDispatch } from "react-redux";
import { deleteChannelById } from "../../../store/servers";
function DeleteChannelPrompt({ channel, setOverlay }) {
  const dispatch = useDispatch();
  const onClickCancel = (e) => {
    e.preventDefault();
    setOverlay(false);
  };
  const onClickDelete = (e) => {
    e.preventDefault();
    dispatch(deleteChannelById(channel.id));
    setOverlay(false);
  };
  return (
    <div className="prompt-background">
      <div className="prompt-container">
        <div className="prompt-top">
          <div className="prompt-header">Delete Channel</div>
          <div className="prompt-body">
            Are you sure you want to delete {<strong>#{channel.name}</strong>}?
            This cannot be undone.
          </div>
        </div>
        <div className="prompt-bottom">
          <button className="reset-button pointer" onClick={onClickCancel}>
            Cancel
          </button>
          <button className="delete-button pointer" onClick={onClickDelete}>
            Delete Channel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteChannelPrompt;
