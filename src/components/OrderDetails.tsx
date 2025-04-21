import React, { useState, useEffect } from 'react';
import { db } from '../firebasConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '/src/components/OrderHistory.css';

const OrderDetails = () => {
    // Extracts the order ID from the URL parameters
    const { orderId } = useParams();
    
    // State to store order details
    const [order, setOrder] = useState<any>(null);

    useEffect(() => {
        // Function to fetch order details from Firestore
        const fetchOrder = async () => {
            if (!orderId) return; // Ensures an orderId is present before proceeding

            try {
                // Reference to the specific order document in Firestore
                const orderDoc = doc(db, 'orders', orderId);
                
                // Fetches the document snapshot
                const docSnapshot = await getDoc(orderDoc);

                if (docSnapshot.exists()) {
                    // Updates the state with the order data if document exists
                    setOrder({ id: docSnapshot.id, ...docSnapshot.data() });
                } else {
                    console.log('No such document!'); // Logs message if document doesn't exist
                }
            } catch (error: any) {
                console.error('Error fetching order:', error.message); // Logs any errors encountered
            }
        };

        fetchOrder();
    }, [orderId]); // Runs effect when orderId changes

    // Displays a loading message while fetching data
    if (!order) {
        return <div>Loading...</div>;
    }

    return (
        <div className='orderhistory-form-container'>
            <h1>Order Details</h1>
            <p>Order ID: {order.id}</p>
            <p>Date: {order.createdAt?.toDate().toLocaleDateString()}</p> {/* Formats order date */}
            <p>Total: ${order.totalPrice?.toFixed(2)}</p> {/* Formats total price */}

            <h2>Items:</h2>
            <ol>
                {/* Maps over the order items and displays them */}
                {order.items.map((item: any) => (
                    <li key={item.id}>
                        {item.title} - Quantity: {item.quantity} - Price: ${item.price}
                    </li>
                ))}
            </ol>

            {/* Button to navigate back to the products page */}
            <Link to="/">
                <button>Go to Products Page</button>
            </Link>
        </div>
    );
};

export default OrderDetails;
