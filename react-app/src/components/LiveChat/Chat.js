import React, { useRef } from "react";
import { useEffect, useState } from "react";
import Message from "./Message";
import "../Application/app.css";
import { useSelector } from "react-redux";
import { hashSvg } from "../utils";
function Chat({ chat }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.session.user);
  const socket = useSelector((state) => state.session.socket);
  const servers = useSelector((state) => state.servers.servers);
  const activeServer = useSelector((state) => state.servers.activeServer);
  const isMounted = useRef(false);
  const messagesRef = useRef();

  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);

  useEffect(() => {
    if (messages.length)
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages]);

  const fetchMessages = async () => {
    const res = await fetch(`/api/${chat.chat_type}/${chat.chat_id}/messages`);
    if (res.ok && isMounted.current) {
      const data = await res.json();
      const msgs = data.messages.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
      setMessages(msgs);
    }
  };

  useEffect(() => {
    if (!socket || !activeServer) return;
    socket.emit("join", { chat_type: chat.chat_type, chat_id: chat.chat_id });
    fetchMessages();
    return () => {
      socket.emit("leave", {
        chat_type: chat.chat_type,
        chat_id: chat.chat_id,
      });
    };
  }, [chat]);

  useEffect(() => {
    socket?.on("message", (msgs) => {
      if (isMounted.current) setMessages(msgs);
    });
    socket?.on("refresh_messages", (msgs) => {
      if (isMounted.current) setMessages(msgs);
    });
  }, []);

  const onMsgChange = (e) => {
    setMessage(e.target.value);
  };

  const onKey = (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
    }
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
    if (e.key != "Enter") {
      return;
    }
    if (!socket) {
      return;
    }
    if (message.length && message.length < 255) {
      socket.emit("message", {
        message: message,
        chat_type: chat.chat_type,
        chat_id: chat.chat_id,
      });
      setMessage("");
    } else {
      alert("Message invalid");
    }
  };
  return (
    <div className="chat-container">
      <div className="white box-header">
        <span style={{ paddingRight: "8px" }} className="hash">
          {hashSvg()}
        </span>{" "}
        {chat.name}
      </div>
      {/* <div style={{ display: "flex" }}> */}
      <div className="all-messages-container" ref={messagesRef}>
        {messages.length > 0 &&
          messages.map((msg) => (
            <Message
              chat={chat}
              reloadMessages={fetchMessages}
              message={msg}
              key={msg.id}
            />
          ))}

        {/* <div style={{ marGintop: "40px" }}>MEMBERS DIV</div> */}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingBottom: "1rem",
          // paddingTop: "1rem",
        }}
      >
        <textarea
          style={{
            resize: "none",
            paddingTop: "10px",
            paddingLeft: ".5rem",
            width: "100%",
            margin: "16px 1rem 0 1rem",
            borderRadius: "8px",
            border: "0",
            height: "2rem",
            backgroundColor: "var(--channeltextarea-background)",
            color: "var(--text-normal",
          }}
          onBlur={(e) => (e.target.style.height = "2rem")}
          maxLength={255}
          name="message"
          placeholder={`Message #${chat.name}`}
          value={message}
          onChange={(e) => onMsgChange(e)}
          onKeyDown={onKey}
        />
        {/* </div> */}
      </div>
    </div>
  );
}

export default Chat;
