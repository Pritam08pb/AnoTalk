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
  const [allpMessages, setAllpMessages] = useState([]);
  const [reqs, setreqs] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [flag, setflag] = useState(false);
  const [pmessage, setpmessage] = useState("");
  const [id, setid] = useState("");

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
        socket.on("receive-personal", (pdata) => {
          setAllpMessages((previous) => [...previous, pdata]);
          setreqs((previous) => {
            const userExists = previous.some((req) => req.user === pdata.user); // userexists in the array

            if (!userExists) {
              return [...previous, pdata];
            } else {
              return previous;
            }
          });
        });
        socket.on("userCount", (count) => {
          setUserCount(count);
        });
      }
      setUser(socket.id);
      setcurrent(socket.id);
    });
  }
  function handlepsubmit(e) {
    e.preventDefault();
    if (pmessage !== "" && username !== "") {
      socket.emit("send-personal", {
        username,
        pmessage,
        user,
        id,
      });
      setAllpMessages((previous) => [
        ...previous,
        {
          username,
          pmessage,
          user,
          id,
        },
      ]);
      setpmessage("");
    } else {
      alert("Please enter a valid username and message");
    }
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
  function flaghandle(index) {
    setflag(true);
    setid(allMessages[index].user);
  }
  function flaghandle2(index) {
    setflag(true);
    setid(reqs[index].user);
  }
  const handleDelete = (index) => {
    // Create a copy of the reqs array
    const updatedReqs = [...reqs];
    // Remove the item at the specified index
    updatedReqs.splice(index, 1);
    // Update the state with the new array
    setreqs(updatedReqs);
  };

  // ..........................................Client-side.........................................................................................................

  return (
    <>
      <div className={styles.full}>
        <div className={styles.inside}>

        
        <a className={styles.l} href="https://pritam08.000webhostapp.com/">
          Made by Pritam{" "}
        </a>

        {flag && (
          <div className={styles.inner2}>
          

          <div className={styles.parentcontainer}>
  
            <div className={styles.parentreq}>
            <div
                className={styles.uname}
                onClick={(e) => setflag(false)}
                style={{ cursor: "pointer", textAlign: "center" }}
              >
                Go back
              </div>
<div className={styles.parentlogo}>
              <div className={styles.logocont}>
                <div className={styles.logo}>
                  <img className={styles.logo1} src="./AT-logo.png" alt="" />
                </div>
                <div className={styles.cont1}>
                  <div className={styles.p}> Online</div>
                  <div className={styles.q}>{Math.floor(userCount / 2)}</div>
                </div>
              </div>
              <h2
                  style={{
                    fontFamily: " monospace",
                    height: "10px",
                    fontSize: "19px",
                  }}
                >
                  Requsts
                </h2>
                </div>


              <div className={styles.req}>
                
                {reqs.map(({ username, pmessage, user, id }, index) => (
                  <div key={index} className={styles.reqid}>
                    <div  className={styles.requser}
                      style={{ cursor: "pointer", textAlign: "center" }}
                      onClick={() => {
                        flaghandle2(index);
                      }}
                    >
                      {username.slice(0, 12)}
                    </div>

                    <div
                      className={styles.x}
                      onClick={() => {
                        handleDelete(index);
                      }}
                    >
                      X
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div div className={styles.containerinput}>
            <div className={styles.container2}>
            {allpMessages
                  .filter((msg) => msg.user === id || msg.id === id)
                  .map(({ username, pmessage, user, id }, index) => (
                    <div
                      className={
                        user === currentuser ? styles.text1 : styles.text
                      }
                      key={index}
                    >
                      {username}
                      <div className={styles.msg}>{pmessage}</div>
                    </div>
                  ))}
            </div>
            <form className={styles.form} onSubmit={handlepsubmit}>
            <input
                  className={styles.input}
                  name="message"
                  placeholder=" Enter your message"
                  value={pmessage}
                  onChange={(e) => setpmessage(e.target.value)}
                  autoComplete={"off"}
                />
            <button className={styles.btn} onClick={handlepsubmit}>
              Send
            </button>
          </form>
            </div>
          </div>
          
        </div>
        )}

        {/* ............................................................................ */}

        <div className={styles.inner}>
          

          <div className={styles.parentcontainer}>
  
            <div className={styles.parentreq}>
            <input
            className={styles.uname}
            placeholder="Enter an Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
<div className={styles.parentlogo}>
              <div className={styles.logocont}>
                <div className={styles.logo}>
                  <img className={styles.logo1} src="./AT-logo.png" alt="" />
                </div>
                <div className={styles.cont1}>
                  <div className={styles.p}> Online</div>
                  <div className={styles.q}>{Math.floor(userCount / 2)}</div>
                </div>
              </div>
              <h2
                  style={{
                    fontFamily: " monospace",
                    height: "10px",
                    fontSize: "19px",
                  }}
                >
                  Requsts
                </h2>
                </div>


              <div className={styles.req}>
                
                {reqs.map(({ username, pmessage, user, id }, index) => (
                  <div key={index} className={styles.reqid}>
                    <div className={styles.requser}
                      style={{ cursor: "pointer", textAlign: "center" }}
                      onClick={() => {
                        flaghandle2(index);
                      }}
                    >
                      {username.slice(0, 12)}
                    </div>

                    <div
                      className={styles.x}
                      onClick={() => {
                        handleDelete(index);
                      }}
                    >
                      X
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div div className={styles.containerinput}>
            <div className={styles.container }>
              {allMessages.map(({ username, message, user }, index) => (
                <div
                  className={user === currentuser ? styles.text1 : styles.text}
                  onClick={
                    user !== currentuser ? () => flaghandle(index) : undefined
                  }
                  key={index}
                >
                  {username}{" "}
                  <div
                    className={user === currentuser ? styles.msg : styles.msg1}
                  >
                    {message}
                  </div>
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
          
        </div>
        

        </div>
        
      </div>
      
    </>
  );
};

export default Chat;
