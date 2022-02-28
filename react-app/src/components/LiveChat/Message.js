import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pencilSvg, trashSvg } from "../utils";
import { Avatar } from "@material-ui/core";
import "../Application/app.css";
import {
  deleteChannelMessageById,
  updateChannelMessageById,
} from "../../store/servers";
import DeleteMessagePrompt from "../Application/Prompts/DeleteMessagePrompt";
export default function Message({ chat, message, reloadMessages }) {
  const user = useSelector((state) => state.session.user);
  const socket = useSelector((state) => state.session.socket);
  const [showDelete, setShowDelete] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isEditting, setIsEditting] = useState(false);
  const [editMessageContent, setEditMessageContent] = useState("");
  const [deleteMessageOverlay, setDeleteMessageOverlay] = useState(false);
  const dispatch = useDispatch();

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editMessageContent.length) setErrors(["no message content"]);
    const data = await dispatch(
      updateChannelMessageById(message.id, editMessageContent)
    );
    if (data.errors?.length > 0) {
      setErrors([data.errors]);
    } else {
      setIsEditting(false);
      reloadMessages();
    }
    setShowDelete(false);
    socket.emit("message_changed", {
      chat_type: chat.chat_type,
      chat_id: chat.chat_id,
    });
  };
  const onCancel = () => {
    setIsEditting(false);
    setShowDelete(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onCancel();
    }
    if (e.key === "Enter") {
      e.preventDefault();
      handleEdit(e);
    }
    e.target.style.height = `auto`;
    e.target.style.height = `${e.target.scrollHeight}px`;
  };
  return (
    <>
      {deleteMessageOverlay ? (
        <DeleteMessagePrompt
          chat={chat}
          message={message}
          setOverlay={setDeleteMessageOverlay}
        />
      ) : null}
      <div
        onMouseLeave={() => setShowDelete(false)}
        onMouseOver={() => setShowDelete(true)}
        className={`message-container ${isEditting ? "active-msg" : ""}`}
      >
        <Avatar src={message.user.imgUrl} />
        <div className="user-message">
          <div>
            <span className="username">{message.user.username}</span>
            <span className="date-txt">
              {" "}
              {new Date(message.created_at).toDateString()}
            </span>
          </div>
          {isEditting ? (
            <>
              <form onSubmit={handleEdit}>
                {errors.length > 0 && (
                  <div>
                    {errors.map((error, ind) => (
                      <div key={ind}>{error}</div>
                    ))}
                  </div>
                )}
                <textarea
                  maxLength={255}
                  required
                  autoFocus
                  className="edit-textarea"
                  // onFocus={handleKeyDown}
                  onKeyDown={handleKeyDown}
                  defaultValue={message.body}
                  onChange={(e) => {
                    setEditMessageContent(e.target.value);
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "12px",
                  }}
                >
                  <span>escape to</span>
                  <button
                    className="edit-btn"
                    onMouseDown={onCancel}
                    type="none"
                  >
                    cancel
                  </button>

                  <span>• enter to</span>
                  <button
                    className="edit-btn"
                    onMouseDown={(e) => e.stopPropagation()}
                    type="submit"
                  >
                    update
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <span>{message.body}</span>
              {message.user.id == user.id && showDelete ? (
                <div className="message-tools">
                  <div
                    onMouseDown={() => setIsEditting(true)}
                    className="pointer"
                  >
                    {pencilSvg()}
                  </div>
                  <div
                    style={{ display: "inline" }}
                    onMouseDown={() => setDeleteMessageOverlay(true)}
                    className="pointer"
                  >
                    {trashSvg()}
                  </div>
                </div>
              ) : (
                <></>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
