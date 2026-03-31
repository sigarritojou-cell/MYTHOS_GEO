import React, { useState } from 'react';
import { useWorldStore } from '../../store/useWorldStore';
import { Layers, ChevronRight, Map, Thermometer, Droplets, Package, Route, Building2, Mountain } from 'lucide-react';

export const LayersPanel: React.FC = () => {
  const { activeLayers, toggleLayer } = useWorldStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const renderLayerToggle = (key: keyof typeof activeLayers, label: string, icon: React.ReactNode) => (
    <button
      key={key}
      onClick={() => toggleLayer(key)}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-colors ${
        activeLayers[key] ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'
      }`}
    >
      <div className="flex items-center gap-2 text-sm">
        {icon}
        <span>{label}</span>
      </div>
      <div className={`w-2 h-2 rounded-full ${activeLayers[key] ? 'bg-emerald-400' : 'bg-slate-700'}`} />
    </button>
  );

  if (isCollapsed) {
    return (
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-2xl flex items-center justify-center cursor-pointer hover:bg-slate-800 transition-colors pointer-events-auto w-12 h-12 shrink-0" onClick={() => setIsCollapsed(false)} title="Open Layers">
        <Layers className="w-5 h-5 text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="w-[calc(100vw-1.5rem)] sm:w-72 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xl flex flex-col shrink-0 pointer-events-auto transition-all duration-300">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800 shrink-0">
        <button onClick={() => setIsCollapsed(true)} className="text-slate-400 hover:text-white transition-colors p-1 rounded hover:bg-slate-800" title="Collapse Panel">
          <ChevronRight className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-widest">Map Layers</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
        {renderLayerToggle('terrain', 'Terrain', <Map className="w-4 h-4" />)}
        {renderLayerToggle('climate', 'Climate', <Thermometer className="w-4 h-4" />)}
        {renderLayerToggle('biomes', 'Biomes', <Droplets className="w-4 h-4" />)}
        {renderLayerToggle('resources', 'Resources', <Package className="w-4 h-4" />)}
        {renderLayerToggle('tradeRoutes', 'Trade Routes', <Route className="w-4 h-4" />)}
        {renderLayerToggle('settlements', 'Settlements', <Building2 className="w-4 h-4" />)}
        {renderLayerToggle('features', 'Geo Features', <Mountain className="w-4 h-4" />)}
      </div>
    </div>
  );
};
