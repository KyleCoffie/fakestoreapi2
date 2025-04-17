import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter, Link } from 'react-router-dom';
import AddProductForm from '../components/AddProductForm';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebasConfig';
import { useNavigate } from 'react-router-dom';

// Mock the firebase/firestore module to provide mocked functions
jest.mock('firebase/firestore', () => ({
  ...jest.requireActual('firebase/firestore'),
  collection: jest.fn(),
  addDoc: jest.fn((ref, data) => {
    console.log('addDoc called with:', data); // Log the data for debugging
    return Promise.resolve({ id: 'mock-id' }); // Return a mock document ID
  }),
}));

// Mock the db object from firebasConfig to return a mock Firestore instance.  This is crucial for the collection function to work correctly.
jest.mock('../firebasConfig', () => ({
  db: {
    collection: jest.fn(() => ({})), // Mock Firestore instance with collection method
  },
}));


const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.spyOn(window, 'alert').mockImplementation(() => {});


describe('AddProductForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all form fields and buttons', () => {
    render(
      <BrowserRouter>
        <AddProductForm />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/Title:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Price:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Image URL:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Stock:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Rating Rate:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Count:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Product/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });

  test('updates state on input change', () => {
    render(
      <BrowserRouter>
        <AddProductForm />
      </BrowserRouter>
    );

    const titleInput = screen.getByLabelText(/Title:/i);
    fireEvent.change(titleInput, { target: { value: 'New Test Product' } });
    expect(titleInput).toHaveValue('New Test Product');

    const priceInput = screen.getByLabelText(/Price:/i) as HTMLInputElement;
    fireEvent.change(priceInput, { target: { value: 99.99 } });
    expect(Number(priceInput.value)).toBe(99.99); // Ensure the value is checked as a number
  });

  test('calls addDoc and navigates on successful submission', async () => {
    render(
      <BrowserRouter>
        <AddProductForm />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Title:/i), { target: { value: 'Test Product' } });
    fireEvent.change(screen.getByLabelText(/Price:/i), { target: { value: '10.00' } });
    fireEvent.change(screen.getByLabelText(/Description:/i), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText(/Category:/i), { target: { value: 'Test Category' } });
    fireEvent.change(screen.getByLabelText(/Image URL:/i), { target: { value: 'http://example.com/image.jpg' } });
    fireEvent.change(screen.getByLabelText(/Stock:/i), { target: { value: '50' } });
    fireEvent.change(screen.getByLabelText(/Rating Rate:/i), { target: { value: '4.5' } });
    fireEvent.change(screen.getByLabelText(/Count:/i), { target: { value: '100' } });

    const addProductBtn = screen.getByRole('button', { name: /Add Product/i });
    fireEvent.click(addProductBtn);

    // Assert that the collection function was called with the correct arguments
    await waitFor(() => expect(collection).toHaveBeenCalledWith(db, 'products'));

    await waitFor(() => expect(addDoc).toHaveBeenCalledTimes(1));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

test('shows error alert on submission failure', async () => {
    // Mock addDoc to reject with an error for this test case
    (addDoc as jest.Mock).mockRejectedValueOnce(new Error('Failed to add product'));
    // Render the component
    render(
      <BrowserRouter>
        <AddProductForm />
      </BrowserRouter>
    );

    // Simulate form submission with test data
    fireEvent.change(screen.getByLabelText(/Title:/i), { target: { value: 'Fail Product' } });
    fireEvent.change(screen.getByLabelText(/Price:/i), { target: { value: '1.00' } });
    fireEvent.change(screen.getByLabelText(/Description:/i), { target: { value: 'Fail Desc' } });
    fireEvent.change(screen.getByLabelText(/Category:/i), { target: { value: 'Fail Cat' } });
    fireEvent.change(screen.getByLabelText(/Image URL:/i), { target: { value: 'fail.jpg' } });
    fireEvent.change(screen.getByLabelText(/Stock:/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/Rating Rate:/i), { target: { value: '1.0' } });
    fireEvent.change(screen.getByLabelText(/Count:/i), { target: { value: '1' } });

    const addProductBtn = screen.getByRole('button', { name: /Add Product/i });
    fireEvent.click(addProductBtn);

    // Wait for the addDoc function to be called
    await waitFor(() => expect(addDoc).toHaveBeenCalledTimes(1));

    // Assert that the error alert was called with the expected message
    expect(window.alert).toHaveBeenCalledWith('Error adding product: Failed to add product');

    // Assert that navigation did not occur
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
