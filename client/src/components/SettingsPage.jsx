import React, { useState } from 'react';
import defaultProfileImg from '../assets/header/pfp.png';

const SettingsPage = () => {
  // Simulated user data (should come from backend in real app)
  const initialUser = {
    name: 'Admin User',
    email: 'info@arauftextile.com',
    phone: '+923001234567',
    role: 'admin',
    profileImg: defaultProfileImg,
    coverImg: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  };

  const [user, setUser] = useState(initialUser);
  const [form, setForm] = useState({ ...initialUser, password: '', confirmPassword: '' });
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Handle profile image upload
  const handleProfileImgChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, profileImg: 'Image size should be less than 2MB' }));
      return;
    }
    if (!file.type.match('image.*')) {
      setErrors(prev => ({ ...prev, profileImg: 'Please select an image file' }));
      return;
    }
    setIsUploading(true);
    setErrors(prev => ({ ...prev, profileImg: '' }));
    const reader = new FileReader();
    reader.onload = (event) => {
      setForm(prev => ({ ...prev, profileImg: event.target.result }));
      setIsUploading(false);
    };
    reader.onerror = () => {
      setErrors(prev => ({ ...prev, profileImg: 'Error reading image file' }));
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // Validate form
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Invalid email format';
    if (!form.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^\+?\d{10,15}$/.test(form.phone)) newErrors.phone = 'Invalid phone number';
    if (editing && form.password) {
      if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isUploading) return;
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccess(false);
      return;
    }
    setUser({ ...user, ...form, password: undefined, confirmPassword: undefined });
    setEditing(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  // Handle cancel
  const handleCancel = () => {
    setForm({ ...user, password: '', confirmPassword: '' });
    setEditing(false);
    setErrors({});
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50 rounded-none md:rounded-2xl shadow-sm min-h-screen">
      {/* Cover Image */}
      <div className="relative h-40 md:h-56 w-full bg-gray-200 rounded-b-3xl overflow-hidden">
        <img
          src={user.coverImg}
          alt="Cover"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {/* Profile Image */}
        <div className="absolute left-1/2 -bottom-12 transform -translate-x-1/2 flex flex-col items-center">
          <div className="relative group">
            <img
              src={form.profileImg || defaultProfileImg}
              alt="Profile"
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg object-cover bg-white"
            />
            {editing && (
              <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 p-2 rounded-full cursor-pointer shadow-md group-hover:scale-110 border-2 border-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z" />
                </svg>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfileImgChange}
                  disabled={isUploading}
                  aria-label="Upload profile image"
                />
              </label>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-full">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
              </div>
            )}
          </div>
          <div className="mt-3 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-500 text-sm md:text-base">{user.email}</p>
          </div>
        </div>
      </div>
      {/* Main Card */}
      <div className="max-w-2xl mx-auto mt-20 md:mt-24 bg-white rounded-2xl shadow-lg p-6 md:p-10 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-500 mt-1 text-sm md:text-base">Update your personal information and password</p>
          </div>
          {!editing ? (
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-md transition-all"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          ) : null}
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled={!editing}
                className={`w-full px-4 py-2 border ${errors.name ? 'border-red-300' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white`}
                placeholder="Your Name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled={!editing}
                className={`w-full px-4 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white`}
                placeholder="you@email.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                disabled={!editing}
                className={`w-full px-4 py-2 border ${errors.phone ? 'border-red-300' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white`}
                placeholder="+92 300 1234567"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white appearance-none"
              >
                <option value="admin">Administrator</option>
                <option value="manager">Manager</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
          </div>
          {/* Password Section */}
          {editing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 transition-all bg-white`}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(v => !v)}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 transition-all bg-white`}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(v => !v)}
                  >
                    {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>
          )}
          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-2">
            {editing ? (
              <>
                <button
                  type="button"
                  className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium shadow-sm transition-all"
                  onClick={handleCancel}
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-md transition-all disabled:opacity-75"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </>
            ) : null}
            {success && (
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg animate-fade-in">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs sm:text-sm">Profile updated successfully!</span>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;