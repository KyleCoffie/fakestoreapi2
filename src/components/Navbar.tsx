import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebaseConfig.mjs';
import Logout from './Logout';
import '/src/App.css';

const Navbar = () => {
  const [user] = useAuthState(auth);

  return (
    <nav>
      
      <Link to="/" className="bold">Home</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/orders">Orders</Link>
      <Link to="/add-product">Create New Product</Link>
      {!user ? (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      ) : (
        <Logout className='nav-link'/>
      )}
    </nav>
  );
};

export default Navbar;
