import React, { useState } from 'react';
// Import Firebase authentication and Firestore utilities
import { auth } from '../../firebaseConfig.mjs';
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link } from 'react-router-dom';
import './Login.css'; 

// Define the Login component
const Login: React.FC = () => {
  // State to store email and password input values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // State to store any error messages
  const [error, setError] = useState<string | null>(null);

  // Function to handle user login
  const loginUser = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    try {
      // Attempt to sign in the user using Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in successfully!");
    } catch (err: any) {
      // Handle errors during login and display an error message
      setError(err.message);
      console.error("Login error:", err.message);
    }
  };

  return (
    <div className='login-container'>
      <h2>Login</h2>
      {/* Display error message if there's an issue during login */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={loginUser}>
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
        {/* Submit button to trigger user login */}
        <button type="submit">Login</button>
      </form>
      {/* Provide a link to navigate to the registration page */}
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;
