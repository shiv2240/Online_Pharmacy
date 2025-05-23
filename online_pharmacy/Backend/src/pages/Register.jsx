import { Formik, Form, Field } from 'formik';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as Yup from '../../../Frontend/node_modules/yup';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const registerSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Too short').required('Required')
});

const Register = () => {
  const { register } = useAuth();
  const { addNotification } = useNotification();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await register(values.name, values.email, values.password);
      addNotification('Registration successful', 'success');
    } catch (error) {
      addNotification(error.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-gray-50"
    >
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Create Account</h2>
          <p className="mt-2 text-gray-600">Join our pharmacy community</p>
        </div>

        <Formik
          initialValues={{ name: '', email: '', password: '' }}
          validationSchema={registerSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-6">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <Field
                  name="name"
                  className="mt-1 block w-full rounded-md border p-2"
                />
                {errors.name && touched.name && (
                  <div className="text-red-500 text-sm">{errors.name}</div>
                )}
              </div>

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
                className="w-full bg-primary-500 text-white py-2 rounded-md hover:bg-primary-600 transition-colors"
              >
                Create Account
              </button>
            </Form>
          )}
        </Formik>

        <div className="text-center">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/login" className="text-primary-500 hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Register;