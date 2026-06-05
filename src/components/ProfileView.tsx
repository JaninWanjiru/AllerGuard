import React, { useState } from 'react';
import { useAppContext } from '../context/AppProvider';
import { ALLERGEN_DICTIONARY, type AllergenCategory } from '../utils/allergenDictionary';
import { Check, Plus, X, Shield } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { activeAllergens, toggleAllergen, customAllergens, addCustomAllergen, removeCustomAllergen } = useAppContext();
  const [customInput, setCustomInput] = useState('');

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      addCustomAllergen(customInput.trim());
      setCustomInput('');
    }
  };

  const categories = Object.keys(ALLERGEN_DICTIONARY).filter(k => k !== 'Custom') as AllergenCategory[];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">Your Allergy Profile</h2>
        <p className="text-gray-400">Select the allergens you want to monitor. We'll automatically check for their derivatives.</p>
      </div>

      <div className="glass-panel p-6">
        <div className="flex items-center space-x-2 mb-6 border-b border-gray-800 pb-4">
          <Shield className="text-emerald-500 w-5 h-5" />
          <h3 className="text-xl font-semibold">The "Big 9" Allergens</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const isActive = activeAllergens.includes(category);
            return (
              <button
                key={category}
                onClick={() => toggleAllergen(category)}
                className={`relative flex items-center p-4 rounded-xl transition-all duration-300 border ${
                  isActive 
                    ? 'bg-emerald-500/20 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                    : 'bg-gray-800/40 border-gray-700/50 hover:bg-gray-700/50'
                }`}
              >
                <div className={`w-6 h-6 rounded-md border flex items-center justify-center mr-3 transition-colors ${
                  isActive ? 'bg-emerald-500 border-emerald-500' : 'border-gray-600 bg-gray-900'
                }`}>
                  {isActive && <Check className="w-4 h-4 text-white" />}
                </div>
                <div className="text-left">
                  <p className={`font-medium ${isActive ? 'text-emerald-300' : 'text-gray-300'}`}>{category}</p>
                  <p className="text-xs text-gray-500 truncate max-w-[150px]" title={ALLERGEN_DICTIONARY[category].join(', ')}>
                    {ALLERGEN_DICTIONARY[category].slice(0, 3).join(', ')}...
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="glass-panel p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-200">Custom Allergens</h3>
        <form onSubmit={handleAddCustom} className="flex space-x-3 mb-6">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Add custom ingredient (e.g., 'Strawberries')"
            className="flex-1 bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all placeholder:text-gray-600"
          />
          <button 
            type="submit" 
            disabled={!customInput.trim()}
            className="glass-button px-6 rounded-lg text-emerald-400 font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5 mr-1" /> Add
          </button>
        </form>

        <div className="flex flex-wrap gap-3">
          {customAllergens.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No custom allergens added.</p>
          ) : (
            customAllergens.map((allergen) => (
              <div key={allergen} className="flex items-center bg-gray-800 border border-gray-700 rounded-full pl-4 pr-1 py-1">
                <span className="text-gray-300 text-sm mr-2">{allergen}</span>
                <button
                  onClick={() => removeCustomAllergen(allergen)}
                  className="p-1 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
