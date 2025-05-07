import React, { useEffect, useRef, useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import useUserAuth from "../customHook/useUserAuth";
import { useNavigate, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import MessageInput from "../components/MessageInput";
import { Card, Box, Paper, Container } from "@mui/material";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import DisplayMessage from "../components/DisplayMessage";

const ChatRoom = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const dummy = useRef();

  useEffect(() => {
    const queryDb = query(collection(db, "messages"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(queryDb, (onSnapshot) => {
      const msgs = onSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
      dummy.current?.scrollIntoView({ behavior: "smooth" });
    });

    return unsubscribe;

  }, []);

  return (
    <>
      <Navbar />
      {/*Här kommer vara en container som  visar meddelande */}
      <Container component={"main"} maxWidth={"xl"}>
          <Card sx={{ height: "80vh", padding: "10px", marginBlock: "20px", overflowY: "scroll"}}>
            {messages.map((msg) => (
              <DisplayMessage key={msg.id} message={msg} isOwnMessage={ user.uid === msg.user_id } />
            ))}
            <Box ref={dummy}/>
          </Card>
     
      </Container>

      <MessageInput user={user} />
    </>
  );
};

export default ChatRoom;
