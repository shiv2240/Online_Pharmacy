import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { FaPlus, FaMinus } from 'react-icons/fa';

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addNotification } = useNotification();
  const { cartItems, setCartItems } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!user) {
          addNotification('Please login to view your cart', 'warning');
          navigate('/login');
          return;
        }

        const { data } = await axios.get('/api/cart', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        setCartItems(data.items || []);
      } catch (error) {
        addNotification(error.response?.data?.message || 'Failed to load cart', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user, setCartItems, addNotification, navigate]);

  const handleQuantityChange = async (medicineId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const response = await axios.post('/api/cart', { medicineId, quantity: newQuantity }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // Update cart state with latest response from backend
      setCartItems(response.data.items || []);
    } catch (error) {
      addNotification(error.response?.data?.message || 'Failed to update quantity', 'error');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.medicineId.price * item.quantity), 0).toFixed(2);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-4 py-8 min-h-screen mt-24">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Shopping Cart</h2>

      {cartItems.map(item => (
        <div key={item.medicineId._id} className="flex justify-between p-4 bg-white rounded-md shadow-md mb-4">
          <p>{item.medicineId.name} - ${item.medicineId.price.toFixed(2)}</p>
          <div className="flex items-center gap-3">
            <button onClick={() => handleQuantityChange(item.medicineId._id, item.quantity - 1)}><FaMinus /></button>
            <span>{item.quantity}</span>
            <button onClick={() => handleQuantityChange(item.medicineId._id, item.quantity + 1)}><FaPlus /></button>
          </div>
        </div>
      ))}

      <p className="text-xl font-bold">Total: ${calculateTotal()}</p>
    </motion.div>
  );
};

export default Cart;