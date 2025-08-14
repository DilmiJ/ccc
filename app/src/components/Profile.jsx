import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!token || !user.username) {
        navigate('/login');
        return;
      }

      const profileFormData = new FormData();
      profileFormData.append('username', user.username);
      profileFormData.append('token', token);
      
      console.log('Fetching profile for:', user.username);
      
      const response = await axios.post('https://apis.mavicsoft.com/endpoints/ccc-hr-25-f/GetProfile', 
        profileFormData,
        { 
          timeout: 15000
        }
      );

      console.log('Profile response:', response.data);

      if (response.data.success || response.data.isSuccess) {
        // Handle the new API response structure
        const profileData = response.data.profile || response.data;
        
        // Transform the API data to match our component structure
        const transformedProfile = {
          username: profileData.username || user.username,
          firstName: profileData.firstName || profileData.firstName || '',
          lastName: profileData.lastName || profileData.lastName || '',
          email: profileData.email || profileData.email || '',
          country: profileData.country || profileData.country || '',
          iddCode: profileData.mobileNumber ? profileData.mobileNumber.substring(0, 3) : '', // Extract +94 from +94765433567
          nationalNumber: profileData.mobileNumber ? profileData.mobileNumber.substring(3) : '', // Extract 765433567 from +94765433567
          profileImage: profileData.profileImage || null,
          createdAt: profileData.createdAt || new Date().toISOString(),
          updatedAt: profileData.updatedAt || new Date().toISOString()
        };
        
        setProfile(transformedProfile);
      } else {
        // If API fails, use fallback profile data from localStorage
        console.log('API failed, using fallback profile data');
        const fallbackProfile = {
          username: user.username,
          firstName: user.firstName || user.username,
          lastName: user.lastName || '',
          email: user.email || 'Not available',
          country: user.country || 'Not available',
          iddCode: user.iddCode || '+94',
          nationalNumber: user.nationalNumber || '',
          profileImage: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setProfile(fallbackProfile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      
      // If it's an API error with response data, log it
      if (error.response?.data) {
        console.log('Profile API error:', error.response.data);
      }
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        // Use fallback profile data on error
        console.log('Using fallback profile data due to error');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const fallbackProfile = {
          username: user.username,
          firstName: user.firstName || user.username,
          lastName: user.lastName || '',
          email: user.email || 'Not available',
          country: user.country || 'Not available',
          iddCode: user.iddCode || '+94',
          nationalNumber: user.nationalNumber || '',
          profileImage: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setProfile(fallbackProfile);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      setSelectedFile(file);
      setError('');
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Image = reader.result.split(',')[1]; // Remove data:image/...;base64, prefix

        const profileFormData = new FormData();
        profileFormData.append('username', user.username);
        profileFormData.append('token', token);
        profileFormData.append('profileImage', base64Image);

        const response = await axios.post('https://apis.mavicsoft.com/endpoints/ccc-hr-25-f/UpdateProfileImage', 
          profileFormData,
          { 
            timeout: 15000
          }
        );

        console.log('Image upload response:', response.data);

        if (response.data.success || response.data.isSuccess) {
          // Update profile with new image
          setProfile(prev => ({
            ...prev,
            profileImage: response.data.imagePath || response.data.profileImage || 'updated'
          }));
          setSelectedFile(null);
          alert('Profile image updated successfully!');
        } else {
          setError(response.data.error || response.data.errorDescription || 'Failed to update profile image');
        }
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error('Error uploading image:', error);
      
      // If it's an API error with response data, log it
      if (error.response?.data) {
        console.log('Image upload API error:', error.response.data);
        setError(error.response.data.error || error.response.data.errorDescription || 'Failed to upload image');
      } else {
        setError('Failed to upload image. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">{error || 'Failed to load profile'}</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-xl rounded-2xl mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white">My Profile</h1>
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-all duration-200 font-medium backdrop-blur-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Image Section */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-xl rounded-2xl p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">Profile Photo</h2>
              
              <div className="text-center">
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt="Profile"
                    className="w-40 h-40 rounded-full mx-auto mb-6 object-cover shadow-lg border-4 border-white"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                
                <div className="w-40 h-40 rounded-full mx-auto mb-6 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-lg border-4 border-white" 
                     style={{ display: profile.profileImage ? 'none' : 'flex' }}>
                  <span className="text-white text-6xl font-bold">
                    {profile.firstName?.charAt(0) || profile.username?.charAt(0) || '?'}
                  </span>
                </div>
                
                <div className="space-y-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-colors duration-200"
                  />
                  
                  {selectedFile && (
                    <button
                      onClick={handleImageUpload}
                      disabled={uploading}
                      className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 font-medium shadow-lg"
                    >
                      {uploading ? 'Uploading...' : 'Upload Photo'}
                    </button>
                  )}
                  
                  {error && (
                    <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details Section */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                <p className="text-gray-600 mt-1">Your account details and preferences</p>
              </div>
              
              <div className="p-8">
                <dl className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500 mb-2">Username</dt>
                    <dd className="text-lg font-semibold text-gray-900">{profile.username}</dd>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500 mb-2">First Name</dt>
                    <dd className="text-lg font-semibold text-gray-900">{profile.firstName || 'Not provided'}</dd>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500 mb-2">Last Name</dt>
                    <dd className="text-lg font-semibold text-gray-900">{profile.lastName || 'Not provided'}</dd>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500 mb-2">Email Address</dt>
                    <dd className="text-lg font-semibold text-gray-900">{profile.email || 'Not available'}</dd>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500 mb-2">Country</dt>
                    <dd className="text-lg font-semibold text-gray-900">{profile.country || 'Not available'}</dd>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500 mb-2">Phone Number</dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {profile.iddCode && profile.nationalNumber ? 
                        `${profile.iddCode} ${profile.nationalNumber}` : 
                        'Not available'
                      }
                    </dd>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500 mb-2">Member Since</dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                    </dd>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500 mb-2">Last Updated</dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {profile.updatedAt ? new Date(profile.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 