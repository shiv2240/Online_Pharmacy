import { useEffect } from "react";
import { motion } from "framer-motion";

const GenericPage = ({ title, content }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-6 py-10"
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
      <div className="text-gray-700 space-y-4">
        {content.map((paragraph, index) => (
          <p key={index} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </motion.div>
  );
};

export default GenericPage;
