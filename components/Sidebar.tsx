import React from 'react';
import { LayoutDashboard, Globe, FileText, Users, Settings, ShieldAlert, Radar } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scanner', label: 'Recon & Scanning', icon: Radar },
    { id: 'websites', label: 'Websites', icon: Globe },
    { id: 'vulnerabilities', label: 'Vulnerabilities', icon: ShieldAlert },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'collaborators', label: 'Collaborators', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 text-slate-300 flex flex-col fixed left-0 top-0 shadow-xl z-50">
      <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
          <ShieldAlert size={20} />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">CyberScope</span>
      </div>

      <nav className="flex-1 py-6 space-y-1 px-3">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">
          Main Menu
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-slate-800/50">
          <div className="relative">
            <img 
              src="https://picsum.photos/100/100" 
              alt="User" 
              className="w-10 h-10 rounded-full border-2 border-slate-700"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">Alex Chen</span>
            <span className="text-xs text-slate-400">Security Lead</span>
          </div>
        </div>
      </div>
    </div>
  );
};