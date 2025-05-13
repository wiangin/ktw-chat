import { Box, Typography, Menu, MenuItem, Chip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useState } from "react";
import FaceIcon from "@mui/icons-material/Face";

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
          <Chip
            label={message.text}
            onClick={handleClick}
            sx={{ fontSize: "16px" }}
            color={"secondary"}
          />
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            sx={{ marginTop: "8px" }}
          >
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

          <Chip label={message.text} sx={{ fontSize: "16px" }}></Chip>
        </Box>
      )}
    </Box>
  );
};

export default DisplayMessage;
