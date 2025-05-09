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
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import useUserAuth from "../customHook/useUserAuth";
import { useState } from "react";

const buttonBgColor = "#9c27b0";

const Navbar = () => {
  const { user } = useUserAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState();
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleSignOut = async () => {
    await signOut(auth);
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
          bgcolor: buttonBgColor,
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
