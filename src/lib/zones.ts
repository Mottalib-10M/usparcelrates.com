/**
 * ZIP Code to zone, from the USPS Domestic Zone Chart (postcalc.usps.com/DomesticZoneChart, effective November 1,
 * 2026, read on 2026-11-13; scripts/data/build-zones.py). One string per origin 3-digit prefix, one character per
 * destination prefix ('0' = the chart lists no zone). Nothing is computed from distances: a pair the chart does not
 * list has no zone here.
 * Legend of the official chart: "*" = destination within the same NDC (network distribution center) as the origin;
 * "+" = the range has 5-digit exceptions, listed per origin and applied by `zoneBetween`.
 *
 * This file ships to the browser. It carries the rows of 30 large origins (zones-embedded.json); any other origin is
 * fetched once from /zones/<prefix>.json (public/, same data) when a reader types its ZIP Code. The build and the
 * tests register the whole chart with `registerAll` (lib/kit.ts).
 */
import E from '../data/zones-embedded.json';
import type { Zone } from './engine/rates';

interface Row { z: string; m: Record<string, number[][]>; x: Array<[string, string, string, string]> }
interface Embedded { effective: string[]; read_on: string; origins: number; symmetric_share: number | null; rows: Record<string, Row> }
const D = E as unknown as Embedded;
const ROWS: Record<string, Row> = { ...D.rows };
const LOADING: Record<string, Promise<void>> = {};
const MISSING = new Set<string>();

export const ZONE_CHART_EFFECTIVE = D.effective[0] ?? '';
export const ZONE_CHART_READ_ON = D.read_on;
export const ORIGIN_COUNT = D.origins;
export const SYMMETRIC_SHARE = D.symmetric_share;
export const EMBEDDED_ORIGINS = Object.keys(D.rows);

/** The whole chart (build and tests only). */
export function registerAll(all: { zones: Record<string, string>; marks: Record<string, Record<string, number[][]>>; zip5: Record<string, Array<[string, string, string, string]>> }) {
  for (const [o, z] of Object.entries(all.zones)) ROWS[o] = { z, m: all.marks[o] ?? {}, x: all.zip5[o] ?? [] };
}

export const zip5 = (s: string | number): string | null => { const m = String(s).replace(/\D/g, ''); return m.length === 5 ? m : null; };
export const zip3 = (s: string | number): string | null => { const z = zip5(s); return z ? z.slice(0, 3) : null; };

/** Starts loading the row of an origin the browser does not hold yet; null when there is nothing to wait for. */
export function loadOrigin(zip: string | number): Promise<void> | null {
  const o = zip3(zip);
  if (!o || ROWS[o] || MISSING.has(o) || typeof fetch === 'undefined') return null;
  if (!LOADING[o]) {
    LOADING[o] = fetch(`/zones/${o}.json`).then((r) => (r.ok ? r.json() : null)).then((j: Row | null) => { if (j) ROWS[o] = j; else MISSING.add(o); })
      .catch(() => { MISSING.add(o); });
  }
  return LOADING[o];
}
/** True while the row of this origin is being fetched. */
export const pendingOrigin = (zip: string | number) => { const o = zip3(zip); return !!o && !ROWS[o] && !MISSING.has(o) && typeof fetch !== 'undefined'; };

export interface ZoneResult { zone: Zone | null; sameNdc: boolean; exception: string | null; originKnown: boolean; destKnown: boolean; originPrefix: string | null; destPrefix: string | null }
/**
 * Zone from one ZIP Code to another. `service` picks the 5-digit exception that applies: the chart lists some
 * destination ranges (APO/FPO/DPO, Pacific territories) with a zone specific to Priority Mail or to Ground Advantage
 * under 16 ounces.
 */
export function zoneBetween(origin: string | number, dest: string | number, service: 'pm' | 'ga_light' | 'other' = 'other'): ZoneResult {
  const o = zip3(origin), d5 = zip5(dest), d = d5 ? d5.slice(0, 3) : null;
  const row = o ? ROWS[o] : undefined;
  const res: ZoneResult = { zone: null, sameNdc: false, exception: null, originKnown: !!row, destKnown: false, originPrefix: o, destPrefix: d };
  if (!row || !d || !d5) return res;
  const ch = row.z[Number(d)];
  if (ch && ch !== '0') { res.zone = Number(ch) as Zone; res.destKnown = true; }
  if (row.m['*']?.some(([a, b]) => Number(d) >= a && Number(d) <= b) || row.m['*+']?.some(([a, b]) => Number(d) >= a && Number(d) <= b)) res.sameNdc = true;
  for (const [a, b, z, svc] of row.x) {
    if (d5 < a || d5 > b) continue;
    const applies = svc === '' || (service === 'pm' && /Priority Mail/.test(svc)) || (service === 'ga_light' && /Ground Advantage/.test(svc));
    if (applies) { res.zone = Number(z) as Zone; res.destKnown = true; res.exception = svc || 'all services'; }
  }
  return res;
}

/** Share of destination prefixes in each zone from one origin. */
export function zoneShares(origin: string | number): Record<Zone, number> | null {
  const o = zip3(origin); const row = o ? ROWS[o] : undefined;
  if (!row) return null;
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 } as Record<Zone, number>;
  let total = 0;
  for (const ch of row.z) if (ch !== '0') { counts[Number(ch) as Zone]++; total++; }
  for (const k of Object.keys(counts)) counts[Number(k) as Zone] = total ? counts[Number(k) as Zone] / total : 0;
  return counts;
}
