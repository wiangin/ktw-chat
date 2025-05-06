import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import useUserAuth from "../customHook/useUserAuth";
import { useNavigate, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import MessageInput from "./MessageInput";

const ChatRoom = ({ user }) => {
  return (
    <>
      <Navbar />
      Välkommen till chattrum
      {/*Här kommer vara en container som  visar meddelande */}
      <MessageInput/>
    </>
  )
}

export default ChatRoom;
