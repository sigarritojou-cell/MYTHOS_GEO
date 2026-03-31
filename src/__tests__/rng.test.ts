import { describe, it, expect } from 'vitest';
import { RNG } from '../utils/rng';

describe('RNG', () => {
  it('produces a number in [0, 1) for numeric seed', () => {
    const rng = new RNG(42);
    const value = rng.next();
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThan(1);
  });

  it('produces a number in [0, 1) for string seed', () => {
    const rng = new RNG('test-seed');
    const value = rng.next();
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThan(1);
  });

  it('is deterministic for the same numeric seed', () => {
    const rng1 = new RNG(12345);
    const rng2 = new RNG(12345);
    const seq1 = Array.from({ length: 10 }, () => rng1.next());
    const seq2 = Array.from({ length: 10 }, () => rng2.next());
    expect(seq1).toEqual(seq2);
  });

  it('is deterministic for the same string seed', () => {
    const rng1 = new RNG('hello');
    const rng2 = new RNG('hello');
    const seq1 = Array.from({ length: 10 }, () => rng1.next());
    const seq2 = Array.from({ length: 10 }, () => rng2.next());
    expect(seq1).toEqual(seq2);
  });

  it('produces different sequences for different seeds', () => {
    const rng1 = new RNG(1);
    const rng2 = new RNG(2);
    const v1 = rng1.next();
    const v2 = rng2.next();
    expect(v1).not.toEqual(v2);
  });

  it('nextRange returns value within [min, max)', () => {
    const rng = new RNG(99);
    for (let i = 0; i < 50; i++) {
      const v = rng.nextRange(5, 10);
      expect(v).toBeGreaterThanOrEqual(5);
      expect(v).toBeLessThan(10);
    }
  });

  it('nextInt returns integer within [min, max]', () => {
    const rng = new RNG(7);
    for (let i = 0; i < 50; i++) {
      const v = rng.nextInt(1, 6);
      expect(Number.isInteger(v)).toBe(true);
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(6);
    }
  });
});
