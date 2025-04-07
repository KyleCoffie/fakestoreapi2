import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ShoppingCart from '../components/ShoppingCart';
import axios from 'axios';

// Mock Firebase Auth hook
jest.mock('axios');

describe('ShoppingCart Component', () => {
  test('renders without crashing',async() => {
    const mockResponse = {
      data: [
        { id: '1', title: 'Shorts', price: 20, quantity: 2}]};
    (axios.get as jest.Mock).mockResolvedValue(mockResponse);
  
    const{ getByText} = render(<ShoppingCart />);
    fireEvent.click(getByText(/fetch cart items/i));
  
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('https://api.example.com/cart-items');

    });
  });
});
  