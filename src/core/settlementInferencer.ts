import { GeographicFeature, Settlement, PlanetData } from '../data/worldModel';
import { RNG } from '../utils/rng';
import * as THREE from 'three';

export class SettlementInferencer {
  private rng: RNG;

  constructor(seed: number) {
    this.rng = new RNG(seed);
  }

  public inferSettlements(_planetData: PlanetData, features: GeographicFeature[], _waterLevel: number): Settlement[] {
    const settlements: Settlement[] = [];
    const numSettlements = 150;

    const sortedFeatures = [...features].sort((a, b) => b.strategicValue - a.strategicValue);

    let cityCount = 0;

    for (let i = 0; i < Math.min(numSettlements, sortedFeatures.length); i++) {
      const feature = sortedFeatures[i];

      if (this.rng.next() > 0.7) continue;

      const isCapital = cityCount === 0;
      const isCity = cityCount > 0 && cityCount < 5 && this.rng.next() > 0.5;
      const type = isCapital ? 'capital' : isCity ? 'city' : this.rng.next() > 0.5 ? 'town' : 'hamlet';

      cityCount++;

      const populationBase = type === 'capital' ? 500000 : type === 'city' ? 100000 : type === 'town' ? 10000 : 500;
      const population = Math.floor(populationBase * (0.5 + this.rng.next()));

      let subtype = 'farming_town';
      let economyRole = 'Agriculture';
      let namePrefix = 'Field';
      const reasons: string[] = [];
      const inferredFrom: string[] = [feature.id];

      if (feature.type === 'natural_harbor') {
        subtype = 'port_city';
        economyRole = 'Trade Port';
        namePrefix = 'Port';
        reasons.push('Located in a natural harbor');
        reasons.push('Excellent access to maritime trade routes');
      } else if (feature.type === 'mountain_peak') {
        subtype = 'mining_town';
        economyRole = 'Mining';
        namePrefix = 'Iron';
        reasons.push('Proximity to mineral-rich mountains');
        reasons.push('Defensible high-altitude position');
      } else if (feature.type === 'fertile_plain') {
        subtype = 'farming_town';
        economyRole = 'Agriculture Hub';
        namePrefix = 'Green';
        reasons.push('Surrounded by highly fertile plains');
        reasons.push('Ideal for large-scale crop production');
      } else if (feature.type === 'oasis') {
        subtype = 'trade_hub';
        economyRole = 'Desert Trade Stop';
        namePrefix = 'Sun';
        reasons.push('Crucial water source in arid region');
        reasons.push('Natural stopping point for desert caravans');
      } else if (feature.type === 'river_valley') {
        subtype = 'river_city';
        economyRole = 'River Trade & Farming';
        namePrefix = 'River';
        reasons.push('Sheltered valley with freshwater access');
        reasons.push('Good conditions for mixed economy');
      }

      const pos = new THREE.Vector3(...feature.position);
      const lat = Math.asin(pos.y);
      const lon = Math.atan2(pos.z, pos.x);

      settlements.push({
        id: `settlement_${i}`,
        name: `${namePrefix} ${type === 'capital' ? 'Prime' : type === 'city' ? 'City' : i}`,
        type,
        subtype,
        regionId: feature.regionId,
        position: feature.position,
        elevation: feature.importance,
        accessToWater: feature.type === 'natural_harbor',
        economyRole,
        strategicValue: feature.strategicValue,
        populationTier: type === 'capital' ? 5 : type === 'city' ? 4 : type === 'town' ? 3 : 1,
        population,
        foundedBecauseOf: reasons,
        inferredFromFeatures: inferredFrom,
        latLon: [lat, lon],
      });
    }

    return settlements;
  }
}
