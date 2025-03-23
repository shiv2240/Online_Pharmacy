import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaSearch, FaPills, FaUserMd, FaTruck } from "react-icons/fa";

function Home() {
  const features = [
    {
      icon: <FaSearch />,
      title: "Easy Search",
      description: "Find your medicines quickly with our advanced search system",
    },
    {
      icon: <FaPills />,
      title: "Wide Selection",
      description: "Access to thousands of medicines and healthcare products",
    },
    {
      icon: <FaUserMd />,
      title: "Expert Support",
      description: "24/7 support from healthcare professionals",
    },
    {
      icon: <FaTruck />,
      title: "Fast Delivery",
      description: "Quick and reliable delivery to your doorstep",
    },
  ];

  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-black to-white overflow-x-hidden">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-screen h-screen flex flex-col items-center justify-center text-center text-black px-6"
      >
        {/* 3D Moving Background Animation */}
        <motion.div
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -20, 20, 0],
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 5,
            ease: "easeInOut",
          }}
          className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-700 to-gray-300 opacity-50 rounded-full blur-3xl"
        ></motion.div>

        <h1 className="text-5xl font-bold mb-6 relative z-10">
          Your Health, Our Priority
        </h1>
        <p className="text-2xl mb-8 relative z-10">
          Get your medicines delivered at your doorstep
        </p>
        <Link
          to="/products"
          className="relative z-10 bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition duration-300"
        >
          Shop Now
        </Link>
      </motion.div>

      {/* Features Section */}
      <div className="w-screen min-h-screen flex flex-col items-center justify-center px-6 py-16">
        <h2 className="text-4xl font-bold text-black mb-12">Why Choose Us?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-screen-xl">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="text-5xl text-black mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-semibold text-black mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-700 text-lg">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-screen h-screen bg-gradient-to-b from-white to-gray-300 flex flex-col items-center justify-center text-center text-black px-6">
        <h2 className="text-4xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-2xl mb-8">
          Join thousands of satisfied customers who trust us with their health needs
        </p>
        <Link
          to="/signup"
          className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition duration-300"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}

export default Home;
