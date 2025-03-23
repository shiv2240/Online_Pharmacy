import { useLocation } from 'react-router-dom';

const Success = () => {
  const { state } = useLocation();
  const orderId = state?.orderId || 'N/A'; // Get orderId from location state, fallback to 'N/A' if not found

  return (
    <div className="max-w-3xl mx-auto p-6 text-center">
      <h2 className="text-3xl font-bold mb-6 text-green-600">Payment Successful!</h2>
      <p className="text-lg mb-4">Thank you for your purchase. Your payment has been successfully processed.</p>
      <p className="text-lg">Your Order ID: <strong>{orderId}</strong></p>
      <p className="text-sm text-gray-500">You can track your order status in the "Orders" section.</p>
    </div>
  );
};

export default Success;
