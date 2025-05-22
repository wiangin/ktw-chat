import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import SighUp from "./pages/Signup";
import ChatRoom from "./pages/ChatRoom";
import useUserAuth from "./customHook/useUserAuth";
import ResetPassword from "./pages/ResetPassword";

function App() {
  const { user } = useUserAuth();
  return (
    <Routes>
      <Route
        path="/"
        element={!user ? <Login /> : <Navigate to={"/chatroom"} />}
      />
      <Route path={"/signup"} element={<SighUp />} />
      <Route
        path={"/chatroom"}
        element={user ? <ChatRoom user={user} /> : <Navigate to={"/"} />}
      />
      <Route path={"/resetpassword"} element={<ResetPassword />} />
    </Routes>
  );
}

export default App;
