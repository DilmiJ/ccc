import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Simple approach: Use FormData format
      console.log('Attempting login with FormData...');
      
      // Create FormData for login
      const loginFormData = new FormData();
      loginFormData.append('username', formData.username);
      loginFormData.append('password', formData.password);
      
      console.log('Login FormData created');
      
      const response = await axios.post('https://apis.mavicsoft.com/endpoints/ccc-hr-25-f/Login', loginFormData, {
        timeout: 15000
      });
      
      console.log('Login response:', response.data);
      
      if (response.data.success || response.data.isSuccess || response.data.accessToken) {
        const token = response.data.accessToken || response.data.token;
        const user = { username: formData.username };
        
        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        console.log('Login successful, token stored');
        navigate('/profile');
      } else {
        setErrors({
          general: response.data.error || response.data.errorDescription || 'Login failed. Please check your credentials.'
        });
      }
    } catch (error) {
      console.log('Basic headers failed, trying with X-Requested-With...');
      
      try {
        // Fallback: Add X-Requested-With header
        const fallbackHeaders = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        };
        
        console.log('Trying login with fallback headers:', fallbackHeaders);
        
        const response = await axios.post('https://apis.mavicsoft.com/endpoints/ccc-hr-25-f/Login', formData, {
          headers: fallbackHeaders,
          timeout: 15000
        });
        
        console.log('Login response with fallback headers:', response.data);
        
        if (response.data.success || response.data.isSuccess) {
          // Store token and user data
          localStorage.setItem('token', response.data.token || response.data.accessToken);
          localStorage.setItem('user', JSON.stringify({
            username: formData.username
          }));
          
          // Redirect to profile page
          navigate('/profile');
        } else {
          setErrors({
            general: response.data.error || response.data.errorDescription || 'Login failed. Please check your credentials.'
          });
        }
        
      } catch (fallbackError) {
        console.error('Login failed with all approaches:', fallbackError);
        setErrors({
          general: fallbackError.response?.data?.error || fallbackError.response?.data?.errorDescription || 'Login failed. Please try again.'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <button
              onClick={() => navigate('/register')}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              create a new account
            </button>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errors.general}
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.username ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 