import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SighUp from "./pages/Signup";
import { Container } from "@mui/material";
import ChatRoom from "./components/ChatRoom";

function App() {
  return (

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SighUp/>}/>
        <Route path="/chatroom" element={<ChatRoom/>}/>
      </Routes>

  );
}

export default App;
