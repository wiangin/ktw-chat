import { useState } from "react";
import { auth, provider, db } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Dialog,
  Typography,
  Container,
  FormControl,
  styled,
} from "@mui/material";
import "@fontsource/roboto/400.css";
import colors from "../utility/colors";
import { setUserToDb } from "../utility/setUserToDb";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkAuth, setCheckAuth] = useState(true);
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
      navigate("/chatroom");
      setUserToDb();
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log("Error signing in with email: ", error);
      setEmail("");
      setPassword("");
      setCheckAuth(false);
    }
  };

  const handleLoginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/chatroom");
      setUserToDb();
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
        }}
      >
        <Typography variant={"h1"} fontSize={50}>
          KtW CHAT
        </Typography>

        <Box marginTop={4} textAlign={"center"}>
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

            <Box display={"flex"} justifyContent={"center"} marginTop={3}>
              <Button
                variant={"contained"}
                type={"submit"}
                fullWidth
                sx={{ bgcolor: colors.bgViolet }}
              >
                Log in
              </Button>
            </Box>
          </FormControl>

          <Box marginTop={1}>
            <Box component={"span"}>Forget your password?</Box>{" "}
            <Link to={"/resetpassword"}>Reset</Link>
          </Box>

          <Box display={"flex"} justifyContent={"center"} marginTop={3}>
            <Button
              variant={"contained"}
              onClick={handleLoginWithGoogle}
              sx={{ bgcolor: colors.bgViolet }}
              fullWidth
            >
              Sign in with Google
            </Button>
          </Box>
          <Box marginTop={3} display={"flex"} gap={1}>
            <Box component={"span"}>Dont have an account?</Box>
            <Link to={"/signup"}>Sign up</Link>
          </Box>
        </Box>

        {!checkAuth && (
          <Dialog open={!checkAuth} onClose={() => setCheckAuth(true)}>
            <Box display={"flex"} justifyContent={"center"} margin={6}>
              <Typography variant={"h6"}>
                Wrong email or password !!!
              </Typography>
            </Box>
          </Dialog>
        )}
      </Box>
    </Container>
  );
};

export default Login;
