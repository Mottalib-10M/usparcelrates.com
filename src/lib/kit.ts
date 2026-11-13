/**
 * Writing kit (CONTRIBUTING-PAGES.md): every price written in a page comes from here, never typed by hand.
 *   K.q(service, zone, oz, period, channel)   one price (lib/engine/rates.ts, Notice 123 files)
 *   K.flat(key, period, channel)               a flat rate box or envelope
 *   K.zone(from, to)                           zone of two ZIP Codes (official zone chart, whole chart registered here)
 *   K.EX                                       the example case of the whole site
 *   formats                                    K.usd(12.4) "$12.40", K.chg(0.059) "+5.9%", K.pct, K.num, K.day
 * This file is imported by pages only (build time): it registers the whole zone chart.
 */
import ZALL from '../data/zones.json';
import P from '../data/params-2026.json';
import * as R from './engine/rates';
import * as Zn from './zones';
import { usd, chg, pct, longDate, EX, JAN, wLabel } from './tool-specs';
import { formatNumber, formatDecimal } from './format';

Zn.registerAll(ZALL as unknown as Parameters<typeof Zn.registerAll>[0]);

const zoneOf = (from: string, to: string, svc: 'pm' | 'ga_light' | 'other' = 'other') => {
  const z = Zn.zoneBetween(from, to, svc).zone;
  if (!z) throw new Error(`no zone ${from} ${to}`);
  return z;
};
/** One price; throws when the table has none (a page never prints a hole). */
const q = (service: R.Service, zone: R.Zone, oz: number, period: R.Period = 'current', channel: R.Channel = 'retail') => {
  const x = R.quote({ service, zone, weightOz: oz, period, channel });
  if (!x.available) throw new Error(`no price ${service} ${zone} ${oz} ${period} ${channel}`);
  return x.price;
};

export const KIT = {
  P, R, EX, JAN, SURCHARGE: R.SURCHARGE, PERIODS: R.PERIODS, READ_ON: R.READ_ON, ZONES: R.ZONES,
  q, quote: R.quote, flat: (key: string, p: R.Period = 'current', c: R.Channel = 'retail') => R.flatRate(p, key, c).price,
  flatBase: (key: string, p: R.Period = 'current', c: R.Channel = 'retail') => R.flatRate(p, key, c).base,
  media: (oz: number, p: R.Period = 'current') => R.media(p, oz).price, letter: R.letter, largeEnvelope: R.largeEnvelope, postcard: R.postcard,
  additionalOunce: R.additionalOunce, nonmachinable: R.nonmachinable, stampsNeeded: R.stampsNeeded, extras: R.extras, insuranceFee: R.insuranceFee,
  history: R.history, flatBreakEven: R.flatBreakEven, compare: R.compare, dimWeightLb: R.dimWeightLb, lengthGirth: R.lengthGirth, tier: R.tier,
  zone: zoneOf, zoneR: Zn.zoneBetween, zoneShares: Zn.zoneShares, ZONE_EFFECTIVE: Zn.ZONE_CHART_EFFECTIVE, ORIGINS: Zn.ORIGIN_COUNT, SYMMETRIC: Zn.SYMMETRIC_SHARE,
  NAME: R.SERVICE_NAME, SHORT: R.SERVICE_SHORT, FLAT_ITEMS: R.FLAT_ITEMS,
  usd, chg, pct: (x: number, d = 0) => pct(x, d), num: (x: number) => formatNumber(x, 0), dec: (x: number, d = 1) => formatDecimal(x, d), day: longDate, w: wLabel,
};
export type Kit = typeof KIT;
