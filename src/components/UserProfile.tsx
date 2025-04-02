import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebasConfig'; // Import auth and db from central config
import { doc, getDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore'; // Firestore functions
import { onAuthStateChanged, User, deleteUser } from 'firebase/auth'; // Auth functions
import { Link } from 'react-router-dom';

// Define an interface for the user profile data structure
interface UserProfileData {
  email: string;
  displayName: string;
  address: string;
  phoneNumber: string;
  createdAt: Timestamp | null; // Firestore Timestamp or null if not loaded
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null); // Store the Firebase Auth user object
  const [profileData, setProfileData] = useState<UserProfileData | null>(null); // Store Firestore profile data
  const [loading, setLoading] = useState<boolean>(true); // Loading state for data fetching
  const [error, setError] = useState<string | null>(null); // Error state

  // State for the update form inputs
  const [displayNameInput, setDisplayNameInput] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const [phoneNumberInput, setPhoneNumberInput] = useState('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false); // Loading state for updates

  // Effect to listen for auth state changes and fetch profile data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // User is signed in, fetch their profile data from Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfileData;
            setProfileData(data);
            // Initialize form inputs with fetched data
            setDisplayNameInput(data.displayName || '');
            setAddressInput(data.address || '');
            setPhoneNumberInput(data.phoneNumber || '');
          } else {
            setError('Profile data not found.'); // Document doesn't exist
          }
        } catch (err) {
          console.error("Error fetching profile data:", err);
          setError('Failed to load profile data.');
        }
      } else {
        // User is signed out
        setUser(null);
        setProfileData(null);
        setError('User is not logged in.'); // Set error if no user
      }
      setLoading(false); // Finished loading
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []); // Empty dependency array means this runs once on mount

  // --- Handler for Profile Update ---
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    if (!user) {
      setError('You must be logged in to update your profile.');
      return;
    }
    setIsUpdating(true);
    setError(null); // Clear previous errors

    const userDocRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(userDocRef, {
        displayName: displayNameInput,
        address: addressInput,
        phoneNumber: phoneNumberInput,
      });
      // Optionally re-fetch data or update local state optimistically
      setProfileData(prev => prev ? { ...prev, displayName: displayNameInput, address: addressInput, phoneNumber: phoneNumberInput } : null);
      alert('Profile updated successfully!'); // Simple feedback
    } catch (err) {
      console.error("Error updating profile:", err);
      setError('Failed to update profile.');
    } finally {
      setIsUpdating(false);
    }
  };

  // --- Handler for Account Deletion ---
  const handleDeleteAccount = async () => {
    if (!user) {
      setError('You must be logged in to delete your account.');
      return;
    }

    // Confirmation dialog
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setLoading(true); // Use main loading indicator for deletion
    setError(null);
    const userDocRef = doc(db, 'users', user.uid);

    try {
      // 1. Delete Firestore document
      await deleteDoc(userDocRef);
      console.log("Firestore document deleted.");

      // 2. Delete Firebase Auth user
      // Note: deleteUser might require recent login. Handle potential errors.
      await deleteUser(user);
      console.log("Firebase Auth user deleted.");
      alert('Account deleted successfully.');
      // User state will be updated by onAuthStateChanged listener

    } catch (err: any) {
      console.error("Error deleting account:", err);
      // Handle specific errors like 'auth/requires-recent-login'
      if (err.code === 'auth/requires-recent-login') {
        setError('Please log out and log back in again before deleting your account.');
        // Potentially redirect to login or prompt for re-authentication
      } else {
        setError('Failed to delete account. Please try again.');
      }
      // If Firestore deletion succeeded but Auth deletion failed, the state is inconsistent.
      // Consider how to handle this (e.g., manual cleanup, specific error message).
    } finally {
      setLoading(false);
    }
  };

  // --- Render Logic ---
  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error && !user) { // Show login error prominently if not logged in
      return <div>Error: {error}. Please log in.</div>;
  }

  if (!profileData || !user) {
    // Handle case where user is logged in but profile data failed to load or doesn't exist
    return <div>Error loading profile data or user not found. {error}</div>;
  }

  // --- Main JSX ---
  return (
    <div>
      <h2>User Profile</h2>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {/* Display Profile Info */}
      <div>
        <p><strong>Email:</strong> {profileData.email}</p>
        <p><strong>Joined:</strong> {profileData.createdAt?.toDate().toLocaleDateString()}</p>
        {/* Display other fields if needed */}
      </div>

      <hr />

      {/* Update Profile Form */}
      <h3>Update Profile</h3>
      <form onSubmit={handleUpdateProfile}>
        <div>
          <label htmlFor="displayName">Display Name:</label>
          <input
            type="text"
            id="displayName"
            value={displayNameInput}
            onChange={(e) => setDisplayNameInput(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="tel" 
            id="phoneNumber"
            value={phoneNumberInput}
            onChange={(e) => setPhoneNumberInput(e.target.value)}
          />
        </div>
        <button type="submit" disabled={isUpdating}>
          {isUpdating ? 'Updating...' : 'Update Profile'}
        </button>
      </form>

      <hr />

      {/* Delete Account Section */}
      <h3>Delete Account</h3>
      <p>Warning: Deleting your account will permanently remove all your data.</p>
        <button onClick={handleDeleteAccount} style={{ backgroundColor: 'red', color: 'white' }} disabled={loading}>
          Delete My Account
        </button>
        <br />
        <Link to="/">
          <button>Go to Products Page</button>
        </Link>
        <br />
        <Link to="/orders">
          <button>View Order History</button>
        </Link>
      </div>
    );
  }

export default UserProfile;
