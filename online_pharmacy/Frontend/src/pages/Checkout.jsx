import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, setCartItems } = useCart();
  const { addNotification } = useNotification();

  useEffect(() => {
    if (!user) {
      addNotification('Please login to checkout', 'warning');
      navigate('/login');
    }
  }, [user, navigate, addNotification]);

  const handleCheckout = async () => {
    try {
      await axios.post('https://online-pharmacy-ps8n.onrender.com/api/orders'), 
        { items: cartItems.map(item => ({
          medicineId: item.medicineId._id,
          quantity: item.quantity
        }))},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      
          }  ;

      setCartItems([]);
      addNotification('Order placed successfully!', 'success');
      navigate('/orders');
    } catch (error) {
      addNotification(error.response?.data?.message || 'Checkout failed', 'error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 py-8 min-h-screen"
    >
      <h2 className="text-3xl font-bold mb-8">Checkout</h2>
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-right mb-8">
          <button
            onClick={handleCheckout}
            className="bg-primary-500 text-white px-8 py-3 rounded-lg hover:bg-primary-600"
          >
            Confirm Order
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;