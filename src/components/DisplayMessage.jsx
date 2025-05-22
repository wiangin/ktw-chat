import {
  Box,
  Typography,
  Menu,
  MenuItem,
  Chip,
  Dialog,
  TextField,
  Button,
  FormControl,
  Popover,
  useTheme,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  deleteDoc,
  doc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { useState, useRef, useEffect } from "react";
import FaceIcon from "@mui/icons-material/Face";
import EditIcon from "@mui/icons-material/Edit";
import ReplyIcon from "@mui/icons-material/Reply";
import colors from "../utility/colors";
import EmojiPicker from "emoji-picker-react";
import DisplayReplyMessages from "./DisplayReplyMessages";
import { multiLineChipStyle } from "../utility/multiLinesChipStyle";
import { lightGreyBgHover } from "../utility/lightGreyBgHover";
import DisplayEditedNotice from "./DisplayEditedNotice";
import DisplayRepliedNotice from "./DisplayRepliedNotice";

const DisplayMessage = ({ message, isOwnMessage, user }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [newMessage, setNewMessage] = useState(message.text);
  const [toOpenTextEditForm, setToOpenTextEditForm] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const sendButtonRef = useRef(null);
  const [ToOpenReplyTextForm, setToOpenReplyTextForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [repliesMessages, setRepliesMessage] = useState([]);
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.up("sm"));
  const [newDate, setNewDate] = useState("");

  const handleDeleteMessage = async () => {
    try {
      const messageRef = doc(db, "messages", message.id);
      await deleteDoc(messageRef);
    } catch (error) {
      console.log("Error deleting message: ", error);
    }
  };

  // Här måste det vara en bättre namn på funktionen
  const handleOnClickOpenMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setToOpenTextEditForm(false);
  };

  const handleTextEdit = () => {
    if(newMessage === "") {
      setNewMessage(message.text);
    }
    setToOpenTextEditForm(true);
    setAnchorEl(null);
  };

  const handleNewMessageOnchange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSendEditedMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      const messageRef = doc(db, "messages", message.id);
      await updateDoc(messageRef, {
        text: newMessage,
        edit: true,
      });
      setNewMessage(newMessage);
      setToOpenTextEditForm(false);
    } catch (error) {
      console.log("Error updating message: ", error);
    }
  };

  const handleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleReply = () => {
    setToOpenReplyTextForm(true);
    setAnchorEl(null);
  };

  const handleReplyOnchange = (e) => {
    setReplyText(e.target.value);
  };

  const handleSendReplyMessage = async (e) => {
    e.preventDefault();
    const messageRef = doc(db, "messages", message.id);
    await updateDoc(messageRef, {
      reply: true,
    });
    const replyRef = collection(db, "messages", message.id, "replies");
    await addDoc(replyRef, {
      text: replyText,
      senderId: user.uid,
      senderEmail: user.email,
      createdAt: serverTimestamp(),
      edit: false,
    });
    setReplyText("");
    setToOpenReplyTextForm(false);
  };

  useEffect(() => {
    const replyMsgRef = collection(db, "messages", message.id, "replies");
    const queryReplyMsg = query(replyMsgRef, orderBy("createdAt"));
    const unsubscribe = onSnapshot(queryReplyMsg, (snapshot) => {
      const replies = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRepliesMessage(replies);
    });
    return unsubscribe;
  }, []);

  const loopingAndDisplayReplyMessages = () => {
    const msg = repliesMessages.map((doc, i) => {
      return (
        <DisplayReplyMessages
          key={i}
          replyBoolean={message.reply}
          repliesMessages={doc}
          isOwnMessage={user.uid === doc.senderId}
          messageId={message}
        />
      );
    });
    return msg;
  };

  // Datum och tid formatering
  useEffect(() => {
    if (message.createdAt) {
      const { seconds } = message.createdAt;
      const date = new Date(seconds * 1000);
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      };
      const formattedDate = date.toLocaleDateString("sv-SE", options);
      setNewDate(formattedDate);
    } else {
      setNewDate("Unknown date");
    }
  }, [message]);

  return (
    <Box sx={{ margin: "10px" }}>
      {isOwnMessage ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            marginTop: "5px",
          }}
        >
          <Box
            display={"flex"}
            flexDirection={"column"}
            sx={{ maxWidth: "70%" }}
            alignItems={"end"}
          >
            {message.edit && <DisplayEditedNotice />}
            <Tooltip title={newDate} placement={"left"}>
              <Chip
                label={message.text}
                onClick={handleOnClickOpenMenu}
                sx={multiLineChipStyle}
                color={"secondary"}
              />
            </Tooltip>

            {repliesMessages.length > 0 && (
              <>
                {message.reply && (
                  <Box marginRight={0.5}>{<DisplayRepliedNotice />}</Box>
                )}
              </>
            )}

            {loopingAndDisplayReplyMessages()}
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            sx={{ marginTop: "8px" }}
          >
            <MenuItem
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                onClick={handleDeleteMessage}
                display={"flex"}
                alignItems={"center"}
                sx={lightGreyBgHover}
              >
                <DeleteIcon sx={{ marginRight: "8px" }} />
                <Typography variant={"body2"}>Delete message</Typography>
              </Box>

              {/* kankse kan skapa en komonent för denna? */}
              <Box
                onClick={handleTextEdit}
                display={"flex"}
                alignItems={"center"}
                marginTop={0.5}
                sx={lightGreyBgHover}
                textAlign={"center"}
              >
                <EditIcon sx={{ marginRight: "8px" }} />
                <Typography variant={"body2"}>Edit</Typography>
              </Box>
            </MenuItem>
          </Menu>
        </Box>
      ) : (
        <Box
          marginTop={3}
          display={"flex"}
          flexDirection={"column"}
          alignItems={"start"}
        >
          <Box display={"flex"} flexDirection={"column"} alignItems={"start"}>
            {message.edit && <DisplayEditedNotice />}

            <Chip label={message.displayName} avatar={<FaceIcon />} />
            <Box sx={{ maxWidth: "70%" }} marginLeft={1.5}>
              <Tooltip title={newDate} placement={"right"}>
                <Chip
                  label={message.text}
                  sx={multiLineChipStyle}
                  onClick={handleOnClickOpenMenu}
                />
              </Tooltip>
            </Box>
          </Box>

          {repliesMessages.length > 0 && (
            <>
              {message.reply && (
                <Box marginRight={0.5}>{<DisplayRepliedNotice />}</Box>
              )}
            </>
          )}

          {loopingAndDisplayReplyMessages()}

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            sx={{ marginTop: "8px" }}
          >
            <MenuItem
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                onClick={handleReply}
                display={"flex"}
                alignItems={"center"}
                sx={lightGreyBgHover}
              >
                <ReplyIcon sx={{ marginRight: "8px" }} />
                <Typography variant={"body2"}>Reply</Typography>
              </Box>
            </MenuItem>
          </Menu>
        </Box>
      )}

      {/* Dialog popup för att redigera sitt meddelande */}
      {toOpenTextEditForm && (
        <Dialog
          open={toOpenTextEditForm}
          onClose={() => setToOpenTextEditForm(false)}
        >
          <Box margin={6} width={isTablet ? "500px" : "300px"}>
            <FormControl
              component={"form"}
              onSubmit={handleSendEditedMessage}
              ref={sendButtonRef}
              sx={{ width: isTablet ? "500px" : "300px" }}
            >
              <TextField
                type={"text"}
                value={newMessage}
                onChange={handleNewMessageOnchange}
                placeholder={"Type a message ..."}
                size="small"
                fullWidth
              />
              <Button onClick={handleEmojiPicker}>😊</Button>
              <Button
                sx={{ marginTop: "5px", bgcolor: colors.bgViolet }}
                onClick={handleSendEditedMessage}
                variant={"contained"}
              >
                Send
              </Button>

              {showEmojiPicker && (
                <Popover
                  open={showEmojiPicker}
                  onClose={() => setShowEmojiPicker(false)}
                >
                  <EmojiPicker
                    onEmojiClick={(emoji) =>
                      setNewMessage(newMessage + emoji.emoji)
                    }
                    height={500}
                    width={300}
                  />
                </Popover>
              )}
            </FormControl>
          </Box>
        </Dialog>
      )}

      {/* Dialog popup för att sparar på meddelande. */}
      {ToOpenReplyTextForm && (
        <Dialog
          open={ToOpenReplyTextForm}
          onClose={() => setToOpenReplyTextForm(false)}
        >
          <Box margin={6}>
            <Chip label={message.text} sx={multiLineChipStyle} />
          </Box>
          <Box margin={6} width={isTablet ? "500px" : "300px"}>
            <FormControl
              component={"form"}
              onSubmit={handleSendReplyMessage}
              ref={sendButtonRef}
              sx={{ width: isTablet ? "500px" : "300px" }}
            >
              <TextField
                type={"text"}
                value={replyText}
                onChange={handleReplyOnchange}
                placeholder={"Type a message ..."}
                size="small"
                fullWidth
              />
              <Button onClick={handleEmojiPicker}>😊</Button>
              <Button
                sx={{ marginTop: "5px", bgcolor: colors.bgViolet }}
                onClick={handleSendReplyMessage}
                variant={"contained"}
              >
                Send
              </Button>

              {showEmojiPicker && (
                <Popover
                  open={showEmojiPicker}
                  onClose={() => setShowEmojiPicker(false)}
                >
                  <EmojiPicker
                    onEmojiClick={(emoji) =>
                      setReplyText(replyText + emoji.emoji)
                    }
                    height={500}
                    width={300}
                  />
                </Popover>
              )}
            </FormControl>
          </Box>
        </Dialog>
      )}
    </Box>
  );
};

export default DisplayMessage;
