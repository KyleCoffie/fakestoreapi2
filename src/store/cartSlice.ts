import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
}

const CART_STORAGE_KEY = 'cartItems';

// Function to load cart items from local storage
const loadCartItems = (): CartItem[] => {
  try {
    const serializedItems = localStorage.getItem(CART_STORAGE_KEY);
    return serializedItems ? JSON.parse(serializedItems) : [];
  } catch (error) {
    console.error("Error loading cart items from local storage:", error);
    return [];
  }
};

const initialState: CartState = {
  items: loadCartItems(), // Load cart items from local storage on initialization
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...newItem, quantity: 1 });
      }
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items)); // Save cart items to local storage
    },
    removeItem: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items)); // Save cart items to local storage
    },
    updateItemQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items)); // Save cart items to local storage
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem(CART_STORAGE_KEY); // Remove cart items from local storage
    },
  },
});

export const { addItem, removeItem, updateItemQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
