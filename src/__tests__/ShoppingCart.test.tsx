// Polyfill TextEncoder/TextDecoder for Jest environment
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ShoppingCart from '../components/ShoppingCart';
import { Provider } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter

// Define the structure of the Cart Item
interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

// Create a mock slice for the cart
const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] as CartItem[] },
  reducers: {
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

// Extract the removeItem action
const { removeItem: removeItemAction } = cartSlice.actions;

// Create a mock store with initial state
const renderWithStore = (ui: React.ReactElement, preloadedState: CartItem[] = []) => {
  const store = configureStore({
    reducer: {
      cart: cartSlice.reducer,
    },
    preloadedState: {
      cart: { items: preloadedState },
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
};
test('removes item on button click', async () => {
  const { getByText, queryByText } = renderWithStore(
    <ShoppingCart />,
    [{ id: 1, title: 'Test Item', price: 10, quantity: 1 }]
  );

  // Ensure the item is initially present using regex for text matching
  expect(getByText(/Test Item/i)).toBeInTheDocument();

  // Click the remove button using a query for the button text
  fireEvent.click(getByText(/remove item/i));

  // Dispatch the remove action (simulate button click)
  await waitFor(() => {
    // Since the item is removed, it should no longer be present in the document
    expect(queryByText(/Test Item/i)).not.toBeInTheDocument();
    expect(getByText('Your cart is empty.')).toBeInTheDocument();
  });
});
