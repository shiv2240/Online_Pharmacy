import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Cart = () => {
  const { cartItems, setCartItems } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate hook

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const { data } = await axios.get('http://localhost:2010/api/cart', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setCartItems(data.items || []);
      } catch (error) {
        console.error('Error fetching cart:', error.response?.data || error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user, setCartItems]);

  const updateQuantity = async (medicineId, newQuantity) => {
    if (newQuantity < 1) return;

    setLoading(true);
    try {
      await axios.post('http://localhost:2010/api/cart', 
        { medicineId, quantity: newQuantity }, 
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      setCartItems(prevCart =>
        prevCart.map(item =>
          item.medicineId._id === medicineId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating cart:', error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.medicineId.price * item.quantity, 0);
  }, [cartItems]);

  const handleProceedToPayment = () => {
    navigate('/payment'); // Redirect to payment page
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.medicineId._id} className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{item.medicineId.name}</h3>
                <p className="text-gray-600">${item.medicineId.price.toFixed(2)} each</p>
                <p className="text-gray-800 font-medium">Subtotal: ${(item.medicineId.price * item.quantity).toFixed(2)}</p>
              </div>

              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => updateQuantity(item.medicineId._id, item.quantity - 1)}
                  className="bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300"
                  disabled={loading}
                >-</button>

                <span className="text-lg">{item.quantity}</span>

                <button 
                  onClick={() => updateQuantity(item.medicineId._id, item.quantity + 1)}
                  className="bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300"
                  disabled={loading}
                >+</button>
              </div>
            </div>
          ))}

          {/* Total Amount Section */}
          <div className="bg-white shadow-md rounded-lg p-4 mt-4 flex justify-between items-center">
            <h3 className="text-xl font-bold">Total Amount:</h3>
            <span className="text-xl font-semibold text-primary-600">${totalAmount.toFixed(2)}</span>
          </div>

          {/* Proceed to Payment Button */}
          <button
  onClick={handleProceedToPayment}
  className="mt-6 bg-primary-500 text-black px-6 py-2 rounded-lg border-2 border-primary-600 hover:bg-primary-600 hover:border-primary-700 transform transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 active:shadow-md"
>
  Proceed to Payment
</button>

        </div>
      )}
    </div>
  );
};

export default Cart;
