import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchUserDetails, updateUser } from '../services/authService';

const Account: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, logout } = useAuth();
  
  const [userDetails, setUserDetails] = useState<{ email: string; name: string; phone_number: string } | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone_number: '' });
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Flag to track intentional logout

  useEffect(() => {
    if (!token && !isLoggingOut) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [token, navigate, location, isLoggingOut]);

  useEffect(() => {
    const getUserDetails = async () => {
      if (!token) return;
      try {
        const details = await fetchUserDetails(token);
        setUserDetails(details);
        setFormData({ name: details.name, email: details.email, phone_number: details.phone_number });
      } catch (err) {
        setError(err.message);
      }
    };
    getUserDetails();
  }, [token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!token) return;
    try {
      const updatedDetails = await updateUser(token, formData);
      setUserDetails(updatedDetails);
      setIsEditing(false);
      setSuccess('Account details updated successfully!');

      // Check if any details have changed
      if (userDetails && (
        formData.email !== userDetails.email || 
        formData.name !== userDetails.name || 
        formData.phone_number !== userDetails.phone_number
      )) {
        const message = 'Your account details have been updated. Please log in again.';
        const loginUrl = `/login?message=${encodeURIComponent(message)}`;
        console.log('Navigating to:', loginUrl);
        setIsLoggingOut(true); // Set flag to prevent useEffect redirect
        logout(); // Clear the token and user
        navigate(loginUrl, { state: { from: location.pathname } });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-neutral-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Account Details</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        {userDetails ? (
          isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-neutral-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-neutral-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-neutral-300 rounded"
                  required
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 cursor-pointer"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="w-full bg-gray-300 text-black p-2 rounded hover:bg-gray-400 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <p><strong>Name:</strong> {userDetails.name}</p>
              <p><strong>Email:</strong> {userDetails.email}</p>
              <p><strong>Phone Number:</strong> {userDetails.phone_number}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 cursor-pointer"
              >
                Edit Details
              </button>
            </div>
          )
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Account;