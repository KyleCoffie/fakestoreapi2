import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { addItem } from '../store/cartSlice';
import './Home.css';
import StarRatings from 'react-star-ratings';
import { auth } from '../firebasConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link } from 'react-router-dom';
import ShoppingCart from './ShoppingCart';
import Logout from './Logout';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebasConfig';
import { fetchProducts, fetchCategories, populateFirestore, fetchProductsByCategory } from '../services/productService';

// Home component: displays a list of products and allows filtering by category
const Home = () => {
  const [user, loading, error] = useAuthState(auth);
  const { data: products, error: productsError, isLoading: productsLoading } = useQuery({ queryKey: ['products', user], queryFn: () => fetchProducts(user) });
  const { data: categories, error: categoriesError, isLoading: categoriesLoading } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
  const [selectedCategory, setSelectedCategory] = useState('');
  const { data: categoryProducts, error: categoryProductsError, isLoading: categoryProductsLoading } = useQuery({
    queryKey: ['categoryProducts', selectedCategory],
    queryFn: () => fetchProductsByCategory(selectedCategory),
    enabled: !!selectedCategory,
  });
  const dispatch = useDispatch();

  if (productsLoading || categoriesLoading || categoryProductsLoading || loading) return <div>Loading...</div>;
  if (productsError || categoriesError || categoryProductsError || error) return <div>Error: {productsError?.message || categoriesError?.message || categoryProductsError?.message || error?.message}</div>;

  const productsToDisplay = selectedCategory ? categoryProducts : products;

  const handleDelete = async (docId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const productDoc = doc(db, 'products', docId);
        await deleteDoc(productDoc);
        alert("Product deleted successfully!");
      } catch (error: any) {
        alert(`Error deleting product: ${error.message}`);
      }
    }
  };

  return (
    <div>
      <div className="home-container">
        <h1>Products</h1>
        <select className="category-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories?.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div className="products-container">
        {productsToDisplay?.map((product) => {
          const { docId, id, image, title, price, description, rating } = product;
          return (
            <div key={docId} className="product-card">
                <img src={image} alt={title} className="product-image" />
                <h3>{title}</h3>
                <p className="product-price">Price: ${price?.toFixed(2)}</p>
                <p>{description}</p>
                <StarRatings
                  rating={rating?.rate}
                starRatedColor="black"
                numberOfStars={5}
                starEmptyColor='white'
                starDimension='20px'
                name='rating'
              />
              <button
                className='add-to-cart-button'
                onClick={() => dispatch(addItem({
                  id,
                  title,
                  price,
                  image,
                  quantity: 1,
                }))}>Add to Cart</button>
              {user && (
                <>
                  <Link to={`/edit-product/${docId}`}>
                    <button>Edit</button>
                  </Link>
                  <button onClick={() => handleDelete(docId)}>Delete</button>
                </>
              )}
            </div>
          );
        })}
      </div>
      {user && (
        <>
          <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
            <Link to="/profile">
              <button>View Profile</button>
            </Link>
            <Logout />
          </div>
          <Link to="/add-product">
            <button>Create New Product</button>
          </Link>
          {user && <button onClick={populateFirestore}>Populate Firestore</button>}
        </>
      )}
      <ShoppingCart />
    </div>
  );
};

export default Home;
