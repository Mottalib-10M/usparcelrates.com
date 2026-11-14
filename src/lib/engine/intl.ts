/**
 * International prices (retail, Post Office counter) over src/data/intl.json, built by scripts/data/build-intl.py
 * from the Notice 123 files read on 2026-11-13, and the country price groups of src/data/intl-countries.ts.
 * Weight steps as printed in the sheets: First-Class Package International Service by ounce step up to 64 oz
 * (4 lb); Priority Mail International by the pound; Priority Mail Express International 0.5 lb then by the pound.
 * The January 2027 international prices are proposed and carry no fuel surcharge (USPS release, November 12, 2026).
 */
import I from '../../data/intl.json';
import { COUNTRIES, type Country } from '../../data/intl-countries';

export type IPeriod = 'current' | 'jan2027';
export type IService = 'fcpis' | 'pmi' | 'pmei';
interface IData { status: string; fcmi_letter: Record<string, number[]>; fcmi_flat: Record<string, number[]>; fcmi_postcard: number[]; fcmi_nonmachinable: number[]; fcpis: Record<string, Array<number | null>>; pmi_flat: Record<string, Array<number | null>>; pmi: Record<string, Array<number | null>>; pmei_flat_env: Array<number | null>; pmei: Record<string, Array<number | null>> }
const D = I as unknown as Record<IPeriod, IData>;
export { COUNTRIES };
export const ISERVICE_NAME: Record<IService, string> = { fcpis: 'First-Class Package International Service', pmi: 'Priority Mail International', pmei: 'Priority Mail Express International' };
export const ISERVICE_SHORT: Record<IService, string> = { fcpis: 'First-Class Package Intl', pmi: 'Priority Mail Intl', pmei: 'Priority Mail Express Intl' };
export const FCPIS_MAX_OZ = 64;
const steps = (t: Record<string, unknown>) => Object.keys(t).map(Number).sort((a, b) => a - b);

export interface IQuote { service: IService; available: boolean; price: number; step: string; reason?: string }
/** One international price for a country and a weight in ounces. */
export function iquote(service: IService, c: Country, oz: number, p: IPeriod = 'current'): IQuote {
  const d = D[p];
  const w = Math.max(oz, 0.01);
  if (service === 'fcpis') {
    if (w > FCPIS_MAX_OZ) return { service, available: false, price: 0, step: '', reason: 'Over 4 lb: First-Class Package International Service stops at 64 ounces.' };
    const k = steps(d.fcpis).find((s) => s >= w - 1e-9)!;
    const v = d.fcpis[String(k)][c.fcpis - 1];
    return v == null ? { service, available: false, price: 0, step: '', reason: 'No price listed for this country.' } : { service, available: true, price: v, step: `up to ${k} oz` };
  }
  const max = service === 'pmi' ? c.pmiMax : c.pmeiMax;
  if (w > max * 16) return { service, available: false, price: 0, step: '', reason: `Over ${max} lb, the limit for ${c.name}.` };
  const t = service === 'pmi' ? d.pmi : d.pmei;
  const g = service === 'pmi' ? c.pmi : c.pmei;
  const k = service === 'pmei' && w <= 8 ? 0.5 : Math.max(1, Math.ceil(w / 16 - 1e-9));
  const v = t[String(k)]?.[g - 1];
  return v == null ? { service, available: false, price: 0, step: '', reason: 'No price listed for this weight and country.' } : { service, available: true, price: v, step: k === 0.5 ? 'up to 0.5 lb' : `${k} lb` };
}

/** Priority Mail International flat rate items, today (flat rate price groups 1 to 8). */
export const IFLAT_ITEMS = [
  { key: 'Flat Rate Envelopes', label: 'Flat Rate Envelope' },
  { key: 'Small Flat Rate Priced Boxes', label: 'Small Flat Rate Box' },
  { key: 'Medium Flat Rate Boxes', label: 'Medium Flat Rate Box' },
  { key: 'Large Flat Rate Boxes', label: 'Large Flat Rate Box' },
];
export const iflat = (key: string, c: Country): number | null => D.current.pmi_flat[key]?.[c.pmiFlat - 1] ?? null;
export const iexpressEnvelope = (c: Country): number | null => D.current.pmei_flat_env[c.pmeiFlat - 1] ?? null;

/** First-Class Mail International: column of the letter and large envelope sheets (groups 1, 2, 3-5, 6-9). */
const fcmiCol = (c: Country) => (c.fcmi === 1 ? 0 : c.fcmi === 2 ? 1 : c.fcmi <= 5 ? 2 : 3);
export function iletter(c: Country, oz: number, p: IPeriod = 'current'): number | null {
  const t = D[p].fcmi_letter;
  const k = steps(t).find((s) => s >= oz - 1e-9);
  return k === undefined ? null : t[String(k)][fcmiCol(c)];
}
export function iflatEnvelope(c: Country, oz: number, p: IPeriod = 'current'): number | null {
  const t = D[p].fcmi_flat;
  const k = steps(t).find((s) => s >= oz - 1e-9);
  return k === undefined ? null : t[String(k)][fcmiCol(c)];
}
export const ipostcard = (c: Country, p: IPeriod = 'current') => D[p].fcmi_postcard[fcmiCol(c)];
export const IREAD_STATUS = { current: D.current.status, jan2027: D.jan2027.status };
