import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Logout from '../components/Logout'; 
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom'; 

// Mock the necessary Firebase and React Router hooks
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Logout Component', () => {
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    // Reset any mocks before each test
    mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
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
    
    // Simulate button click
    fireEvent.click(screen.getByText('Logout'));

    // Ensure signOut was called once
    await waitFor(() => expect(signOut).toHaveBeenCalledTimes(1));

    // Check if navigate was called with '/login'
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('should show loading state when logging out', () => {
    // Mock signOut to resolve successfully
    (signOut as jest.Mock).mockResolvedValueOnce(undefined);

    render(<Logout />);
    
    // Simulate button click
    fireEvent.click(screen.getByText('Logout'));

    // Check that the button displays the loading state
    expect(screen.getByText('Logging out...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled(); // Ensure the button is disabled during logout
  });

  test('should display error message when logout fails', async () => {
    // Mock signOut to reject with an error
    (signOut as jest.Mock).mockRejectedValueOnce(new Error('Logout error'));

    render(<Logout />);
    
    // Simulate button click
    fireEvent.click(screen.getByText('Logout'));

    // Wait for the error message to appear
    await waitFor(() => screen.getByText('Logout failed. Please try again.'));
    
    // Check if the error message is shown
    expect(screen.getByText('Logout failed. Please try again.')).toBeInTheDocument();
  });
});
