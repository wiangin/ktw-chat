import { Box, Typography, Chip } from "@mui/material";
import FaceIcon from "@mui/icons-material/Face";

const repliesNotice = () => {
  return (
    <Typography marginLeft={0.5} variant={"caption"} color={"grey"}>
      Replied
    </Typography>
  );
};

const DisplayReplyMessages = ({ replyBoolean, replyMessages }) => {
  return (
    <Box display={"flex"} flexDirection={"column"}>
      {replyBoolean && (
        <Box marginLeft={2} display={"flex"} flexDirection={"column"}>
          <Box marginRight={0.5}>{repliesNotice()}</Box>
          {replyMessages.map((doc, i) => (
            <Box key={i}>
              <Box marginBottom={0.3}>
                <Chip
                  label={doc.senderEmail}
                  avatar={<FaceIcon />}
                  variant="outlined"
                />
              </Box>
              <Box marginBottom={1}>
                <Chip label={doc.text} variant="outlined" />
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default DisplayReplyMessages;
