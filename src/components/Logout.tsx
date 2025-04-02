import { getAuth, signOut } from "firebase/auth";

const logoutUser = async (): Promise<void> => {
  try {
    const auth = getAuth();
    await signOut(auth);
    console.log("User logged out");
  } catch (error) {
    console.error("Logout error:", error);
  }
};
