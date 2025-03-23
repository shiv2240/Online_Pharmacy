import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleReturnHome = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      navigate('/');
    }, 2000); // 2 seconds for animation before redirecting
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-gray-50"
    >
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>

        {/* "Return Home" Button with Loading Animation */}
        <button
          onClick={handleReturnHome}
          disabled={isSubmitting}
          className={`w-full py-3 rounded-lg font-semibold text-lg text-black
                     transition-all duration-300 flex justify-center items-center
                     ${isSubmitting
                       ? 'bg-gray-400 cursor-not-allowed'
                       : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-md hover:shadow-lg transform hover:scale-105 border border-gray-300 hover:border-gray-400'}`}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-black"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Returning...
            </span>
          ) : (
            'Return Home'
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default NotFound;
