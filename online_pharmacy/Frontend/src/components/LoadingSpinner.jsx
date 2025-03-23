import { motion } from 'framer-motion';
import { FaHeartbeat } from 'react-icons/fa';

function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="text-primary-600 text-4xl"
      >
        <FaHeartbeat />
      </motion.div>
    </div>
  );
}

export default LoadingSpinner;