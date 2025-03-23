import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { ref, get } from "firebase/database";
import { db, realtimeDb } from "../firebase/config";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

function Profile() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const ordersRef = useRef(null);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    fetchUserData();
    fetchOrders();
  }, [currentUser]);

  useEffect(() => {
    if (new URLSearchParams(location.search).get("tab") === "orders" && ordersRef.current) {
      ordersRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [orders]);

  const fetchUserData = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const snapshot = await get(ref(realtimeDb, "orders"));
      if (snapshot.exists()) {
        const ordersData = Object.values(snapshot.val()).filter((o) => o.userId === currentUser.uid);
        setOrders(ordersData);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-screen mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6 mb-8"
      >
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <p className="text-gray-600">Email: {currentUser?.email || "N/A"}</p>
            {userData && (
              <>
                <p className="text-gray-600">Name: {userData.name || "N/A"}</p>
                <p className="text-gray-600">Phone: {userData.phone || "N/A"}</p>
              </>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Default Shipping Address</h2>
            {userData?.address ? (
              <>
                <p className="text-gray-600">{userData.address.street}</p>
                <p className="text-gray-600">
                  {userData.address.city}, {userData.address.state}
                </p>
                <p className="text-gray-600">{userData.address.postalCode}</p>
              </>
            ) : (
              <p className="text-gray-600">No address on file.</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Order History Section */}
      <div className="bg-white rounded-lg shadow-md p-6" ref={ordersRef}>
        <h2 className="text-2xl font-bold mb-6">Order History</h2>
        {orders.length === 0 ? (
          <p className="text-gray-600">No orders found</p>
        ) : (
          <div className="space-y-6">
          {orders.map((order, index) => (
  <motion.div
    key={order?.id || index}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="border rounded-lg p-4"
  >
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold">
        Order #{order?.id ? order.id.slice(0, 8) : "Unknown"}
      </h3>
      <span
        className={`px-3 py-1 rounded-full text-sm ${
          order?.status === "delivered"
            ? "bg-green-100 text-green-800"
            : order?.status === "processing"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {order?.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Pending"}
      </span>
    </div>
    <div className="text-gray-600">
      <p><strong>Name:</strong> {order?.name || "N/A"}</p>
      <p><strong>Email:</strong> {order?.email || "N/A"}</p>
      <p><strong>Date:</strong> {order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Unknown"}</p>
      <p><strong>Shipping Address:</strong> {order?.address || "N/A"}</p>
      <p><strong>Total:</strong> ${order?.total ? order.total.toFixed(2) : "0.00"}</p>
      <p><strong>Products:</strong></p>
      <ul className="list-disc pl-5">
        {order?.products
          ? Object.values(order.products).map((product, idx) => (
              <li key={idx}>
                {product.name} - ${product.price.toFixed(2)} x {product.quantity}
              </li>
            ))
          : <li>No products found</li>
        }
      </ul>
    </div>
  </motion.div>
))}


          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
