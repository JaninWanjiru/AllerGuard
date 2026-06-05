import React from 'react';
import { Camera, List, Clock, ShieldAlert } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'scanner', label: 'Scanner', icon: Camera },
    { id: 'profile', label: 'Profile', icon: List },
    { id: 'history', label: 'History', icon: Clock },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950 text-gray-100">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 glass-dark border-r border-gray-800 z-10">
        <div className="p-6 flex items-center space-x-3 text-emerald-400">
          <ShieldAlert className="w-8 h-8" />
          <h1 className="text-2xl font-bold tracking-tight">AllerGuard</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-8">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeTab === item.id 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto overflow-x-hidden pb-20 md:pb-0">
        {/* Mobile Header */}
        <header className="md:hidden glass sticky top-0 z-20 flex items-center justify-between p-4 border-b border-gray-800/50">
          <div className="flex items-center space-x-2 text-emerald-400">
            <ShieldAlert className="w-6 h-6" />
            <h1 className="text-xl font-bold">AllerGuard</h1>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-5xl mx-auto min-h-full">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 w-full glass z-50 border-t border-gray-800/50">
        <div className="flex justify-around items-center p-3">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                activeTab === item.id ? 'text-emerald-400' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <item.icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};
