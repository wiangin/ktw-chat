import { useEffect, useRef, useState } from "react";
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
  Tooltip,
} from "@mui/material";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  getDocs,
  doc,
} from "firebase/firestore";
import DisplayMessage from "../components/DisplayMessage";

const ChatRoom = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const dummy = useRef();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.up("sm"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loggedInUser, setLoggedInUsers] = useState([]);

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

  useEffect(() => {
    const queryDb = query(collection(db, "users"));
    const unsubscribe = onSnapshot(queryDb, (onSnapshot) => {
      const inloggedUser = onSnapshot.docs.map((user) => ({
        id: user.id,
        ...user.data(),
      }));
      setLoggedInUsers(inloggedUser);
    });
    return unsubscribe;
  }, []);

  return (
    <>
      <Navbar />
      <Box sx={{ display: "flex", flexDirection: isTablet ? "row" : "column" }}>
        <Container>
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "row" : "column",
              margin: "20px",
            }}
          >
            {loggedInUser
              .filter((u) => u.user_id !== user.uid)
              .map((u) => (
                <Tooltip title={u.email} key={u.user_id}>
                  <Avatar />
                </Tooltip>
              ))}
          </Box>
        </Container>
        <Container component={"section"} maxWidth={"sm"}>
          <Paper
            elevation={3}
            sx={{
              overflowY: "scroll",
              padding: "10px",
              marginBottom: "10px",
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
