import { Box, Typography, Chip, Menu, MenuItem, Tooltip } from "@mui/material";
import FaceIcon from "@mui/icons-material/Face";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";

const DisplayReplyMessages = ({
  replyBoolean,
  repliesMessages,
  isOwnMessage,
  messageId,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [newDate, setNewDate] = useState("");

  const handleOnClick = (e) => {
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
        <Box marginLeft={2} display={"flex"} flexDirection={"column"} >
          <>
            {isOwnMessage ? (
              <>
                <Tooltip title={newDate} placement={"right"}>
                  <Chip
                    onClick={handleOnClick}
                    label={repliesMessages.text}
                    color={"secondary"}
                    // kanske kan göra objekt av denna styling för multi line Chip
                    sx={{
                      marginTop: "5px",
                      fontSize: "16px",
                      paddingY: "5px",
                      height: "auto",
                      "& .MuiChip-label": {
                        display: "block",
                        whiteSpace: "normal",
                      },
                    }}
                  />
                </Tooltip>

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
                      onClick={handleDeleteReply}
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
                  </MenuItem>
                </Menu>
              </>
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
                    <Chip
                      label={repliesMessages.text}
                      sx={{
                        fontSize: "16px",
                        paddingY: "5px",
                        height: "auto",
                        "& .MuiChip-label": {
                          display: "block",
                          whiteSpace: "normal",
                        },
                      }}
                    />
                  </Tooltip>
                </Box>
              </Box>
            )}
          </>
        </Box>
      )}
    </Box>
  );
};

export default DisplayReplyMessages;
