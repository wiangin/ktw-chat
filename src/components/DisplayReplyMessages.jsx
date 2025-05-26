import { Box, Chip, Menu, MenuItem, Tooltip } from "@mui/material";
import FaceIcon from "@mui/icons-material/Face";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import {
  multiLineChipStyleWithMarginTop,
  multiLineChipStyle,
} from "../utility/multiLinesChipStyle";
import DisplayEditedNotice from "./DisplayEditedNotice";
import MenuItemContents from "./MenuItemContents";
import TextEditDialog from "./TextEditDialog";

const DisplayReplyMessages = ({
  replyBoolean,
  repliesMessages,
  isOwnMessage,
  messageId,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [newDate, setNewDate] = useState("");
  const [newMessage, setNewMessage] = useState(repliesMessages.text);
  const [toOpenTextEditForm, setToOpenTextEditForm] = useState(false);

  const handleOnClickOpenMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteReply = async () => {
    try {
      const messageRef = doc(
        db,
        "messages",
        messageId?.id,
        "replies",
        repliesMessages.id
      );
      await deleteDoc(messageRef);
      setAnchorEl(null);
    } catch (error) {
      console.log("Error deleting message: ", error);
    }
  };

  const handleTextEdit = () => {
    if (newMessage === "") {
      setNewMessage(repliesMessages.text);
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
      const messageRef = doc(
        db,
        "messages",
        messageId?.id,
        "replies",
        repliesMessages.id
      );
      await updateDoc(messageRef, {
        text: newMessage,
        edit: true,
      });
      setToOpenTextEditForm(false);
      setNewMessage("");
    } catch (error) {
      console.log("Error updating message: ", error);
    }
  };

  useEffect(() => {
    if (repliesMessages.createdAt) {
      const { seconds } = repliesMessages.createdAt;
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
  }, [repliesMessages]);

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      alignItems={isOwnMessage ? "end" : "start"}
    >
      {replyBoolean && (
        <>
          {isOwnMessage ? (
            <Box marginLeft={2} display={"flex"} flexDirection={"column"}>
              <Tooltip title={newDate} placement={"right"}>
                <Chip
                  onClick={handleOnClickOpenMenu}
                  label={repliesMessages.text}
                  color={"secondary"}
                  sx={multiLineChipStyleWithMarginTop}
                />
              </Tooltip>

              {repliesMessages.edit && <DisplayEditedNotice />}
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
                  <MenuItemContents
                    isHandleDeleteMessage={handleDeleteReply}
                    isHandleTextEdit={handleTextEdit}
                  />
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box display={"flex"} flexDirection={"column"} marginY={0.5}>
              <Box display={"flex"} alignSelf={"end"}>
                <Chip
                  label={repliesMessages.senderEmail}
                  avatar={<FaceIcon />}
                />
              </Box>

              <Box marginLeft={1.8}>
                <Tooltip title={newDate} placement={"right"}>
                  <Chip label={repliesMessages.text} sx={multiLineChipStyle} />
                </Tooltip>
              </Box>
            </Box>
          )}
        </>
      )}

      {/* Dialog popup för att redigera på meddelande. */}
      {toOpenTextEditForm && (
        <TextEditDialog
          toOpenTextEditForm={toOpenTextEditForm}
          setToOpenTextEditForm={setToOpenTextEditForm}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleNewMessageOnchange={handleNewMessageOnchange}
          handleSendEditedMessage={handleSendEditedMessage}
        />
      )}
    </Box>
  );
};

export default DisplayReplyMessages;
