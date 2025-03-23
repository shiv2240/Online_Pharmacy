import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext"; // Ensure you're using auth
import LoadingSpinner from "../components/LoadingSpinner";
import { getDatabase, ref, get, update } from "firebase/database";
import { set } from "date-fns";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("name-asc");
  const [searchTerm, setSearchTerm] = useState("");

  const { currentUser } = useAuth(); // Ensure user authentication is available
  const db = getDatabase();

  useEffect(() => {
    fetchProducts();
  }, [sortBy]);

  const fetchProducts = async () => {
    try {
      const productsRef = ref(db, "products");
      const snapshot = await get(productsRef);

      if (snapshot.exists()) {
        const productsObj = snapshot.val();

        const productsArray = Object.keys(productsObj).map((key) => ({
          id: key,
          ...productsObj[key],
        }));

        setProducts(productsArray);
      } else {
        console.log("No products found in database.");
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = Array.isArray(products)
    ? products.filter((product) =>
        product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleAddToCart = async (product) => {
    const cartItem = { ...product, quantity: 1 };

    if (currentUser) {
      try {
        const database = getDatabase();
        const cartRef = ref(database, `users/${currentUser.uid}/cart`);
        const snapshot = await get(cartRef);

        let updatedCart = {};

        if (snapshot.exists()) {
          updatedCart = snapshot.val();

          if (updatedCart[product.id]) {
            updatedCart[product.id].quantity += 1;
          } else {
            updatedCart[product.id] = cartItem;
          }
        } else {
          updatedCart[product.id] = cartItem;
        }

        await set(cartRef, updatedCart);

        toast.success("Added to cart");
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error("Failed to add item");
      }
    } else {
      // Guest user: Store in localStorage
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const itemIndex = localCart.findIndex((item) => item.id === product.id);

      if (itemIndex > -1) {
        localCart[itemIndex].quantity += 1;
      } else {
        localCart.push(cartItem);
      }

      localStorage.setItem("cart", JSON.stringify(localCart));
      toast.success("Added to cart");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-screen mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl text-black font-bold mb-4 md:mb-0">Products</h1>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-primary-600 font-bold">
                  ${product.price.toFixed(2)}
                </span>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition duration-300"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Products;
