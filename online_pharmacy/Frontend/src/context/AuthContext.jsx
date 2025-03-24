import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export const AuthContext = createContext(); // ✅ Fix: Named export

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const res = await axios.get('https://online-pharmacy-ps8n.onrender.com/api/auth/protected', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data.user);
      }
    } catch (error) {
      localStorage.removeItem('token');
      console.error('Error fetching auth status:', error); // Debugging line
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post('https://online-pharmacy-ps8n.onrender.com/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user); // Store user data here
      navigate('/'); // Redirect to home after successful login
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed! Please check your credentials."); // Debugging alert
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axios.post('https://online-pharmacy-ps8n.onrender.com/api/auth/register', { name, email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      navigate('/'); // Redirect to home after successful registration
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed! Please try again."); // Debugging alert
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
