import { TextField, Button, FormControl, Popover } from "@mui/material";
import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import colors from "../colors";

const MessageInput = ({ user }) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleOnchangeNewMessage = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    await addDoc(collection(db, "messages"), {
      text: message,
      createdAt: serverTimestamp(),
      user_id: user.uid,
      displayName: user.email,
      edit: false
    });
    setMessage("");
  };

  const handleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  return (
    <>
      <FormControl
        component={"form"}
        onSubmit={handleSendMessage}
        sx={{
          display: "flex",
          flexDirection: "row",
          padding: "10px",
          backgroundColor: "#f8f9fa",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TextField
          type={"text"}
          value={message}
          onChange={handleOnchangeNewMessage}
          placeholder={"Type a message ..."}
          size="small"
          fullWidth
        />

        <Button onClick={handleEmojiPicker}>😊</Button>

        <Button
          variant={"contained"}
          sx={{ bgcolor: colors.bgViolet }}
          type={"submit"}
        >
          Send
        </Button>

        {showEmojiPicker && (
          <Popover
            open={showEmojiPicker}
            onClose={() => setShowEmojiPicker(false)}
          >
            <EmojiPicker
              onEmojiClick={(emoji) => setMessage(message + emoji.emoji)}
              height={500}
              width={300}
            />
          </Popover>
        )}
      </FormControl>
    </>
  );
};

export default MessageInput;
