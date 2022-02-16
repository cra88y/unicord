import React from "react";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import Message from "./Message";
import "../Application/app.css";
function Chat({ chat }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (socket) socket.close();
    setSocket(io.connect("ws://localhost:5000", { withCredentials: true }));
    setMessages([]);
  }, [chat]);

  useEffect(() => {
    if (!socket) return;
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
  }, [socket]);

  useEffect(() => {
    getMessages();
  }, [messages.length]);

  const getMessages = () => {
    if (!socket) return;
    socket.on("message", (msg) => {
      setMessages([...messages, msg]);
    });
  };

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
        messages.map((msg) => <Message msg={msg} key={msg.id} />)}
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
