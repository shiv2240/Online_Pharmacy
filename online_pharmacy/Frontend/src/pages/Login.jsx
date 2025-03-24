import { Formik, Form, Field } from 'formik';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import image from "../images/17843.jpg";

const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required')
});

const Login = () => {
  const { login } = useAuth(); // Login function from context
  const { addNotification } = useNotification(); // Notification function from context
  const navigate = useNavigate(); // To navigate to different routes after login

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await login(values.email, values.password); // Assuming login returns user data
      if (response && response.user) {
        const userId = response.user._id; // Assuming 'user' contains _id
        localStorage.setItem('userId', userId); // Store userId in localStorage
        addNotification('Login successful', 'success');
        navigate('/'); // Redirect to home page after successful login
      } else {
        addNotification('Login failed, please try again', 'error'); // Handle failure
      }
    } catch (error) {
      addNotification(error.response?.data?.message || 'Login failed', 'error'); // Error notification
    } finally {
      setSubmitting(false); // Reset submitting state
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-gray-50 relative z-0"
    >
      {/* Background Image with Blur */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center object-cover"
        style={{
          backgroundImage: `url(${image})`, // Replace with your image URL
          backdropFilter: 'blur(10px)', // Apply blur effect
          zIndex: '-1', // Keep the background behind the content
        }}
      ></div>
  
      {/* Content Box */}
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Welcome Back</h2>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>
  
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-6">
              <div>
                <label className="block text-sm font-medium">Email</label>
                <Field
                  name="email"
                  type="email"
                  className="mt-1 block w-full rounded-md border p-2"
                />
                {errors.email && touched.email && (
                  <div className="text-red-500 text-sm">{errors.email}</div>
                )}
              </div>
  
              <div>
                <label className="block text-sm font-medium">Password</label>
                <Field
                  name="password"
                  type="password"
                  className="mt-1 block w-full rounded-md border p-2"
                />
                {errors.password && touched.password && (
                  <div className="text-red-500 text-sm">{errors.password}</div>
                )}
              </div>
  
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-lg font-semibold text-lg text-black
                transition-all duration-300 flex justify-center items-center
                ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-md hover:shadow-lg transform hover:scale-105 border border-gray-300'
                }`}
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
                    Signing In...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </Form>
          )}
        </Formik>
  
        <div className="text-center">
          <span className="text-gray-600">Don't have an account? </span>
          <Link to="/register" className="text-primary-500 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
