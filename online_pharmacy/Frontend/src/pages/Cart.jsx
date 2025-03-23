import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { realtimeDb } from "../firebase/config";
import { ref, get, set, push, onValue } from "firebase/database";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;

    const cartRef = ref(realtimeDb, `users/${currentUser.uid}/cart`);

    const unsubscribe = onValue(cartRef, (snapshot) => {
      if (snapshot.exists()) {
        const dbCartItems = Object.entries(snapshot.val()).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setCartItems(dbCartItems);
      } else {
        setCartItems([]);
      }
      setLoading(false);
    });

    mergeLocalCartWithFirebase();

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [currentUser]);

  const mergeLocalCartWithFirebase = async () => {
    if (!currentUser) return;

    const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (localCart.length === 0) return;

    try {
      const cartRef = ref(realtimeDb, `users/${currentUser.uid}/cart`);
      const snapshot = await get(cartRef);
      let existingCart = snapshot.exists() ? snapshot.val() : {};

      localCart.forEach((item) => {
        if (existingCart[item.id]) {
          existingCart[item.id].quantity += item.quantity;
        } else {
          existingCart[item.id] = item;
        }
      });

      await set(cartRef, existingCart);
      localStorage.removeItem("cart");
    } catch (error) {
      console.error("Error merging guest cart:", error);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      await removeItem(productId);
      return;
    }

    const updatedItems = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updatedItems);
    await updateCart(updatedItems);
  };

  const removeItem = async (productId) => {
    const updatedItems = cartItems.filter((item) => item.id !== productId);
    setCartItems(updatedItems);
    await updateCart(updatedItems);
    toast.success("Item removed from cart");
  };

  const updateCart = async (updatedItems) => {
    if (!currentUser) {
      localStorage.setItem("cart", JSON.stringify(updatedItems));
      return;
    }

    try {
      await set(ref(realtimeDb, `users/${currentUser.uid}/cart`), {
        ...Object.fromEntries(updatedItems.map((item) => [item.id, item])),
      });
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to update cart.");
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (!currentUser) {
      toast.error("Please log in to place an order.");
      return;
    }

    try {
      const orderRef = push(ref(realtimeDb, "orders"));
      await set(orderRef, {
        userId: currentUser.uid,
        items: cartItems,
        total: calculateTotal(),
        createdAt: new Date().toISOString(),
        status: "processing",
      });

      await set(ref(realtimeDb, `users/${currentUser.uid}/cart`), {});

      toast.success("Order placed successfully!");
      navigate("/profile?tab=orders");
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("Failed to place order.");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-screen mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl text-gray-900 font-bold mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-700 mb-4">Your cart is empty</p>
          <Link
            to="/products"
            className="inline-block bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700 transition duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md p-6 mb-4"
              >
                <div className="flex items-center">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
                  <div className="ml-6 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-gray-700">${item.price.toFixed(2)}</p>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 bg-gray-300 rounded-md text-gray-700"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="mx-4 text-gray-900 font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 bg-gray-300 rounded-md text-gray-700"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md ml-4"
                  >
                    Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2 text-gray-800">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="block w-full bg-orange-600 text-white text-center px-6 py-3 rounded-md hover:bg-orange-700 transition duration-300"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
