import React, { useEffect, useState } from "react";
import { auth, provider } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import useUserAuth from "../customHook/useUserAuth";
import { useNavigate, Link } from "react-router-dom";
import { Box, Card, Paper, Button, TextField, Dialog } from "@mui/material";

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
    <Box
      component={"section"}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <h1>Welcome to KTW CHAT</h1>
      <Box>
        <form onSubmit={handleLoginWithEmail}>
          <Box>
            <TextField
              label={"Email"}
              variant={"standard"}
              type="text"
              id="username"
              name="username"
              required
              value={email}
              onChange={handleEmailChange}
            />
          </Box>
          <Box>
            <TextField
              label={"Password"}
              variant={"standard"}
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={handlePasswordChange}
            />
          </Box>
          <Box display={"flex"} justifyContent={"center"} marginTop={3}>
            <Button variant={"contained"} type="submit">
              Log in
            </Button>
          </Box>
        </form>

        <Box marginTop={2} display={"flex"} gap={1}>
          <Box component={"span"}>Dont have an account ?</Box>
          <Link to="/signup">Sign up</Link>
        </Box>

        <Box display={"flex"} justifyContent={"center"} marginTop={2}>
          <Button variant={"contained"} onClick={handleLoginWithGoogle}>
            Sign in with Google
          </Button>
        </Box>
      </Box>
      {!checkAuth && (
        <Dialog open={!checkAuth} onClose={() => setCheckAuth(true)}>
            <Box display={"flex"} justifyContent={"center"} margin={6}>
                <p>Wrong email or password !!!</p>
            </Box>
            
        </Dialog>
      )}
    </Box>
  );
};

export default Login;
