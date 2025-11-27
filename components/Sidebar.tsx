import React from 'react';
import { LayoutDashboard, ArrowLeftRight, Wallet, BrainCircuit, Activity, ShieldCheck } from 'lucide-react';
import { Tab } from '../types';

interface SidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isOpen }) => {
  const menuItems = [
    { id: Tab.MARKET, label: 'Market', icon: LayoutDashboard },
    { id: Tab.SWAP, label: 'Private Swap', icon: ArrowLeftRight },
    { id: Tab.PORTFOLIO, label: 'Portfolio', icon: Wallet },
    { id: Tab.INSIGHTS, label: 'AI Sentinel', icon: BrainCircuit },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition duration-200 ease-in-out z-30 w-64 bg-zk-900 border-r border-zk-700 flex flex-col`}>
      <div className="p-6 flex items-center space-x-3 border-b border-zk-800">
        <div className="w-8 h-8 bg-zk-accent rounded-full flex items-center justify-center">
            <ShieldCheck className="text-zk-900 w-5 h-5" />
        </div>
        <span className="text-xl font-bold tracking-wider text-white">ZkMarket</span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-zk-800 text-zk-accent shadow-[0_0_15px_rgba(0,255,157,0.1)] border border-zk-700' 
                  : 'text-zk-muted hover:bg-zk-800 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-zk-accent' : 'text-zk-muted'}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zk-800">
        <div className="bg-zk-800 rounded-xl p-4 border border-zk-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zk-muted">Network Status</span>
            <span className="flex items-center text-xs text-zk-accent">
              <span className="w-2 h-2 bg-zk-accent rounded-full mr-2 animate-pulse"></span>
              Operational
            </span>
          </div>
          <div className="text-xs text-zk-muted">
            <p>Block: #19,234,121</p>
            <p>TPS: 1,245</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;