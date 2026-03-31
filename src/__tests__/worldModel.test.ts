import { describe, it, expect } from 'vitest';
import { defaultParameters, WorldParameters } from '../data/worldModel';

describe('defaultParameters', () => {
  it('has the expected seed', () => {
    expect(defaultParameters.seed).toBe(12345);
  });

  it('has all parameter values between 0 and 1 (except seed)', () => {
    const rangeFields: (keyof WorldParameters)[] = [
      'waterLevel',
      'continentDensity',
      'terrainRoughness',
      'mountainHeight',
      'riverDensity',
      'temperatureBias',
      'humidityBias',
      'iceCoverage',
      'vegetationDensity',
    ];
    for (const field of rangeFields) {
      const value = defaultParameters[field] as number;
      expect(value, `${field} should be >= 0`).toBeGreaterThanOrEqual(0);
      expect(value, `${field} should be <= 1`).toBeLessThanOrEqual(1);
    }
  });

  it('has waterLevel at 0.5 by default', () => {
    expect(defaultParameters.waterLevel).toBe(0.5);
  });
});
