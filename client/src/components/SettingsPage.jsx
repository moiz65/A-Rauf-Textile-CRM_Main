import React, { useState } from 'react';
import defaultProfileImg from '../assets/header/pfp.png';

const SettingsPage = () => {
  // Form state
  const [formData, setFormData] = useState({
    companyName: 'A RAUF TEXTILE',
    phone: '+923001234567',
    developBy: 'Digious Corp',
    email: 'info@arauftextile.com',
    address: '123 Textile Street, Karachi, Pakistan',
    username: 'admin',
    password: 'admin123',
    role: 'admin'
  });

  // UI state
  const [profileImg, setProfileImg] = useState(defaultProfileImg);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('company');
  const [isUploading, setIsUploading] = useState(false);
  const [isEditingCompanyName, setIsEditingCompanyName] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
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
      setProfileImg(event.target.result);
      setIsUploading(false);
    };
    reader.onerror = () => {
      setErrors(prev => ({ ...prev, profileImg: 'Error reading image file' }));
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^\+?\d{10,15}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number';
    
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    
    if (!formData.role) newErrors.role = 'Role is required';
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isUploading) return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccess(false);
      return;
    }
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    console.log('Form data to submit:', {
      ...formData,
      profileImg: profileImg !== defaultProfileImg ? profileImg : null
    });
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50 rounded-none md:rounded-2xl shadow-sm">
      <div className="px-4 sm:px-6 py-6 md:py-8">
        {/* Header with tabs */}
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-500 mt-1 text-sm md:text-base">Manage your company and account preferences</p>
          </div>
          
          <div className="flex bg-gray-100 p-1 rounded-lg w-full md:w-auto">
            <button
              onClick={() => setActiveTab('company')}
              className={`px-3 py-1 md:px-4 md:py-2 text-sm font-medium rounded-md transition-colors flex-1 md:flex-none ${
                activeTab === 'company' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Company
            </button>
            <button
              onClick={() => setActiveTab('account')}
              className={`px-3 py-1 md:px-4 md:py-2 text-sm font-medium rounded-md transition-colors flex-1 md:flex-none ${
                activeTab === 'account' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Account
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Profile Image Section */}
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="relative group">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden border-4 border-white shadow-lg relative">
                  <img 
                    src={profileImg}
                    alt="Company Logo"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultProfileImg;
                    }}
                  />
                  {isUploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent"></div>
                    </div>
                  )}
                </div>
                <label className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-blue-500 hover:bg-blue-600 p-1.5 sm:p-2 rounded-full cursor-pointer transition-all shadow-md group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageChange}
                    disabled={isUploading}
                    aria-label="Upload company logo"
                  />
                </label>
              </div>
              <div className="text-center sm:text-left">
                {/* Editable company name */}
                <h2
                  className="text-xl sm:text-2xl font-bold text-gray-900 cursor-pointer inline-block"
                  title="Click to edit company name"
                  onClick={() => setIsEditingCompanyName(true)}
                  style={{ minWidth: 120 }}
                >
                  {isEditingCompanyName ? (
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      onBlur={() => setIsEditingCompanyName(false)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') setIsEditingCompanyName(false);
                      }}
                      autoFocus
                      className="text-xl sm:text-2xl font-bold text-gray-900 border-b border-blue-400 bg-white px-1 outline-none"
                      style={{ minWidth: 120 }}
                    />
                  ) : (
                    formData.companyName
                  )}
                </h2>
                <p className="text-gray-500 mt-1 text-sm sm:text-base flex items-center justify-center sm:justify-start gap-1 sm:gap-2">
                  <span>Click to change company logo</span>
                </p>
                {errors.profileImg && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2">{errors.profileImg}</p>
                )}
              </div>
            </div>
          </div>

          {/* Settings Form */}
          <form onSubmit={handleSubmit} className="divide-y divide-gray-100">
            {/* Company Settings Tab */}
            {activeTab === 'company' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+92 300 1234567"
                    className={`w-full px-3 py-2 sm:px-4 sm:py-3 border ${errors.phone ? 'border-red-300' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Developed By
                  </label>
                  <input
                    type="text"
                    name="developBy"
                    value={formData.developBy}
                    onChange={handleChange}
                    placeholder="Development Company"
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="md:col-span-2 space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contact@company.com"
                    className={`w-full px-3 py-2 sm:px-4 sm:py-3 border ${errors.email ? 'border-red-300' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="md:col-span-2 space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Company Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Street, City, Country"
                    rows="3"
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            )}

            {/* Account Settings Tab */}
            {activeTab === 'account' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                    className={`w-full px-3 py-2 sm:px-4 sm:py-3 border ${errors.username ? 'border-red-300' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      className={`w-full px-3 py-2 sm:px-4 sm:py-3 border ${errors.password ? 'border-red-300' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 transition-all`}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-sm"
                      onClick={() => setShowPassword(!showPassword)}
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
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}
                </div>

                <div className="md:col-span-2 space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    User Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 sm:px-4 sm:py-3 border ${errors.role ? 'border-red-300' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white`}
                  >
                    <option value="">Select User Role</option>
                    <option value="admin">Administrator</option>
                    <option value="manager">Manager</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  {errors.role && (
                    <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                  )}
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 bg-gray-50 space-y-3 sm:space-y-0">
              <div className="w-full sm:w-auto">
                {success && (
                  <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg animate-fade-in">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs sm:text-sm">Settings saved successfully!</span>
                  </div>
                )}
              </div>
              <button 
                type="submit" 
                className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg disabled:opacity-75"
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;