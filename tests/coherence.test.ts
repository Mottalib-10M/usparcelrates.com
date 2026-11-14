/** Engine rules and figures shared across pages (RECETTE §17): the same example gives the same price everywhere. */
import { describe, it, expect } from 'vitest';
import { KIT as K } from '../src/lib/kit';
import { EMBEDDED_ORIGINS } from '../src/lib/zones';
import { getTool, TOOL_KINDS, EX } from '../src/lib/tool-specs';
import { quote, dimWeightLb } from '../src/lib/engine/rates';

describe('zones', () => {
  it('the example route is zone 8', () => { expect(K.zone(EX.from, EX.to)).toBe(8); });
  it('every default origin of every tool ships with the page', () => {
    for (const k of TOOL_KINDS) {
      for (const i of getTool(k).inputs) if (i.kind === 'zip' && i.id === 'from') expect(EMBEDDED_ORIGINS).toContain(String(i.def).slice(0, 3));
    }
  });
  it('the whole chart is registered at build time', () => { expect(K.ORIGINS).toBeGreaterThan(900); });
});

describe('engine', () => {
  it('size weight rounds each side up and divides by 139', () => {
    expect(dimWeightLb(18, 14, 12)).toBe(22);
    expect(dimWeightLb(12.5, 12.5, 12.5)).toBe(Math.ceil((13 * 13 * 13) / 139));
    expect(dimWeightLb(10, 10, 10)).toBeNull();
  });
  it('over 70 lb is refused', () => { expect(quote({ service: 'ga', zone: 5, weightOz: 71 * 16 }).available).toBe(false); });
  it('the January 2027 price is the base price plus 11%', () => {
    const j = quote({ service: 'pm', zone: 8, weightOz: 32, period: 'jan2027' });
    expect(j.price).toBeCloseTo(Math.round(j.base * 111) / 100, 2);
  });
  it('prices rise with the zone', () => {
    const p = K.ZONES.filter((z) => z <= 8).map((z) => K.q('ga', z, 32, 'current', 'retail'));
    for (let i = 1; i < p.length; i++) expect(p[i]).toBeGreaterThanOrEqual(p[i - 1]);
  });
  it('online is not dearer than the counter', () => {
    expect(K.q('ga', 8, 32, 'current', 'commercial')).toBeLessThanOrEqual(K.q('ga', 8, 32, 'current', 'retail'));
  });
});

/** Testers 2026-11-14 (round 3): the flat rate tools and the stamp tools must say what the reader really pays. */
describe('flat rate and stamps tools', () => {
  const run = (k: string, arg: Record<string, number | string> = {}) => {
    const t = getTool(k, arg);
    return t.run(Object.fromEntries(t.inputs.map((i) => [i.id, i.def])) as never);
  };
  it('the flat rate tool compares with the cheapest option of the home calculator, same package', () => {
    const home = run('ship'), flat = run('flat');
    expect(flat.sub).toContain(home.value);
    expect(flat.sub).not.toMatch(/Priority Mail/);
  });
  it('a heavy package where the box wins still names the cheapest price by weight', () => {
    const flat = run('flat', { lb: 10 });
    const w = run('ship', { lb: 10 });
    expect(flat.sub).toMatch(/^The box is the cheapest option/);
    expect(flat.sub).toContain(w.value);
  });
  it('a 2 oz letter shows the two stamps it takes, worth $1.64, not the $1.11 postage', () => {
    const o = run('stamps', { w: 2 });
    expect(o.label).toBe('2 Forever stamps to put on it');
    expect(o.value).toBe('$1.64');
    expect(o.sub).toContain('$1.11');
  });
});
