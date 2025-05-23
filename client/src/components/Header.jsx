import React, { useState } from 'react';
import ProfileImage from '../assets/header/pfp.png';

const Header = ({ name: initialName }) => {
  const [name, setName] = useState(initialName);
  const [isEditing, setIsEditing] = useState(false);

  const handleNameChange = (e) => setName(e.target.value);

  const handleBlur = () => setIsEditing(false);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
    }
  };

  return (
    <div className="flex justify-between items-center mb-6 p-4 sm:p-6 rounded-[30px] shadow-sm bg-white">
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
              className="text-base sm:text-lg font-semibold max-w-[150px] sm:max-w-none border-b border-gray-300 focus:outline-none"
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
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Notifications"
        >
          {/* Bell Icon */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-gray-600"
          >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
        </button>
        
        <button 
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Settings"
        >
          {/* Gear Icon */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-gray-600"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Header;
