import styles from "../styles/chat.module.css";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

let socket;

const Chat = () => {
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState("");
  const [currentuser,setcurrent]= useState("");
  const [allMessages, setAllMessages] = useState([]);

  useEffect(() => {
    socketInitializer();
  }, []);

  async function socketInitializer() {
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      if (socket.connected) {
        socket.on("receive-message", (data) => {
          setAllMessages((prev) => [...prev, data]);
        });
       
      }
      setUser(socket.id);
      setcurrent(socket.id);
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (message != "" && username != "") {
      // console.log("emitted");
      socket.emit("send-message", {
        username,
        message,
        user,
      });
      setMessage("");
    } else {
      alert("Please enter a valid username and message");
    }
  }

  return (
    <>
      <div className={styles.full}>
        <div className={styles.inner}>
          <input
            className={styles.uname}
            placeholder="Enter an Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className={styles.logo}><img className={styles.logo1} src="./AT-logo.png" alt="" /></div>
          <div className={styles.container}>
            {allMessages.map(({ username, message, user }, index) => (
              <div
                className={user === currentuser ? styles.text1 : styles.text}
                key={index}
              >
                {username} : {message}
              </div>
            ))}
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              className={styles.input}
              name="message"
              placeholder=" Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              autoComplete={"off"}
            />
            <button className={styles.btn} onClick={handleSubmit}>
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Chat;
