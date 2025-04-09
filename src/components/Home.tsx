import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { addItem } from '../store/cartSlice';
import './Home.css';

// Define the Product type
interface Product {
  docId: string;
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}
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
  const { data: categories, error: categoriesError, isLoading: categoriesLoading } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
  const [selectedCategory, setSelectedCategory] = useState('');
  const { data: categoryProducts, error: categoryProductsError, isLoading: categoryProductsLoading } = useQuery({
    queryKey: ['categoryProducts', selectedCategory],
    queryFn: () => fetchProductsByCategory(selectedCategory),
    enabled: !!selectedCategory,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        const productsData = await fetchProducts(user);
        setProducts(productsData);
      } catch (error: any) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProductsData();
  }, [user]);

  if (categoriesLoading || categoryProductsLoading || loading) return <div>Loading...</div>;
  if (categoriesError || categoryProductsError || error) return <div>Error: {categoriesError?.message || categoryProductsError?.message || error?.message}</div>;

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
          {categories?.map((category: string) => (
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
                  rating={rating?.rate || 0}
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
      <div style={{ display: 'flex', justifyContent: 'left' }}>
        {user && <button onClick={populateFirestore}>Populate Firestore</button>}
      </div>
      <ShoppingCart />
    </div>
  );
};

export default Home;
