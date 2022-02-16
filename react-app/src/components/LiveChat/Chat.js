import React from "react";
import { useEffect, useState } from "react";

import Message from "./Message";
import "../Application/app.css";
import { useSelector } from "react-redux";
function Chat({ chat }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const socket = useSelector((state) => state.session.socket);

  useEffect(() => {
    if (!socket) return;
    setMessages([]);
    socket.emit("join", { chat_type: chat.chat_type, chat_id: chat.chat_id });
    const fetchMessages = async () => {
      const res = await fetch(
        `http://localhost:5000/api/${chat.chat_type}/${chat.chat_id}/messages`
      );
      if (res.ok) {
        const data = await res.json();
        console.log(data);
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
  }, [chat]);

  useEffect(() => {
    socket.on("message", (msg) => {
      setMessages([...messages, msg]);
    });
  }, [messages.length]);

  const onMsgChange = (e) => {
    setMessage(e.target.value);
  };

  const onClick = () => {
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
      <h1>{chat.name}</h1>
      {messages.length > 0 &&
        messages.map((msg) => <Message message={msg} key={msg.id} />)}
      <input
        name="message"
        value={message}
        onChange={(e) => onMsgChange(e)}
      ></input>
      <button onClick={onClick}>Send</button>
    </div>
  );
}

export default Chat;
