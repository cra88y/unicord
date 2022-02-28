import React from "react";
import "./prompt.css";
import "../SettingsOverlays/overlay.css";
import { useDispatch, useSelector } from "react-redux";
import { deleteChannelMessageById } from "../../../store/servers";
function DeleteMessagePrompt({ chat, message, setOverlay }) {
  const socket = useSelector((state) => state.session.socket);
  const dispatch = useDispatch();
  const onClickCancel = (e) => {
    e.preventDefault();
    setOverlay(false);
  };
  const onClickDelete = (e) => {
    e.preventDefault();
    dispatch(deleteChannelMessageById(message.id)).then((e) => {
      socket.emit("message_changed", {
        chat_type: chat.chat_type,
        chat_id: chat.chat_id,
      });
    });
    setOverlay(false);
  };
  return (
    <div className="prompt-background">
      <div className="prompt-container">
        <div className="prompt-top">
          <div className="prompt-header">Delete Message</div>
          <div className="prompt-subtext">
            Are you sure you want to delete your message "
            {<strong>{message.body}</strong>}"?
          </div>
        </div>
        <div className="prompt-bottom">
          <button className="reset-button pointer" onClick={onClickCancel}>
            Cancel
          </button>
          <button className="delete-button pointer" onClick={onClickDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteMessagePrompt;
