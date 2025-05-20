import { Box, Typography, Chip, Menu, MenuItem } from "@mui/material";
import FaceIcon from "@mui/icons-material/Face";
import DeleteIcon from "@mui/icons-material/Delete";
import useUserAuth from "../customHook/useUserAuth";
import { useState } from "react";
import { db } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";

const repliesNotice = () => {
  return (
    <Typography marginLeft={0.5} variant={"caption"} color={"grey"}>
      Replied
    </Typography>
  );
};

const DisplayReplyMessages = ({ replyBoolean, repliesMessages }) => {
  const { user } = useUserAuth();
  const loggedInUser = user?.uid;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOnClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
// fixar funktion för att ta bort sitt svarande meddelande
  const handleDeleteReply = async () => {
    try {
      console.log(repliesMessages);
      
      // const messageRef = doc(db, "replies", repliesMessages.id);
      // await deleteDoc(messageRef);
    }
    catch (error) {
      console.log("Error deleting message: ", error);
    }
  }


  return (
    <Box display={"flex"} flexDirection={"column"}>
      {replyBoolean && (
        <Box marginLeft={2} display={"flex"} flexDirection={"column"}>
          <Box marginRight={0.5}>{repliesNotice()}</Box>
          {repliesMessages.map((doc, i) => (
            <Box key={i}>
              <Box>
                {loggedInUser !== doc.senderId && (
                  <Chip label={doc.senderEmail} avatar={<FaceIcon />} />
                )}
              </Box>
              <Box marginBottom={1} marginLeft={1.5}>
                {loggedInUser === doc.senderId ? (
                  <>
                    <Chip
                      label={doc.text}
                      color={"secondary"}
                      onClick={handleOnClick}
                    />
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
                        onClick ={handleDeleteReply}
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
                          <Typography variant={"body2"}>
                            Delete message
                          </Typography>
                        </Box>
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <Chip label={doc.text} />
                )}
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default DisplayReplyMessages;
