import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FaBox, FaShippingFast, FaCheckCircle } from 'react-icons/fa';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`/api/orders/${user.id}`);
        setOrders(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchOrders();
  }, [user]);

  const getStatusIcon = (status, currentStatus) => {
    const icons = {
      processing: <FaBox className="text-gray-400" />,
      shipped: <FaShippingFast className="text-blue-500" />,
      delivered: <FaCheckCircle className="text-green-500" />
    };
    
    return (
      <motion.div
        animate={status === currentStatus ? { scale: 1.2 } : {}}
        className={`p-4 rounded-full ${status === currentStatus ? 'bg-blue-50' : ''}`}
      >
        {icons[status]}
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <h2 className="text-2xl font-bold mb-8">Order History</h2>
      
      {orders.map(order => (
        <motion.div
          key={order._id}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-lg shadow-md p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Order #{order._id.slice(-6)}</h3>
              <p className="text-gray-500 text-sm">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${
              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
            }`}>
              {order.status}
            </span>
          </div>

          <div className="flex justify-between items-center mb-6">
            {['processing', 'shipped', 'delivered'].map(status => (
              <div key={status} className="flex flex-col items-center">
                {getStatusIcon(status, order.status)}
                <span className="text-sm mt-2 capitalize">{status}</span>
              </div>
            ))}
          </div>

          <div className="grid gap-4">
            {order.items.map(item => (
              <div key={item.medicineId._id} className="flex items-center border-b pb-4">
                <img 
                  src={item.medicineId.image || '/placeholder-medicine.jpg'}
                  alt={item.medicineId.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="ml-4">
                  <h4 className="font-semibold">{item.medicineId.name}</h4>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ${item.medicineId.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Orders;