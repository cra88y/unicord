import React, { useRef } from "react";
import { useEffect, useState } from "react";

import Message from "./Message";
import "../Application/app.css";
import { useSelector } from "react-redux";
import { hashSvg } from "../utils";
function Chat({ chat }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const socket = useSelector((state) => state.session.socket);
  const servers = useSelector((state) => state.servers.servers);
  const activeServer = useSelector((state) => state.servers.activeServer);
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);
  useEffect(() => {
    if (!socket || !activeServer) return;
    // setMessages([]);
    socket.emit("join", { chat_type: chat.chat_type, chat_id: chat.chat_id });
    const fetchMessages = async () => {
      const res = await fetch(
        `/api/${chat.chat_type}/${chat.chat_id}/messages`
      );
      if (res.ok && isMounted.current) {
        const data = await res.json();
        setMessages([...data.messages]);
      }
    };
    fetchMessages();
    return () => {
      socket.emit("leave", {
        chat_type: chat.chat_type,
        chat_id: chat.chat_id,
      });
    };
  }, [chat, servers]);

  useEffect(() => {
    socket?.on("message", (msg) => {
      setMessages([...messages, msg]);
    });
  }, [messages]);

  const onMsgChange = (e) => {
    setMessage(e.target.value);
  };

  const onKey = (e) => {
    if (e.key != "Enter") return;
    if (!socket) {
      console.log("no socket");
      return;
    }
    if (message.length) {
      socket.emit("message", {
        message: message,
        chat_type: chat.chat_type,
        chat_id: chat.chat_id,
      });
      setMessage("");
    } else {
      alert("Can't send empty message.");
    }
  };
  return (
    <div className="chat-container">
      <div className="white box-header">
        <span style={{ paddingRight: "8px", width: "24px" }} className="hash">
          {hashSvg()}
        </span>{" "}
        {chat.name}
      </div>
      {/* <div style={{ display: "flex" }}> */}
      <div>
        {messages.length > 0 &&
          messages.map((msg) => <Message message={msg} key={msg.id} />)}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingBottom: "1rem",
            // paddingTop: "1rem",
          }}
        >
          <input
            style={{
              paddingLeft: ".5rem",
              width: "100%",
              margin: "0 1rem",
              borderRadius: "8px",
              border: "0",
              height: "2rem",
              backgroundColor: "var(--channeltextarea-background)",
              color: "var(--text-normal",
            }}
            name="message"
            placeholder={`Message #${chat.name}`}
            value={message}
            onChange={(e) => onMsgChange(e)}
            onKeyDown={onKey}
          />
          {/* </div> */}
        </div>
        {/* <div style={{ marginTop: "40px" }}>MEMBERS DIV</div> */}
      </div>
    </div>
  );
}

export default Chat;
