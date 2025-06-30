import React, { useState, useEffect } from 'react';
import {
  Lock, Mail, User, Building2, Phone, Eye, EyeOff, CheckCircle, Pencil, RefreshCcw, X, Shield, Bell, Globe, Clock
} from 'lucide-react';
import defaultAvatar from '../assets/header/pfp.png';

const SettingsPage = () => {
  // User data state
  const [userData, setUserData] = useState({
    name: 'Muhammad Ahmed',
    email: 'ahmed@arauftextile.com',
    phone: '+923001234567',
    company: 'A Rauf Textile',
    address: '123 Textile Street, Karachi, Pakistan',
    username: 'ahmed_rauf',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    role: 'admin',
    twoFactorEnabled: true,
    notifications: true
  });

  // UI state
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [isEditing, setIsEditing] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate loading user data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleToggle = (field) => {
    setUserData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, avatar: 'Image size should be less than 2MB' }));
      return;
    }

    if (!file.type.match('image.*')) {
      setErrors(prev => ({ ...prev, avatar: 'Please select an image file' }));
      return;
    }

    setIsUploading(true);
    setErrors(prev => ({ ...prev, avatar: '' }));

    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatar(event.target.result);
      setIsUploading(false);
      showSuccess('Profile picture updated successfully');
    };
    reader.onerror = () => {
      setErrors(prev => ({ ...prev, avatar: 'Error reading image file' }));
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'email':
        if (!value.trim()) newErrors.email = 'Email is required';
        else if (!/^\S+@\S+\.\S+$/.test(value)) newErrors.email = 'Invalid email format';
        else delete newErrors.email;
        break;
      
      case 'phone':
        if (!value.trim()) newErrors.phone = 'Phone is required';
        else if (!/^\+?\d{10,15}$/.test(value)) newErrors.phone = 'Invalid phone number';
        else delete newErrors.phone;
        break;
      
      case 'newPassword':
        if (value && value.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';
        else delete newErrors.newPassword;
        break;
      
      case 'confirmPassword':
        if (userData.newPassword && value !== userData.newPassword) newErrors.confirmPassword = 'Passwords do not match';
        else delete newErrors.confirmPassword;
        break;
      
      default:
        if (!value.trim()) newErrors[name] = 'This field is required';
        else delete newErrors[name];
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleSubmit = async (section) => {
    setIsEditing(null);
    
    // Validate the section being submitted
    let isValid = true;
    const fieldsToValidate = {
      profile: ['name', 'email', 'phone', 'company', 'address'],
      account: ['username'],
      security: userData.newPassword ? ['newPassword', 'confirmPassword'] : []
    }[section];

    fieldsToValidate.forEach(field => {
      if (!validateField(field, userData[field])) {
        isValid = false;
      }
    });

    if (!isValid) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    showSuccess(`${section.charAt(0).toUpperCase() + section.slice(1)} settings updated successfully`);
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setErrors({});
  };

  const renderEditableField = (field, label, icon, type = 'text', options = null) => {
    const isEditingField = isEditing === field;
    
    return (
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          {icon}
          {label}
        </label>
        
        {isEditingField ? (
          <div className="flex flex-col space-y-2">
            {options ? (
              <select
                name={field}
                value={userData[field]}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {options.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            ) : (
              <div className="relative">
                <input
                  type={type}
                  name={field}
                  value={userData[field]}
                  onChange={handleChange}
                  onBlur={() => validateField(field, userData[field])}
                  className={`w-full px-3 py-2 border ${errors[field] ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  autoFocus
                />
                {type.includes('password') && (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(prev => ({ ...prev, [field]: !prev[field] }))}
                  >
                    {showPassword[field] ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                )}
              </div>
            )}
            {errors[field] && (
              <p className="text-red-500 text-xs">{errors[field]}</p>
            )}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(activeTab)}
                className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <p className="text-gray-900">
              {type === 'password' ? '••••••••' : userData[field] || '-'}
            </p>
            <button
              onClick={() => setIsEditing(field)}
              className="text-gray-400 hover:text-blue-500 p-1 rounded-full"
            >
              <Pencil className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-5xl mx-auto px-2 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">Manage your account and preferences</p>
          </div>
        </div>
        
        {/* Success message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 shadow-sm">
            <CheckCircle className="h-5 w-5" />
            <span>{successMessage}</span>
            <button 
              onClick={() => setSuccessMessage('')} 
              className="ml-auto text-green-700 hover:text-green-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row border border-gray-100">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-gray-100 bg-gradient-to-b from-white to-blue-50/40">
            <div className="p-6 flex flex-col items-center">
              <div className="relative mb-4">
                <img 
                  src={avatar} 
                  alt="User avatar" 
                  className="h-20 w-20 rounded-full object-cover border-4 border-blue-200 shadow-lg bg-white"
                />
                <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 p-2 rounded-full shadow-md cursor-pointer border-2 border-white transition-all">
                  <Pencil className="h-4 w-4 text-white" />
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
                {isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center">
                    <RefreshCcw className="h-6 w-6 text-white animate-spin" />
                  </div>
                )}
              </div>
              <div className="text-center">
                <h2 className="font-semibold text-gray-900 text-lg">{userData.name}</h2>
                <p className="text-sm text-gray-500 mb-2">{userData.role}</p>
              </div>
              <nav className="w-full mt-4 space-y-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'profile' 
                      ? 'bg-blue-100 text-blue-700 shadow' 
                      : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  <User className="h-5 w-5 mr-2" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('account')}
                  className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'account' 
                      ? 'bg-blue-100 text-blue-700 shadow' 
                      : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  <Building2 className="h-5 w-5 mr-2" />
                  Account
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'security' 
                      ? 'bg-blue-100 text-blue-700 shadow' 
                      : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  <Lock className="h-5 w-5 mr-2" />
                  Security
                </button>
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'preferences' 
                      ? 'bg-blue-100 text-blue-700 shadow' 
                      : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  <Globe className="h-5 w-5 mr-2" />
                  Preferences
                </button>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 p-6 md:p-10 bg-white">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <RefreshCcw className="h-12 w-12 text-blue-500 animate-spin" />
              </div>
            ) : (
              <>
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderEditableField('name', 'Full Name', <User className="h-5 w-5" />)}
                        {renderEditableField('email', 'Email', <Mail className="h-5 w-5" />, 'email')}
                        {renderEditableField('phone', 'Phone', <Phone className="h-5 w-5" />, 'tel')}
                        {renderEditableField('company', 'Company', <Building2 className="h-5 w-5" />)}
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Address</h2>
                      {renderEditableField('address', 'Address', <Globe className="h-5 w-5" />, 'text')}
                    </div>
                  </div>
                )}
                
                {/* Account Tab */}
                {activeTab === 'account' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Details</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderEditableField('username', 'Username', <User className="h-5 w-5" />)}
                        {renderEditableField('role', 'Role', <Shield className="h-5 w-5" />, 'select', [
                          { value: 'admin', label: 'Administrator' },
                          { value: 'manager', label: 'Manager' },
                          { value: 'editor', label: 'Editor' },
                          { value: 'viewer', label: 'Viewer' }
                        ])}
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Activity</h2>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                          <div>
                            <p className="font-medium">Last login</p>
                            <p className="text-sm text-gray-500">Today at 10:30 AM from Karachi, Pakistan</p>
                          </div>
                          <button className="text-sm text-blue-600 hover:text-blue-800">View all activity</button>
                        </div>
                        <div className="flex items-center justify-between py-3">
                          <div>
                            <p className="font-medium">Account created</p>
                            <p className="text-sm text-gray-500">January 15, 2022</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Password</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderEditableField('currentPassword', 'Current Password', <Lock className="h-5 w-5" />, 'password')}
                        {renderEditableField('newPassword', 'New Password', <Lock className="h-5 w-5" />, 'password')}
                        {renderEditableField('confirmPassword', 'Confirm Password', <Lock className="h-5 w-5" />, 'password')}
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Security Settings</h2>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Shield className="h-6 w-6 text-gray-600" />
                            <div>
                              <p className="font-medium">Two-factor authentication</p>
                              <p className="text-sm text-gray-500">
                                {userData.twoFactorEnabled ? 'Enabled' : 'Disabled'} - adds an extra layer of security
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleToggle('twoFactorEnabled')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                              userData.twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                userData.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Bell className="h-6 w-6 text-gray-600" />
                            <div>
                              <p className="font-medium">Login notifications</p>
                              <p className="text-sm text-gray-500">
                                {userData.notifications ? 'Enabled' : 'Disabled'} - get alerts for new logins
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleToggle('notifications')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                              userData.notifications ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                userData.notifications ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Language & Region</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderEditableField('language', 'Language', <Globe className="h-5 w-5" />, 'select', [
                          { value: 'en', label: 'English' },
                          { value: 'ur', label: 'Urdu' },
                          { value: 'ar', label: 'Arabic' }
                        ])}
                        {renderEditableField('timezone', 'Timezone', <Clock className="h-5 w-5" />, 'select', [
                          { value: 'UTC+5', label: 'UTC+5 (Pakistan Standard Time)' },
                          { value: 'UTC+4', label: 'UTC+4 (Gulf Standard Time)' },
                          { value: 'UTC+0', label: 'UTC (GMT)' }
                        ])}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;