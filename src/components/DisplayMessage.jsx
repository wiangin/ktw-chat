import {
  Card,
  Paper,
  Box,
  Tooltip,
  Avatar,
  Button,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useState } from "react";

const DisplayMessage = ({ message, isOwnMessage }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
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
          <Paper
            onClick={handleClick}
            sx={{
              padding: "10px",
              marginTop: "5px",
              display: "flex",
              alignItems: "flex-end",
              flexDirection: "column",
              cursor: "pointer",
            }}
          >
            <Typography variant={"body2"}>{message.text}</Typography>
          </Paper>

          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem
              sx={{
                "&:hover": {
                  backgroundColor: "lightGrey",
                },
              }}
            >
              <DeleteIcon sx={{ marginRight: "5px" }} />
              <Typography variant={"body2"} onClick={handleDeleteMessage}>
                Delete message
              </Typography>
            </MenuItem>
          </Menu>
        </Box>
      ) : (
        <Box marginTop={3} display={"flex"} alignItems={"center"} gap={"10px"}>
          <Tooltip title={message.displayName}>
            <Avatar />
          </Tooltip>
          <Paper sx={{ padding: "10px", marginTop: "5px" }}>
            <Typography variant={"body2"}>{message.text}</Typography>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default DisplayMessage;
