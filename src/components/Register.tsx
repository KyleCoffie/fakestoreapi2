import React, { useState } from 'react';
// Import Firebase authentication and Firestore utilities
import { auth } from '../firebasConfig.mjs';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebasConfig.mjs";

// Define the Register component
const Register: React.FC = () => {
  // State to store email and password input values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // State to store any error messages
  const [error, setError] = useState<string | null>(null);

  // Function to handle user registration
  const registerUser = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      // Attempt to create a new user with email and password in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create a user document in Firestore after successful authentication
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        email: user.email,
        createdAt: serverTimestamp(), // Store the current timestamp
        displayName: "", // Default display name
      });

      console.log("User registered and Firestore document created:", user.uid);
    } catch (err: any) {
      // Handle errors during registration and display an error message
      setError(err.message);
      console.error("Registration error:", err.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {/* Display error message if there's an issue during registration */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={registerUser}>
        <div>
          <label htmlFor="email">Email:</label>
          {/* Input field for email with onChange handler */}
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          {/* Input field for password with onChange handler */}
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {/* Submit button to trigger user registration */}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
