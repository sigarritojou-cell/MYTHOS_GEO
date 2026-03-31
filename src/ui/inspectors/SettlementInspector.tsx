import React from 'react';
import { useWorldStore } from '../../store/useWorldStore';
import { Building2, Users, X } from 'lucide-react';

export const SettlementInspector: React.FC = () => {
  const { selectedSettlement, setSelectedSettlement } = useWorldStore();

  if (!selectedSettlement) return null;

  return (
    <div className="w-[calc(100vw-1.5rem)] sm:w-80 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xl pointer-events-auto shrink-0 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100">{selectedSettlement.name}</h2>
          <p className="text-xs text-indigo-400 uppercase tracking-widest font-semibold">{selectedSettlement.type}</p>
        </div>
        <button onClick={() => setSelectedSettlement(null)} className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 text-sm text-slate-300">
          <Building2 className="w-4 h-4 text-emerald-400" />
          <span className="flex-1">Economy</span>
          <span className="font-mono text-slate-100">{selectedSettlement.economyRole}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-300">
          <Users className="w-4 h-4 text-indigo-400" />
          <span className="flex-1">Population</span>
          <span className="font-mono text-slate-100">{selectedSettlement.population.toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800">
        <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Inference Reasoning</div>
        <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
          {selectedSettlement.foundedBecauseOf?.map((reason, idx) => (
            <li key={idx}>{reason}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800">
        <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Coordinates</div>
        <div className="grid grid-cols-2 gap-2 font-mono text-xs text-slate-400">
          <div className="bg-slate-950 p-2 rounded border border-slate-800">Lat: {(selectedSettlement.latLon[0] * (180 / Math.PI)).toFixed(2)}°</div>
          <div className="bg-slate-950 p-2 rounded border border-slate-800">Lon: {(selectedSettlement.latLon[1] * (180 / Math.PI)).toFixed(2)}°</div>
        </div>
      </div>
    </div>
  );
};
