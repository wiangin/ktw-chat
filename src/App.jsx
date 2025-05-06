import React from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import SighUp from "./pages/Signup";
import { Container } from "@mui/material";
import ChatRoom from "./components/ChatRoom";
import useUserAuth from "./customHook/useUserAuth";

function App() {
  const { user } = useUserAuth();
  return (
    <Routes>
      <Route path="/" element={ !user ? <Login /> : <Navigate to={"/chatroom"}/> } />
      <Route path="/signup" element={<SighUp />} />
      <Route path="/chatroom" element={ user ? <ChatRoom user={user}/> : <Navigate to={"/"}/> } />
    </Routes>
  );
}

export default App;
