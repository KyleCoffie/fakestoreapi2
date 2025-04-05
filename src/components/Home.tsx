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
import { db } from '../firebasConfig';
import { collection, addDoc, getDocs, doc, deleteDoc, query, where } from 'firebase/firestore';

interface Product {
  docId: string;
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

// Function to fetch all products from the Fake Store API - changed to populate firestore
const populateFirestore = async () => {
  const products = await fetch('https://fakestoreapi.com/products').then(res => res.json());
  const productsCollection = collection(db, 'products');
  const existingProducts = await getDocs(productsCollection);

  if (existingProducts.empty) {
    products.forEach(async (product: any) => {
      await addDoc(productsCollection, { ...product });
    });
    alert('Firestore populated!');
  } else {
    alert('Firestore already populated!');
  }
};

// Function to fetch products from Firestore or Fake Store API
const fetchProducts = async (user: any): Promise<Product[]> => {
  const productsCollection = collection(db, 'products');
  const snapshot = await getDocs(productsCollection);

  // If user is not logged in, fetch from Fake Store API
  if (!user) {
    const response = await fetch('https://fakestoreapi.com/products');
    const products = await response.json();
    return products.map((product: any) => {
      const { title, price, description, category, image, rating } = product;
      return {
        docId: product.id.toString(), // Use API product ID as docId
        id: product.id,
        title: title,
        price: price,
        description: description,
        category: category,
        image: image,
        rating: rating || { rate: 0, count: 0 },
      };
    });
  }

  // If user is logged in, fetch from Firestore
  if (!snapshot.empty) {
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
        rating: data.rating || { rate: 0, count: 0 },
      };
    });
  } else {
    const response = await fetch('https://fakestoreapi.com/products');
    const products = await response.json();
    return products.map((product: any) => {
      const { title, price, description, category, image, rating } = product;
      return {
        docId: product.id.toString(), // Use API product ID as docId
        id: product.id,
        title: title,
        price: price,
        description: description,
        category: category,
        image: image,
        rating: rating || { rate: 0, count: 0 },
      };
    });
  }
};

// Function to fetch all categories from the Fake Store API
const fetchCategories = async () => {
  const response = await fetch('https://fakestoreapi.com/products/categories');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
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
      rating: data.rating || { rate: 0, count: 0 },
    };
  });
};

// Home component: displays a list of products and allows filtering by category
const Home = () => {
  const [user, loading, error] = useAuthState(auth);
  const { data: products, error: productsError, isLoading: productsLoading } = useQuery<Product[]>({ queryKey: ['products', user], queryFn: () => fetchProducts(user) });
  const { data: categories, error: categoriesError, isLoading: categoriesLoading } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
  const [selectedCategory, setSelectedCategory] = useState('');
  const { data: categoryProducts, error: categoryProductsError, isLoading: categoryProductsLoading } = useQuery<Product[]>({
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
                <p style={{ fontWeight: 'bold', fontStyle: 'italic' }}>Price: ${price?.toFixed(2)}</p>
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
        </>
      )}
      <button onClick={populateFirestore}>Populate Firestore</button>
      <ShoppingCart />
    </div>
  );
};

export default Home;
