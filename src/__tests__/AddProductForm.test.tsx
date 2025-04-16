import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter, Link } from 'react-router-dom';
import AddProductForm from '../components/AddProductForm';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

jest.mock('../firebasConfig', () => ({
  db: {
    collection: jest.fn(),
  },
}));

jest.mock('firebase/firestore', () => ({
  addDoc: jest.fn(),
  getFirestore: jest.fn(() => ({
    collection: jest.fn(() => ({
      add: jest.fn(),
    })),
  })),
}));


jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
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
    expect(screen.getByLabelText(/Rating Count:/i)).toBeInTheDocument();
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
    const mockNavigate = jest.fn();
    const mockCollection = jest.fn();
    jest.mock('firebase/firestore', () => ({
      addDoc: jest.fn(),
      getFirestore: jest.fn(() => ({
        collection: mockCollection,
      })),
    }));

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
    fireEvent.change(screen.getByLabelText(/Rating Count:/i), { target: { value: '100' } });

    const addProductBtn = screen.getByRole('button', { name: /Add Product/i });
    fireEvent.click(addProductBtn);

    await waitFor(() => expect(mockCollection).toHaveBeenCalledWith('products'));
    await waitFor(() => expect(addDoc).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(addDoc).toHaveBeenCalledWith(expect.any(Object), {
        title: 'Test Product',
        price: 10,
        description: 'Test Description',
        category: 'Test Category',
        image: 'http://example.com/image.jpg',
        stock: 50,
        rating: { rate: 4.5, count: 100 },
      })
    );
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('shows error alert on submission failure', async () => {
    const mockNavigate = jest.fn();
    const mockCollection = jest.fn();
    jest.mock('firebase/firestore', () => ({
      addDoc: jest.fn().mockRejectedValueOnce(new Error('Failed to add product')),
      getFirestore: jest.fn(() => ({
        collection: mockCollection,
      })),
    }));

    render(
      <BrowserRouter>
        <AddProductForm />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Title:/i), { target: { value: 'Fail Product' } });
    fireEvent.change(screen.getByLabelText(/Price:/i), { target: { value: '1.00' } });
    fireEvent.change(screen.getByLabelText(/Description:/i), { target: { value: 'Fail Desc' } });
    fireEvent.change(screen.getByLabelText(/Category:/i), { target: { value: 'Fail Cat' } });
    fireEvent.change(screen.getByLabelText(/Image URL:/i), { target: { value: 'fail.jpg' } });
    fireEvent.change(screen.getByLabelText(/Stock:/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/Rating Rate:/i), { target: { value: '1.0' } });
    fireEvent.change(screen.getByLabelText(/Rating Count:/i), { target: { value: '1' } });

    const addProductBtn = screen.getByRole('button', { name: /Add Product/i });
    fireEvent.click(addProductBtn);

    await waitFor(() => expect(mockCollection).toHaveBeenCalledWith('products'));
    await waitFor(() => expect(addDoc).toHaveBeenCalledTimes(1));
    expect(window.alert).toHaveBeenCalledWith('Error adding product: Failed to add product');
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
