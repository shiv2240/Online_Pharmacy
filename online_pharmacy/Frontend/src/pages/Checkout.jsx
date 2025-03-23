import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { realtimeDb } from "../firebase/config"; // ✅ Use Realtime Database
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { ref, set, remove } from "firebase/database";

function Checkout() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const { currentUser } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (!currentUser) {
      toast.error("You must be logged in to place an order.");
      setLoading(false);
      return;
    }
  
    try {
      const orderId = Date.now().toString(); // Unique Order ID
      const userCartRef = ref(realtimeDb, `users/${currentUser.uid}/cart`);
  
      // Fetch user's cart data
      const cartSnapshot = await get(userCartRef);
      const cartItems = cartSnapshot.exists() ? cartSnapshot.val() : null;
  
      if (!cartItems) {
        toast.error("Your cart is empty. Please add items before placing an order.");
        setLoading(false);
        return;
      }
  
      // ✅ Capture Full Name Properly
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      console.log("Captured Name:", fullName); // Debugging Line
  
      // ✅ Calculate Total Price
      const totalAmount = Object.values(cartItems).reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
  
      // ✅ Save Order to Firebase
      await set(ref(realtimeDb, `orders/${orderId}`), {
        userId: currentUser.uid,
        name: fullName, // Store Name
        email: formData.email,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        products: cartItems, // Store Products
        total: totalAmount, // Store Total Amount
        status: "pending",
        createdAt: new Date().toISOString(),
      });
  
      // ✅ Clear user's cart after order placement
      await remove(userCartRef);
  
      // ✅ Show success message
      toast.success("Order placed successfully!");
  
      // ✅ Reset form fields
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        city: "",
        postalCode: "",
      });
  
    } catch (error) {
      console.error("Error processing order:", error);
      toast.error("Failed to process order. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  
  

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-screen mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Checkout
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Shipping Information
            </h2>
          </div>

          {[
            { label: "First Name", name: "firstName", type: "text" },
            { label: "Last Name", name: "lastName", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Address", name: "address", type: "text" },
            { label: "City", name: "city", type: "text" },
            { label: "Postal Code", name: "postalCode", type: "text" },
          ].map(({ label, name, type }, index) => (
            <div
              key={index}
              className={`md:col-span-${
                name === "email" || name === "address" ? "2" : "1"
              }`}
            >
              <label className="block text-sm font-medium text-gray-700">
                {label}
              </label>
              <input
                type={type}
                name={name}
                required
                value={formData[name]}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm px-4 py-3 text-gray-900 bg-gray-100 focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
              />
            </div>
          ))}

          <div className="md:col-span-2 mt-6">
            <button
              type="submit"
              className="w-full bg-orange-600 text-white font-semibold text-lg px-6 py-3 rounded-lg hover:bg-orange-700 transition duration-300"
            >
              Place Order
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default Checkout;

{
  /* {[
            { label: "Card Number", name: "cardNumber", type: "text" },
            {
              label: "Expiry Date",
              name: "expiryDate",
              type: "text",
              placeholder: "MM/YY",
            },
            { label: "CVV", name: "cvv", type: "text" },
          ].map(({ label, name, type, placeholder }, index) => (
            <div key={index} className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700">
                {label}
              </label>
              <input
                type={type}
                name={name}
                required
                value={formData[name]}
                onChange={handleInputChange}
                placeholder={placeholder}
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm px-4 py-3 text-gray-900 bg-gray-50 focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
              />
            </div>
          ))} */
}
