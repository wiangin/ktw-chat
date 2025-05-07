import React, { useEffect, useState } from "react";
import { auth, provider } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import useUserAuth from "../customHook/useUserAuth";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Dialog,
  Typography,
  Container,
  FormControl
} from "@mui/material";
import "@fontsource/roboto/400.css";

const buttonBgColor = "#9c27b0";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkAuth, setCheckAuth] = useState(true);
  const { user } = useUserAuth();
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLoginWithEmail = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("sign in success!!!");
      navigate("/chatroom");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log("Error signing in with email: ", error);
      setEmail("");
      setPassword("");
      //   if (user === null) {
      //     setCheckAuth(false);
      //   }
      setCheckAuth(false);
    }
  };

  const handleLoginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
      console.log("sign in success!!!");
      navigate("/chatroom");
    } catch (error) {
      console.log("Error signing in with Google: ", error);
    }
  };

  return (
    <Container maxWidth={"xl"}>
      <Box
        component={"section"}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          // bgcolor: "#121212",
          // color: "#F5F5DC"
        }}
      >
        <Typography variant={"h1"} fontSize={50}>
          KtW CHAT
        </Typography>
        <Box marginTop={4}>
          <FormControl component={"form"} onSubmit={handleLoginWithEmail}>
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
                color="secondary"
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
                color="secondary"
              />
            </Box>
            <Box display={"flex"} justifyContent={"center"} marginTop={3}>
              <Button
                variant={"contained"}
                type={"submit"}
                sx={{ bgcolor: buttonBgColor}}
              >
                Log in
              </Button>
            </Box>
          </FormControl>

          <Box marginTop={3} display={"flex"} gap={1}>
            <Box component={"span"}>Dont have an account ?</Box>
            <Link to={"/signup"}>Sign up</Link>
          </Box>

          <Box display={"flex"} justifyContent={"center"} marginTop={3}>
            <Button
              variant={"contained"}
              onClick={handleLoginWithGoogle}
              sx={{ bgcolor: buttonBgColor }}
            >
              Sign in with Google
            </Button>
          </Box>
        </Box>
        {!checkAuth && (
          <Dialog open={!checkAuth} onClose={() => setCheckAuth(true)}>
            <Box display={"flex"} justifyContent={"center"} margin={6}>
              <Typography variant={"h6"}>Wrong email or password !!!</Typography>
            </Box>
          </Dialog>
        )}
      </Box>
    </Container>
  )
}

export default Login;
