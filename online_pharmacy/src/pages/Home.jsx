import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaSearch, FaPills, FaUserMd, FaTruck } from "react-icons/fa";

function Home() {
  const features = [
    {
      icon: <FaSearch />,
      title: "Easy Search",
      description:
        "Find your medicines quickly with our advanced search system",
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
    <div className="w-screen min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary-600 text-white py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Your Health, Our Priority
            </h1>
            <p className="text-xl mb-8">
              Get your medicines delivered at your doorstep
            </p>
            <Link
              to="/products"
              className="bg-white text-primary-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">

          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <div className="text-4xl text-primary-600 mb-4 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of satisfied customers who trust us with their
              health needs
            </p>
            <Link
              to="/signup"
              className="bg-primary-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-700 transition duration-300"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
