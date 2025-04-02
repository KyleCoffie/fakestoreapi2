import { getAuth, signOut } from "firebase/auth";

/**
 * Logs out the currently authenticated user from Firebase Authentication.
 */
const logoutUser = async (): Promise<void> => {
  try {
    // Get the authentication instance
    const auth = getAuth();

    // Sign out the user
    await signOut(auth);
    console.log("User logged out"); // Log a message confirming successful logout
  } catch (error) {
    console.error("Logout error:", error); // Log any errors that occur during logout
  }
};

