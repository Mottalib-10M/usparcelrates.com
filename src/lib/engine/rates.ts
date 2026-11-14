/**
 * Price engine (RECETTE §4, §17): pure functions over src/data/rates.json, the USPS Notice 123 price files read on
 * 2026-11-13 (scripts/data/build-rates.py). Nothing is typed here; every number is a cell of a Postal Service file.
 *
 * Periods: `current` = Notice 123 in force October 4, 2026 to January 16, 2027 (the time-limited holiday prices);
 * `jan2027` = the tables filed with the Postal Regulatory Commission on November 12, 2026 (docket CP2027-1), BASE
 * prices to which the Postal Service adds an 11% fuel surcharge (8% carried over from April 2026 plus 3%; USPS
 * release of November 12, 2026). `jul2026` = the regular prices of July 12 to October 3, 2026, kept for the history.
 *
 * Rounding rules come from the Domestic Mail Manual read the same day: Priority Mail retail per pound, any fraction
 * rounded up, minimum 1 lb (DMM 123.1.1); Priority Mail Express 0.5 lb then per pound (DMM 113.1.1); USPS Ground
 * Advantage at 4, 8, 12 and 15.999 ounces then per pound to 70 lb (DMM 133.1.2); Media Mail per pound, minimum 1 lb
 * (DMM 173.1.2); dimensional weight for parcels over 1 cubic foot, L x W x H / 139 rounded up, zones 1 to 9, capped at
 * the 70-pound price (DMM 123.1.3, 113.1.3, 133.1.4).
 */
import R from '../../data/rates.json';

export type Period = 'current' | 'jan2027' | 'jul2026';
export type Channel = 'retail' | 'comm';
export type Service = 'ga' | 'pm' | 'pme' | 'media';
export type Zone = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
interface ZoneTable { flat: Record<string, number>; oz: Record<string, number[]>; lb: Record<string, number[]>; oversized: number[] | null; fees: Record<string, number> }
interface PeriodData { status: string; pm_retail: ZoneTable; pm_comm: ZoneTable; ga_retail: ZoneTable; ga_comm: ZoneTable; pme_retail: ZoneTable; pme_comm: ZoneTable; media: Record<string, number>; fcm: { letter: Record<string, number>; letter_metered: Record<string, number>; flat: Record<string, number>; postcard: number; additional_ounce: number; nonmachinable: number }; extra: Extra }
interface Extra { certified: number; certified_restricted: number; certified_adult_signature: number; insurance: number[][]; insurance_per_100: number; registered: number[][]; cod: number[][]; return_receipt_retail: number; return_receipt_electronic: number; signature_confirmation_retail: number; signature_confirmation_electronic: number; adult_signature: number; adult_signature_restricted: number; certificate_of_mailing: number }

const D = R as unknown as { read_on: string; periods: Record<Period, { effective: string; through?: string; file: string; proposed?: boolean; fuel_surcharge?: number; docket?: string }>; current: PeriodData; jan2027: PeriodData; jul2026: PeriodData };
export const READ_ON = D.read_on;
export const PERIODS = D.periods;
/** 11%: the permanent fuel surcharge of the prices from January 17, 2027 (8% + 3%). */
export const SURCHARGE = D.periods.jan2027.fuel_surcharge ?? 0;
export const ZONES: Zone[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
export const OZ = 16;
export const MAX_LB = 70;
export const CUBIC_FOOT = 1728;
export const DIM_DIVISOR = 139;
export const SERVICES: Service[] = ['ga', 'pm', 'pme', 'media'];
export const SERVICE_NAME: Record<Service, string> = { ga: 'USPS Ground Advantage', pm: 'Priority Mail', pme: 'Priority Mail Express', media: 'Media Mail' };
export const SERVICE_SHORT: Record<Service, string> = { ga: 'Ground Advantage', pm: 'Priority Mail', pme: 'Priority Mail Express', media: 'Media Mail' };
/** Competitive shipping products: the only ones that carry the fuel surcharge (release of November 12, 2026). */
export const SURCHARGED: Service[] = ['ga', 'pm', 'pme'];

export const round2 = (x: number) => Math.round(x * 100 + 1e-9) / 100;
const data = (p: Period) => D[p];

function table(p: Period, s: Exclude<Service, 'media'>, c: Channel): ZoneTable {
  const d = data(p);
  return s === 'ga' ? (c === 'retail' ? d.ga_retail : d.ga_comm) : s === 'pm' ? (c === 'retail' ? d.pm_retail : d.pm_comm) : (c === 'retail' ? d.pme_retail : d.pme_comm);
}

/** Adds the fuel surcharge where it applies: January 2027 tables, shipping products only, rounded to the cent. */
export function withSurcharge(p: Period, s: Service, base: number): number {
  return p === 'jan2027' && SURCHARGED.includes(s) ? round2(base * (1 + SURCHARGE)) : base;
}
export const surchargeOf = (p: Period, s: Service, base: number) => round2(withSurcharge(p, s, base) - base);

export interface Tier { key: string; label: string; unit: 'oz' | 'lb' }
/** The weight increment the Postal Service charges for, by service and channel. */
export function tier(s: Service, c: Channel, weightOz: number): Tier {
  const w = Math.max(weightOz, 0.01);
  if (s === 'ga' && w < OZ) {
    const k = w <= 4 ? '4' : w <= 8 ? '8' : w <= 12 ? '12' : '15.999';
    return { key: k, label: k === '15.999' ? 'under 1 lb (15.999 oz)' : `up to ${k} oz`, unit: 'oz' };
  }
  if ((s === 'pme' || (s === 'pm' && c === 'comm')) && w <= OZ / 2) return { key: '0.5', label: 'up to 0.5 lb (8 oz)', unit: 'lb' };
  const lb = Math.max(1, Math.ceil(w / OZ - 1e-9));
  return { key: String(lb), label: `${lb} lb`, unit: 'lb' };
}

/** Dimensional weight in pounds for a box over one cubic foot, else null (DMM: L x W x H / 139, rounded up). */
export function dimWeightLb(l: number, w: number, h: number): number | null {
  // Each side is rounded up to the next whole inch first (DMM 123.1.3.2).
  const cu = Math.ceil(l - 1e-9) * Math.ceil(w - 1e-9) * Math.ceil(h - 1e-9);
  if (!(cu > CUBIC_FOOT)) return null;
  return Math.min(MAX_LB, Math.ceil(cu / DIM_DIVISOR - 1e-9));
}
export const cubicInches = (l: number, w: number, h: number) => l * w * h;
/** Length plus girth (2 x width + 2 x height), the measure of the 108-inch and 130-inch limits. */
export const lengthGirth = (l: number, w: number, h: number) => { const [a, b, c] = [l, w, h].sort((x, y) => y - x); return a + 2 * b + 2 * c; };

export interface QuoteIn { service: Service; channel?: Channel; period?: Period; zone: Zone; weightOz: number; dims?: [number, number, number] | null }
export interface Quote {
  service: Service; channel: Channel; period: Period; zone: Zone; weightOz: number; billableOz: number; dimLb: number | null;
  tier: Tier; base: number; price: number; surcharge: number; available: boolean; reason?: string; oversized: boolean; fees: number; feeNotes: string[];
}
/** Price of one piece. Media Mail ignores the zone and the channel. */
export function quote(o: QuoteIn): Quote {
  const channel = o.channel ?? 'retail', period = o.period ?? 'current';
  const dimLb = o.dims && o.service !== 'media' ? dimWeightLb(...o.dims) : null;
  const billableOz = Math.max(o.weightOz, (dimLb ?? 0) * OZ);
  const lg = o.dims ? lengthGirth(...o.dims) : 0;
  const base0 = { service: o.service, channel, period, zone: o.zone, weightOz: o.weightOz, billableOz, dimLb, oversized: false, fees: 0, feeNotes: [] as string[] };
  if (billableOz > MAX_LB * OZ) return { ...base0, tier: { key: '70', label: '70 lb', unit: 'lb' }, base: 0, price: 0, surcharge: 0, available: false, reason: 'Over 70 lb: the Postal Service does not accept it.' };
  if (o.service === 'media') {
    const t = tier('media', 'retail', billableOz);
    const base = data(period).media[t.key];
    return { ...base0, channel: 'retail', tier: t, base, price: base, surcharge: 0, available: base !== undefined };
  }
  const tb = table(period, o.service, channel);
  const t = tier(o.service, channel, billableOz);
  let base = (t.unit === 'oz' ? tb.oz : tb.lb)[t.key]?.[o.zone - 1];
  let oversized = false;
  if (lg > 130) return { ...base0, tier: t, base: 0, price: 0, surcharge: 0, available: false, reason: 'Over 130 inches of length plus girth: not mailable.' };
  if (lg > 108) {
    if (o.service === 'ga' && tb.oversized) { base = tb.oversized[o.zone - 1]; oversized = true; }
    else return { ...base0, tier: t, base: 0, price: 0, surcharge: 0, available: false, reason: `Over 108 inches of length plus girth: ${SERVICE_SHORT[o.service]} does not take it; Ground Advantage has an oversized price.` };
  }
  if (base === undefined) return { ...base0, tier: t, base: 0, price: 0, surcharge: 0, available: false, reason: 'No price in the table for this weight.' };
  // Nonstandard fees (Notice 123 footers): length over 22 in, over 30 in, volume over 2 cubic feet.
  let fees = 0; const feeNotes: string[] = [];
  if (o.dims && !oversized) {
    const L = Math.max(...o.dims), cu = cubicInches(...o.dims);
    const f = tb.fees;
    const k30 = Object.keys(f).find((k) => /Length fee > 30/.test(k)), k22 = Object.keys(f).find((k) => /Length fee > 22/.test(k)), kv = Object.keys(f).find((k) => /Volume fee/.test(k));
    if (L > 30 && k30) { fees += f[k30]; feeNotes.push(`longer than 30 in: +${f[k30].toFixed(2)}`); }
    else if (L > 22 && k22) { fees += f[k22]; feeNotes.push(`longer than 22 in: +${f[k22].toFixed(2)}`); }
    if (cu > 2 * CUBIC_FOOT && kv) { fees += f[kv]; feeNotes.push(`over 2 cubic feet: +${f[kv].toFixed(2)}`); }
  }
  const price = withSurcharge(period, o.service, base);
  return { ...base0, tier: t, base, price: round2(price + fees), surcharge: round2(price - base), available: true, oversized, fees, feeNotes };
}

/** Flat rate items as labelled in the Notice 123 sheets. */
export const FLAT_ITEMS: Array<{ key: string; service: 'pm' | 'pme'; sheet: string; label: string; size: string }> = [
  { key: 'pm_env', service: 'pm', sheet: 'Flat Rate Envelopes', label: 'Priority Mail Flat Rate Envelope', size: '12 1/2 x 9 1/2 in' },
  { key: 'pm_legal', service: 'pm', sheet: 'Legal Flat Rate Envelope', label: 'Priority Mail Legal Flat Rate Envelope', size: '15 x 9 1/2 in' },
  { key: 'pm_padded', service: 'pm', sheet: 'Padded Flat Rate Envelope', label: 'Priority Mail Padded Flat Rate Envelope', size: '12 1/2 x 9 1/2 in' },
  { key: 'pm_small', service: 'pm', sheet: 'Small Flat Rate Box', label: 'Priority Mail Small Flat Rate Box', size: '8 11/16 x 5 7/16 x 1 3/4 in outside' },
  { key: 'pm_medium', service: 'pm', sheet: 'Medium Flat Rate Boxes', label: 'Priority Mail Medium Flat Rate Box', size: '11 1/4 x 8 3/4 x 6 in or 14 1/8 x 12 x 3 1/2 in outside' },
  { key: 'pm_large', service: 'pm', sheet: 'Large Flat Rate Boxes', label: 'Priority Mail Large Flat Rate Box', size: '12 1/4 x 12 1/4 x 6 in outside' },
  { key: 'pm_apo', service: 'pm', sheet: 'APO/FPO/DPO Large Flat Rate Box', label: 'Priority Mail Large Flat Rate Box to APO/FPO/DPO', size: '12 1/4 x 12 1/4 x 6 in outside' },
  { key: 'pme_env', service: 'pme', sheet: 'Flat Rate Envelope', label: 'Priority Mail Express Flat Rate Envelope', size: '12 1/2 x 9 1/2 in' },
  { key: 'pme_legal', service: 'pme', sheet: 'Legal Flat Rate Envelope', label: 'Priority Mail Express Legal Flat Rate Envelope', size: '15 x 9 1/2 in' },
  { key: 'pme_padded', service: 'pme', sheet: 'Padded Flat Rate Envelope', label: 'Priority Mail Express Padded Flat Rate Envelope', size: '12 1/2 x 9 1/2 in' },
];
export function flatRate(p: Period, key: string, c: Channel = 'retail'): { base: number; price: number; item: (typeof FLAT_ITEMS)[number] } {
  const item = FLAT_ITEMS.find((i) => i.key === key);
  if (!item) throw new Error(`flat item ${key}`);
  const base = table(p, item.service, c).flat[item.sheet];
  if (base === undefined) throw new Error(`no flat price ${key} ${p} ${c}`);
  return { base, price: withSurcharge(p, item.service, base), item };
}

/** Media Mail by weight (retail = commercial). */
export const media = (p: Period, weightOz: number) => quote({ service: 'media', period: p, zone: 1, weightOz });

/* First-Class Mail retail (letters, large envelopes, postcards). */
export function letter(p: Period, oz: number, metered = false): number | null {
  const t = metered ? data(p).fcm.letter_metered : data(p).fcm.letter;
  const k = oz <= 1 ? '1' : oz <= 2 ? '2' : oz <= 3 ? '3' : oz <= 3.5 ? '3.5' : null;
  return k ? t[k] ?? null : null;
}
export function largeEnvelope(p: Period, oz: number): number | null {
  const t = data(p).fcm.flat;
  const k = Math.ceil(oz - 1e-9);
  return k >= 1 && k <= 13 ? t[String(k)] ?? null : null;
}
export const postcard = (p: Period) => data(p).fcm.postcard;
export const additionalOunce = (p: Period) => data(p).fcm.additional_ounce;
export const nonmachinable = (p: Period) => data(p).fcm.nonmachinable;
/** Forever stamps needed for a price, at the 1-ounce letter value, and what is overpaid. */
export function stampsNeeded(price: number, p: Period = 'current'): { count: number; stamp: number; overpay: number } {
  const stamp = letter(p, 1)!;
  const count = Math.ceil(price / stamp - 1e-9);
  return { count, stamp, overpay: round2(count * stamp - price) };
}

/** Footer fees of the Priority Mail Express retail sheet (Sunday/holiday delivery, size and handling fees). */
export const pmeFees = (p: Period): Record<string, number> => data(p).pme_retail.fees;
/** The Sunday or holiday delivery premium of Priority Mail Express. */
export const sundayFee = (p: Period): number => Object.entries(pmeFees(p)).find(([k]) => /Sunday/.test(k))?.[1] ?? 0;

/* Extra services. */
export const extras = (p: Period): Extra => data(p).extra;
export function insuranceFee(p: Period, value: number): number {
  if (value <= 0) return 0;
  const e = extras(p);
  for (const [lo, hi, fee] of e.insurance) if (value >= lo && value <= hi) return fee;
  const top = e.insurance[e.insurance.length - 1];
  return round2(top[2] + Math.ceil((value - top[1]) / 100 - 1e-9) * e.insurance_per_100);
}
export function registeredFee(p: Period, value: number): number | null {
  const e = extras(p);
  if (value <= 0) return e.registered.find((r) => r[0] === 0)?.[2] ?? e.registered[0][2];
  for (const [lo, hi, fee] of e.registered) if (value >= lo && value <= hi) return fee;
  const top = e.registered[e.registered.length - 1];
  if (value <= 50000) return round2(top[2] + Math.ceil((value - top[1]) / 1000 - 1e-9) * 3.1);
  return null;
}
export function codFee(p: Period, value: number): number | null {
  for (const [lo, hi, fee] of extras(p).cod) if (value >= lo && value <= hi) return fee;
  return null;
}

/** All services for one piece, cheapest first. */
export function compare(o: { zone: Zone; weightOz: number; period?: Period; channel?: Channel; dims?: [number, number, number] | null; mediaEligible?: boolean }): Quote[] {
  const list: Quote[] = (['ga', 'pm', 'pme'] as Service[]).map((service) => quote({ service, zone: o.zone, weightOz: o.weightOz, period: o.period, channel: o.channel, dims: o.dims }));
  if (o.mediaEligible) list.push(quote({ service: 'media', zone: o.zone, weightOz: o.weightOz, period: o.period }));
  return list.filter((q) => q.available).sort((a, b) => a.price - b.price);
}

/** The same piece across the three periods, for the price-change pages. */
export function history(o: { service: Service; channel?: Channel; zone: Zone; weightOz: number }) {
  const q = (period: Period) => quote({ ...o, period });
  const jul = q('jul2026'), now = q('current'), jan = q('jan2027');
  const pct = (a: number, b: number) => (a > 0 ? (b - a) / a : 0);
  return { jul, now, jan, vsJul: pct(jul.price, jan.price), vsNow: pct(now.price, jan.price), holidayVsJul: pct(jul.price, now.price) };
}

/** Where a flat rate box beats the weight price: the first zone, at a weight, where the box is cheaper. */
export function flatBreakEven(key: string, weightOz: number, p: Period = 'current', c: Channel = 'retail'): { zone: Zone | null; box: number; byZone: number[] } {
  const item = FLAT_ITEMS.find((i) => i.key === key)!;
  const box = flatRate(p, key, c).price;
  const byZone = ZONES.map((z) => quote({ service: item.service, channel: c, period: p, zone: z, weightOz }).price);
  const zone = ZONES.find((z) => byZone[z - 1] > box) ?? null;
  return { zone, box, byZone };
}

/** Zone 1 to 9 row of a service at a weight, both periods: the table of the service pages. */
export function zoneRow(s: Exclude<Service, 'media'>, c: Channel, weightOz: number, p: Period) {
  return ZONES.map((zone) => quote({ service: s, channel: c, period: p, zone, weightOz }));
}
