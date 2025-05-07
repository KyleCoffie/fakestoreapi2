import { db } from '../../firebaseConfig.mjs/index.js';
import { collection, addDoc, getDocs, } from 'firebase/firestore';

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

// Helper function to map product data
const mapProductData = (data: any, docId?: string): Product => {
  return {
    docId: docId || data.id.toString(), // Use API product ID as docId if docId is not provided
    id: data.id,
    title: data.title,
    price: data.price,
    description: data.description,
    category: data.category,
    image: data.image,
    rating: data.rating || { rate: 0, count: 0 },
  };
};

// Function to fetch all products from the Fake Store API - changed to populate firestore
export const populateFirestore = async () => {
  const products = await fetch('https://fakestoreapi.com/products').then(res => res.json());
  const productsCollection = collection(db, 'products');
  const existingProducts = await getDocs(productsCollection);

  if (existingProducts.empty) {
    await Promise.all(products.map(async (product: any) => {
      await addDoc(productsCollection, { ...product });
    }));
    alert('Firestore populated!');
  } else {
    alert('Firestore already populated!');
  }
};

// Function to fetch products from Firestore or Fake Store API
export const fetchProducts = async (user: any): Promise<Product[]> => {
  const productsCollection = collection(db, 'products');
  const snapshot = await getDocs(productsCollection);

  // If user is logged in, fetch from Firestore
  if (user && !snapshot.empty) {
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return mapProductData(data, doc.id);
    });
  } else {
    // If user is not logged in or Firestore is empty, fetch from Fake Store API
    const response = await fetch('https://fakestoreapi.com/products');
    const products = await response.json();
    return products.map((product: any) => {
      return mapProductData(product);
    });
  }
};

// Function to fetch all categories from the Fake Store API
export const fetchCategories = async () => {
  const response = await fetch('https://fakestoreapi.com/products/categories');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

// Function to fetch products by category from Fake Store API
export const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
  const response = await fetch(`https://fakestoreapi.com/products/category/${category}`);
  if (!response.ok) throw new Error('Failed to fetch Products');
  return response.json();
};



