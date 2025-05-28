import React, { useState, useEffect } from 'react';
import ProfileImage from '../assets/header/pfp.png';
import { Bell, BellOff, Settings, X, Check } from 'lucide-react';

const Header = ({ name: initialName }) => {
  const [name, setName] = useState(initialName);
  const [isEditing, setIsEditing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState('medium');

  // Check notification permission and apply font size on component mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setHasPermission(Notification.permission === 'granted');
      if (Notification.permission === 'granted') {
        setNotificationsEnabled(true);
      }
    }

    // Check for saved preferences
    const savedFontSize = localStorage.getItem('fontSize') || 'medium';
    setFontSize(savedFontSize);
    applyFontSize(savedFontSize);
  }, []);

  const applyFontSize = (size) => {
    document.documentElement.style.fontSize = 
      size === 'small' ? '14px' : size === 'large' ? '18px' : '16px';
  };

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
      setUnreadCount(0); // Clear notifications when toggling
    }

    if (!notificationsEnabled && (hasPermission || Notification.permission === 'granted')) {
      setTimeout(() => {
        new Notification('Notifications Enabled', {
          body: 'You will now receive important updates',
          icon: ProfileImage
        });
        setUnreadCount(1);
      }, 1000);
    }
  };

  const changeFontSize = (size) => {
    setFontSize(size);
    localStorage.setItem('fontSize', size);
    applyFontSize(size);
  };

  // Demo: Simulate receiving notifications
  useEffect(() => {
    if (notificationsEnabled && hasPermission) {
      const interval = setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance of notification
          new Notification('New Update', {
            body: 'You have new activity in your dashboard',
            icon: ProfileImage
          });
          setUnreadCount(prev => prev + 1);
        }
      }, 30000); // Every 30 seconds

      return () => clearInterval(interval);
    }
  }, [notificationsEnabled, hasPermission]);

  return (
    <div className="flex justify-between items-center mb-6 p-4 sm:p-6 rounded-[30px] shadow-sm bg-white text-black">
      {/* Profile Section */}
      <div className="flex items-center">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full mr-3 sm:mr-4 overflow-hidden">
          <img 
            src={ProfileImage} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <div className="text-gray-500 text-xs sm:text-sm">Welcome Back!</div>
          {isEditing ? (
            <input
              value={name}
              onChange={handleNameChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              autoFocus
              className="text-base sm:text-lg font-semibold max-w-[150px] sm:max-w-none border-b border-gray-300 focus:outline-none bg-transparent"
            />
          ) : (
            <h1
              className="text-base sm:text-lg font-semibold truncate max-w-[150px] sm:max-w-none cursor-pointer"
              onClick={() => setIsEditing(true)}
              title="Click to edit"
            >
              {name}
            </h1>
          )}
        </div>
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
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10 p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Settings</h3>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="block mb-2">Font Size</span>
                  <div className="flex gap-2">
                    {['small', 'medium', 'large'].map((size) => (
                      <button
                        key={size}
                        onClick={() => changeFontSize(size)}
                        className={`px-3 py-1 text-sm rounded-full ${fontSize === size ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
                      >
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <button className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                    <Check className="w-4 h-4" />
                    Save Preferences
                  </button>
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