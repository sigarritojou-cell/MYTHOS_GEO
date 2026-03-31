import { describe, it, expect } from 'vitest';
import { GeographyAnalyzer } from '../core/geographyAnalyzer';
import { PlanetData } from '../data/worldModel';

function makePlanetData(overrides: Partial<PlanetData> = {}): PlanetData {
  const count = 30;
  const vertices: number[] = [];
  const elevations: number[] = [];
  const temperatures: number[] = [];
  const humidities: number[] = [];
  const biomes: string[] = [];
  const colors: number[] = [];

  for (let i = 0; i < count; i++) {
    vertices.push(1, 0, 0); // x, y, z
    elevations.push(0.3);   // below waterLevel=0.5
    temperatures.push(0.5);
    humidities.push(0.5);
    biomes.push('Ocean');
    colors.push(0.4, 0.4, 0.3);
  }

  return { vertices, elevations, temperatures, humidities, biomes, colors, indices: [], ...overrides };
}

describe('GeographyAnalyzer', () => {
  it('returns an empty array when all vertices are below water level', () => {
    const analyzer = new GeographyAnalyzer();
    const data = makePlanetData();
    const features = analyzer.analyze(data, 0.5);
    expect(features).toEqual([]);
  });

  it('detects mountain peaks when elevation is high enough', () => {
    const count = 30;
    const vertices: number[] = [];
    const elevations: number[] = [];
    const temperatures: number[] = [];
    const humidities: number[] = [];
    const biomes: string[] = [];
    const colors: number[] = [];

    for (let i = 0; i < count; i++) {
      vertices.push(0, 1, 0);
      elevations.push(0.95); // above waterLevel(0.5) + 0.4 = 0.9
      temperatures.push(0.5);
      humidities.push(0.4);
      biomes.push('Mountain');
      colors.push(0.4, 0.4, 0.45);
    }

    const analyzer = new GeographyAnalyzer();
    const features = analyzer.analyze(
      { vertices, elevations, temperatures, humidities, biomes, colors, indices: [] },
      0.5,
    );

    expect(features.length).toBeGreaterThan(0);
    expect(features.every(f => f.type === 'mountain_peak')).toBe(true);
  });

  it('detects natural harbors near the shoreline', () => {
    const count = 45;
    const vertices: number[] = [];
    const elevations: number[] = [];
    const temperatures: number[] = [];
    const humidities: number[] = [];
    const biomes: string[] = [];
    const colors: number[] = [];

    // elevation just above waterLevel (0.51 is in [0.5, 0.55))
    for (let i = 0; i < count; i++) {
      vertices.push(1, 0, 0);
      elevations.push(0.51);
      temperatures.push(0.5);
      humidities.push(0.5);
      biomes.push('Plains');
      colors.push(0.25, 0.5, 0.2);
    }

    const analyzer = new GeographyAnalyzer();
    const features = analyzer.analyze(
      { vertices, elevations, temperatures, humidities, biomes, colors, indices: [] },
      0.5,
    );

    const harbors = features.filter(f => f.type === 'natural_harbor');
    expect(harbors.length).toBeGreaterThan(0);
  });

  it('returns GeographicFeature objects with required fields', () => {
    const count = 30;
    const vertices: number[] = [];
    const elevations: number[] = [];
    const temperatures: number[] = [];
    const humidities: number[] = [];
    const biomes: string[] = [];
    const colors: number[] = [];

    for (let i = 0; i < count; i++) {
      vertices.push(0, 0, 1);
      elevations.push(0.95);
      temperatures.push(0.5);
      humidities.push(0.4);
      biomes.push('Mountain');
      colors.push(0.4, 0.4, 0.45);
    }

    const analyzer = new GeographyAnalyzer();
    const features = analyzer.analyze(
      { vertices, elevations, temperatures, humidities, biomes, colors, indices: [] },
      0.5,
    );

    for (const f of features) {
      expect(f).toHaveProperty('id');
      expect(f).toHaveProperty('type');
      expect(f).toHaveProperty('name');
      expect(f).toHaveProperty('position');
      expect(f.position).toHaveLength(3);
      expect(f).toHaveProperty('strategicValue');
      expect(f).toHaveProperty('tags');
      expect(Array.isArray(f.tags)).toBe(true);
    }
  });
});
