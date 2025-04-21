import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, updateItemQuantity, clearCart } from '../store/cartSlice';
import { db, auth } from '../firebasConfig'; // Import Firebase
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Import Firestore functions
import { useAuthState } from 'react-firebase-hooks/auth'; // Import useAuthState hook
import { Link } from 'react-router-dom'; // Import the Link component for navigation
import './Home.css';
import { RootState } from '../store/store';

const ShoppingCart = () => {
  // Get the cart items from the Redux store
  const cartItems = useSelector((state: RootState) => state.cart.items);
  // Get the dispatch function from Redux
  const dispatch = useDispatch();
  // Get the current user
  const [user] = useAuthState(auth);
  // State variable to track whether the user has checked out
  const [checkout, setCheckout] = useState(false);

  // Function to remove an item from the cart
  const handleRemoveItem = (id: number) => {
    dispatch(removeItem(id));
  };

  // Function to update the quantity of an item in the cart
  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity >= 0) {
      dispatch(updateItemQuantity({ id, quantity }));
    }
  };

  // Function to calculate the total price of the items in the cart
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Function to calculate the total number of items in the cart
  const calculateTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // useEffect hook to display a thank you message after the user checks out
  useEffect(() => {
    if (checkout) {
      // Set a timer to clear the checkout state after 3 seconds
      const timer = setTimeout(() => {
        setCheckout(false);
      }, 3000);

      // Clear the timer when the component unmounts or the checkout state changes
      return () => clearTimeout(timer);
    }
  }, [checkout]);

  return (
    <div className='shopping-cart-container'>
      {/* Heading for the shopping cart */}
      <h1>Shopping Cart</h1>
      {/* Display a thank you message if the user has checked out */}
      {checkout ? (
        <p>Thank you for your purchase!</p>
      ) : cartItems.length === 0 ? (
        // Display a message if the cart is empty
        <p>Your cart is empty.</p>
      ) : (
        // Display the cart items and checkout button if the cart is not empty
        <>
          <ul className="cart-list">
            {/* Map over the cart items and display each item in a list */}
            {cartItems.map((item) => (
              <li key={item.id}>
                {/* Display the item image */}
                <img src={item.image} alt={item.title} style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
                {/* Display the item title, price, and quantity */}
                {item.title} - ${item.price} - Quantity: {item.quantity}
                {/* Button to remove the item from the cart */}
                <button 
                className='remove-item-button'
                onClick={() => handleRemoveItem(item.id)}>Remove Item</button>
                {/* Buttons to update the quantity of the item */}
                <button 
                className='quantity-button'
                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}> + </button>
                <button 
                className='quantity-button'
                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}> - </button>
              </li>
            ))}
          </ul>
          {/* Display the total number of items in the cart */}
          <p>Total Items: {calculateTotalItems()}</p>
          {/* Display the total price of the items in the cart */}
          <p>Total Price: ${calculateTotal().toFixed(2)}</p>
          {/* Button to place order */}
          {user ? (
            cartItems.length > 0 && (
              <button
                className='place-order-button'
                onClick={async () => {
                  if (!user) {
                    alert("Please login to place an order.");
                    return;
                  }

                  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

                  // Transform cart items to a serializable format
                  const orderItems = cartItems.map(item => ({
                    id: item.id,
                    title: item.title,
                    price: item.price,
                    image: item.image,
                    quantity: item.quantity,
                  }));

                  const orderData = {
                    userId: user.uid,
                    items: orderItems, // Use the transformed orderItems
                    totalPrice: totalPrice,
                    createdAt: serverTimestamp(),
                  };

                  dispatch(clearCart());
                  setCheckout(true);

                  try {
                    const ordersCollection = collection(db, 'orders');
                    await addDoc(ordersCollection, orderData);
                    alert('Order placed successfully!');
                  } catch (error: any) {
                    alert(`Error placing order: ${error.message}`);
                  }
                }}
              >
                Place Order
              </button>
            )
          ) : (
            <div>
              <p>Please <Link to="/login">login</Link> or <Link to="/register">register</Link> to complete your purchase.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ShoppingCart;
