import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, ArrowRight, Activity, Loader2, Sparkles, RefreshCw, BrainCircuit } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AssetChart from './components/AssetChart';
import { Tab, Asset, AIAnalysis } from './types';
import { MOCK_ASSETS, MOCK_CHART_DATA, MOCK_HISTORY } from './constants';
import { analyzeAsset } from './services/geminiService';

const App: React.FC = () => {
  // Initialize tab from URL hash if available
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const hash = window.location.hash.replace('#', '').toUpperCase();
    return Object.values(Tab).includes(hash as Tab) ? (hash as Tab) : Tab.MARKET;
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset>(MOCK_ASSETS[0]);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Sync URL hash when activeTab changes
  useEffect(() => {
    const hash = activeTab.toLowerCase();
    if (window.location.hash.replace('#', '') !== hash) {
      window.location.hash = hash;
    }
  }, [activeTab]);

  // Listen for hash changes (e.g. back button)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toUpperCase();
      if (Object.values(Tab).includes(hash as Tab)) {
        setActiveTab(hash as Tab);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleConnectWallet = () => {
    setWalletConnected(!walletConnected);
  };

  const runAnalysis = async (asset: Asset) => {
    setAnalyzing(true);
    setAiAnalysis(null);
    try {
        const result = await analyzeAsset(asset);
        setAiAnalysis(result);
    } catch (e) {
        console.error(e);
    } finally {
        setAnalyzing(false);
    }
  };

  // Auto analyze when switching to Insights tab with an asset selected
  useEffect(() => {
    if (activeTab === Tab.INSIGHTS && !aiAnalysis) {
        runAnalysis(selectedAsset);
    }
  }, [activeTab, selectedAsset, aiAnalysis]);

  const renderMarket = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Chart Section */}
        <div className="flex-1 bg-zk-900 border border-zk-700 rounded-xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Activity className="w-32 h-32 text-zk-accent" />
            </div>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-1 flex items-center gap-2">
                            {selectedAsset.name} 
                            <span className="text-sm font-normal text-zk-muted bg-zk-800 px-2 py-0.5 rounded border border-zk-700">{selectedAsset.symbol}</span>
                        </h2>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl font-mono text-zk-accent">${selectedAsset.price.toFixed(2)}</span>
                            <span className={`text-sm font-medium flex items-center ${selectedAsset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {selectedAsset.change24h >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                                {Math.abs(selectedAsset.change24h)}% (24h)
                            </span>
                        </div>
                    </div>
                    <button 
                        onClick={() => { setActiveTab(Tab.INSIGHTS); runAnalysis(selectedAsset); }}
                        className="bg-zk-800 hover:bg-zk-700 text-zk-accent border border-zk-accent/30 hover:border-zk-accent px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 group/btn"
                    >
                        <Sparkles className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        AI Analysis
                    </button>
                </div>
                <AssetChart data={MOCK_CHART_DATA} color={selectedAsset.change24h >= 0 ? "#00ff9d" : "#ef4444"} />
            </div>
        </div>

        {/* Quick Stats */}
        <div className="w-full md:w-80 space-y-4">
            <div className="bg-zk-800 border border-zk-700 rounded-xl p-5">
                <h3 className="text-zk-muted text-sm font-medium mb-4 uppercase tracking-wider">Market Stats</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-zk-muted">Volume (24h)</span>
                        <span className="text-white font-mono">{selectedAsset.volume}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-zk-muted">TVL</span>
                        <span className="text-white font-mono">{selectedAsset.tvl}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-zk-muted">Category</span>
                        <span className="text-xs bg-zk-700 text-white px-2 py-1 rounded">{selectedAsset.category}</span>
                    </div>
                </div>
            </div>

             <div className="bg-zk-accent/10 border border-zk-accent/20 rounded-xl p-5">
                <h3 className="text-zk-accent text-sm font-bold mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Pro Tip
                </h3>
                <p className="text-sm text-zk-muted leading-relaxed">
                    Use the <span className="text-white font-medium">Private Swap</span> tab to obscure your transaction history before exiting to a centralized exchange.
                </p>
            </div>
        </div>
      </div>

      {/* Assets List */}
      <div className="bg-zk-900 border border-zk-700 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zk-800 flex justify-between items-center">
            <h3 className="font-bold text-white">Top Privacy Assets</h3>
            <button className="text-sm text-zk-accent hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-zk-800 text-zk-muted text-xs uppercase tracking-wider">
                    <tr>
                        <th className="p-4">Asset</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">24h Change</th>
                        <th className="p-4 hidden md:table-cell">Volume</th>
                        <th className="p-4">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zk-800">
                    {MOCK_ASSETS.map((asset) => (
                        <tr 
                            key={asset.id} 
                            onClick={() => setSelectedAsset(asset)}
                            className={`cursor-pointer transition-colors hover:bg-zk-800/50 ${selectedAsset.id === asset.id ? 'bg-zk-800/80' : ''}`}
                        >
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-zk-700 flex items-center justify-center font-bold text-xs text-zk-muted">
                                        {asset.symbol[0]}
                                    </div>
                                    <div>
                                        <div className="font-medium text-white">{asset.name}</div>
                                        <div className="text-xs text-zk-muted">{asset.symbol}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="p-4 font-mono text-white">${asset.price.toFixed(4)}</td>
                            <td className="p-4">
                                <span className={`flex items-center ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                                </span>
                            </td>
                            <td className="p-4 hidden md:table-cell text-zk-muted">{asset.volume}</td>
                            <td className="p-4">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedAsset(asset);
                                        setActiveTab(Tab.SWAP);
                                    }}
                                    className="text-xs bg-zk-700 hover:bg-zk-600 text-white px-3 py-1.5 rounded transition-colors"
                                >
                                    Trade
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );

  const renderSwap = () => (
    <div className="max-w-md mx-auto mt-10">
        <div className="bg-zk-900 border border-zk-700 rounded-2xl p-6 shadow-2xl relative">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Private Swap</h2>
                <div className="flex gap-2">
                     <button className="p-2 text-zk-muted hover:text-white hover:bg-zk-800 rounded-lg transition-colors">
                        <RefreshCw className="w-4 h-4" />
                     </button>
                </div>
            </div>

            {/* From Input */}
            <div className="bg-zk-800 rounded-xl p-4 mb-2 border border-zk-700 focus-within:border-zk-accent transition-colors">
                <div className="flex justify-between mb-2">
                    <span className="text-xs text-zk-muted">From</span>
                    <span className="text-xs text-zk-muted">Balance: {walletConnected ? '1450.00' : '0.00'}</span>
                </div>
                <div className="flex items-center gap-4">
                    <input 
                        type="number" 
                        placeholder="0.0" 
                        className="bg-transparent text-2xl font-mono text-white focus:outline-none w-full" 
                    />
                    <button className="flex items-center gap-2 bg-zk-700 hover:bg-zk-600 text-white px-3 py-1.5 rounded-full transition-colors min-w-max">
                        <div className="w-5 h-5 rounded-full bg-blue-500"></div>
                        USDT
                    </button>
                </div>
            </div>

            {/* Swap Arrow */}
            <div className="flex justify-center -my-3 relative z-10">
                <button className="bg-zk-700 border-4 border-zk-900 rounded-full p-2 text-zk-accent hover:scale-110 transition-transform">
                    <ArrowRight className="w-4 h-4 rotate-90" />
                </button>
            </div>

            {/* To Input */}
            <div className="bg-zk-800 rounded-xl p-4 mt-2 border border-zk-700 focus-within:border-zk-accent transition-colors">
                <div className="flex justify-between mb-2">
                    <span className="text-xs text-zk-muted">To (Private)</span>
                    <span className="text-xs text-zk-muted">Balance: {walletConnected ? '12.4' : '0.0'}</span>
                </div>
                <div className="flex items-center gap-4">
                    <input 
                        type="number" 
                        placeholder="0.0" 
                        className="bg-transparent text-2xl font-mono text-white focus:outline-none w-full" 
                    />
                    <button className="flex items-center gap-2 bg-zk-700 hover:bg-zk-600 text-white px-3 py-1.5 rounded-full transition-colors min-w-max">
                        <div className="w-5 h-5 rounded-full bg-zk-accent"></div>
                        {selectedAsset.symbol}
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-zk-muted">Rate</span>
                    <span className="text-white">1 {selectedAsset.symbol} = ${(selectedAsset.price).toFixed(2)} USDT</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-zk-muted">Privacy Fee</span>
                    <span className="text-zk-accent font-mono">0.1%</span>
                </div>
            </div>

            <button className="w-full mt-6 bg-zk-accent text-zk-900 font-bold py-4 rounded-xl hover:bg-opacity-90 transition-all shadow-[0_0_20px_rgba(0,255,157,0.2)]">
                {walletConnected ? 'Swap Assets' : 'Connect Wallet to Swap'}
            </button>
        </div>
    </div>
  );

  const renderPortfolio = () => (
      <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zk-900 border border-zk-700 rounded-xl p-6">
                  <h3 className="text-zk-muted text-sm mb-2">Total Privacy Value</h3>
                  <div className="text-3xl font-bold text-white font-mono">$12,450.32</div>
                  <div className="text-green-400 text-sm mt-1">+12.5% vs last week</div>
              </div>
              <div className="bg-zk-900 border border-zk-700 rounded-xl p-6">
                  <h3 className="text-zk-muted text-sm mb-2">Active Notes</h3>
                  <div className="text-3xl font-bold text-white font-mono">3</div>
                  <div className="text-zk-muted text-sm mt-1">Ready to withdraw</div>
              </div>
              <div className="bg-zk-900 border border-zk-700 rounded-xl p-6">
                  <h3 className="text-zk-muted text-sm mb-2">Relayer Fees Saved</h3>
                  <div className="text-3xl font-bold text-zk-accent font-mono">$45.20</div>
                  <div className="text-zk-muted text-sm mt-1">Via batching</div>
              </div>
          </div>

          <div className="bg-zk-900 border border-zk-700 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-zk-800">
                  <h3 className="font-bold text-white">Recent Transactions</h3>
              </div>
              <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                      <thead className="bg-zk-800 text-zk-muted text-xs uppercase">
                          <tr>
                              <th className="p-4">Type</th>
                              <th className="p-4">Asset</th>
                              <th className="p-4">Amount</th>
                              <th className="p-4">Time</th>
                              <th className="p-4">Status</th>
                              <th className="p-4">Hash</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-zk-800">
                          {MOCK_HISTORY.map((tx) => (
                              <tr key={tx.id} className="hover:bg-zk-800/50">
                                  <td className="p-4">
                                      <span className={`px-2 py-1 rounded text-xs ${
                                          tx.type === 'Deposit' ? 'bg-blue-900/50 text-blue-400' :
                                          tx.type === 'Withdraw' ? 'bg-green-900/50 text-green-400' :
                                          'bg-purple-900/50 text-purple-400'
                                      }`}>
                                          {tx.type}
                                      </span>
                                  </td>
                                  <td className="p-4 text-white">{tx.asset}</td>
                                  <td className="p-4 font-mono text-white">{tx.amount}</td>
                                  <td className="p-4 text-zk-muted">{tx.timestamp}</td>
                                  <td className="p-4 text-green-400">{tx.status}</td>
                                  <td className="p-4 text-zk-accent font-mono text-xs">{tx.hash}</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
  );

  const renderInsights = () => (
    <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <BrainCircuit className="text-zk-accent" />
                AI Sentinel Analysis
            </h2>
            <div className="flex items-center gap-3">
                <select 
                    className="bg-zk-800 border border-zk-700 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-zk-accent"
                    value={selectedAsset.id}
                    onChange={(e) => {
                        const asset = MOCK_ASSETS.find(a => a.id === e.target.value);
                        if (asset) {
                            setSelectedAsset(asset);
                            runAnalysis(asset);
                        }
                    }}
                >
                    {MOCK_ASSETS.map(a => <option key={a.id} value={a.id}>{a.name} ({a.symbol})</option>)}
                </select>
                <button 
                    onClick={() => runAnalysis(selectedAsset)} 
                    disabled={analyzing}
                    className="p-2 bg-zk-800 hover:bg-zk-700 border border-zk-700 rounded-lg text-zk-muted hover:text-white transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-5 h-5 ${analyzing ? 'animate-spin' : ''}`} />
                </button>
            </div>
        </div>

        {analyzing ? (
            <div className="h-64 flex flex-col items-center justify-center text-zk-muted space-y-4 border border-dashed border-zk-700 rounded-xl">
                <Loader2 className="w-10 h-10 animate-spin text-zk-accent" />
                <p>Gemini 2.5 Flash is analyzing market data...</p>
            </div>
        ) : aiAnalysis ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                {/* Sentiment Card */}
                <div className={`col-span-1 md:col-span-1 border rounded-xl p-6 flex flex-col items-center justify-center text-center ${
                    aiAnalysis.sentiment === 'Bullish' ? 'bg-green-900/10 border-green-500/30' : 
                    aiAnalysis.sentiment === 'Bearish' ? 'bg-red-900/10 border-red-500/30' : 
                    'bg-gray-900/10 border-gray-500/30'
                }`}>
                    <div className="text-lg text-zk-muted mb-2">Market Sentiment</div>
                    <div className={`text-3xl font-bold mb-4 ${
                        aiAnalysis.sentiment === 'Bullish' ? 'text-green-400' : 
                        aiAnalysis.sentiment === 'Bearish' ? 'text-red-400' : 
                        'text-gray-400'
                    }`}>
                        {aiAnalysis.sentiment}
                    </div>
                    <div className="w-full bg-zk-800 rounded-full h-3 overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-1000 ${
                                aiAnalysis.sentiment === 'Bullish' ? 'bg-green-500' : 
                                aiAnalysis.sentiment === 'Bearish' ? 'bg-red-500' : 
                                'bg-gray-500'
                            }`}
                            style={{ width: `${aiAnalysis.score}%` }}
                        ></div>
                    </div>
                    <div className="text-xs text-zk-muted mt-2">Confidence Score: {aiAnalysis.score}/100</div>
                </div>

                {/* Analysis Text */}
                <div className="col-span-1 md:col-span-2 bg-zk-900 border border-zk-700 rounded-xl p-6">
                    <h3 className="text-zk-accent font-bold mb-4 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Market Summary
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                        {aiAnalysis.summary}
                    </p>
                    
                    <div className="mt-6">
                        <h4 className="text-zk-muted text-sm font-bold uppercase tracking-wider mb-3">Key Technical Levels</h4>
                        <div className="flex flex-wrap gap-2">
                            {aiAnalysis.keyLevels.map((level, i) => (
                                <span key={i} className="bg-zk-800 border border-zk-600 text-xs px-3 py-1.5 rounded-full text-white font-mono">
                                    {level}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="h-64 flex items-center justify-center text-zk-muted border border-zk-700 rounded-xl">
                Select an asset to view analysis
            </div>
        )}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-zk-accent selection:text-zk-900">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={(tab) => { setActiveTab(tab); setSidebarOpen(false); }} 
        isOpen={sidebarOpen} 
      />
      
      <div className="md:pl-64 flex flex-col min-h-screen">
        <Header 
            onMenuClick={() => setSidebarOpen(true)} 
            walletConnected={walletConnected}
            onConnectWallet={handleConnectWallet}
        />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">{
                    activeTab === Tab.MARKET ? 'Market Overview' :
                    activeTab === Tab.SWAP ? 'Private Swap' :
                    activeTab === Tab.PORTFOLIO ? 'My Portfolio' :
                    'AI Market Sentinel'
                }</h1>
                <p className="text-zk-muted">
                    {activeTab === Tab.MARKET ? 'Real-time prices and privacy metrics' : 
                     activeTab === Tab.SWAP ? 'Anonymous cross-chain bridging & swapping' :
                     activeTab === Tab.PORTFOLIO ? 'Manage your shielded assets and notes' :
                     'AI-powered insights powered by Gemini 2.5 Flash'}
                </p>
            </div>

            {activeTab === Tab.MARKET && renderMarket()}
            {activeTab === Tab.SWAP && renderSwap()}
            {activeTab === Tab.PORTFOLIO && renderPortfolio()}
            {activeTab === Tab.INSIGHTS && renderInsights()}
          </div>
        </main>
      </div>

      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden opacity-20">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-zk-accent/10 blur-[150px] rounded-full mix-blend-screen"></div>
        <div className="absolute top-1/2 right-0 w-1/2 h-1/2 bg-blue-500/10 blur-[150px] rounded-full mix-blend-screen"></div>
      </div>
    </div>
  );
};

export default App;