import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Logout from '../components/Logout'; 
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom'; 

// Mock the necessary Firebase and React Router hooks
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signOut: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Logout Component', () => {
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    // Reset any mocks before each test
    mockNavigate = jest.fn();
    (useNavigate as jest.Mock<() => void>).mockReturnValue(mockNavigate); // More precise type annotation
    (signOut as jest.Mock).mockReset();
  });

  test('should render logout button', () => {
    render(<Logout />);
    
    // Check if the logout button is present in the document
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('should call signOut and navigate to login when logout button is clicked', async () => {
    // Mock signOut to resolve successfully
    (signOut as jest.Mock).mockResolvedValueOnce(undefined);
    
    render(<Logout />);
    
    
      fireEvent.click(screen.getByText('Logout'));
      await waitFor(() => {
        expect(signOut).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      });
    });

  test('should show loading state when logging out', async() => {
    // Mock signOut to resolve successfully
    (signOut as jest.Mock).mockResolvedValueOnce(new Promise(()=> {}));

    render(<Logout />);
    
    // Simulate button click
    fireEvent.click(screen.getByText('Logout'));

    // Check that the button displays the loading state
    await waitFor (()=>{
        expect(screen.getByText('Logging out...')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeDisabled(); // Ensure the button is disabled during logout

    })
  });

  test('should display error message when logout fails', async () => {
    // Mock signOut to reject with an error
    (signOut as jest.Mock).mockRejectedValueOnce(new Error('Logout error'));

    render(<Logout />);
    fireEvent.click(screen.getByText('Logout'));
    
    await waitFor (() => { 
      expect(screen.getByText('Logout failed. Please try again.')).toBeInTheDocument();
    });
  });
});

// Mock window.alert to prevent pop-ups during testing
global.alert = jest.fn();
