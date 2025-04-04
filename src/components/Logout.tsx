import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import React from 'react';

/**
 * Logs out the currently authenticated user from Firebase Authentication.
 */
const Logout = () => {
  const navigate = useNavigate();

  const logoutUser = async (): Promise<void> => {
    try {
      // Get the authentication instance
      const auth = getAuth();

      // Sign out the user
      await signOut(auth);
      console.log("User logged out"); // Log a message confirming successful logout
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout error:", error); // Log any errors that occur during logout
    }
  };

  return (
    <button onClick={logoutUser}>Logout</button>
  );
};

export default Logout;
