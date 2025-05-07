import React from 'react';
import './App.css';
import { Provider } from 'react-redux';
import store from './store/store';
import Home from './components/Home';
import ShoppingCart from './components/ShoppingCart';
import UserProfile from './components/UserProfile';
import Login from './components/Login';
import Logout from './components/Logout';
import Register from './components/Register';
import AddProductForm from './components/AddProductForm'; // Import AddProductForm
import EditProductForm from './components/EditProductForm'; // Import EditProductForm
import OrderHistory from './components/OrderHistory'; // Import OrderHistory
import OrderDetails from './components/OrderDetails'; // Import OrderDetails
import Navbar from './components/Navbar'; // Import Navbar component
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebaseConfig.mjs';
import './App.css';


// Create a new QueryClient instance for managing data fetching and caching
const queryClient = new QueryClient();

// App component: renders the Home and ShoppingCart components
const App: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <Navbar />
      {user ? (
        <>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/add-product" element={user ? <AddProductForm /> : <Navigate to="/login" />} /> {/* Add route for AddProductForm */}
            <Route path="/edit-product/:productId" element={user ? <EditProductForm /> : <Navigate to="/login" />} /> {/* Add route for EditProductForm */}
            <Route path="/orders" element={<OrderHistory />} /> {/* Add route for OrderHistory */}
            <Route path="/order/:orderId" element={<OrderDetails />} /> {/* Add route for OrderDetails */}
            <Route path="/login" element={<Navigate to="/" />} /> {/* Prevent logged-in users from accessing login */}
            <Route path="/register" element={<Navigate to="/" />} /> {/* Prevent logged-in users from accessing register */}
          </Routes>
        </>
      ) : (
        <>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} /> {/* Render Home component by default */}
            <Route path="/profile" element={user ? <UserProfile /> : <Navigate to="/login" />} /> {/* Redirect to login if not authenticated */}
            <Route path="/add-product" element={user ? <AddProductForm /> : <Navigate to="/login" />} /> {/* Add route for AddProductForm */}
            <Route path="/edit-product/:productId" element={user ? <EditProductForm /> : <Navigate to="/login" />} /> {/* Redirect to login if not authenticated */}
            <Route path="/orders" element={user ? <OrderHistory /> : <Navigate to="/login" />} /> {/* Redirect to login if not authenticated */}
            <Route path="/order/:orderId" element={user ? <OrderDetails /> : <Navigate to="/login" />} /> {/* Redirect to login if not authenticated */}
          </Routes>
        </>
      )}
    </>
  );
};

// RootApp component: provides the Redux store to the App component
const RootApp: React.FC = () => {
  return (
    // Use the Redux Provider to make the store available to all components
    <Provider store={store}>
      <App />
    </Provider>
  );
};

// Define props type if needed
interface AppWithQueryClientProps {}

// AppWithQueryClient component: provides the React Query client to the RootApp component
const AppWithQueryClient: React.FC<AppWithQueryClientProps> = () => {
  return (
    // Use the QueryClientProvider to manage data fetching and caching
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <RootApp />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default AppWithQueryClient;
