import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Dialog,
} from "@mui/material";
import colors from "../colors";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";


const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [sendNotice, setSendNotice] = useState(true);
  const [wrongEmail, setWrongEmail] = useState(false);

  const handleEmailOnchange = (e) => {
    setEmail(e.target.value);
  };

  const handleResetPassword = async () => {
    if (!email.trim()) return;
    try {
      await sendPasswordResetEmail(auth, email);
      setSendNotice(false);
    } catch (error) {
      console.log("Maybe wrong email?", error);
      setWrongEmail(true);
    }

    setEmail("");
  };

  return (
    <Container maxWidth={"xl"}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Typography variant={"h1"} fontSize={40}>
          Reset password
        </Typography>

        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={0.5}
          marginY={3}
        >
          <TextField
            label={"Email"}
            size={"small"}
            color="secondary"
            onChange={handleEmailOnchange}
            value={email}
            required
          />
          <Button
            variant={"contained"}
            sx={{ bgcolor: colors.bgViolet }}
            onClick={handleResetPassword}
          >
            Send
          </Button>
        </Box>

        <Link to={"/"} style={{ fontSize: "18px" }}>
          Return to Login
        </Link>
      </Box>

      {!sendNotice && (
        <Dialog open={!sendNotice} onClose={() => setSendNotice(true)}>
          <Box>
            <Typography variant={"h6"} margin={6}>
              Please check your email to reset password
            </Typography>
          </Box>
        </Dialog>
      )}

      {wrongEmail && (
        <Dialog open={wrongEmail} onClose={() => setWrongEmail(false)}>
          <Box>
            <Typography variant={"h6"} margin={6}>
              Please enter correct email!
            </Typography>
          </Box>
        </Dialog>
      )}
    </Container>
  );
};

export default ResetPassword;
