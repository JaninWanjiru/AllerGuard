import React from 'react';
import type { AnalysisResult } from '../utils/analysisEngine';
import { AlertOctagon, AlertTriangle, CheckCircle2, RefreshCcw, ShieldAlert } from 'lucide-react';

interface ResultsDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result, onReset }) => {
  const { verdict, matchedAllergens, prideLoopTriggered, highlightedText } = result;

  const isSafe = verdict === 'SAFE';
  const isWarning = verdict === 'WARNING';
  const isCritical = verdict === 'CRITICAL';

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 max-w-2xl mx-auto">
      
      {/* High-visibility Status Badge */}
      <div className={`glass-panel p-8 text-center border-t-4 shadow-2xl relative overflow-hidden ${
        isSafe ? 'border-t-emerald-500' :
        isWarning ? 'border-t-amber-500' : 'border-t-rose-500'
      }`}>
        
        {/* Glow effect */}
        <div className={`absolute -top-20 -left-20 w-40 h-40 blur-[80px] rounded-full opacity-50 ${
          isSafe ? 'bg-emerald-500' :
          isWarning ? 'bg-amber-500' : 'bg-rose-500'
        }`} />

        <div className="relative z-10 flex flex-col items-center">
          {isSafe && <CheckCircle2 className="w-20 h-20 text-emerald-400 mb-4 animate-bounce" />}
          {isWarning && <AlertTriangle className="w-20 h-20 text-amber-400 mb-4 animate-pulse" />}
          {isCritical && !prideLoopTriggered && <AlertOctagon className="w-20 h-20 text-rose-500 mb-4 animate-pulse" />}
          {isCritical && prideLoopTriggered && <ShieldAlert className="w-20 h-20 text-purple-500 mb-4 animate-pulse" />}
          
          <h2 className={`text-4xl font-extrabold tracking-tight mb-2 ${
            isSafe ? 'text-emerald-400' :
            isWarning ? 'text-amber-400' : 'text-rose-500'
          }`}>
            {isSafe && 'SAFE TO EAT'}
            {isWarning && 'MAY CONTAIN / WARNING'}
            {isCritical && !prideLoopTriggered && 'CRITICAL MATCH DETECTED'}
            {isCritical && prideLoopTriggered && 'ALGORITHMIC HOLD'}
          </h2>

          {prideLoopTriggered && (
            <p className="text-xl text-purple-300 font-semibold mt-2 px-4 py-2 bg-purple-900/30 rounded-lg border border-purple-500/50">
              Routing to Public Health Officers via PRIDE Network
            </p>
          )}

          <p className="text-gray-400 mt-4 text-lg">
            {isSafe && "No active allergens were detected in the ingredients list."}
            {isWarning && "Cross-contamination warning. Please exercise caution."}
            {isCritical && !prideLoopTriggered && "Do not consume. Active allergens detected."}
          </p>
        </div>
      </div>

      {/* Detailed Breakdown */}
      {!isSafe && (
        <div className="glass-panel p-6 border border-rose-500/20">
          <h3 className="text-xl font-semibold mb-4 text-gray-200">Trigger Breakdown</h3>
          <div className="space-y-3">
            {matchedAllergens.map((match, idx) => (
              <div key={idx} className="flex items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="w-2 h-2 rounded-full bg-rose-500 mr-3" />
                <p className="text-gray-200">
                  Triggered by <span className="font-bold text-rose-400">'{match.triggerWord}'</span> 
                  {match.category !== 'Custom' && <span className="text-gray-400"> → Derivative of {match.category}</span>}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Highlighted Text View */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-200">Analyzed Text</h3>
        <div 
          className="p-4 bg-gray-900/80 rounded-xl text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-wrap border border-gray-800"
          dangerouslySetInnerHTML={{ __html: highlightedText }}
        />
      </div>

      <button
        onClick={onReset}
        className="w-full glass-button py-4 rounded-xl text-emerald-400 font-bold flex items-center justify-center text-lg shadow-lg hover:shadow-emerald-500/20"
      >
        <RefreshCcw className="w-5 h-5 mr-2" />
        Scan Another Label
      </button>

    </div>
  );
};
