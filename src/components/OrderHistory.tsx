import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebasConfig';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link } from 'react-router-dom';


// Define the structure of an order
interface Order {
  id: string;
  userId: string;
  items: any[];
  totalPrice: number;
  createdAt: any;
}

const OrderHistory = () => {
    // State to store the user's order history
  const [orders, setOrders] = useState<Order[]>([]);
  // Get the current user from Firebase Auth
  const [user] = useAuthState(auth);

  // Fetch order history when the component mounts or when the user changes
  useEffect(() => {
    // Fetch order history from Firestore
    const fetchOrders = async () => {
      if (!user) return; // Do nothing if user is not logged in

      try {
        // Reference to the orders collection in Firestore
        const ordersCollection = collection(db, 'orders');
        // Query to get orders for the current user, ordered by creation date
        const q = query(
          ordersCollection,
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        // Execute the query and get the snapshot
        const querySnapshot = await getDocs(q);


        // Map through the documents and extract order data

        const ordersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          userId: doc.data().userId,
          items: doc.data().items,
          totalPrice: doc.data().totalPrice,
          createdAt: doc.data().createdAt,
        }));
        // Update the state with the fetched orders
        setOrders(ordersData);
      } catch (error: any) {
        console.error('Error fetching orders:', error.message);
      }
    };

    fetchOrders();
  }, [user]);

  return (
    <div>
      <h1>Order History</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              <Link to={`/order/${order.id}`}>
                Order ID: {order.id} - Date: {order.createdAt?.toDate().toLocaleDateString()} - Total: ${order.totalPrice?.toFixed(2)}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Link to="/">
        <button>Go to Products Page</button>
      </Link>
    </div>
  );
};

export default OrderHistory;
