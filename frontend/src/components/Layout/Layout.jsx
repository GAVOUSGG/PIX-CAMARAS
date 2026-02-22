import React, { useState } from 'react';
import Header from './Header';
import Navigation from './Navigation';

const Layout = ({ children, activeTab, setActiveTab, user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden selection:bg-emerald-500/30 font-sans">
      {/* Sidebar Navigation */}
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
      />
      
      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-screen w-full overflow-hidden relative bg-[#0B1120] md:rounded-l-[2rem] border-l border-white/5 shadow-2xl">
        <Header user={user} onLogout={onLogout} onMenuClick={() => setIsMobileMenuOpen(true)} />
        
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