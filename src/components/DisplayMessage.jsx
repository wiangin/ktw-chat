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
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useState, useRef } from "react";
import FaceIcon from "@mui/icons-material/Face";
import colors from "../colors";
import EmojiPicker from "emoji-picker-react";

const DisplayMessage = ({ message, isOwnMessage }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [newMessage, setNewMessage] = useState(message.text);
  const [openTextEdit, setOpenTextEdit] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const sendButtonRef = useRef(null);

  const editedText = () => {
    return (
      <Typography marginLeft={0.5} variant={"caption"} color={"grey"}>
        Edited
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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const messageRef = doc(db, "messages", message.id);
    await updateDoc(messageRef, {
      text: newMessage,
      edit: true,
    });
    console.log("message has been updated");

    setNewMessage("");
    setOpenTextEdit(false);
  };

  const handleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

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
          <Chip
            label={message.text}
            onClick={handleClick}
            sx={{ fontSize: "16px" }}
            color={"secondary"}
          />

          {message.edit && <>{editedText()}</>}
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
                <DeleteIcon sx={{ marginRight: "5px" }} />
                <Typography variant={"body2"}>Delete message</Typography>
              </Box>
              <Box
                onClick={handleTextEdit}
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
          <Box display={"flex"} alignItems={"center"} gap={1}>
            <Chip label={message.displayName} avatar={<FaceIcon />} />
          </Box>
          <Box display={"flex"} flexDirection={"column"}>
            <Chip label={message.text} sx={{ fontSize: "16px" }} />
            {message.edit && <>{editedText()}</>}
          </Box>
        </Box>
      )}

      {openTextEdit && (
        <Dialog open={openTextEdit} onClose={() => setOpenTextEdit(false)}>
          <Box margin={6}>
            <FormControl
              component={"form"}
              onSubmit={handleSendMessage}
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
                onClick={handleSendMessage}
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
    </Box>
  );
};

export default DisplayMessage;
