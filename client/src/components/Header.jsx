import React, { useState, useEffect, useRef } from 'react';
import ProfileImage from '../assets/header/pfp.png';
import { Bell, BellOff, Settings, X, Check, ChevronDown, User as UserIcon, LogOut } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const Header = ({ name: initialName }) => {
  // Get users from localStorage
  const storedUsers = localStorage.getItem('users');
  const users = storedUsers ? JSON.parse(storedUsers) : (localStorage.getItem('user') ? [JSON.parse(localStorage.getItem('user'))] : []);
  const storedActiveUser = localStorage.getItem('activeUser');
  const [activeUser, setActiveUser] = useState(storedActiveUser ? JSON.parse(storedActiveUser) : users[0] || null);
  // Prefer firstName + lastName from user if available, fallback to name, then initialName
  const [name, setName] = useState(() => {
    const settings = localStorage.getItem('settings');
    if (settings) {
      try {
        const parsed = JSON.parse(settings);
        if (parsed.companyName) return parsed.companyName;
      } catch {}
    }
    // Try to get firstName + lastName from user (from login)
    if (activeUser && (activeUser.firstName || activeUser.lastName)) {
      return `${activeUser.firstName || ''} ${activeUser.lastName || ''}`.trim();
    }
    return activeUser?.name || initialName || 'User';
  });
  const [isEditing, setIsEditing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [profileImg, setProfileImg] = useState(activeUser?.profileImg || ProfileImage);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Check notification permission on component mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setHasPermission(Notification.permission === 'granted');
      if (Notification.permission === 'granted') {
        setNotificationsEnabled(true);
      }
    }
  }, []);

  // Update localStorage and state when activeUser changes
  useEffect(() => {
    if (activeUser) {
      // Prefer firstName + lastName if available
      if (activeUser.firstName || activeUser.lastName) {
        setName(`${activeUser.firstName || ''} ${activeUser.lastName || ''}`.trim());
      } else {
        setName(activeUser.name);
      }
      setProfileImg(activeUser.profileImg || ProfileImage);
      localStorage.setItem('activeUser', JSON.stringify(activeUser));
    }
  }, [activeUser]);

  // Update users in localStorage when profile image or name changes
  useEffect(() => {
    if (activeUser && users.length > 0) {
      // If firstName/lastName exist, update them as well
      let updatedUser = { ...activeUser, profileImg };
      if (name && (!activeUser.firstName && !activeUser.lastName)) {
        updatedUser.name = name;
      } else if (name && (activeUser.firstName || activeUser.lastName)) {
        // Optionally split name back to first/last if user edits it
        const [first, ...rest] = name.split(' ');
        updatedUser.firstName = first;
        updatedUser.lastName = rest.join(' ');
      }
      const updatedUsers = users.map(u => u.email === activeUser.email ? updatedUser : u);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setActiveUser(prev => ({ ...updatedUser }));
    }
    // eslint-disable-next-line
  }, [name, profileImg]);

  // When settings change, update name if companyName changes
  useEffect(() => {
    const handleStorage = () => {
      const settings = localStorage.getItem('settings');
      if (settings) {
        try {
          const parsed = JSON.parse(settings);
          if (parsed.companyName) setName(parsed.companyName);
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleNameChange = (e) => setName(e.target.value);
  const handleBlur = () => setIsEditing(false);
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
    }
  };

  const toggleNotifications = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications');
      return;
    }
    if (Notification.permission === 'denied') {
      alert('Notifications have been blocked. Please enable them in your browser settings.');
      return;
    }
    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      setHasPermission(permission === 'granted');
      setNotificationsEnabled(permission === 'granted');
    } else {
      setNotificationsEnabled(!notificationsEnabled);
      setUnreadCount(0);
    }
    if (!notificationsEnabled && (hasPermission || Notification.permission === 'granted')) {
      setTimeout(() => {
        new Notification('Notifications Enabled', {
          body: 'You will now receive important updates',
          icon: profileImg
        });
        setUnreadCount(1);
      }, 1000);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Demo: Simulate receiving notifications
  useEffect(() => {
    if (notificationsEnabled && hasPermission) {
      const interval = setInterval(() => {
        if (Math.random() > 0.7) {
          new Notification('New Update', {
            body: 'You have new activity in your dashboard',
            icon: profileImg
          });
          setUnreadCount(prev => prev + 1);
        }
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [notificationsEnabled, hasPermission, profileImg]);

  // Handle profile image upload
  const handleProfileImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfileImg(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle user dropdown
  const handleUserDropdown = () => setShowUserDropdown(v => !v);
  const handleUserSwitch = (user) => {
    setActiveUser(user);
    setShowUserDropdown(false);
  };

  return (
    <div className="flex justify-between items-center mb-6 p-4 sm:p-6 rounded-[30px] shadow-sm bg-white text-black">
      {/* Profile Section */}
      <div className="flex items-center relative">
        {/* Profile Image and Edit */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full mr-3 sm:mr-4 overflow-hidden relative group cursor-pointer">
          <img
            src={profileImg}
            alt="Profile"
            className="w-full h-full object-cover"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            title="Click to change profile image"
            style={{ cursor: 'pointer' }}
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleProfileImgChange}
          />
          <span className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 text-[10px] border border-white pointer-events-none">Edit</span>
        </div>
        {/* User Info and Name Edit */}
        <div className="flex flex-col min-w-0">
          <div className="text-gray-500 text-xs sm:text-sm truncate">Welcome Back!</div>
          <div className="text-xs text-blue-600 font-semibold mb-1 truncate">
            {activeUser?.email ? `Logged in as: ${activeUser.email}` : ''}
          </div>
          {activeUser?.username && (
            <div className="text-xs text-gray-500 mb-1 truncate">Username: <span className="font-semibold">{activeUser.username}</span></div>
          )}
          {isEditing ? (
            <input
              value={name}
              onChange={handleNameChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              autoFocus
              className="text-base sm:text-lg font-semibold max-w-[150px] sm:max-w-none border-b border-gray-300 focus:outline-none bg-transparent"
              style={{ minWidth: 0 }}
            />
          ) : (
            <h1
              className="text-base sm:text-lg font-semibold truncate max-w-[150px] sm:max-w-none cursor-pointer"
              onClick={() => setIsEditing(true)}
              title="Click to edit"
              style={{ minWidth: 0 }}
            >
              {name}
            </h1>
          )}
        </div>
        {/* User Switch Dropdown */}
        {users.length > 1 && (
          <div className="relative ml-2">
            <button
              className="flex items-center px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 border border-gray-200"
              onClick={handleUserDropdown}
            >
              <UserIcon className="w-4 h-4 mr-1" />
              Switch
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>
            {showUserDropdown && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                {users.map((u, idx) => (
                  <button
                    key={u.email}
                    className={`flex items-center w-full px-3 py-2 text-sm hover:bg-blue-50 ${u.email === activeUser.email ? 'bg-blue-100 font-bold' : ''}`}
                    onClick={() => handleUserSwitch(u)}
                  >
                    <img
                      src={u.profileImg || ProfileImage}
                      alt="User"
                      className="w-6 h-6 rounded-full mr-2 border-2 border-blue-400"
                    />
                    <span className="truncate">{(u.firstName || u.lastName) ? `${u.firstName || ''} ${u.lastName || ''}`.trim() : (u.name || u.email)}</span>
                    {u.email === activeUser.email && (
                      <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">Active</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Icons Section */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <button 
          className="p-2 relative rounded-full hover:bg-gray-100 transition-colors"
          onClick={toggleNotifications}
          aria-label={notificationsEnabled ? "Disable notifications" : "Enable notifications"}
        >
          {notificationsEnabled ? (
            <Bell className="w-5 h-5 text-gray-600" />
          ) : (
            <BellOff className="w-5 h-5 text-gray-400" />
          )}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
        <div className="relative">
          <button 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
          {showSettings && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-30">
              <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 animate-fade-in mx-2">
                <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-500" /> Settings
                </h3>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                  title="Close settings"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
                <div className="space-y-8">
                {/* Profile Settings */}
                <div>
                  <div className="font-medium text-gray-700 mb-2">Profile</div>
                  <div className="flex items-center gap-4">
                    <img src={profileImg} alt="Profile" className="w-14 h-14 rounded-full border-2 border-blue-400 object-cover" />
                    <div>
                      <div className="font-semibold text-gray-900 text-lg">{name}</div>
                      <div className="text-xs text-gray-500">{activeUser?.email}</div>
                      <label className="block mt-2 text-xs text-blue-600 cursor-pointer hover:underline">
                        Change Photo
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          style={{ display: 'none' }}
                          onChange={handleProfileImgChange}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                {/* Company Settings */}
                <div>
                  <div className="font-medium text-gray-700 mb-2">Company Name</div>
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={name}
                    onChange={handleNameChange}
                    placeholder="Enter company name"
                  />
                </div>
                {/* Professional Preferences */}
                <div>
                  <div className="font-medium text-gray-700 mb-2">Preferences</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={notificationsEnabled}
                        onChange={toggleNotifications}
                        className="accent-blue-500 w-4 h-4"
                      />
                      <span className="text-sm text-gray-600">Enable notifications</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        // Placeholder for dark mode toggle
                        checked={false}
                        onChange={() => {}}
                        className="accent-blue-500 w-4 h-4"
                        disabled
                      />
                      <span className="text-sm text-gray-400">Dark mode (coming soon)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        // Placeholder for email reports
                        checked={false}
                        onChange={() => {}}
                        className="accent-blue-500 w-4 h-4"
                        disabled
                      />
                      <span className="text-sm text-gray-400">Email weekly reports (coming soon)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        // Placeholder for 2FA
                        checked={false}
                        onChange={() => {}}
                        className="accent-blue-500 w-4 h-4"
                        disabled
                      />
                      <span className="text-sm text-gray-400">Two-factor authentication (coming soon)</span>
                    </label>
                  </div>
                </div>
                {/* Save & Logout */}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                    onClick={() => {
                      // Save preferences to localStorage
                      localStorage.setItem('settings', JSON.stringify({ companyName: name }));
                      setShowSettings(false);
                    }}
                  >
                    <Check className="w-4 h-4" />
                    Save Preferences
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 py-2 px-4 bg-red-100 hover:bg-red-200 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors text-red-700"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;