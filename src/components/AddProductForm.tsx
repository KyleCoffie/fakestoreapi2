import React, { useState } from 'react';
// Import Firestore and Firebase utilities for data handling
import { db } from '../firebasConfig';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import './ProductForm.css'; // Import the stylesheet for form styling

// Define the AddProductForm component
const AddProductForm = () => {
  // State variables to store form input values
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [stock, setStock] = useState('');
  const [ratingRate, setRatingRate] = useState('');
  const [ratingCount, setRatingCount] = useState('');

  // Hook to navigate programmatically after form submission
  const navigate = useNavigate();

  // Function to handle product submission to Firestore
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    try {
      // Construct the product data object
      const productData = {
        title,
        price: parseFloat(price), // Ensure price is stored as a number
        description,
        category,
        image,
        stock: parseInt(stock), // Convert stock to an integer
        rating: { 
          rate: parseFloat(ratingRate), // Convert rating rate to a float
          count: parseInt(ratingCount) // Convert rating count to an integer
        }
      };

      // Reference Firestore collection and add the new product document
      const productsCollection = collection(db, 'products');
      await addDoc(productsCollection, productData);
      
      alert('Product added successfully!'); // Notify the user of success
      navigate('/'); // Redirect user to the home page
    } catch (error: any) {
      // Handle any errors during the submission process
      alert(`Error adding product: ${error.message}`);
    }
  };

  return (
    <div className="product-form-container">
      <h1>Add New Product</h1>
      <form className="product-form" onSubmit={handleSubmit}>
        {/* Form fields for product details */}
        <label>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Price:
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </label>
        <label>
          Description:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </label>
        <label>
          Category:
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
        </label>
        <label>
          Image URL:
          <input type="text" value={image} onChange={(e) => setImage(e.target.value)} required />
        </label>
        <label>
          Stock:
          <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
        </label>
        <label>
          Rating Rate:
          <input type="number" value={ratingRate} onChange={(e) => setRatingRate(e.target.value)} required />
        </label>
        <label>
          Rating Count:
          <input type="number" value={ratingCount} onChange={(e) => setRatingCount(e.target.value)} required />
        </label>
        {/* Submit button to add the product */}
        <button type="submit">Add Product</button>
        {/* Cancel button to return to the home page */}
        <Link to="/">
          <button>Cancel</button>
        </Link>
      </form>
    </div>
  );
};

export default AddProductForm;
