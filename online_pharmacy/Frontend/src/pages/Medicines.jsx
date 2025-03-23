import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();
  const { setCartItems, cartItems } = useCart();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const { data } = await axios.get('https://online-pharmacy-ps8n.onrender.com/api/medicines');
        setMedicines(data);
      } catch (error) {
        addNotification('Failed to load medicines', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, [addNotification]);

  const addToCart = async (medicine) => {
    if (!user) {
      addNotification('Please login to add items to cart', 'warning');
      return;
    }

    try {
      const existingItem = cartItems.find(item => item.medicineId._id === medicine._id);
      const newQuantity = existingItem ? existingItem.quantity + 1 : 1;
      
      const { data } = await axios.post('https://online-pharmacy-ps8n.onrender.com/api/cart', 
        { medicineId: medicine._id, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`} }
      );

      setCartItems(data.items);
      addNotification('Added to cart', 'success');
    } catch (error) {
      addNotification(error.response?.data?.message || 'Failed to add to cart', 'error');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMedicines = medicines.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(medicines.length / itemsPerPage);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">All Medicines</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentMedicines.map((medicine, index) => (
          <motion.div
            key={medicine._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <motion.img
              src={medicine.image || '/placeholder-medicine.jpg'}
              alt={medicine.name}
              className="w-full h-48 object-contain p-4"
              animate={{ x: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            />

            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{medicine.name}</h3>
              <p className="text-gray-700 mb-4">{medicine.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-primary-600">${medicine.price.toFixed(2)}</span>
                <button
                  onClick={() => addToCart(medicine)}
                  className="bg-gradient-to-r from-primary-500 to-primary-600 text-black px-6 py-3 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-gray-300 hover:border-gray-400"
                >
                  🛒 Add to Cart
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8 space-x-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-800 font-semibold">Page {currentPage} of {totalPages}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default Medicines;