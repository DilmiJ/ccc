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
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="relative min-h-screen py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <img src="/pexels-alscre-2847648.jpg" alt="Background" className="pointer-events-none select-none absolute inset-0 -z-10 w-full h-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-white/70"></div>

      <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 lg:p-10">
            <div>
              <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
                Sign in to your account
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Or{' '}
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
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

              <div className="space-y-5">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    className={`mt-1 block w-full px-4 py-3 border ${
                      errors.username ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all`}
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      className={`block w-full px-4 py-3 pr-12 border ${
                        errors.password ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all`}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.74-1.64 1.82-3.09 3.17-4.31m3.99-2.39A10.94 10.94 0 0 1 12 4c5 0 9.27 3.89 11 8-.46 1.02-1.06 1.98-1.79 2.83"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.99] shadow-md"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default Login; 