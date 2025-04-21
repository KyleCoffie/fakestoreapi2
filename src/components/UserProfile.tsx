import React, { useState } from 'react';
import { auth, db } from '../firebasConfig';
import { doc, getDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged, User, deleteUser } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import './UserProfile.css';

interface UserProfileData {
  email: string;
  displayName: string;
  address: string;
  phoneNumber: string;
  createdAt: Timestamp | null;
}

const UserProfile: React.FC = () => {
  const [displayNameInput, setDisplayNameInput] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const [phoneNumberInput, setPhoneNumberInput] = useState('');
  const queryClient = useQueryClient();

  // Fetch the current user using onAuthStateChanged
  const fetchUser = () => {
    return new Promise<User | null>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        resolve(user);
        unsubscribe(); // Unsubscribe after first call
      });
    });
  };

  const { data: user, isLoading: isUserLoading, error: userError } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
  });

  const fetchUserProfile = async (userId: string) => {
    const userDocRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfileData;
    } else {
      throw new Error('Profile data not found.');
    }
  };

  const { data: profileData, isLoading, error, } = useQuery({
    queryKey: ['userProfile', user?.uid],
    queryFn: () => fetchUserProfile(user!.uid),
    enabled: !!user?.uid && !isUserLoading, // Fetch profile only when user is available
  });

  const updateUserProfile = async (updates: { displayName: string; address: string; phoneNumber: string }) => {
    if (!user) {
      throw new Error('You must be logged in to update your profile.');
    }
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, updates);
  };

  const { mutate: updateMutate, status: updateStatus } = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['userProfile', user?.uid] });
      alert('Profile updated successfully!');
    },
    onError: (error: any) => {
      console.error("Error updating profile:", error);
    },
  });

  const deleteUserAccount = async () => {
    if (!user) {
      throw new Error('You must be logged in to delete your account.');
    }

    const userDocRef = doc(db, 'users', user.uid);
    await deleteDoc(userDocRef);
    await deleteUser(user);
  };

  const { mutate: deleteMutate, isPending: isDeleteLoading } = useMutation({
    mutationFn: deleteUserAccount,
    onSuccess: () => {
      alert('Account deleted successfully.');
    },
    onError: (error: any) => {
      console.error("Error deleting account:", error);
    },
  });

  // --- Handler for Profile Update ---
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      return;
    }
    updateMutate({ displayName: displayNameInput, address: addressInput, phoneNumber: phoneNumberInput });
  };

  // --- Handler for Account Deletion ---
  const handleDeleteAccount = async () => {
    if (!user) {
      return;
    }
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    deleteMutate();
  };

  // --- Render Logic ---
  if (isUserLoading) {
    return <div>Loading user...</div>;
  }

  if (userError) {
    return <div>Error loading user: {userError.message}</div>;
  }

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div>Error loading profile: {error.message}</div>;
  }

  if (!profileData || !user) {
    return <div>Error loading profile data or user not found.</div>;
  }

  // --- Main JSX ---
  return (
    <div className='profile-form-container'>
      <h2>User Profile</h2>
      {/* Omit error display here as it's already handled above */}
      <div>
        <p><strong>Email:</strong> {profileData.email}</p>
        <p><strong>Joined:</strong> {profileData.createdAt?.toDate().toLocaleDateString()}</p>
        <p><strong>Display Name:</strong> {profileData.displayName}</p>
        <p><strong>Address:</strong> {profileData.address}</p>
        <p><strong>Phone Number:</strong> {profileData.phoneNumber}</p>
      </div>

        <h3>Update Profile</h3>
      <div className='profile-form'>

        <form className="profile-form" onSubmit={handleUpdateProfile}>
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
          <button className='profile-form-button'type="submit" disabled={updateStatus === 'pending'}>
            {updateStatus === 'pending' ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>

        <button onClick={handleDeleteAccount} style={{ backgroundColor: 'red', color: 'white' }} disabled={isDeleteLoading}>
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
