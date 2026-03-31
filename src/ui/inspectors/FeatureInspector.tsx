import React from 'react';
import { useWorldStore } from '../../store/useWorldStore';
import { Shield, X, Mountain } from 'lucide-react';

export const FeatureInspector: React.FC = () => {
  const { selectedFeature, setSelectedFeature } = useWorldStore();

  if (!selectedFeature) return null;

  return (
    <div className="w-[calc(100vw-1.5rem)] sm:w-80 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xl pointer-events-auto shrink-0 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100">{selectedFeature.name}</h2>
          <p className="text-xs text-indigo-400 uppercase tracking-widest font-semibold">{selectedFeature.type.replace('_', ' ')}</p>
        </div>
        <button onClick={() => setSelectedFeature(null)} className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 text-sm text-slate-300">
          <Mountain className="w-4 h-4 text-emerald-400" />
          <span className="flex-1">Importance</span>
          <span className="font-mono text-slate-100">{(selectedFeature.importance * 100).toFixed(0)}</span>
        </div>

        <div className="flex items-center gap-3 text-sm text-slate-300">
          <Shield className="w-4 h-4 text-rose-400" />
          <span className="flex-1">Strategic Value</span>
          <span className="font-mono text-slate-100">{(selectedFeature.strategicValue * 100).toFixed(0)}%</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800">
        <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Tags</div>
        <div className="flex flex-wrap gap-2">
          {selectedFeature.tags.map((tag, idx) => (
            <span key={idx} className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-md border border-slate-700">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800">
        <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Related Resources</div>
        <div className="flex flex-wrap gap-2">
          {selectedFeature.relatedResources.map((resource, idx) => (
            <span key={idx} className="px-2 py-1 bg-emerald-900/30 text-emerald-400 text-xs rounded-md border border-emerald-800/50">
              {resource}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
