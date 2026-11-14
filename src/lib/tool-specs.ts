/**
 * The calculators of the site, rendered by components/calc/SpecTool.tsx (full tool) and MiniSim.tsx (mini-simulator).
 * Every price comes from the engine (lib/engine/rates.ts, USPS Notice 123 files) and every zone from the official
 * zone chart (lib/zones.ts). `arg` overrides the default of any field by its id. This file ships to the browser.
 *
 * Words used on screen: "Post Office price" = the retail price paid at a counter; "online price" = the Commercial
 * price the Postal Service gives to anyone who buys a label on usps.com (Click-N-Ship).
 * "From Jan 17, 2027" = the proposed base price of the November 12, 2026 filing plus the 11% fuel surcharge.
 */
import type { ToolSpec, V, Input, ToolOut } from './tool-types';
import { formatMoney, formatNumber, formatPercent } from './format';
import {
  quote, compare, flatRate, FLAT_ITEMS, media, letter, largeEnvelope, postcard, nonmachinable, additionalOunce, stampsNeeded,
  extras, insuranceFee, history, sundayFee, dimWeightLb, lengthGirth, SERVICE_NAME, SERVICE_SHORT, SURCHARGE, OZ, MAX_LB, ZONES,
  type Service, type Zone, type Period, type Channel, type Quote,
} from './engine/rates';
import { zoneBetween, loadOrigin, pendingOrigin, zip5, zip3, zoneShares, type ZoneResult } from './zones';
import { COUNTRIES, iquote, iflat, iexpressEnvelope, iletter, iflatEnvelope, ipostcard, IFLAT_ITEMS, ISERVICE_NAME, ISERVICE_SHORT, type IService } from './engine/intl';
import { STAMP_HISTORY, STAMP_FORMATS } from '../data/stamp-history';

/** $12.40: postage is always written to the cent. */
export const usd = (x: number) => formatMoney(x, 2);
/** +5.9% or -1.2%. */
export const chg = (x: number) => `${x > 0 ? '+' : x < 0 ? '-' : ''}${formatPercent(Math.abs(x), 1)}`;
export const pct = (x: number, d = 0) => formatPercent(x, d);
const n = (v: V, k: string) => Number(v[k]) || 0;
const s = (v: V, k: string) => String(v[k] ?? '');
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const longDate = (iso: string) => `${MONTHS[Number(iso.slice(5, 7)) - 1]} ${Number(iso.slice(8, 10))}, ${iso.slice(0, 4)}`;

/**
 * ONE example case for the whole site: a 2-pound package from New York (10001) to Los Angeles (90012), the
 * coast-to-coast trip of zone 8. Every calculator that takes ZIP Codes starts from it, so a reader never sees two
 * prices for one case. tests/coherence.test.ts locks it.
 */
export const EX = { from: '10001', to: '90012', lb: 2, oz: 0, fromCity: 'New York', toCity: 'Los Angeles' } as const;
export const JAN = 'from Jan 17, 2027';

/** Weight in ounces from the two fields. */
export const weightOz = (v: V) => n(v, 'lb') * OZ + n(v, 'oz');
export const wLabel = (oz: number) => {
  const lb = Math.floor(oz / OZ + 1e-9), r = Math.round((oz - lb * OZ) * 10) / 10;
  if (lb === 0) return `${formatNumber(r, Number.isInteger(r) ? 0 : 1)} oz`;
  return r ? `${lb} lb ${formatNumber(r, Number.isInteger(r) ? 0 : 1)} oz` : `${lb} lb`;
};
const dimsOf = (v: V): [number, number, number] | null => (n(v, 'l') > 0 && n(v, 'w') > 0 && n(v, 'h') > 0 ? [n(v, 'l'), n(v, 'w'), n(v, 'h')] : null);

/* Fields shared by several calculators. */
const FROM = (def: string = EX.from): Input => ({ kind: 'zip', id: 'from', label: 'From ZIP Code', short: 'from', def, help: 'Where you mail it' });
const TO = (def: string = EX.to): Input => ({ kind: 'zip', id: 'to', label: 'To ZIP Code', short: 'to', def, help: 'Where it is delivered' });
const LB = (def: number = EX.lb): Input => ({ id: 'lb', label: 'Weight: pounds', short: 'pounds', def, unit: 'lb', max: 70, help: 'Packed, box included. Up to 70 lb' });
const OZF = (def: number = EX.oz): Input => ({ id: 'oz', label: 'Weight: ounces', short: 'ounces', def, unit: 'oz', max: 15.9, decimals: 1, help: '0 to 15.9; 16 oz make 1 lb' });
const DIM = (id: 'l' | 'w' | 'h', label: string): Input => ({ id, label, short: label.toLowerCase(), def: 0, unit: 'in', max: 130, decimals: 1, adv: true, help: id === 'l' ? '0 if small: counts over 1 cubic foot' : undefined });
const DIMS: Input[] = [DIM('l', 'Length'), DIM('w', 'Width'), DIM('h', 'Height')];
const ZONE_SEL = (def = 8): Input => ({ kind: 'select', id: 'zone', label: 'Zone (distance band of the zone chart)', short: 'zone', def: String(def), options: ZONES.map((z) => ({ value: String(z), label: z === 1 ? 'Zone 1 (same area)' : z === 8 ? 'Zone 8 (across the country)' : z === 9 ? 'Zone 9 (Pacific territories)' : `Zone ${z}` })) });

/** Applies `arg` to the defaults of a list of fields. */
function spec(inputs: Input[], arg: Record<string, number | string>, run: (v: V) => ToolOut, pending?: (v: V) => Promise<unknown> | null): ToolSpec {
  return {
    inputs: inputs.map((i) => (arg[i.id] === undefined ? i : { ...i, def: (i.kind === 'choice' || i.kind === 'select' || i.kind === 'zip') ? String(arg[i.id]) : Number(arg[i.id]) } as Input)),
    run,
    pending,
  };
}
const waitZips = (v: V) => loadOrigin(s(v, 'from'));

/** Zone of the two ZIP Codes, or the line that says why there is none yet. */
function zoneOf(v: V, svc: 'pm' | 'ga_light' | 'other' = 'other'): { z: ZoneResult; zone: Zone | null; why?: string } {
  const z = zoneBetween(s(v, 'from'), s(v, 'to'), svc);
  if (!zip5(s(v, 'from')) || !zip5(s(v, 'to'))) return { z, zone: null, why: 'Type two ZIP Codes of 5 digits.' };
  if (!z.originKnown && pendingOrigin(s(v, 'from'))) return { z, zone: null, why: 'Looking up the zone chart of this ZIP Code…' };
  if (!z.originKnown) return { z, zone: null, why: `The zone chart has no entry for ZIP Codes starting ${zip3(s(v, 'from'))}. Check the ZIP Code.` };
  if (!z.zone) return { z, zone: null, why: `The zone chart lists no zone from ${zip3(s(v, 'from'))} to ${zip3(s(v, 'to'))}. Check the ZIP Code.` };
  return { z, zone: z.zone };
}
const svcKey = (service: Service, oz: number): 'pm' | 'ga_light' | 'other' => (service === 'pm' || service === 'pme' ? 'pm' : service === 'ga' && oz < OZ ? 'ga_light' : 'other');
const noZone = (label: string, why: string): ToolOut => ({ label, value: '–', sub: why, rows: [] });
const ZONE_WORD = (z: Zone, r: ZoneResult) => `zone ${z}${r.sameNdc ? ' (same network center)' : ''}`;
const DAYS: Record<Service, string> = { pme: '1 to 3 days, guaranteed', pm: '2 to 3 days', ga: '2 to 5 days', media: '2 to 8 days' };
const SVC_ROW: Service[] = ['ga', 'pm', 'pme'];
const q = (service: Service, zone: Zone, oz: number, period: Period, channel: Channel, dims: [number, number, number] | null) => quote({ service, zone, weightOz: oz, period, channel, dims });
const price = (x: Quote) => (x.available ? usd(x.price) : 'not accepted');
const exampleShip = (v: V) => `Example: a ${wLabel(weightOz(v))} package from ${s(v, 'from')} to ${s(v, 'to')}`;

type Arg = Record<string, number | string>;
function svcSpec(service: Exclude<Service, 'media'>, arg: Arg): ToolSpec {
    return spec([FROM(), TO(), LB(), OZF(), { kind: 'choice', id: 'ch', label: 'Where you pay', short: 'paid', def: 'retail', options: [{ value: 'retail', label: 'Post Office' }, { value: 'comm', label: 'Online label' }] }, ...DIMS], arg, (v) => {
      const oz = weightOz(v), ch = s(v, 'ch') as Channel, dims = dimsOf(v);
      const head = `${SERVICE_SHORT[service]} ${ch === 'retail' ? 'at the Post Office' : 'online'} today`;
      if (oz <= 0) return noZone(head, 'Enter the weight of the package.');
      const zr = zoneOf(v, svcKey(service, oz));
      if (!zr.zone) return noZone(head, zr.why ?? '');
      const now = q(service, zr.zone, oz, 'current', ch, dims), jan = q(service, zr.zone, oz, 'jan2027', ch, dims), other = q(service, zr.zone, oz, 'current', ch === 'retail' ? 'comm' : 'retail', dims);
      if (!now.available) return noZone(head, now.reason ?? 'Not mailable.');
      return {
        label: head, value: usd(now.price), example: exampleShip(v),
        sub: `${ZONE_WORD(zr.zone, zr.z)} · charged as ${now.tier.label}${now.dimLb ? ` (box size weight ${now.dimLb} lb)` : ''}`,
        rows: [
          [`${JAN} (proposed, with the ${pct(SURCHARGE)} fuel surcharge)`, price(jan), jan.price],
          ['Change on January 17, 2027', jan.available ? chg((jan.price - now.price) / now.price) : '–'],
          [ch === 'retail' ? 'Same label bought online today' : 'Same package at the Post Office today', price(other), other.price],
          ...(now.fees ? [['Size fees included', usd(now.fees)] as [string, string]] : []),
        ],
        table: {
          caption: `${SERVICE_SHORT[service]}, ${wLabel(oz)}, ${ch === 'retail' ? 'Post Office' : 'online'} price in every zone.`,
          headers: ['Zone', 'Now', JAN],
          rows: ZONES.filter((z) => z <= 8 || service !== 'pme').map((z) => [`Zone ${z}${z === zr.zone ? ' (yours)' : ''}`, price(q(service, z, oz, 'current', ch, dims)), price(q(service, z, oz, 'jan2027', ch, dims))]),
          align: ['l', 'r', 'r'],
        },
      };
    }, waitZips);
}

const SPECS: Record<string, (arg?: Arg) => ToolSpec> = {
  /** Home and "how much to ship": every service for one package, at the Post Office and online, now and in 2027. */
  ship: (arg = {}) => spec([FROM(), TO(), LB(), OZF(), ...DIMS], arg, (v) => {
    const oz = weightOz(v), dims = dimsOf(v);
    if (oz <= 0) return noZone('Cheapest at the Post Office today', 'Enter the weight of the package.');
    const zr = zoneOf(v, svcKey('pm', oz)), zg = zoneOf(v, svcKey('ga', oz));
    if (!zr.zone || !zg.zone) return noZone('Cheapest at the Post Office today', zr.why ?? zg.why ?? '');
    const zoneFor = (sv: Service) => (sv === 'ga' ? zg.zone! : zr.zone!);
    const now = SVC_ROW.map((sv) => q(sv, zoneFor(sv), oz, 'current', 'retail', dims));
    const onl = SVC_ROW.map((sv) => q(sv, zoneFor(sv), oz, 'current', 'comm', dims));
    const jan = SVC_ROW.map((sv) => q(sv, zoneFor(sv), oz, 'jan2027', 'retail', dims));
    const janO = SVC_ROW.map((sv) => q(sv, zoneFor(sv), oz, 'jan2027', 'comm', dims));
    const ok = now.filter((x) => x.available).sort((a, b) => a.price - b.price);
    if (!ok.length) return noZone('Cheapest at the Post Office today', now[0].reason ?? 'Not mailable.');
    const best = ok[0], bestOnline = onl.filter((x) => x.available).sort((a, b) => a.price - b.price)[0];
    const bestJan = jan.filter((x) => x.available).sort((a, b) => a.price - b.price)[0];
    const dim = dims ? dimWeightLb(...dims) : null;
    return {
      label: 'Cheapest at the Post Office today', value: usd(best.price), example: exampleShip(v),
      sub: `${SERVICE_NAME[best.service]}, ${ZONE_WORD(best.zone, zg.z)}, ${DAYS[best.service]}`,
      rows: [
        ...now.map((x): [string, string, number] => [`${SERVICE_SHORT[x.service]} at the Post Office (${DAYS[x.service]})`, price(x), x.available ? x.price : 0]),
        [`Cheapest online label today (${SERVICE_SHORT[bestOnline.service]})`, usd(bestOnline.price)],
        [`Cheapest at the Post Office ${JAN}`, usd(bestJan.price)],
        ...(dim ? [[`Size weight of the box (dimensional weight)`, `${dim} lb`] as [string, string]] : []),
      ],
      table: {
        caption: `Same package, ${wLabel(oz)}, zone ${zg.zone}${zr.zone !== zg.zone ? ` (Priority Mail zone ${zr.zone})` : ''}. Prices ${JAN} are proposed and include the 11% fuel surcharge.`,
        headers: ['Service', 'Post Office now', 'Online now', `Post Office ${JAN}`, `Online ${JAN}`],
        rows: SVC_ROW.map((sv, i) => [SERVICE_SHORT[sv], price(now[i]), price(onl[i]), price(jan[i]), price(janO[i])]),
        align: ['l', 'r', 'r', 'r', 'r'],
      },
      note: [...now.filter((x) => !x.available).map((x) => `${SERVICE_SHORT[x.service]}: ${x.reason}`), ...now.flatMap((x) => x.feeNotes.length ? [`${SERVICE_SHORT[x.service]} size fee included (${x.feeNotes.join(', ')}).`] : [])].join(' ') || undefined,
    };
  }, waitZips),

  /** One service by weight and ZIP Codes: the service pages. */
  ga: (arg = {}) => svcSpec('ga', arg),
  pm: (arg = {}) => svcSpec('pm', arg),
  pme: (arg = {}) => svcSpec('pme', arg),


  /** ZIP Code to zone. */
  zone: (arg = {}) => spec([FROM(), TO()], arg, (v) => {
    const zr = zoneOf(v, 'other');
    if (!zr.zone) return noZone('Zone between the two ZIP Codes', zr.why ?? '');
    const zp = zoneOf(v, 'pm').zone ?? zr.zone;
    const ga = q('ga', zr.zone, OZ, 'current', 'retail', null), pm = q('pm', zp, OZ, 'current', 'retail', null);
    const sh = zoneShares(s(v, 'from'));
    return {
      label: 'Zone between the two ZIP Codes', value: `Zone ${zr.zone}`, example: `Example: from ${s(v, 'from')} to ${s(v, 'to')}`,
      sub: zr.z.sameNdc ? 'Both ZIP Codes are served by the same network distribution center.' : `From prefix ${zr.z.originPrefix} to prefix ${zr.z.destPrefix}`,
      rows: [
        ['Ground Advantage, 1 lb, Post Office', usd(ga.price)],
        ['Priority Mail, 1 lb, Post Office', usd(pm.price)],
        ...(zp !== zr.zone ? [['Priority Mail zone (5-digit exception)', `Zone ${zp}`] as [string, string]] : []),
        ...(sh ? [[`Share of the country in zone 8 or 9 from ${zr.z.originPrefix}`, pct((sh[8] ?? 0) + (sh[9] ?? 0))] as [string, string]] : []),
      ],
    };
  }, waitZips),

  /** Flat rate box or envelope against the price by weight for the same trip. */
  flat: (arg = {}) => spec([
    { kind: 'select', id: 'item', label: 'Flat rate box or envelope', short: 'item', def: 'pm_medium', options: FLAT_ITEMS.filter((i) => i.key !== 'pm_apo').map((i) => ({ value: i.key, label: i.label.replace('Priority Mail ', '') })) },
    FROM(), TO(), LB(), OZF(),
  ], arg, (v) => {
    const key = s(v, 'item'), item = FLAT_ITEMS.find((i) => i.key === key) ?? FLAT_ITEMS[4];
    const box = flatRate('current', item.key, 'retail'), boxJ = flatRate('jan2027', item.key, 'retail'), boxO = flatRate('current', item.key, 'comm');
    const oz = weightOz(v);
    const zr = zoneOf(v, 'pm');
    const rows: ToolOut['rows'] = [[`Same ${item.service === 'pm' ? 'box' : 'envelope'} ${JAN} (proposed)`, usd(boxJ.price)], ['Same, online label today', usd(boxO.price)]];
    let sub = "Any weight up to 70 lb, any zone";
    if (zr.zone && oz > 0) {
      const w = q(item.service, zr.zone, oz, 'current', 'retail', null);
      if (w.available) {
        rows.push([`${SERVICE_SHORT[item.service]} by weight, ${wLabel(oz)}, zone ${zr.zone}`, usd(w.price)]);
        sub = w.price > box.price ? `Cheaper than paying by weight (${usd(w.price)}): the flat rate saves ${usd(w.price - box.price)}.` : `Paying by weight is cheaper here (${usd(w.price)}): the flat rate costs ${usd(box.price - w.price)} more.`;
      }
    } else if (zr.why) rows.push(['Price by weight', zr.why]);
    return { label: `${item.label} at the Post Office today`, value: usd(box.price), example: `Example: ${wLabel(oz)} from ${s(v, 'from')} to ${s(v, 'to')}`, sub, rows };
  }, waitZips),

  /** Media Mail against Ground Advantage. */
  media: (arg = {}) => spec([LB(), OZF(), FROM(), TO()], arg, (v) => {
    const oz = weightOz(v);
    if (oz <= 0) return noZone('Media Mail today', 'Enter the weight of the package.');
    const m = media('current', oz), mj = media('jan2027', oz);
    if (!m.available) return noZone('Media Mail today', m.reason ?? 'Not mailable.');
    const zr = zoneOf(v, svcKey('ga', oz));
    const rows: ToolOut['rows'] = [[`Media Mail ${JAN}`, usd(mj.price)]];
    if (zr.zone) { const g = q('ga', zr.zone, oz, 'current', 'retail', null); rows.push([`Ground Advantage, zone ${zr.zone}, Post Office`, usd(g.price)], ['Saved with Media Mail', usd(Math.max(0, g.price - m.price))]); }
    else if (zr.why) rows.push(['Ground Advantage for comparison', zr.why]);
    return { label: 'Media Mail today, any distance', value: usd(m.price), example: `Example: books weighing ${wLabel(oz)}`, sub: `charged as ${m.tier.label} · books, recorded media and printed music only`, rows };
  }, waitZips),

  /** Stamps and First-Class Mail. */
  stamps: (arg = {}) => spec([
    { kind: 'select', id: 'what', label: 'What you mail', short: 'item', def: 'letter', options: [{ value: 'letter', label: 'Letter (card or envelope up to 3.5 oz)' }, { value: 'flat', label: 'Large envelope (flat, up to 13 oz)' }, { value: 'postcard', label: 'Postcard' }] },
    { id: 'w', label: 'Weight in ounces', short: 'weight', def: 1, unit: 'oz', max: 13, decimals: 1, help: 'A sheet of paper weighs about 0.2 oz; weigh it if unsure' },
    { kind: 'choice', id: 'nm', label: 'Square, rigid or lumpy?', short: 'nonmachinable', def: 'no', options: [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }], adv: true, help: 'Square cards, rigid or lumpy letters pay the nonmachinable surcharge' },
  ], arg, (v) => {
    const what = s(v, 'what'), w = Math.max(n(v, 'w'), 0.1);
    let base: number | null = what === 'postcard' ? postcard('current') : what === 'flat' ? largeEnvelope('current', w) : letter('current', w);
    let label = what === 'postcard' ? 'Postcard stamp' : what === 'flat' ? 'Large envelope postage' : 'Letter postage';
    if (base === null) return noZone(label, what === 'letter' ? 'Over 3.5 oz a letter pays the large envelope price: pick “Large envelope”.' : 'Over 13 oz it is a package: use Ground Advantage.');
    const extra = s(v, 'nm') === 'yes' && what === 'letter' ? nonmachinable('current') : 0;
    const total = Math.round((base + extra) * 100) / 100;
    const st = stampsNeeded(total);
    return {
      label, value: usd(total), example: `Example: a ${formatNumber(w, Number.isInteger(w) ? 0 : 1)} oz ${what === 'flat' ? 'large envelope' : what}`,
      sub: `${st.count} Forever stamp${st.count > 1 ? 's' : ''} (${usd(st.stamp)} each)${st.overpay > 0 ? `, ${usd(st.overpay)} overpaid` : ''}`,
      rows: [
        ['One Forever stamp (1 oz letter)', usd(letter('current', 1)!)],
        ['Each extra ounce of a letter', usd(additionalOunce('current'))],
        ...(extra ? [['Nonmachinable surcharge included', usd(extra)] as [string, string]] : []),
        ['Price on January 17, 2027', `${usd(total)} (stamps do not change)`],
      ],
    };
  }),

  /** Certified Mail: postage plus fees. */
  certified: (arg = {}) => spec([
    { id: 'w', label: 'Letter weight in ounces', short: 'weight', def: 1, unit: 'oz', max: 3.5, decimals: 1, help: 'A few sheets in a standard envelope: 1 oz' },
    { kind: 'select', id: 'rr', label: 'Proof of who signed (return receipt)', short: 'return receipt', def: 'paper', options: [{ value: 'none', label: 'None (tracking only)' }, { value: 'paper', label: 'Green card by mail (PS Form 3811)' }, { value: 'email', label: 'Electronic, by e-mail' }] },
    { kind: 'choice', id: 'rd', label: 'Only the addressee may sign', short: 'restricted', def: 'no', options: [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }], adv: true },
  ], arg, (v) => {
    const e = extras('current'), w = Math.max(n(v, 'w'), 0.1);
    const post = letter('current', w) ?? letter('current', 3.5)!;
    const cert = s(v, 'rd') === 'yes' ? e.certified_restricted : e.certified;
    const rr = s(v, 'rr') === 'paper' ? e.return_receipt_retail : s(v, 'rr') === 'email' ? e.return_receipt_electronic : 0;
    const total = Math.round((post + cert + rr) * 100) / 100;
    return {
      label: 'Certified Mail letter, total at the Post Office', value: usd(total), example: `Example: a ${formatNumber(w, Number.isInteger(w) ? 0 : 1)} oz letter`,
      sub: 'Postage, Certified Mail fee and return receipt added',
      rows: [['Postage (First-Class Mail letter)', usd(post), post], [s(v, 'rd') === 'yes' ? 'Certified Mail Restricted Delivery' : 'Certified Mail fee', usd(cert), cert], ['Return receipt', rr ? usd(rr) : 'none', rr], [`Same letter ${JAN}`, `${usd(total)} (no change filed)`]],
    };
  }),

  /** Insurance and signature fees on a package. */
  insure: (arg = {}) => spec([
    { id: 'val', label: 'Value of the contents', short: 'value', def: 250, unit: '$', max: 5000, help: 'Up to $5,000' },
    { kind: 'select', id: 'svc', label: 'Service', short: 'service', def: 'pm', options: [{ value: 'pm', label: 'Priority Mail' }, { value: 'ga', label: 'Ground Advantage' }, { value: 'pme', label: 'Priority Mail Express' }, { value: 'media', label: 'Media Mail (no insurance included)' }] },
    { kind: 'select', id: 'sig', label: 'Signature at delivery', short: 'signature', def: 'none', options: [{ value: 'none', label: 'None' }, { value: 'sc', label: 'Signature Confirmation' }, { value: 'adult', label: 'Adult Signature (21 or older)' }], adv: true },
  ], arg, (v) => {
    const e = extras('current'), ej = extras('jan2027'), val = n(v, 'val'), svc = s(v, 'svc');
    const included = svc === 'media' ? 0 : 100;
    const ins = val > included ? insuranceFee('current', val) : 0, insJ = val > included ? insuranceFee('jan2027', val) : 0;
    const sig = s(v, 'sig') === 'sc' ? e.signature_confirmation_retail : s(v, 'sig') === 'adult' ? e.adult_signature : 0;
    const sigJ = s(v, 'sig') === 'sc' ? ej.signature_confirmation_retail : s(v, 'sig') === 'adult' ? ej.adult_signature : 0;
    return {
      label: 'Fees on top of postage, Post Office', value: usd(ins + sig), example: `Example: contents worth ${formatMoney(val, 0)}`,
      sub: val <= included ? `Nothing to buy for the value: ${SERVICE_SHORT[svc as Service]} already covers up to $100.` : `Insurance for the full ${formatMoney(val, 0)} declared`,
      rows: [['Insurance fee', ins ? usd(ins) : '$0.00', ins], ['Signature fee', sig ? usd(sig) : '$0.00', sig], ['Coverage included without a fee', included ? '$100' : 'none'], [`Same fees ${JAN}`, usd(insJ + sigJ)]],
    };
  }),

  /** Dimensional weight. */
  dim: (arg = {}) => spec([
    { id: 'l', label: 'Length', short: 'length', def: 18, unit: 'in', max: 130, decimals: 1 }, { id: 'w', label: 'Width', short: 'width', def: 14, unit: 'in', max: 130, decimals: 1 }, { id: 'h', label: 'Height', short: 'height', def: 12, unit: 'in', max: 130, decimals: 1 },
    LB(5), ZONE_SEL(),
  ], arg, (v) => {
    const d: [number, number, number] = [n(v, 'l'), n(v, 'w'), n(v, 'h')], zone = Number(s(v, 'zone')) as Zone, oz = n(v, 'lb') * OZ;
    const cu = d[0] * d[1] * d[2], dl = dimWeightLb(...d), lg = lengthGirth(...d);
    const pm = q('pm', zone, oz, 'current', 'retail', d), pmNo = q('pm', zone, oz, 'current', 'retail', null), ga = q('ga', zone, oz, 'current', 'retail', d);
    return {
      label: 'Weight the Postal Service charges', value: `${Math.max(dl ?? 0, Math.ceil(n(v, 'lb')))} lb`, example: `Example: an ${formatNumber(d[0], 0)} x ${formatNumber(d[1], 0)} x ${formatNumber(d[2], 0)} inch box weighing ${n(v, 'lb')} lb`,
      sub: dl ? `Size weight ${dl} lb (${formatNumber(cu, 0)} cubic inches ÷ 139) against ${n(v, 'lb')} lb on the scale` : `Under 1 cubic foot (${formatNumber(cu, 0)} cubic inches): only the scale counts`,
      rows: [['Priority Mail, zone ' + zone + ', Post Office', price(pm), pm.price], ['Same box if size did not count', price(pmNo), pmNo.price], ['Ground Advantage, same box', price(ga), ga.price], ['Length plus girth', `${formatNumber(lg, 1)} in${lg > 108 ? (lg > 130 ? ' (over 130: refused)' : ' (over 108: oversized)') : ''}`]],
      note: [pm, ga].flatMap((x) => (x.available ? [] : [`${SERVICE_SHORT[x.service]}: ${x.reason}`])).join(' ') || undefined,
    };
  }),

  /** The same package across July 2026, today and January 2027. */
  history: (arg = {}) => spec([
    { kind: 'select', id: 'svc', label: 'Service', short: 'service', def: 'ga', options: SVC_ROW.map((sv) => ({ value: sv, label: SERVICE_NAME[sv] })) },
    LB(), OZF(), ZONE_SEL(),
  ], arg, (v) => {
    const oz = weightOz(v), service = s(v, 'svc') as Service, zone = Number(s(v, 'zone')) as Zone;
    if (oz <= 0) return noZone('Post Office price from January 17, 2027', 'Enter the weight of the package.');
    const h = history({ service, zone, weightOz: oz });
    if (!h.jan.available) return noZone('Post Office price from January 17, 2027', h.jan.reason ?? 'Not mailable.');
    return {
      label: `${SERVICE_SHORT[service]} at the Post Office from January 17, 2027`, value: usd(h.jan.price), example: `Example: ${wLabel(oz)}, zone ${zone}`,
      sub: `${chg(h.vsNow)} against today, ${chg(h.vsJul)} against July 2026 · proposed, with the ${pct(SURCHARGE)} fuel surcharge`,
      rows: [['July 12 to October 3, 2026', usd(h.jul.price), h.jul.price], ['Today (holiday prices, to January 16, 2027)', usd(h.now.price), h.now.price], ['From January 17, 2027: base price', usd(h.jan.base)], [`Fuel surcharge (${pct(SURCHARGE)})`, usd(h.jan.surcharge)]],
    };
  }),
  /** International: a country and a weight, the three retail services, today and from January 17, 2027. */
  intl: (arg = {}) => spec([
    { kind: 'select', id: 'country', label: 'Country you ship to', short: 'country', def: 'Canada', options: COUNTRIES.map((c) => ({ value: c.name, label: c.name })) },
    LB(2), OZF(),
  ], arg, (v) => {
    const c = COUNTRIES.find((x) => x.name === s(v, 'country')) ?? COUNTRIES[0], oz = weightOz(v);
    const head = `Cheapest to ${c.name} at the Post Office today`;
    if (oz <= 0) return noZone(head, 'Enter the weight of the package.');
    const svcs: IService[] = ['fcpis', 'pmi', 'pmei'];
    const now = svcs.map((sv) => iquote(sv, c, oz, 'current')), jan = svcs.map((sv) => iquote(sv, c, oz, 'jan2027'));
    const ok = now.filter((x) => x.available).sort((a, b) => a.price - b.price);
    if (!ok.length) return noZone(head, now[1].reason ?? 'Not mailable at this weight.');
    const best = ok[0];
    const ip = (x: { available: boolean; price: number }) => (x.available ? usd(x.price) : 'not accepted');
    const med = iflat('Medium Flat Rate Boxes', c);
    return {
      label: head, value: usd(best.price), example: `Example: a ${wLabel(oz)} package to ${c.name}`,
      sub: `${ISERVICE_NAME[best.service]}, charged ${best.step} · retail price, customs form required`,
      rows: [
        ...now.map((x): [string, string, number] => [`${ISERVICE_SHORT[x.service]} today`, ip(x), x.available ? x.price : 0]),
        ...(med !== null ? [[`Priority Mail Intl Medium Flat Rate Box today`, usd(med)] as [string, string]] : []),
      ],
      table: {
        caption: `${wLabel(oz)} to ${c.name}: Post Office prices today and proposed from January 17, 2027 (no fuel surcharge on international mail).`,
        headers: ['Service', 'Today', JAN],
        rows: svcs.map((sv, i) => [ISERVICE_NAME[sv], ip(now[i]), ip(jan[i])]),
        align: ['l', 'r', 'r'],
      },
      note: now.filter((x) => !x.available).map((x) => `${ISERVICE_SHORT[x.service]}: ${x.reason}`).join(' ') || undefined,
    };
  }),

  /** Overnight: Priority Mail Express by ZIP Codes, with the Sunday or holiday fee and the flat rate envelope. */
  overnight: (arg = {}) => spec([FROM(), TO(), LB(1), OZF(), { kind: 'choice', id: 'day', label: 'Delivery day', short: 'day', def: 'week', options: [{ value: 'week', label: 'Monday to Saturday' }, { value: 'sun', label: 'Sunday or holiday' }] }], arg, (v) => {
    const oz = weightOz(v), head = 'Priority Mail Express at the Post Office today';
    if (oz <= 0) return noZone(head, 'Enter the weight of the package.');
    const zr = zoneOf(v, 'pm');
    if (!zr.zone) return noZone(head, zr.why ?? '');
    const fee = s(v, 'day') === 'sun' ? sundayFee('current') : 0;
    const now = q('pme', zr.zone, oz, 'current', 'retail', null), onl = q('pme', zr.zone, oz, 'current', 'comm', null), jan = q('pme', zr.zone, oz, 'jan2027', 'retail', null), pm = q('pm', zr.zone, oz, 'current', 'retail', null);
    if (!now.available) return noZone(head, now.reason ?? 'Not mailable.');
    const env = flatRate('current', 'pme_env', 'retail').price;
    return {
      label: head, value: usd(now.price + fee), example: exampleShip(v),
      sub: `${ZONE_WORD(zr.zone, zr.z)} · charged as ${now.tier.label}${fee ? ` · Sunday or holiday fee ${usd(fee)} included` : ''}`,
      rows: [
        ['Same label bought online today', usd(onl.price + fee), onl.price],
        [`Flat Rate Envelope, any weight that fits`, usd(env + fee), env],
        [`Priority Mail, 2 to 3 days, no guarantee`, price(pm), pm.available ? pm.price : 0],
        [`Express ${JAN} (proposed, fuel surcharge in)`, usd(jan.price + fee)],
      ],
    };
  }, waitZips),

  /** Flat rate envelopes: one envelope against the price by weight of the same service. */
  flatenv: (arg = {}) => spec([
    { kind: 'select', id: 'item', label: 'Flat rate envelope', short: 'envelope', def: 'pm_env', options: FLAT_ITEMS.filter((i) => /env|legal|padded/.test(i.key)).map((i) => ({ value: i.key, label: i.label })) },
    FROM(), TO(), LB(1), OZF(),
  ], arg, (v) => {
    const item = FLAT_ITEMS.find((i) => i.key === s(v, 'item')) ?? FLAT_ITEMS[0];
    const now = flatRate('current', item.key, 'retail').price, onl = flatRate('current', item.key, 'comm').price, jan = flatRate('jan2027', item.key, 'retail').price;
    const oz = weightOz(v), zr = zoneOf(v, 'pm');
    const rows: ToolOut['rows'] = [['Same envelope, online label', usd(onl), onl], [`Same envelope ${JAN} (proposed)`, usd(jan), jan]];
    let sub = `${item.size} · any weight up to 70 lb if it closes normally`;
    if (zr.zone && oz > 0) {
      const w = q(item.service, zr.zone, oz, 'current', 'retail', null);
      if (w.available) { rows.push([`${SERVICE_SHORT[item.service]} by weight, zone ${zr.zone}`, usd(w.price), w.price]); sub = w.price > now ? `Envelope saves ${usd(w.price - now)} against paying by weight` : `Paying by weight is ${usd(now - w.price)} cheaper for this trip`; }
    } else if (zr.why) rows.push(['Price by weight', zr.why]);
    return { label: `${item.label} at the Post Office`, value: usd(now), example: `Example: ${wLabel(oz)} from ${s(v, 'from')} to ${s(v, 'to')}`, sub, rows };
  }, waitZips),

  /** Book of stamps: a format and a quantity. */
  book: (arg = {}) => spec([
    { kind: 'select', id: 'fmt', label: 'Format', short: 'format', def: 'booklet', options: STAMP_FORMATS.map((f) => ({ value: f.key, label: f.label })) },
    { id: 'n', label: 'How many', short: 'quantity', def: 1, max: 50, help: 'Booklets, panes or coils' },
  ], arg, (v) => {
    const f = STAMP_FORMATS.find((x) => x.key === s(v, 'fmt')) ?? STAMP_FORMATS[0], n = Math.max(1, Math.round(Number(v.n) || 1));
    const st = letter('current', 1)!, count = f.count * n, total = Math.round(count * st * 100) / 100;
    return {
      label: `${n} × ${f.label.toLowerCase()} of Forever stamps`, value: usd(total), example: `Example: ${n} ${f.label.toLowerCase()}`,
      sub: `${formatNumber(count, 0)} stamps at ${usd(st)} each, the 1-ounce letter price`,
      rows: [
        ['One stamp', usd(st)],
        ['Letters of 1 ounce it mails', formatNumber(count, 0)],
        ['Postcards it mails (a Forever stamp on a card)', formatNumber(count, 0)],
        [`Same purchase ${JAN}`, `${usd(total)} (no stamp change filed)`],
      ],
    };
  }),

  /** Forever stamps bought earlier: what they paid then and what they mail today. */
  forever: (arg = {}) => spec([
    { id: 'n', label: 'Forever stamps you have', short: 'stamps', def: 20, max: 10000 },
    { kind: 'select', id: 'since', label: 'Price when you bought them', short: 'bought', def: '2024-07-14', options: [...STAMP_HISTORY].reverse().map((h) => ({ value: h.date, label: `${h.cents}¢ (from ${longDate(h.date)})` })) },
  ], arg, (v) => {
    const n = Math.max(0, Math.round(Number(v.n) || 0)), h = STAMP_HISTORY.find((x) => x.date === s(v, 'since')) ?? STAMP_HISTORY[STAMP_HISTORY.length - 2];
    const st = letter('current', 1)!, now = Math.round(n * st * 100) / 100, paid = Math.round(n * h.cents) / 100;
    return {
      label: 'What your Forever stamps are worth today', value: usd(now), example: `Example: ${formatNumber(n, 0)} stamps bought at ${h.cents}¢`,
      sub: `${formatNumber(n, 0)} letters of 1 ounce at today's ${usd(st)}`,
      rows: [
        ['You paid', usd(paid), paid],
        ['Gained since', usd(Math.max(0, now - paid)), Math.max(0, now - paid)],
        ['Rise of the stamp price', paid > 0 ? chg((st * 100 - h.cents) / h.cents) : '–'],
        [`Worth ${JAN}`, `${usd(now)} (no stamp change filed)`],
      ],
    };
  }),

  /** First-Class Mail: shape, weight, stamps or meter, with the ounce table of the shape. */
  fcm: (arg = {}) => spec([
    { kind: 'select', id: 'what', label: 'What you mail', short: 'item', def: 'letter', options: [{ value: 'letter', label: 'Letter (up to 3.5 oz)' }, { value: 'flat', label: 'Large envelope (up to 13 oz)' }, { value: 'postcard', label: 'Postcard' }] },
    { id: 'w', label: 'Weight in ounces', short: 'weight', def: 2, unit: 'oz', max: 13, decimals: 1, help: 'Round up: 1.2 oz pays the 2 oz price' },
    { kind: 'choice', id: 'pay', label: 'Paid with', short: 'paid with', def: 'stamp', options: [{ value: 'stamp', label: 'Stamps' }, { value: 'meter', label: 'Postage meter' }], adv: true, help: 'Meter prices exist for letters only' },
  ], arg, (v) => {
    const what = s(v, 'what'), w = Math.max(n(v, 'w'), 0.1), meter = s(v, 'pay') === 'meter' && what === 'letter';
    const p = what === 'postcard' ? postcard('current') : what === 'flat' ? largeEnvelope('current', w) : letter('current', w, meter);
    const label = `First-Class Mail ${what === 'flat' ? 'large envelope' : what}${meter ? ', meter' : ''}`;
    if (p === null) return noZone(label, what === 'letter' ? 'Over 3.5 oz a letter is priced as a large envelope.' : 'Over 13 oz it is a package: Ground Advantage.');
    const steps = what === 'flat' ? [1, 2, 3, 4, 5, 6, 8, 10, 13] : [1, 2, 3, 3.5];
    return {
      label, value: usd(p), example: `Example: a ${formatNumber(w, Number.isInteger(w) ? 0 : 1)} oz ${what === 'flat' ? 'large envelope' : what}`,
      sub: what === 'postcard' ? 'Postcard price, any weight within the card size' : `charged at the ${Math.ceil(w - 1e-9) > 3 && what === 'letter' ? '3.5' : formatNumber(Math.ceil(w - 1e-9), 0)} oz step`,
      rows: [
        ['Forever stamps to put on it', String(stampsNeeded(p).count)],
        ...(what === 'letter' ? [['Same letter with a postage meter', usd(letter('current', w, true) ?? 0)] as [string, string]] : []),
        [`Price ${JAN}`, `${usd(p)} (no First-Class Mail change filed)`],
      ],
      table: what === 'postcard' ? undefined : { caption: `First-Class Mail ${what === 'flat' ? 'large envelope' : 'letter'} prices by ounce, Notice 123.`, headers: ['Weight not over', 'Stamps', ...(what === 'letter' ? ['Meter'] : [])], rows: steps.map((o) => [`${o} oz`, usd((what === 'flat' ? largeEnvelope('current', o) : letter('current', o)) ?? 0), ...(what === 'letter' ? [usd(letter('current', o, true) ?? 0)] : [])]), align: what === 'letter' ? ['l', 'r', 'r'] : ['l', 'r'] },
    };
  }),

  /** USPS rates: every service for a weight and a zone, counter and online. */
  rates: (arg = {}) => spec([LB(), OZF(), ZONE_SEL(5)], arg, (v) => {
    const oz = weightOz(v), zone = Number(s(v, 'zone')) as Zone, head = 'Lowest USPS rate at the Post Office today';
    if (oz <= 0) return noZone(head, 'Enter the weight of the package.');
    const all: Service[] = ['ga', 'pm', 'pme', 'media'];
    const now = all.map((sv) => q(sv, zone, oz, 'current', 'retail', null)), onl = all.map((sv) => q(sv, zone, oz, 'current', 'comm', null)), jan = all.map((sv) => q(sv, zone, oz, 'jan2027', 'retail', null));
    const ok = now.slice(0, 3).filter((x) => x.available).sort((a, b) => a.price - b.price);
    if (!ok.length) return noZone(head, now[0].reason ?? 'Not mailable.');
    return {
      label: head, value: usd(ok[0].price), example: `Example: ${wLabel(oz)}, zone ${zone}`,
      sub: `${SERVICE_NAME[ok[0].service]} · Media Mail apart (books and media only): ${price(now[3])}`,
      rows: now.slice(0, 3).map((x): [string, string, number] => [`${SERVICE_SHORT[x.service]} (${DAYS[x.service]})`, price(x), x.available ? x.price : 0]),
      table: { caption: `${wLabel(oz)} in zone ${zone}. Online = Commercial price of a label bought on usps.com; Media Mail has one price everywhere.`, headers: ['Service', 'Post Office', 'Online', `Post Office ${JAN}`], rows: all.map((sv, i) => [SERVICE_NAME[sv], price(now[i]), sv === 'media' ? price(now[i]) : price(onl[i]), price(jan[i])]), align: ['l', 'r', 'r', 'r'] },
    };
  }),

  /** Postage for any piece: letter, large envelope or package, from one form. */
  postage: (arg = {}) => spec([
    { kind: 'select', id: 'what', label: 'What you send', short: 'item', def: 'package', options: [{ value: 'letter', label: 'Letter (up to 3.5 oz)' }, { value: 'flat', label: 'Large envelope (up to 13 oz)' }, { value: 'package', label: 'Package or box' }] },
    LB(1), OZF(),
    { ...FROM(), help: 'Packages only: letters cost the same everywhere' }, { ...TO(), help: 'Packages only' },
  ], arg, (v) => {
    const what = s(v, 'what'), oz = weightOz(v);
    if (oz <= 0) return noZone('Postage today', 'Enter the weight.');
    if (what !== 'package') {
      const p = what === 'flat' ? largeEnvelope('current', oz) : letter('current', oz);
      const label = what === 'flat' ? 'Large envelope postage' : 'Letter postage';
      if (p === null) return noZone(label, what === 'letter' ? 'Over 3.5 oz: choose “Large envelope”.' : 'Over 13 oz: choose “Package or box”.');
      const st = stampsNeeded(p);
      return { label, value: usd(p), example: `Example: a ${wLabel(oz)} ${what === 'flat' ? 'large envelope' : 'letter'}`, sub: `${st.count} Forever stamp${st.count > 1 ? 's' : ''}, any distance in the United States`, rows: [['Forever stamp', usd(st.stamp)], [`Price ${JAN}`, `${usd(p)} (no change filed)`]] };
    }
    const zg = zoneOf(v, svcKey('ga', oz)), zp = zoneOf(v, 'pm');
    if (!zg.zone || !zp.zone) return noZone('Package postage today', zg.why ?? zp.why ?? '');
    const ga = q('ga', zg.zone, oz, 'current', 'retail', null), gaO = q('ga', zg.zone, oz, 'current', 'comm', null), pm = q('pm', zp.zone, oz, 'current', 'retail', null), gaJ = q('ga', zg.zone, oz, 'jan2027', 'retail', null);
    if (!ga.available) return noZone('Package postage today', ga.reason ?? 'Not mailable.');
    return {
      label: 'Package postage at the Post Office, Ground Advantage', value: usd(ga.price), example: exampleShip(v),
      sub: `${ZONE_WORD(zg.zone, zg.z)} · charged as ${ga.tier.label}`,
      rows: [['Same label printed online', usd(gaO.price), gaO.price], ['Priority Mail, faster', price(pm), pm.available ? pm.price : 0], [`Ground Advantage ${JAN}`, price(gaJ)]],
    };
  }, waitZips),
};

export function getTool(kind: string, arg?: Arg): ToolSpec {
  const f = SPECS[kind];
  if (!f) throw new Error(`Unknown tool ${kind}`);
  return f(arg);
}
export const TOOL_KINDS = Object.keys(SPECS);
