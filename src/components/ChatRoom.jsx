
import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import  useUserAuth  from '../customHook/useUserAuth';
import { useNavigate, Navigate } from 'react-router-dom';

const ChatRoom = () => {
   
    return (
        <div>
           Välkommen till chattrum
        </div>
    )
};

export default ChatRoom