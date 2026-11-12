import { describe, expect, it } from 'vitest';
import { MAX_EMPLOYEES, hoursSavedPerMonth, parseCount } from './savings';

describe('hoursSavedPerMonth', () => {
  it('saves 10 minutes per report', () => {
    expect(hoursSavedPerMonth(50, 4)).toBe(33.3);
  });

  it('rounds to one decimal', () => {
    expect(hoursSavedPerMonth(1, 1)).toBe(0.2);
  });
});

describe('parseCount', () => {
  it('accepts whole numbers from 1 to the maximum', () => {
    expect(parseCount('1', MAX_EMPLOYEES)).toBe(1);
    expect(parseCount('5000', MAX_EMPLOYEES)).toBe(5000);
  });

  it('refuses an empty field, 0, decimals and values above the maximum', () => {
    for (const value of ['', '0', '2.5', '-3', '5001']) {
      expect(parseCount(value, MAX_EMPLOYEES)).toBeNull();
    }
  });
});
