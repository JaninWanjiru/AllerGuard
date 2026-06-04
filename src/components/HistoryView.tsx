import React, { useState } from 'react';
import { useAppContext } from '../context/AppProvider';
import { Search, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';

export const HistoryView: React.FC = () => {
  const { scanHistory } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = scanHistory.filter(scan => 
    scan.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scan.triggers.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">Scan History</h2>
          <p className="text-gray-400 mt-1">Review your past scans and safety verdicts.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products or triggers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-gray-600"
          />
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        {filteredHistory.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p>No scan history found matching your search.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800/50">
            {filteredHistory.map((scan) => (
              <div key={scan.id} className="p-4 md:p-6 hover:bg-gray-800/30 transition-colors flex flex-col md:flex-row md:items-center gap-4">
                
                <div className="flex-shrink-0">
                  {scan.verdict === 'SAFE' && (
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-emerald-400" />
                    </div>
                  )}
                  {scan.verdict === 'WARNING' && (
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-amber-400" />
                    </div>
                  )}
                  {scan.verdict === 'CRITICAL' && (
                    <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center relative">
                      {scan.prideTriggered ? <ShieldAlert className="w-6 h-6 text-rose-400" /> : <AlertTriangle className="w-6 h-6 text-rose-400" />}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-1">
                    <h4 className="text-lg font-semibold text-gray-200">{scan.productName || 'Unknown Product'}</h4>
                    <span className="text-sm text-gray-500">{new Date(scan.timestamp).toLocaleString()}</span>
                  </div>
                  
                  {scan.prideTriggered && (
                    <div className="inline-block px-2 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs rounded mb-2 font-medium">
                      PRIDE Loop Triggered
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mt-2">
                    {scan.triggers.length > 0 ? (
                       scan.triggers.map((trigger, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-gray-400">
                          {trigger}
                        </span>
                      ))
                    ) : (
                      <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-xs text-emerald-400/80">
                        No triggers detected
                      </span>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
