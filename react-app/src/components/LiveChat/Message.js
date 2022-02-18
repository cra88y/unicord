import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pencilSvg, trashSvg } from "../utils";
import { Avatar } from "@material-ui/core";
import "../Application/app.css";
import { deleteChannelMessageById } from "../../store/servers";
export default function Message({ message }) {
  const user = useSelector((state) => state.session.user);
  const [showDelete, setShowDelete] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isEditting, setIsEditting] = useState(false);
  const [editMessageContent, setEditMessageContent] = useState("");

  const dispatch = useDispatch();

  const deleteMessageById = () => {
    return;
  };

  const updateMessageById = () => {
    return;
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you'd like to delete your message "${message.body}"?`
      )
    ) {
      dispatch(deleteChannelMessageById(message.id));
    }
    setShowDelete(false);
  };
  const handleEdit = async (e) => {
    e.preventDefault();
    const data = await dispatch(
      updateMessageById(message.id, editMessageContent)
    );
    if (data) {
      setErrors(data);
    } else {
      setIsEditting(false);
    }
    setShowDelete(false);
  };
  const handleKeyDown = (e) => {
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight + 5}px`;
  };
  return (
    <div
      onMouseLeave={() => setShowDelete(false)}
      onMouseOver={() => setShowDelete(true)}
      className="message-container"
    >
      <Avatar src={message.user.avatar_url} />
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
            <form
              onSubmit={!editMessageContent.length ? undefined : handleEdit}
            >
              {errors.length > 0 && (
                <div>
                  {errors.map((error, ind) => (
                    <div key={ind}>{error}</div>
                  ))}
                </div>
              )}
              <textarea
                required
                // autoFocus
                onFocus={handleKeyDown}
                onKeyDown={handleKeyDown}
                defaultValue={message.body}
                onBlur={(e) => {
                  setEditMessageContent(e.target.value);
                }}
              />
              <button onMouseDown={(e) => e.stopPropagation()} type="submit">
                update
              </button>
              <button
                onMouseDown={(e) => {
                  setIsEditting(false);
                  setShowDelete(false);
                }}
                type="none"
              >
                cancel
              </button>
            </form>
          </>
        ) : (
          <>
            <span>{message.body}</span>
            {message.user.id == user.id && showDelete ? (
              <>
                <span
                  style={{ display: "inline" }}
                  onMouseDown={handleDelete}
                  className="pointer"
                >
                  {trashSvg()}
                </span>
                <span
                  onMouseDown={() => setIsEditting(true)}
                  className="pointer"
                >
                  {pencilSvg()}
                </span>
              </>
            ) : (
              <></>
            )}
          </>
        )}
      </div>
    </div>
  );
}
