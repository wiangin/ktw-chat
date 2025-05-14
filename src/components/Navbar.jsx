import {
  AppBar,
  Toolbar,
  Typography,
  Box,
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
import CustomTooltip from "../CustomComponent/CustomTooltip";

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
          <CustomTooltip title={user ? user.email : "User"}>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar />
            </IconButton>
          </CustomTooltip>
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
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <Box
                textAlign={"center"}
                sx={{
                  "&:hover": { backgroundColor: "lightGrey" },
                  width: "100%",
                  padding: "5px",
                }}
              >
                <Typography variant={"body2"}>Log Out</Typography>
              </Box>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
