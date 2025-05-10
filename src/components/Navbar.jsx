import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Box,
  Tooltip,
  Avatar,
  Menu,
  IconButton,
  MenuItem,
} from "@mui/material";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import useUserAuth from "../customHook/useUserAuth";
import { useState } from "react";
import colors from "../colors";
import { deleteDoc, doc } from "firebase/firestore";

const Navbar = () => {
  const { user } = useUserAuth();
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleSignOut = async () => {
    const userRef = doc(db, "users", user.uid);
    try {
      await deleteDoc(userRef);
      await signOut(auth);
    } catch (error) {
      console.log("Error signing out");
    }
    navigate("/");
  };

  const handleOpenUserMenu = (e) => {
    setAnchorElUser(e.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position={"sticky"}>
      <Toolbar
        disableGutters
        sx={{
          justifyContent: "space-between",
          height: 60,
          bgcolor: colors.bgViolet,
          padding: "15px",
        }}
      >
        <Typography variant={"h6"}>KtW CHAT</Typography>
        <Box>
          <Tooltip title={user ? user.email : "User"}>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            id={"menu-appbar"}
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <MenuItem
              onClick={handleSignOut}
              sx={{ "&:hover": { backgroundColor: "lightGrey" } }}
            >
              <Typography textAlign={"center"}>Log Out</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
