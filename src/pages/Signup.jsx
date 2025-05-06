import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Dialog,
} from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import useUserAuth from "../customHook/useUserAuth";

const buttonBgColor = "#9c27b0";

const SighUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checkAuth, setCheckAuth] = useState(true);
  const navigate = useNavigate();
  const { user } = useUserAuth();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };
  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      console.log("Password not match!!!");
      // Lägg alert att password inte matcha!
      setConfirmPassword("");
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/chatroom");
    } catch (error) {
      console.log("Error signing up with Email: ", error);
      setCheckAuth(false);

    }
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
        <Typography variant={"h1"} fontSize={50}>
          Sign Up
        </Typography>
        <Box>
          <form onSubmit={handleSignUp}>
            <Box>
              <TextField
                label={"Email"}
                variant={"standard"}
                type={"text"}
                id={"username"}
                name={"username"}
                required
                value={email}
                onChange={handleEmailChange}
                color={"secondary"}
              />
            </Box>
            <Box marginTop={1}>
              <TextField
                label={"Password"}
                variant={"standard"}
                type={"password"}
                id={"password"}
                name={"password"}
                required
                value={password}
                onChange={handlePasswordChange}
                color={"secondary"}
              />
            </Box>
            <Box marginTop={1}>
              <TextField
                label={"Confirm password"}
                variant={"standard"}
                type={"password"}
                id={"password"}
                name={"password"}
                required
                value={confirmPassword}
                onChange={handleConfirmPassword}
                color={"secondary"}
              />
            </Box>
            <Box display={"flex"} justifyContent={"center"} marginTop={3}>
              <Button
                variant={"contained"}
                type="submit"
                sx={{ bgcolor: buttonBgColor }}
              >
                Sign Up
              </Button>
            </Box>
          </form>
        </Box>
        <Box marginTop={3}>
          <Box component={"span"}>Already have an account ? </Box>
          <Link to={"/"}>Log in</Link>
        </Box>
        {!checkAuth && (
          <Dialog open={!checkAuth} onClose={() => setCheckAuth(true)}>
            <Box display={"flex"} justifyContent={"center"} margin={6}>
              <p>Password may not match !!!</p>
            </Box>
          </Dialog>
        )}
      </Box>
    </Container>
  );
};

export default SighUp;
