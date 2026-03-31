import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { PlanetRenderer } from './render/PlanetRenderer';
import { ParametersPanel } from './ui/panels/ParametersPanel';
import { LayersPanel } from './ui/panels/LayersPanel';
import { SettlementInspector } from './ui/inspectors/SettlementInspector';
import { FeatureInspector } from './ui/inspectors/FeatureInspector';
import { useWorldStore } from './store/useWorldStore';
import { WorldGenerator } from './core/worldGenerator';
import { Globe, Download } from 'lucide-react';

export default function App() {
  const { parameters, setWorldData, setIsGenerating, worldData } = useWorldStore();

  useEffect(() => {
    // Initial generation
    const generate = async () => {
      setIsGenerating(true);
      // Use setTimeout to allow UI to update before heavy computation
      setTimeout(() => {
        const generator = new WorldGenerator(parameters);
        const data = generator.generateWorldData();
        setWorldData(data);
        setIsGenerating(false);
      }, 100);
    };
    generate();
  }, [parameters, setWorldData, setIsGenerating]);

  const handleExport = () => {
    if (!worldData) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(worldData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `world_${parameters.seed}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative font-sans text-slate-200">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
          <ambientLight intensity={0.1} />
          <directionalLight position={[5, 3, 5]} intensity={1.5} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <PlanetRenderer />
          <OrbitControls 
            enablePan={true} 
            enableZoom={true} 
            enableRotate={true}
            minDistance={1.1}
            maxDistance={10}
          />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col p-3 sm:p-4 overflow-hidden">
        {/* Header */}
        <header className="flex justify-between items-center mb-4 pointer-events-auto shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 bg-slate-900/80 backdrop-blur-md px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-slate-800 shadow-lg">
            <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-widest text-white uppercase leading-tight">MYTHOS GEO</h1>
              <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-widest leading-tight">Planetary World Generator</p>
            </div>
          </div>

          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-slate-700 transition-colors shadow-lg"
          >
            <Download className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-medium uppercase tracking-wider hidden sm:inline">Export JSON</span>
            <span className="text-xs font-medium uppercase tracking-wider sm:hidden">Export</span>
          </button>
        </header>

        {/* Main Layout */}
        <div className="flex-1 relative pointer-events-none">
          {/* Left Panel */}
          <div className="absolute top-0 left-0 bottom-0 pointer-events-none flex flex-col max-w-[calc(100vw-1.5rem)] sm:max-w-sm overflow-hidden pb-2">
            <ParametersPanel />
          </div>

          {/* Right Panel */}
          <div className="absolute top-0 right-0 bottom-0 pointer-events-none flex flex-col items-end gap-3 sm:gap-4 max-w-[calc(100vw-1.5rem)] sm:max-w-sm overflow-y-auto custom-scrollbar pb-2 pr-1">
            <LayersPanel />
            <SettlementInspector />
            <FeatureInspector />
          </div>
        </div>
      </div>
    </div>
  );
}
