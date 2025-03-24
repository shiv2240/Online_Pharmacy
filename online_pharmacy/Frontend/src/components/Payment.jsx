import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentPage = () => {
  const { cartItems, setCartItems } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const navigate = useNavigate();

  // Handle payment logic
  const handlePayment = async () => {
    setLoading(true);
    try {
      // Log cart items being sent to the backend
      console.log("Sending cartItems:", cartItems);

      // Get user from localStorage
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      console.log("Saved User from LocalStorage:", savedUser); // Debugging line

      const user = savedUser ? JSON.parse(savedUser) : null; // Ensure user is parsed from localStorage

      if (!user || !user._id) {
        throw new Error('User ID is missing');
      }

      // Log the user data for debugging
      console.log("User Data:", user);

      // Call your backend to process the payment
      const response = await axios.post(
        'https://online-pharmacy-ps8n.onrender.com/api/charge',
        {
          userId: user._id,
          cartItems, // Pass cart items for payment processing
        address: 'user address',
        contactNumber: 'user contact',
        paymentMethod: 'card',
        cardDetails: '**** **** **** 1234',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log("backendData", response.data);
      
      // If payment is successful
      console.log("Payment successful!");
      setPaymentStatus('Payment successful!');
      
      // Clear the cart locally and on the backend only if payment is successful
      setCartItems([]);
      
      // Clear the cart on the backend using DELETE request
      await axios.delete(
        'https://online-pharmacy-ps8n.onrender.com/api/cart',
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      // Navigate to success page with orderId as state
      navigate('/success', { state: { orderId: response.data.orderId } });
    
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('Payment failed. Please try again.');
      console.error('Error details:', error.response || error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total amount for the cart
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.medicineId.price * item.quantity,
    0
  );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Payment Page</h2>

      {/* Display message if cart is empty */}
      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty. Please add items to the cart.</p>
      ) : (
        <>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            <div className="bg-white shadow-md rounded-lg p-4">
              {cartItems.map((item) => (
                <div key={item.medicineId._id} className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="font-semibold">{item.medicineId.name}</h4>
                    <p className="text-gray-600">${item.medicineId.price.toFixed(2)} each</p>
                    <p className="text-gray-800 font-medium">Quantity: {item.quantity}</p>
                    <p className="text-gray-800 font-medium">
                      Subtotal: ${(item.medicineId.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              <div className="border-t pt-4">
                <h4 className="text-xl font-bold">Total Amount: ${totalAmount.toFixed(2)}</h4>
              </div>
            </div>
          </div>

          {/* Payment Status Message */}
          {paymentStatus && (
            <div className="mt-4 p-4 rounded-md text-center">
              <p
                className={`${
                  paymentStatus.includes('failed') ? 'text-red-500' : 'text-green-500'
                }`}
              >
                {paymentStatus}
              </p>
            </div>
          )}

          {/* Proceed to Payment Button */}
          <button
            onClick={handlePayment}
            className="mt-6 bg-primary-500 text-black px-6 py-2 rounded-lg border-2 border-primary-600 hover:bg-primary-600 hover:border-primary-700 transform transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 active:shadow-md"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Proceed to Pay'}
          </button>
        </>
      )}
    </div>
  );
};

export default PaymentPage;
