import {
  Box,
  Dialog,
  useTheme,
  useMediaQuery,
  FormControl,
  TextField,
  Button,
  Popover,
} from "@mui/material";
import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import colors from "../utility/colors";

const TextEditDialog = ({
  toOpenTextEditForm,
  setToOpenTextEditForm,
  newMessage,
  setNewMessage,
  handleNewMessageOnchange,
  handleSendEditedMessage,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.up("sm"));

  const handleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  return (
    <>
      <Dialog
        open={toOpenTextEditForm}
        onClose={() => setToOpenTextEditForm(false)}
      >
        <Box margin={6} width={isTablet ? "500px" : "300px"}>
          <FormControl
            component={"form"}
            onSubmit={handleSendEditedMessage}
            sx={{ width: isTablet ? "500px" : "300px" }}
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
    </>
  );
};

export default TextEditDialog;
