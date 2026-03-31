import { createNoise3D } from 'simplex-noise';
import { WorldParameters, WorldData, TradeRoute, PlanetData } from '../data/worldModel';
import { RNG } from '../utils/rng';
import { GeographyAnalyzer } from './geographyAnalyzer';
import { SettlementInferencer } from './settlementInferencer';
import * as THREE from 'three';

export class WorldGenerator {
  private noise3D: ReturnType<typeof createNoise3D>;
  private params: WorldParameters;
  private rng: RNG;

  constructor(params: WorldParameters) {
    this.params = params;
    this.rng = new RNG(params.seed);
    this.noise3D = createNoise3D(() => this.rng.next());
  }

  private fbm(x: number, y: number, z: number): number {
    let f = 0.0;
    let w = 0.5;
    const p = new THREE.Vector3(x, y, z);
    for (let i = 0; i < 5; i++) {
      f += w * this.noise3D(p.x, p.y, p.z);
      p.multiplyScalar(2.0);
      w *= 0.5;
    }
    return f * 0.5 + 0.5;
  }

  public getElevation(x: number, y: number, z: number): number {
    const { seed } = this.params;
    const noisePos = new THREE.Vector3(x, y, z)
      .multiplyScalar(2.0)
      .add(new THREE.Vector3(seed * 0.1, seed * 0.2, seed * 0.3));
    return this.fbm(noisePos.x, noisePos.y, noisePos.z);
  }

  public getTemperature(x: number, y: number, z: number, elevation: number): number {
    const { temperatureBias, waterLevel, seed } = this.params;
    const height = (elevation - waterLevel) / (1.0 - waterLevel);

    let temp = 1.0 - Math.abs(y);
    if (elevation > waterLevel) {
      temp -= height * 0.6;
    }
    temp += this.noise3D(x * 4.0 + seed, y * 4.0 + seed, z * 4.0 + seed) * 0.25;
    temp *= temperatureBias * 2.0;

    return Math.max(0, Math.min(1, temp));
  }

  public getHumidity(x: number, y: number, z: number): number {
    const { humidityBias, seed } = this.params;
    let humidity = this.fbm(x * 3.5 + 100.0 + seed, y * 3.5 + 100.0 + seed, z * 3.5 + 100.0 + seed);
    humidity *= humidityBias * 2.0;
    return Math.max(0, Math.min(1, humidity));
  }

  private generatePlanetData(): PlanetData {
    const geometry = new THREE.IcosahedronGeometry(1, 60);
    const posAttribute = geometry.attributes.position;

    const vertices: number[] = [];
    const colors: number[] = [];
    const elevations: number[] = [];
    const temperatures: number[] = [];
    const humidities: number[] = [];
    const biomes: string[] = [];

    const { waterLevel, iceCoverage } = this.params;

    for (let i = 0; i < posAttribute.count; i++) {
      const x = posAttribute.getX(i);
      const y = posAttribute.getY(i);
      const z = posAttribute.getZ(i);

      const elevation = this.getElevation(x, y, z);
      const temp = this.getTemperature(x, y, z, elevation);
      const humidity = this.getHumidity(x, y, z);

      elevations.push(elevation);
      temperatures.push(temp);
      humidities.push(humidity);

      let r = 0;
      let g = 0;
      let b = 0;
      let biome = 'Ocean';

      if (elevation < waterLevel) {
        const depth = (waterLevel - elevation) / waterLevel;
        r = 0.76;
        g = 0.7;
        b = 0.5;
        if (depth > 0.3) {
          r = 0.4;
          g = 0.4;
          b = 0.3;
        }
      } else {
        const height = (elevation - waterLevel) / (1.0 - waterLevel);

        if (temp < 0.2 || 1.0 - temp < iceCoverage) {
          biome = 'Snow';
          r = 0.95;
          g = 0.98;
          b = 1.0;
        } else if (height > 0.7) {
          biome = 'Mountain';
          r = 0.4;
          g = 0.4;
          b = 0.45;
        } else if (height > 0.4) {
          biome = 'Highlands';
          r = 0.45;
          g = 0.35;
          b = 0.25;
        } else if (humidity < 0.3) {
          biome = 'Desert';
          r = 0.85;
          g = 0.75;
          b = 0.55;
        } else if (humidity < 0.45) {
          biome = 'Dry Plains';
          r = 0.6;
          g = 0.6;
          b = 0.3;
        } else if (humidity > 0.7) {
          biome = 'Forest';
          r = 0.15;
          g = 0.35;
          b = 0.15;
        } else {
          biome = 'Plains';
          r = 0.25;
          g = 0.5;
          b = 0.2;
        }
      }

      biomes.push(biome);
      colors.push(r, g, b);
      vertices.push(x, y, z);
    }

    const indices = geometry.index ? Array.from(geometry.index.array as Iterable<number>) : [];

    return {
      vertices,
      colors,
      indices,
      elevations,
      temperatures,
      humidities,
      biomes,
    };
  }

  public generateWorldData(): WorldData {
    const planetData = this.generatePlanetData();
    const analyzer = new GeographyAnalyzer();
    const features = analyzer.analyze(planetData, this.params.waterLevel);
    const inferencer = new SettlementInferencer(this.params.seed);
    const settlements = inferencer.inferSettlements(planetData, features, this.params.waterLevel);

    const tradeRoutes: TradeRoute[] = [];
    for (let i = 0; i < settlements.length; i++) {
      const distances = settlements
        .map((settlement, idx) => ({
          idx,
          dist: new THREE.Vector3(...settlements[i].position).distanceTo(new THREE.Vector3(...settlement.position)),
        }))
        .filter((distance) => distance.idx !== i)
        .sort((a, b) => a.dist - b.dist);

      const connections = Math.floor(this.rng.next() * 2) + 1;

      for (let c = 0; c < Math.min(connections, distances.length); c++) {
        const targetIdx = distances[c].idx;
        const s1 = settlements[i];
        const s2 = settlements[targetIdx];

        const routeId1 = `route-${s1.id}-${s2.id}`;
        const routeId2 = `route-${s2.id}-${s1.id}`;
        if (!tradeRoutes.find((route) => route.id === routeId1 || route.id === routeId2) && distances[c].dist < 0.6) {
          tradeRoutes.push({
            id: routeId1,
            type: s1.type === 'capital' || s2.type === 'capital' ? 'highway' : 'road',
            startSettlementId: s1.id,
            endSettlementId: s2.id,
            path: [s1.position, s2.position],
          });
        }
      }
    }

    return {
      parameters: { ...this.params },
      planetData,
      features,
      settlements,
      tradeRoutes,
    };
  }
}
