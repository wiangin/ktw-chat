import { Card, Paper, Box, Tooltip, Avatar } from "@mui/material";

const DisplayMessage = ({ message, isOwnMessage }) => {
  return (
    <Box sx={{ margin: "10px" }} elevation={3}>
      {isOwnMessage ? (
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            width: "100%",
            marginTop: "20px"
          }}
        >
        <Tooltip title={message.displayName}>
                <Avatar/>
            </Tooltip>
        <Paper sx={{padding: "10px", marginTop: "5px"}}>
             {message.text}
        </Paper>
         
        </Box>
      ) : (
        <Box marginTop={3}>
            <Tooltip title={message.displayName}>
                <Avatar/>
            </Tooltip>
            <Paper sx={{padding: "10px", marginTop: "5px"}}>
                {message.text}
            </Paper>
          
        </Box>
      )}
    </Box>
  );
};

export default DisplayMessage;
