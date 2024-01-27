import styles from "../styles/chat.module.css";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";


let socket;

const Chat = () => {
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState("");
  const [currentuser, setcurrent] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [extra, setextra] = useState(0);

  useEffect(() => {
    console.log("nj");
    socketInitializer();
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {}, [userCount]);

  async function socketInitializer() {
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      console.log(socket.connected);
      if (socket.connected) {
        socket.on("receive-message", (data) => {
          setAllMessages((prev) => [...prev, data]);
        });
        socket.on("userCount", (count) => {
          setUserCount(count);
        });
      }
      setUser(socket.id);
      setcurrent(socket.id);
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (message !== "" && username !== "") {
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

// ...................................................................................................................................................
  


  return (
    <>
      <div className={styles.full}>
        <a className={styles.l} href="https://pritam08.000webhostapp.com/">Made by Pritam </a>
        <div className={styles.inner}>
          <input
            className={styles.uname}
            placeholder="Enter an Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <div className={styles.logocont}>
            <div className={styles.logo}>
              <img className={styles.logo1} src="./AT-logo.png" alt="" />
            </div>
            <div className={styles.cont1}>
              <div className={styles.p}> Online</div>
              <div className={styles.q}>{Math.floor(userCount / 2)}</div>
            </div>
          </div>

          <div className={styles.container}>
            {allMessages.map(({ username, message, user }, index) => (
              <div
                className={user === currentuser ? styles.text1 : styles.text}
                key={index}
              >
                {username}<div className={styles.msg}>{message}</div> 
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
