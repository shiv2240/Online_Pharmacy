import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // Import Footer
import Success from './components/Success';

// Lazy-loaded pages
const Home = lazy(() => import('./pages/Home'));
const Medicines = lazy(() => import('./pages/Medicines'));
const MedicineDetails = lazy(() => import('./pages/MedicineDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Orders = lazy(() => import('./pages/Orders'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Terms = lazy(() => import('./pages/Terms'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const Payment = lazy(() => import('./components/Payment'));  // Import the Payment page
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId'); // Retrieve userId from localStorage
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  return (
    <Router>
      <CartProvider>
        <AuthProvider>
          <NotificationProvider>
            <Navbar />
            <ErrorBoundary>
              <Suspense fallback={<LoadingSpinner fullScreen />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/medicines" element={<Medicines />} />
                  <Route path="/medicine/:id" element={<MedicineDetails />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/checkout" element={<Checkout />} />
                  
                  {/* Pass the userId to Payment */}
                  <Route 
                    path="/payment" 
                    element={<Payment/>} 
                  />

                  {/* Protected Routes */}
                  <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                  <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/success" element={<ProtectedRoute><Success /></ProtectedRoute>} />

                  {/* Footer Pages */}
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<About />} />

                  {/* 404 handler */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
            <Footer /> {/* Footer added here */}
          </NotificationProvider>
        </AuthProvider>
      </CartProvider>
    </Router>
  );
}

export default App;
