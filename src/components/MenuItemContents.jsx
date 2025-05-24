import { Box, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { lightGreyBgHover } from "../utility/lightGreyBgHover";

const MenuItemContents = ({ isHandleDeleteMessage, isHandleTextEdit }) => {
  return (
    <>
      <Box
        onClick={isHandleDeleteMessage}
        display={"flex"}
        alignItems={"center"}
        sx={lightGreyBgHover}
      >
        <DeleteIcon sx={{ marginRight: "8px" }} />
        <Typography variant={"body2"}>Delete message</Typography>
      </Box>
      <Box
        onClick={isHandleTextEdit}
        display={"flex"}
        alignItems={"center"}
        marginTop={0.5}
        sx={lightGreyBgHover}
        textAlign={"center"}
      >
        <EditIcon sx={{ marginRight: "8px" }} />
        <Typography variant={"body2"}>Edit</Typography>
      </Box>
    </>
  );
};

export default MenuItemContents;
