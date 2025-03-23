import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white p-6 mt-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Online Pharmacy. All rights reserved.</p>
        
        <nav className="flex space-x-6">
          <Link to="/terms" className="hover:underline">Terms & Conditions</Link>
          <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link to="/contact" className="hover:underline">Contact Us</Link>
          <Link to="/about" className="hover:underline">About Us</Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;

// Dummy pages
export const Terms = () => (
  <div className="max-w-7xl mx-auto p-6">
    <h2 className="text-2xl font-bold">Terms & Conditions</h2>
    <p className="mt-4">These are the terms and conditions of our pharmacy.</p>
  </div>
);

export const Privacy = () => (
  <div className="max-w-7xl mx-auto p-6">
    <h2 className="text-2xl font-bold">Privacy Policy</h2>
    <p className="mt-4">This is our privacy policy page.</p>
  </div>
);

export const Contact = () => (
  <div className="max-w-7xl mx-auto p-6">
    <h2 className="text-2xl font-bold">Contact Us</h2>
    <p className="mt-4">Reach out to us through our official email or phone number.</p>
  </div>
);

export const About = () => (
  <div className="max-w-7xl mx-auto p-6">
    <h2 className="text-2xl font-bold">About Us</h2>
    <p className="mt-4">We are a trusted online pharmacy providing high-quality medicines.</p>
  </div>
);
