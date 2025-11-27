import React from 'react';
import { Menu, Bell, Search, Wallet } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  walletConnected: boolean;
  onConnectWallet: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, walletConnected, onConnectWallet }) => {
  return (
    <header className="h-16 bg-zk-900 border-b border-zk-800 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20 backdrop-blur-md bg-opacity-80">
      <div className="flex items-center md:hidden">
        <button onClick={onMenuClick} className="text-zk-muted hover:text-white p-2">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="hidden md:flex items-center flex-1 max-w-lg">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zk-muted w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search assets, pools, or transactions..." 
            className="w-full bg-zk-800 border border-zk-700 text-sm text-white rounded-full pl-10 pr-4 py-2 focus:outline-none focus:border-zk-accent transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-zk-muted hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <button 
          onClick={onConnectWallet}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
            walletConnected 
              ? 'bg-zk-800 text-zk-accent border border-zk-accent' 
              : 'bg-zk-accent text-zk-900 hover:bg-opacity-90 shadow-[0_0_15px_rgba(0,255,157,0.3)]'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>{walletConnected ? '0x71...8f9a' : 'Connect Wallet'}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;