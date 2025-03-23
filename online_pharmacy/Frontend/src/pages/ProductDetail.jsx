import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const productDoc = await getDoc(doc(db, 'products', id));
      if (productDoc.exists()) {
        setProduct({ id: productDoc.id, ...productDoc.data() });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleAddToCart = async (product) => {
      const cartItem = { ...product, quantity: 1 };
      
      if (currentUser) {
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userRef);
          let updatedCart = [];
    
          if (userDoc.exists()) {
            const existingCart = userDoc.data().cart || [];
            const itemIndex = existingCart.findIndex(item => item.id === product.id);
    
            if (itemIndex > -1) {
              existingCart[itemIndex].quantity += 1;
            } else {
              existingCart.push(cartItem);
            }
            updatedCart = existingCart;
          } else {
            updatedCart = [cartItem];
          }
    
          await updateDoc(userRef, { cart: updatedCart });
          toast.success('Added to cart');
        } catch (error) {
          console.error('Error adding to cart:', error);
          toast.error('Failed to add item');
        }
      } else {
        // For guest users, save cart in localStorage
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const itemIndex = localCart.findIndex(item => item.id === product.id);
    
        if (itemIndex > -1) {
          localCart[itemIndex].quantity += 1;
        } else {
          localCart.push(cartItem);
        }
    
        localStorage.setItem('cart', JSON.stringify(localCart));
        toast.success('Added to cart');
      }
    };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold">Product not found</h2>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>
          
          <div className="text-2xl font-bold text-primary-600">
            ${product.price.toFixed(2)}
          </div>

          <div className="flex items-center space-x-4">
            <label htmlFor="quantity" className="text-gray-700">
              Quantity:
            </label>
            <input
              type="number"
              id="quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <button
            onClick={() => handleAddToCart(product, quantity)}
            className="w-full bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition duration-300"
          >
            Add to Cart
          </button>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold mb-4">Product Details</h2>
            <dl className="space-y-4">
              <div>
                <dt className="font-medium text-gray-700">Category</dt>
                <dd className="mt-1 text-gray-600">{product.category}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">Brand</dt>
                <dd className="mt-1 text-gray-600">{product.brand}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">Stock</dt>
                <dd className="mt-1 text-gray-600">{product.stock} units</dd>
              </div>
            </dl>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ProductDetail;