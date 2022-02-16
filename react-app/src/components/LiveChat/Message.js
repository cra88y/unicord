import React from "react";

function Message({ msg }) {
  return (
    <div>
      <strong>{msg.user.username}: </strong>
      <span>{msg.body}</span>
    </div>
  );
}

export default Message;
