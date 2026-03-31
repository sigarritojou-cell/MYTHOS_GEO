export interface WorldParameters {
  seed: number;
  waterLevel: number;
  continentDensity: number;
  terrainRoughness: number;
  mountainHeight: number;
  riverDensity: number;
  temperatureBias: number;
  humidityBias: number;
  iceCoverage: number;
  vegetationDensity: number;
}

export interface PlanetData {
  vertices: number[];
  colors: number[];
  indices: number[];
  elevations: number[];
  temperatures: number[];
  humidities: number[];
  biomes: string[];
}

export interface ContinentData {
  id: string;
  name: string;
  vertexIndices: number[];
  area: number;
}

export interface RegionData {
  id: string;
  continentId: string;
  bounds: number[];
  averageElevation: number;
  temperature: number;
  humidity: number;
  biomeId: string;
  resources: string[];
  coastal: boolean;
  inland: boolean;
  mountain: boolean;
  river: boolean;
  detectedFeatures: string[];
}

export interface ClimateLayerSet {
  temperatureMap: number[];
  humidityMap: number[];
}

export interface BiomeData {
  id: string;
  name: string;
  color: [number, number, number];
}

export interface ResourceZone {
  id: string;
  type: string;
  vertexIndices: number[];
}

export interface GeographicFeature {
  id: string;
  type: string;
  name: string;
  regionId: string;
  position: [number, number, number];
  importance: number;
  tags: string[];
  relatedResources: string[];
  strategicValue: number;
}

export interface Settlement {
  id: string;
  name: string;
  type: 'hamlet' | 'village' | 'town' | 'city' | 'capital';
  subtype: string;
  regionId: string;
  position: [number, number, number];
  elevation: number;
  accessToWater: boolean;
  economyRole: string;
  strategicValue: number;
  populationTier: number;
  population: number;
  foundedBecauseOf: string[];
  inferredFromFeatures: string[];
  latLon: [number, number];
}

export interface TradeRoute {
  id: string;
  type: 'road' | 'river' | 'sea' | 'highway';
  startSettlementId: string;
  endSettlementId: string;
  path: [number, number, number][];
}

export interface WorldData {
  parameters: WorldParameters;
  planetData?: PlanetData;
  regions?: RegionData[];
  features?: GeographicFeature[];
  settlements: Settlement[];
  tradeRoutes: TradeRoute[];
}

export const defaultParameters: WorldParameters = {
  seed: 12345,
  waterLevel: 0.5,
  continentDensity: 0.5,
  terrainRoughness: 0.5,
  mountainHeight: 0.5,
  riverDensity: 0.5,
  temperatureBias: 0.5,
  humidityBias: 0.5,
  iceCoverage: 0.5,
  vegetationDensity: 0.5,
};
