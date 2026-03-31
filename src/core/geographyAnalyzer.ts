import { GeographicFeature, PlanetData } from '../data/worldModel';

export class GeographyAnalyzer {
  public analyze(planetData: PlanetData, waterLevel: number): GeographicFeature[] {
    const features: GeographicFeature[] = [];
    const { vertices, elevations, humidities, temperatures } = planetData;

    const vertexCount = elevations.length;

    for (let i = 0; i < vertexCount; i += 10) {
      const elevation = elevations[i];
      if (elevation > waterLevel + 0.4) {
        const x = vertices[i * 3];
        const y = vertices[i * 3 + 1];
        const z = vertices[i * 3 + 2];

        features.push({
          id: `feature_peak_${i}`,
          type: 'mountain_peak',
          name: `Mount ${i}`,
          regionId: 'region_0',
          position: [x, y, z],
          importance: elevation,
          tags: ['high_altitude', 'cold', 'mineral_rich'],
          relatedResources: ['iron', 'stone', 'gold'],
          strategicValue: 0.8,
        });
      }
    }

    for (let i = 0; i < vertexCount; i += 15) {
      const elevation = elevations[i];
      if (elevation > waterLevel && elevation < waterLevel + 0.05) {
        const x = vertices[i * 3];
        const y = vertices[i * 3 + 1];
        const z = vertices[i * 3 + 2];

        features.push({
          id: `feature_bay_${i}`,
          type: 'natural_harbor',
          name: `Bay ${i}`,
          regionId: 'region_0',
          position: [x, y, z],
          importance: 0.9,
          tags: ['coastal', 'sheltered', 'trade_potential'],
          relatedResources: ['fish', 'salt'],
          strategicValue: 0.9,
        });
      }
    }

    for (let i = 0; i < vertexCount; i += 20) {
      const elevation = elevations[i];
      const humidity = humidities[i];
      const temp = temperatures[i];

      if (elevation > waterLevel + 0.05 && elevation < waterLevel + 0.2 && humidity > 0.5 && temp > 0.3 && temp < 0.8) {
        const x = vertices[i * 3];
        const y = vertices[i * 3 + 1];
        const z = vertices[i * 3 + 2];

        features.push({
          id: `feature_plain_${i}`,
          type: 'fertile_plain',
          name: `Plains ${i}`,
          regionId: 'region_0',
          position: [x, y, z],
          importance: 0.7,
          tags: ['flat', 'fertile', 'agriculture'],
          relatedResources: ['grain', 'livestock'],
          strategicValue: 0.6,
        });
      }
    }

    for (let i = 0; i < vertexCount; i += 25) {
      const elevation = elevations[i];
      const humidity = humidities[i];
      const temp = temperatures[i];

      if (elevation > waterLevel && elevation < waterLevel + 0.1 && humidity < 0.2 && temp > 0.7) {
        const x = vertices[i * 3];
        const y = vertices[i * 3 + 1];
        const z = vertices[i * 3 + 2];

        features.push({
          id: `feature_oasis_${i}`,
          type: 'oasis',
          name: `Oasis ${i}`,
          regionId: 'region_0',
          position: [x, y, z],
          importance: 0.8,
          tags: ['desert', 'water_source', 'trade_stop'],
          relatedResources: ['water', 'dates'],
          strategicValue: 0.85,
        });
      }
    }

    for (let i = 0; i < vertexCount; i += 30) {
      const elevation = elevations[i];
      const humidity = humidities[i];

      if (elevation > waterLevel + 0.05 && elevation < waterLevel + 0.15 && humidity > 0.6) {
        const x = vertices[i * 3];
        const y = vertices[i * 3 + 1];
        const z = vertices[i * 3 + 2];

        features.push({
          id: `feature_valley_${i}`,
          type: 'river_valley',
          name: `Valley ${i}`,
          regionId: 'region_0',
          position: [x, y, z],
          importance: 0.85,
          tags: ['freshwater', 'sheltered', 'fertile'],
          relatedResources: ['fish', 'timber', 'clay'],
          strategicValue: 0.75,
        });
      }
    }

    return features;
  }
}
