import { afterEach, describe, expect, it, vi } from 'vitest';
import { experience, getYearsExperience, projects } from '../data/personal';
import { flows } from '../themes/signal/content';

describe('getYearsExperience', () => {
  afterEach(() => vi.useRealTimers());

  it('returns a whole number on a career anniversary month', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-15'));
    expect(getYearsExperience()).toBe('3');
  });

  it('returns one decimal place part-way through a year', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-27'));
    expect(getYearsExperience()).toBe('3.2');
  });
});

describe('portfolio data', () => {
  it('uses unique project ids (they are route slugs)', () => {
    const ids = projects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every company project a company name and no public repo link', () => {
    for (const p of projects.filter((project) => project.category === 'company')) {
      expect(p.companyName).toBeTruthy();
      expect(p.github).toBe('');
    }
  });

  it('lists experience newest first', () => {
    expect(experience[0].period).toMatch(/Present/);
  });

  it('has a signal flow diagram for every project with a valid focus node', () => {
    for (const p of projects) {
      const flow = flows[p.id];
      expect(flow, p.id).toBeDefined();
      expect(flow.focus).toBeGreaterThanOrEqual(0);
      expect(flow.focus).toBeLessThan(flow.nodes.length);
    }
  });
});
