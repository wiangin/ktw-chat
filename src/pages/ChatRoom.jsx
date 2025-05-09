import React, { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import Navbar from "../components/Navbar";
import MessageInput from "../components/MessageInput";
import {
  Card,
  Box,
  Container,
  Avatar,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import DisplayMessage from "../components/DisplayMessage";
import { Margin } from "@mui/icons-material";

const ChatRoom = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const dummy = useRef();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.up("sm"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
      <Box sx={{display: "flex", flexDirection: isTablet ? "row" : "column"}}>
        <Container>
          <Box sx={{display: "flex", flexDirection: isMobile ? "row" : "column", margin: "20px"}}>
            <Avatar />
            <Avatar />
            <Avatar />
            <Avatar />
          </Box>
        </Container>
        <Container component={"section"} maxWidth={"sm"}>
          <Paper
            elevation={3}
            sx={{
              overflowY: "scroll",
              padding: "10px",
              marginBottom: "10px"
            }}
          >
            {messages.map((msg) => (
              <DisplayMessage
                key={msg.id}
                message={msg}
                isOwnMessage={user.uid === msg.user_id}
              />
            ))}
            <Box ref={dummy} />
          </Paper>
        </Container>
      </Box>

      <MessageInput user={user} />
    </>
  );
};

export default ChatRoom;
