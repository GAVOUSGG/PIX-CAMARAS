import React, { useState } from 'react';
import Header from './Header';
import Navigation from './Navigation';

const Layout = ({ children, activeTab, setActiveTab, user, onLogout, darkMode, setDarkMode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className={`flex h-screen overflow-hidden selection:bg-emerald-500/30 font-sans transition-colors duration-500 ${darkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900'}`}>
      {/* Sidebar Navigation */}
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
        darkMode={darkMode}
      />
      
      {/* Main Content Area */}
      <div className={`flex flex-col flex-1 h-screen w-full overflow-hidden relative border-l transition-all duration-500 ${
        darkMode 
          ? 'bg-zinc-950 border-white/5' 
          : 'bg-white border-black/5'
      }`}>
        <Header 
          user={user} 
          onLogout={onLogout} 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative z-0">
          <div className="max-w-7xl mx-auto pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;