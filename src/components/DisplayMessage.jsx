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
import { useState, useRef, use, useEffect } from "react";
import FaceIcon from "@mui/icons-material/Face";
import EditIcon from "@mui/icons-material/Edit";
import ReplyIcon from "@mui/icons-material/Reply";
import colors from "../colors";
import EmojiPicker from "emoji-picker-react";

const DisplayMessage = ({ message, isOwnMessage, user }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [newMessage, setNewMessage] = useState(message.text);
  const [openTextEdit, setOpenTextEdit] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const sendButtonRef = useRef(null);
  const [openReplyText, setOpenReplyText] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [repliesMessages, setRepliesMessage] = useState([]);

  const editedText = () => {
    return (
      <Typography marginLeft={0.5} variant={"caption"} color={"grey"}>
        Edited
      </Typography>
    );
  };
  const repliesNotice = () => {
    return (
      <Typography marginLeft={0.5} variant={"caption"} color={"grey"}>
        Replied
      </Typography>
    );
  };

  const handleDeleteMessage = async () => {
    try {
      const messageRef = doc(db, "messages", message.id);
      await deleteDoc(messageRef);
    } catch (error) {
      console.log("Error deleting message: ", error);
    }
  };

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenTextEdit(false);
  };

  const handleTextEdit = (e) => {
    setOpenTextEdit(true);
    setAnchorEl(null);
  };

  const handleNewMessageOnchange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSendEditedMessage = async (e) => {
    e.preventDefault();
    const messageRef = doc(db, "messages", message.id);
    await updateDoc(messageRef, {
      text: newMessage,
      edit: true,
    });
    setNewMessage(newMessage);
    setOpenTextEdit(false);
  };

  const handleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleReply = () => {
    setOpenReplyText(true);
    setAnchorEl(null);
  };

  const handleReplyOnchange = (e) => {
    setReplyText(e.target.value);
  };

  const handleSendReplyMessage = async (e) => {
    // send reply
    e.preventDefault();
    const messageRef = doc(db, "messages", message.id);
    await updateDoc(messageRef, {
      reply: true,
    });
    const repliesRef = collection(db, "messages", message.id, "replies");
    await addDoc(repliesRef, {
      text: replyText,
      senderId: user.uid,
      senderEmail: user.email,
      timestamp: serverTimestamp(),
    });
    setReplyText("");
  };

  useEffect(() => {
    const repliesMsg = collection(db, "messages", message.id, "replies");
    const q = query(repliesMsg, orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const replies = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRepliesMessage(replies);
    });
    return unsubscribe;
  }, []);

  console.log(repliesMessages);

  return (
    <Box sx={{ margin: "10px" }}>
      {isOwnMessage ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            width: "100%",
            marginTop: "20px",
          }}
        >
          <Box
            display={"flex"}
            flexDirection={"column"}
            sx={{ maxWidth: "100%" }}
            alignItems={"end"}
          >
            {message.edit && <>{editedText()}</>}
            <Chip
              label={message.text}
              onClick={handleClick}
              sx={{
                fontSize: "16px",
                paddingY: "5px",
                height: "auto",
                "& .MuiChip-label": { display: "block", whiteSpace: "normal" },
              }}
              color={"secondary"}
            />

            {message.reply && (
              <>
                {repliesNotice()}
                {repliesMessages.map((doc, i) => (
                  <Chip key={i} label={doc.text} />
                ))}
              </>
            )}
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
                sx={{
                  "&:hover": {
                    backgroundColor: "lightGrey",
                  },
                  padding: "10px",
                  width: "100%",
                }}
              >
                <DeleteIcon sx={{ marginRight: "8px" }} />
                <Typography variant={"body2"}>Delete message</Typography>
              </Box>
              <Box
                onClick={handleTextEdit}
                display={"flex"}
                alignItems={"center"}
                marginTop={0.5}
                sx={{
                  "&:hover": {
                    backgroundColor: "lightGrey",
                  },
                  padding: "10px",
                  width: "100%",
                }}
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
          gap={"10px"}
        >
          <Box display={"flex"} flexDirection={"column"} alignItems={"start"}>
            {message.edit && <>{editedText()}</>}
            <Chip label={message.displayName} avatar={<FaceIcon />} />
          </Box>

          <Box
            display={"flex"}
            flexDirection={"column"}
            sx={{ maxWidth: "100%" }}
          >
            <Chip
              label={message.text}
              sx={{
                fontSize: "16px",
                paddingY: "5px",
                height: "auto",
                "& .MuiChip-label": { display: "block", whiteSpace: "normal" },
              }}
              onClick={handleClick}
            />
            {message.reply && (
              <>
                {repliesNotice()}
                {repliesMessages.map((doc, i) => (
                  <>
                    <Chip label={doc.senderEmail} avatar={<FaceIcon />} />

                    <Chip key={i} label={doc.text} />
                  </>
                ))}
              </>
            )}
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
                onClick={handleReply}
                display={"flex"}
                alignItems={"center"}
                sx={{
                  "&:hover": {
                    backgroundColor: "lightGrey",
                  },
                  padding: "10px",
                  width: "100%",
                }}
              >
                <ReplyIcon sx={{ marginRight: "8px" }} />
                <Typography variant={"body2"}>Reply</Typography>
              </Box>
            </MenuItem>
          </Menu>
        </Box>
      )}

      {openTextEdit && (
        <Dialog open={openTextEdit} onClose={() => setOpenTextEdit(false)}>
          <Box margin={6}>
            <FormControl
              component={"form"}
              onSubmit={handleSendEditedMessage}
              ref={sendButtonRef}
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

      {/* Dialog för att visa meddelandet som man vill svara på */}
      {openReplyText && (
        <Dialog open={openReplyText} onClose={() => setOpenReplyText(false)}>
          <Box margin={3}>
            <Chip
              label={message.text}
              sx={{
                fontSize: "16px",
                paddingY: "5px",
                height: "auto",
                "& .MuiChip-label": { display: "block", whiteSpace: "normal" },
              }}
            />
          </Box>
          <Box margin={6}>
            <FormControl
              component={"form"}
              onSubmit={handleSendReplyMessage}
              ref={sendButtonRef}
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
