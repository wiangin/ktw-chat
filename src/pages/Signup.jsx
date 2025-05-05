import { Box, Button, TextField } from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import useUserAuth from "../customHook/useUserAuth";

const SighUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    }
  };

  // console.log("User : ", user);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <h1>Sign Up</h1>
      <Box>
        <form onSubmit={handleSignUp}>
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
          <Box>
            <TextField
            label={"Confirm password"}
            variant={"standard"}
              type="password"
              id="password"
              name="password"
              required
              value={confirmPassword}
              onChange={handleConfirmPassword}
            />
          </Box>
          <Box display={"flex"} justifyContent={"center"} marginTop={2}>
            <Button variant={"contained"} type="submit">Sign Up</Button>
          </Box>
        </form>
      </Box>
      <Box marginTop={2}>
        <Box component={"span"}>Already have an account ? </Box>
        <Link to={"/"}>Log in</Link>
      </Box>

      
    </Box>
  );
};

export default SighUp;
