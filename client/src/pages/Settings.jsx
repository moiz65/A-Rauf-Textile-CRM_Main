import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import SettingsPage from '../components/SettingsPage';

const Settings = () => {
  return (
    <div className="flex bg-[#F5F5F5] min-h-screen p-3">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <Header name="A RAUF TEXTILE" />
          
          <div>
            <SettingsPage />
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
