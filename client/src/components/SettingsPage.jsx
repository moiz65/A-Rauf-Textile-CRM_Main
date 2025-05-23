import React, { useState } from 'react';
import { 
  FaUserEdit, FaEnvelope, FaPhone, FaMapMarkerAlt, 
  FaUser, FaLock, FaUserShield, FaUpload, 
  FaCheckCircle, FaEye, FaEyeSlash, FaBuilding 
} from 'react-icons/fa';
import { MdDeveloperMode } from 'react-icons/md';
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

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle profile image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate image
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

    // Read and display the image
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

  // Form validation
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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccess(false);
      return;
    }
    
    // Simulate API call
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    
    // In a real app, you would send the data to your backend here
    console.log('Form data to submit:', {
      ...formData,
      profileImg: profileImg !== defaultProfileImg ? profileImg : null
    });
  };

  return (
    <div className="flex-1 overflow-auto bg-white rounded-[16px] shadow-md">
      <div className="px-4 md:px-6 pb-6">
        <div className="bg-white p-3">
          {/* Header with tabs */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
              <p className="text-gray-500 text-sm">Manage your company and account settings</p>
            </div>
            <div className="flex mt-4 md:mt-0">
              <button
                onClick={() => setActiveTab('company')}
                className={`px-4 py-2 text-sm font-medium flex items-center ${activeTab === 'company' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <FaBuilding className="mr-2" /> Company
              </button>
              <button
                onClick={() => setActiveTab('account')}
                className={`px-4 py-2 text-sm font-medium flex items-center ${activeTab === 'account' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <FaUser className="mr-2" /> Account
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Profile Image Section */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-md relative">
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
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 bg-blue-500 hover:bg-blue-600 p-2 rounded-full cursor-pointer transition-colors shadow-lg">
                  <FaUpload className="text-white text-sm" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageChange}
                    disabled={isUploading}
                  />
                </label>
                {errors.profileImg && (
                  <span className="absolute -bottom-6 left-0 text-red-500 text-xs">{errors.profileImg}</span>
                )}
              </div>
              <div className="text-center sm:text-left">
                <div className="font-medium flex items-center justify-center sm:justify-start gap-2 text-gray-700">
                  <FaUserEdit className="text-blue-500" /> 
                  <span>Company Logo</span>
                </div>
                <div className="text-xl font-bold text-gray-800 mt-1">{formData.companyName}</div>
                <p className="text-gray-500 text-sm mt-1">JPG, PNG or GIF (Max. 2MB)</p>
              </div>
            </div>

            {/* Settings Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Settings Tab */}
              {activeTab === 'company' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium flex items-center gap-2">
                      <FaPhone className="text-blue-500" /> Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+92 300 1234567"
                        className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-400' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      />
                      {errors.phone && (
                        <span className="absolute left-0 text-red-500 text-xs mt-1">{errors.phone}</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium flex items-center gap-2">
                      <MdDeveloperMode className="text-blue-500" /> Developed By
                    </label>
                    <input
                      type="text"
                      name="developBy"
                      value={formData.developBy}
                      onChange={handleChange}
                      placeholder="Development Company"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2 font-medium flex items-center gap-2">
                      <FaEnvelope className="text-blue-500" /> Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="contact@company.com"
                        className={`w-full px-4 py-3 border ${errors.email ? 'border-red-400' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      />
                      {errors.email && (
                        <span className="absolute left-0 text-red-500 text-xs mt-1">{errors.email}</span>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2 font-medium flex items-center gap-2">
                      <FaMapMarkerAlt className="text-blue-500" /> Company Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 Street, City, Country"
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Account Settings Tab */}
              {activeTab === 'account' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium flex items-center gap-2">
                      <FaUser className="text-blue-500" /> Username
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Enter username"
                        className={`w-full px-4 py-3 border ${errors.username ? 'border-red-400' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      />
                      {errors.username && (
                        <span className="absolute left-0 text-red-500 text-xs mt-1">{errors.username}</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium flex items-center gap-2">
                      <FaLock className="text-blue-500" /> Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        className={`w-full px-4 py-3 border ${errors.password ? 'border-red-400' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10`}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                      {errors.password && (
                        <span className="absolute left-0 text-red-500 text-xs mt-1">{errors.password}</span>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2 font-medium flex items-center gap-2">
                      <FaUserShield className="text-blue-500" /> User Role
                    </label>
                    <div className="relative">
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border ${errors.role ? 'border-red-400' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white`}
                      >
                        <option value="">Select User Role</option>
                        <option value="admin">Administrator</option>
                        <option value="manager">Manager</option>
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                      {errors.role && (
                        <span className="absolute left-0 text-red-500 text-xs mt-1">{errors.role}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-gray-200">
                <div className="mb-4 sm:mb-0">
                  {success && (
                    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
                      <FaCheckCircle className="text-green-500" />
                      <span>Settings saved successfully!</span>
                    </div>
                  )}
                </div>
                <button 
                  type="submit" 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2 transition-colors shadow-md hover:shadow-lg disabled:opacity-75"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;