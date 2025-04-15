import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import {AddProductForm} from '../components/AddProductForm';
import { getFirestore } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

console.log(AddProductForm);
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({
    collection: jest.fn(() => ({
      add: jest.fn(),
    })),
  })),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

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

    const priceInput = screen.getByLabelText(/Price:/i);
    fireEvent.change(priceInput, { target: { value: '99.99' } });
    expect(priceInput).toHaveValue('99.99');
  });

  test('calls addDoc and navigates on successful submission', async () => {
    const mockAddDoc = jest.fn().mockResolvedValueOnce({ id: 'mockProductId' });
    const mockCollection = jest.fn(() => ({ add: mockAddDoc }));
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
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

    fireEvent.click(screen.getByRole('button', { name: /Add Product/i }));

    await waitFor(() => {
      expect(mockAddDoc).toHaveBeenCalledTimes(1);
      expect(mockAddDoc).toHaveBeenCalledWith(expect.any(Object), {
        title: 'Test Product',
        price: 10.00,
        description: 'Test Description',
        category: 'Test Category',
        image: 'http://example.com/image.jpg',
        stock: 50,
        rating: { rate: 4.5, count: 100 },
      });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('shows error alert on submission failure', async () => {
    const mockAddDoc = jest.fn().mockRejectedValueOnce(new Error('Failed to add product'));
    const mockCollection = jest.fn(() => ({ add: mockAddDoc }));
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
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

    fireEvent.click(screen.getByRole('button', { name: /Add Product/i }));

    await waitFor(() => {
      expect(mockAddDoc).toHaveBeenCalledTimes(1);
      expect(global.alert).toHaveBeenCalledWith('Error adding product: Failed to add product');
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
