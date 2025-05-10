import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Dialog,
  FormControl,
} from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import useUserAuth from "../customHook/useUserAuth";
import colors from "../colors";

const SighUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checkAuth, setCheckAuth] = useState(true);
  const navigate = useNavigate();

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

  console.log(checkAuth);
  
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
          <FormControl component={"form"} onSubmit={handleSignUp}>
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
                sx={{ bgcolor: colors.bgViolet }}
              >
                Sign Up
              </Button>
            </Box>
          </FormControl>
        </Box>

        <Box marginTop={3}>
          <Box component={"span"}>Already have an account ? </Box>
          <Link to={"/"}>Log in</Link>
        </Box>

        {!checkAuth && (
          <Dialog open={!checkAuth} onClose={() => setCheckAuth(true)}>
            <Box display={"flex"} justifyContent={"center"} margin={6}>
              <Typography variant={"body2"}>Password may not match !!!</Typography>
            </Box>
          </Dialog>
        )}
      </Box>
    </Container>
  );
};

export default SighUp;
