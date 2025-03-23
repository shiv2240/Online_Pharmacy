import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Payment = ({ userId }) => {  // Make sure to pass the `userId` from parent component or context
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardDetails, setCardDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare order data to send to the backend
    const orderData = {
      items: [
        // Example: Replace with actual items data
        { medicineId: 'someMedicineId', quantity: 1 }
      ],
      userId,
      address,
      contactNumber,
      paymentMethod,
    };

    try {
      // Call the API to create the order
      const response = await fetch(`/api/orders/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const order = await response.json();

      if (order) {
        setLoading(false);
        // Redirect to success page with orderId
        navigate('/success', { state: { orderId: order._id } });
      }
    } catch (error) {
      console.error('Error submitting payment:', error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Payment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            required
          />
          <small className="text-gray-500">Do not enter original address.</small>
        </div>

        {/* Contact Number */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Contact Number</label>
          <input
            type="text"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            required
          />
          <small className="text-gray-500">Do not enter original number.</small>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Payment Method</option>
            <option value="card">Card</option>
            <option value="upi">UPI</option>
          </select>
        </div>

        {/* Card Details (if card payment selected) */}
        {paymentMethod === 'card' && (
          <div>
            <label className="block text-sm font-medium text-gray-600">Card Details</label>
            <input
              type="text"
              value={cardDetails}
              onChange={(e) => setCardDetails(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              required
            />
            <small className="text-gray-500">Do not enter original card details.</small>
          </div>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="mt-6 bg-primary-500 text-black px-6 py-3 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-primary-600 active:scale-95 active:shadow-sm"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Payment;
