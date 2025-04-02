import React, { useState, useEffect } from 'react';
import { db } from '../firebasConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';


const OrderDetails = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState<any>(null);

    useEffect(() => {
        // Fetch order details from Firestore
        const fetchOrder = async () => {
            if (!orderId) return;

            try {
                const orderDoc = doc(db, 'orders', orderId);
                const docSnapshot = await getDoc(orderDoc);

                if (docSnapshot.exists()) {
                    setOrder({ id: docSnapshot.id, ...docSnapshot.data() });
                } else {
                    console.log('No such document!');
                }
            } catch (error: any) {
                console.error('Error fetching order:', error.message);
            }
        };

        fetchOrder();
    }, [orderId]);

    if (!order) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Order Details</h1>
            <p>Order ID: {order.id}</p>
            <p>Date: {order.createdAt?.toDate().toLocaleDateString()}</p>
            <p>Total: ${order.totalPrice?.toFixed(2)}</p>
            <h2>Items:</h2>
            <ul>
                {order.items.map((item: any) => (
                    <li key={item.id}>
                        {item.title} - Quantity: {item.quantity} - Price: ${item.price}
                    </li>
                ))}
            </ul>
            <Link to="/">
                <button>Go to Products Page</button>
            </Link>
        </div>
    );
};

export default OrderDetails;
