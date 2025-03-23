import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import LoadingSpinner from '../components/LoadingSpinner';

const MedicineDetails = () => {
  const { id } = useParams();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();
  const { user } = useAuth();

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const res = await axios.get(`/api/medicines/${id}`);
        setMedicine(res.data);
      } catch (error) {
        addNotification('Failed to load medicine details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchMedicine();
  }, [id, addNotification]);

  const addToCart = async () => {
    try {
      await axios.post('/api/cart', { medicineId: id, quantity: 1 }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      addNotification('Added to cart', 'success');
    } catch (error) {
      addNotification('Failed to add to cart', 'error');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <img 
            src={medicine.image || '/placeholder-medicine.jpg'} 
            alt={medicine.name}
            className="w-full h-96 object-contain"
          />
        </div>
        
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{medicine.name}</h1>
          <p className="text-gray-600">{medicine.description}</p>
          
          <div className="text-2xl font-bold text-primary-600">
            ${medicine.price}
          </div>

          {user && (
            <button
              onClick={addToCart}
              className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MedicineDetails;