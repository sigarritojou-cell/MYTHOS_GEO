import React, { useState } from 'react';
import { useWorldStore } from '../../store/useWorldStore';
import { WorldParameters } from '../../data/worldModel';
import { Settings, RefreshCw, ChevronLeft } from 'lucide-react';

export const ParametersPanel: React.FC = () => {
  const { parameters, setParameter, generateWorld, isGenerating } = useWorldStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSliderChange = (key: keyof WorldParameters, e: React.ChangeEvent<HTMLInputElement>) => {
    setParameter(key, parseFloat(e.target.value));
  };

  const renderSlider = (key: keyof WorldParameters, label: string, min = 0, max = 1, step = 0.01) => (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">{label}</label>
        <span className="text-xs text-slate-400 font-mono">{parameters[key].toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={parameters[key]}
        onChange={(e) => handleSliderChange(key, e)}
        className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
      />
    </div>
  );

  if (isCollapsed) {
    return (
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-2xl flex items-center justify-center cursor-pointer hover:bg-slate-800 transition-colors pointer-events-auto w-12 h-12 shrink-0" onClick={() => setIsCollapsed(false)} title="Open Parameters">
        <Settings className="w-5 h-5 text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="w-[calc(100vw-1.5rem)] sm:w-80 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xl flex flex-col max-h-full pointer-events-auto transition-all duration-300">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-widest">World Parameters</h2>
        </div>
        <button onClick={() => setIsCollapsed(true)} className="text-slate-400 hover:text-white transition-colors p-1 rounded hover:bg-slate-800" title="Collapse Panel">
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {renderSlider('waterLevel', 'Water Level')}
        {renderSlider('continentDensity', 'Continent Density')}
        {renderSlider('terrainRoughness', 'Terrain Roughness')}
        {renderSlider('mountainHeight', 'Mountain Height')}
        {renderSlider('temperatureBias', 'Temperature Bias')}
        {renderSlider('humidityBias', 'Humidity Bias')}
        {renderSlider('iceCoverage', 'Ice Coverage')}
        {renderSlider('vegetationDensity', 'Vegetation Density')}

        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">Seed</label>
            <span className="text-xs text-slate-400 font-mono">{parameters.seed}</span>
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              value={parameters.seed}
              onChange={(e) => setParameter('seed', parseInt(e.target.value) || 0)}
              className="w-full bg-slate-800 text-slate-200 text-sm rounded px-3 py-1.5 border border-slate-700 focus:outline-none focus:border-indigo-500 font-mono"
            />
            <button onClick={() => setParameter('seed', Math.floor(Math.random() * 1000000))} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-slate-300 transition-colors shrink-0" title="Randomize Seed">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-slate-800 shrink-0">
        <button
          onClick={generateWorld}
          disabled={isGenerating}
          className={`w-full py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${
            isGenerating ? 'bg-indigo-600/50 text-indigo-200 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20'
          }`}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate World'
          )}
        </button>
      </div>
    </div>
  );
};
