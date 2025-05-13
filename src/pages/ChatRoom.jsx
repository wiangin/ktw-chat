import { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import Navbar from "../components/Navbar";
import MessageInput from "../components/MessageInput";
import {
  Box,
  Container,
  Avatar,
  Paper,
  useMediaQuery,
  useTheme,
  Chip,
  Grid,
} from "@mui/material";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import DisplayMessage from "../components/DisplayMessage";
import CustomTooltip from "../CustomComponent/CustomTooltip";

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
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100vh",
      }}
      disableGutters
      maxWidth={"xl"}
    >
      <Box>
        <Navbar />
        <Grid container paddingX={2}>
          <Grid item size={isTablet ? 4 : 12}>
            <Container sx={{ marginTop: "25px" }}>
              <Chip label={"Who's in the room"} sx={{ fontSize: "16px" }} />
              <Box
                padding={2}
                display={"flex"}
                flexDirection={isMobile ? "row" : "column"}
                gap={1}
              >
                {isTablet &&
                  loggedInUser
                    .filter((u) => u.user_id !== user.uid)
                    .map((u) => (
                      <Box
                        key={u.user_id}
                        display={"flex"}
                        alignItems={"center"}
                        gap={1}
                        marginBottom={1}
                      >
                        <Avatar />
                        <Chip label={u.email} sx={{ fontSize: "16px" }} />
                      </Box>
                    ))}

                {isMobile &&
                  loggedInUser
                    .filter((u) => u.user_id !== user.uid)
                    .map((u) => (
                      <CustomTooltip title={u.email} key={u.user_id} arrow>
                        <Avatar />
                      </CustomTooltip>
                    ))}
              </Box>
            </Container>
          </Grid>

          <Grid item size={isTablet ? 8 : 12}>
            <Container sx={{ marginTop: "25px" }}>
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
          </Grid>
        </Grid>
      </Box>

      <MessageInput user={user} />
    </Container>
  );
};

export default ChatRoom;
