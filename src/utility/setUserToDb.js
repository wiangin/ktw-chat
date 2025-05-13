import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";

export const setUserToDb = async () => {
  await setDoc(
    doc(db, "users", auth.currentUser.uid),
    {
      email: auth.currentUser.email,
      user_id: auth.currentUser.uid,
    },
    { merge: true }
  );
};
