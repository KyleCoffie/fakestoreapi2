import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

/**
 * Logs out the currently authenticated user from Firebase Authentication.
 */
const Logout = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);  // For error feedback
  const [loading, setLoading] = useState(false);  // To track loading state

  const logoutUser = async (): Promise<void> => {
    setLoading(true); // Set loading to true while logging out
    setError(null); // Reset previous errors

    try {
      // Get the authentication instance
      const auth = getAuth();

      // Sign out the user
      await signOut(auth);
      console.log("User logged out");
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      setError("Logout failed. Please try again."); // Set error message
      console.error("Logout error:", error); // Log any errors that occur during logout
    } finally {
      setLoading(false); // Stop loading after the process completes
    }
  };

  return (
    <div>
      <button onClick={logoutUser} disabled={loading}>
        {loading ? 'Logging out...' : 'Logout'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
    </div>
  );
};

export default Logout;
