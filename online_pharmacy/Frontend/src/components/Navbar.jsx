import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaBars, FaTimes, FaShoppingCart, FaUser, FaPills } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Medicines', path: '/medicines' },
    { name: 'Cart', path: '/cart', icon: <FaShoppingCart />, count: cartCount },
    { name: 'Profile', path: '/profile', icon: <FaUser /> }
  ];

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <FaPills className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">PharmaCare</span>
            </Link>
            
            <div className="hidden md:flex md:items-center md:ml-6">
              {menuItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                      isActive 
                        ? 'text-primary-600 bg-gray-100' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`
                  }
                >
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.name}
                  {item.count > 0 && item.name === 'Cart' && (
                    <span className="ml-1 bg-primary-500 text-white rounded-full px-2 py-1 text-xs">
                      {item.count}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>

          <div className="hidden md:flex md:items-center">
            {user ? (
              <div className="ml-4 relative">
                <button className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
                  <span className="mr-1">{user.name}</span>
                  <FaUser className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center">
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.name}
                  {item.count > 0 && item.name === 'Cart' && (
                    <span className="ml-2 bg-primary-500 text-white rounded-full px-2 py-1 text-xs">
                      {item.count}
                    </span>
                  )}
                </div>
              </NavLink>
            ))}
            {user ? (
              <button
                onClick={logout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;