import { create } from 'zustand';
import { WorldData, WorldParameters, defaultParameters, Settlement, GeographicFeature } from '../data/worldModel';
import { WorldGenerator } from '../core/worldGenerator';

interface WorldState {
  parameters: WorldParameters;
  worldData: WorldData | null;
  isGenerating: boolean;
  activeLayers: {
    terrain: boolean;
    climate: boolean;
    biomes: boolean;
    resources: boolean;
    tradeRoutes: boolean;
    settlements: boolean;
    features: boolean;
  };
  selectedSettlement: Settlement | null;
  selectedFeature: GeographicFeature | null;
  selectedRegion: string | null;
  setParameter: (key: keyof WorldParameters, value: number) => void;
  setWorldData: (data: WorldData) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  toggleLayer: (layer: keyof WorldState['activeLayers']) => void;
  setSelectedSettlement: (settlement: Settlement | null) => void;
  setSelectedFeature: (feature: GeographicFeature | null) => void;
  setSelectedRegion: (region: string | null) => void;
  generateWorld: () => void;
}

export const useWorldStore = create<WorldState>((set, get) => ({
  parameters: { ...defaultParameters },
  worldData: null,
  isGenerating: false,
  activeLayers: {
    terrain: true,
    climate: false,
    biomes: false,
    resources: false,
    tradeRoutes: true,
    settlements: true,
    features: true,
  },
  selectedSettlement: null,
  selectedFeature: null,
  selectedRegion: null,

  setParameter: (key, value) =>
    set((state) => ({
      parameters: { ...state.parameters, [key]: value },
    })),

  setWorldData: (data) => set({ worldData: data }),

  setIsGenerating: (isGenerating) => set({ isGenerating }),

  toggleLayer: (layer) =>
    set((state) => ({
      activeLayers: { ...state.activeLayers, [layer]: !state.activeLayers[layer] },
    })),

  setSelectedSettlement: (settlement) => set({ selectedSettlement: settlement, selectedFeature: null }),

  setSelectedFeature: (feature) => set({ selectedFeature: feature, selectedSettlement: null }),

  setSelectedRegion: (region) => set({ selectedRegion: region }),

  generateWorld: () => {
    const { parameters } = get();
    set({ isGenerating: true });

    setTimeout(() => {
      const generator = new WorldGenerator(parameters);
      const data = generator.generateWorldData();
      set({ worldData: data, isGenerating: false });
    }, 100);
  },
}));
