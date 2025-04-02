import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { addItem } from '../store/cartSlice';
import './Home.css';
import StarRatings from 'react-star-ratings'; // Import the StarRatings component for displaying star ratings
import { auth } from '../firebasConfig'; // Import the auth object from firebaseConfig
import { useAuthState } from 'react-firebase-hooks/auth'; // Import the useAuthState hook
import { Link } from 'react-router-dom'; // Import the Link component for navigation
import ShoppingCart from './ShoppingCart'; // Import the ShoppingCart component
import { db } from '../firebasConfig'; // Import the Firestore database
import { collection, addDoc, getDocs, doc, deleteDoc, query, where } from 'firebase/firestore'; // Import Firestore functions

interface Product {
  docId: string;
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  stock: number;
  rating: { rate: number; count: number };
}

// Function to fetch all products from the Fake Store API - changed to populate firestore
const populateFirestore = async () => {
  const products = await fetch('https://fakestoreapi.com/products').then(res => res.json());
  const productsCollection = collection(db, 'products');
  const existingProducts = await getDocs(productsCollection);

  if (existingProducts.empty) {
    products.forEach(async (product: any) => {
      await addDoc(productsCollection, { ...product, stock: 100 });
    });
    alert('Firestore populated!');
  } else {
    alert('Firestore already populated!');
  }
};

// Function to fetch products from Firestore
const fetchProducts = async (): Promise<Product[]> => {
  const productsCollection = collection(db, 'products');
  const snapshot = await getDocs(productsCollection);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      docId: doc.id,
      id: data.id,
      title: data.title,
      price: data.price,
      description: data.description,
      category: data.category,
      image: data.image,
      stock: data.stock,
      rating: data.rating || { rate: 0, count: 0 },
    };
  });
};

// Function to fetch all categories from the Fake Store API
const fetchCategories = async () => {
  const response = await fetch('https://fakestoreapi.com/products/categories');
  // If the response is not ok, throw new Error
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  // Parse the response as JSON and return it
  return response.json();
};

// Function to fetch products by category from Firestore
const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
  const productsCollection = collection(db, 'products');
  const q = query(
    productsCollection,
    where('category', '==', category)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      docId: doc.id,
      id: data.id,
      title: data.title,
      price: data.price,
      description: data.description,
      category: data.category,
      image: data.image,
      stock: data.stock,
      rating: data.rating || { rate: 0, count: 0 },
    };
  });
};

// Home component: displays a list of products and allows filtering by category
const Home = () => {
  // Use the useQuery hook to fetch products from Firestore
  const { data: products, error: productsError, isLoading: productsLoading } = useQuery<Product[]>({ queryKey: ['products'], queryFn: fetchProducts });
  // Use the useQuery hook to fetch categories from the API
  const { data: categories, error: categoriesError, isLoading: categoriesLoading } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
  // State variable to store the selected category
  const [selectedCategory, setSelectedCategory] = useState('');
  // Use the useQuery hook to fetch products by category from the API
  const { data: categoryProducts, error: categoryProductsError, isLoading: categoryProductsLoading } = useQuery<Product[]>({
    queryKey: ['categoryProducts', selectedCategory],
    queryFn: () => fetchProductsByCategory(selectedCategory),
    enabled: !!selectedCategory, // Only fetch products if a category is selected
  });
  // Get the dispatch function from Redux
  const dispatch = useDispatch();

  // Use the useAuthState hook to get the current user
  const [user, loading, error] = useAuthState(auth);

  // If any of the data is loading, display a loading message
  if (productsLoading || categoriesLoading || categoryProductsLoading || loading) return <div>Loading...</div>;
  // If there is an error, display an error message
  if (productsError || categoriesError || categoryProductsError || error) return <div>Error: {productsError?.message || categoriesError?.message || categoryProductsError?.message || error?.message}</div>;

  // Determine which products to display based on whether a category is selected
  const productsToDisplay = selectedCategory ? categoryProducts : products;

  const handleDelete = async (docId: string) => {
    // Delete the product from Firestore
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
      {/* Heading for the products section */}
      <h1>Products</h1>
      {/* Select element for filtering products by category */}
      <select className="category-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
        {/* Option to display all categories */}
        <option value="">All Categories</option>
        {/* Map over the categories and create an option for each one */}
        {categories?.map((category) => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
      {/* Container for the products */}
      <div className="products-container">
        {/* Map over the products to display and create a product card for each one */}
        {productsToDisplay?.map((product) => {
          const { docId, id, image, title, price, stock, description, rating } = product;
          return (
            <div key={docId} className="product-card">
              {/* Display the product image */}
              <img src={image} alt={title} className="product-image" />
              {/* Display the product title */}
              <h3>{title}</h3>
              {/* Display the product price */}
              <p style={{ fontWeight: 'bold', fontStyle: 'italic' }}>Price: ${price?.toFixed(2)}</p>
              <p>Stock: {stock}</p>

              {/* Display the product category */}
              {/* <p>Category: {product.category}</p> */}
              {/* Display the product description */}
              <p>{description}</p>
              {/* Display the star rating for the product */}
              <StarRatings
                rating={rating?.rate}
                starRatedColor="black"
                numberOfStars={5}
                starEmptyColor='white'
                starDimension='25px'
                name='rating'
              />
              {/* Button to add the product to the cart */}
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

      {/* Conditionally render the link to the user profile if the user is logged in */}
      {user && (
        <>
          <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
            <Link to="/profile">
              <button>View Profile</button>
            </Link>
          </div>
          <Link to="/add-product">
            <button>Create New Product</button>
          </Link>
        </>
      )}
      <button onClick={populateFirestore}>Populate Firestore</button>
      <ShoppingCart />
    </div>
  );
};

export default Home;
