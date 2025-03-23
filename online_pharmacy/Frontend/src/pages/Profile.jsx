import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { motion } from 'framer-motion';

const profileSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  medicalHistory: Yup.string(),
  allergies: Yup.string()
});

const Profile = () => {
  const { user, logout } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await axios.get('https://online-pharmacy-ps8n.onrender.com/api/prescriptions');
        setPrescriptions(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    
    if (user) fetchPrescriptions();
  }, [user]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await axios.put('/api/users/profile', values);
      // Handle success
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <Formik
        initialValues={{
          name: user?.name || '',
          email: user?.email || '',
          medicalHistory: '',
          allergies: ''
        }}
        validationSchema={profileSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>

            <div>
              <label className="block text-sm font-medium">Medical History</label>
              <Field
                as="textarea"
                name="medicalHistory"
                className="mt-1 block w-full rounded-md border p-2 h-32"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Allergies</label>
              <Field
                name="allergies"
                className="mt-1 block w-full rounded-md border p-2"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="bg-primary-500 text-white px-6 py-2 rounded-md"
            >
              Update Profile
            </motion.button>
          </Form>
        )}
      </Formik>

      <div className="mt-12">
        <h3 className="text-xl font-bold mb-4">Prescription History</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {prescriptions.map((prescription, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border rounded-lg overflow-hidden"
            >
              <img
                src={prescription.filePath}
                alt={`Prescription ${index + 1}`}
                className="w-full h-40 object-cover"
              />
              <div className="p-2 text-sm text-gray-600">
                {new Date(prescription.createdAt).toLocaleDateString()}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;