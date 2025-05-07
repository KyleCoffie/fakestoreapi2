import React, { useState, useEffect } from 'react';
// Import Firebase Firestore functions and utilities
import { db } from '../../firebaseConfig.mjs/index.js';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate, useParams, Link } from 'react-router-dom';
import './ProductForm.css'; 

// Define the EditProductForm component
const EditProductForm = () => {
  // Retrieve the product ID from the URL parameters
  const { productId } = useParams();

  // State variables to store product details
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [ratingRate, setRatingRate] = useState('');

  // Hook to navigate programmatically
  const navigate = useNavigate();

  // Fetch product data from Firestore when component loads
  useEffect(() => {
    const fetchProduct = async () => {
      // Ensure product ID exists before fetching
      if (!productId) {
        alert('Product ID is missing!');
        navigate('/');
        return;
      }
      try {
        // Reference the Firestore document of the selected product
        const productDoc = doc(db, 'products', productId);
        const productSnapshot = await getDoc(productDoc);

        // If the document exists, update the state with product details
        if (productSnapshot.exists()) {
          const productData = productSnapshot.data();
          setTitle(productData.title);
          setPrice(productData.price.toString());
          setDescription(productData.description);
          setCategory(productData.category);
          setImage(productData.image);
          setRatingRate(productData.rating.rate.toString());
        } else {
          alert('Product not found!');
          navigate('/');
        }
      } catch (error: any) {
        alert(`Error fetching product: ${error.message}`);
        navigate('/');
      }
    };

    fetchProduct();
  }, [productId, navigate]);

  // Handle product update submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure product ID exists before updating
    if (!productId) {
      alert('Product ID is missing!');
      navigate('/');
      return;
    }

    try {
      // Reference the Firestore document to be updated
      const productDoc = doc(db, 'products', productId);
      await updateDoc(productDoc, {
        title,
        price: parseFloat(price),
        description,
        category,
        image,
        rating: { rate: parseFloat(ratingRate)}
      });

      alert('Product updated successfully!');
      navigate('/');
    } catch (error: any) {
      alert(`Error updating product: ${error.message}`);
    }
  };

  return (
    <div className="product-form-container">
      <h1>Edit Product</h1>
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
          Rating Rate:
          <input type="number" value={ratingRate} onChange={(e) => setRatingRate(e.target.value)} required />
        </label>
        {/* Button to submit the form and update the product */}
        <button type="submit">Update Product</button>
        {/* Cancel button to return to home page */}
        <Link to="/">
          <button>Cancel</button>
        </Link>
      </form>
    </div>
  );
};

export default EditProductForm;
