import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const items = K.FLAT_ITEMS.filter((i) => i.key !== 'pm_apo');
const rows = items.map((i) => [i.label.replace('Priority Mail ', ''), K.usd(K.flat(i.key, 'jul2026')), K.usd(K.flat(i.key)), K.usd(K.flat(i.key, 'current', 'comm')), K.usd(K.flat(i.key, 'jan2027'))]);
const med = K.flat('pm_medium'), medJ = K.flat('pm_medium', 'jan2027'), medJb = K.flatBase('pm_medium', 'jan2027'), medJul = K.flat('pm_medium', 'jul2026');
const be = (key: string, oz: number) => K.flatBreakEven(key, oz).zone;
/** Testers 2026-11-14: "wins from never" and an unexplained "zone 9". */
const beCell = (z: number | null) => (z === null ? 'in no zone' : z === 9 ? 'zone 9 only (Guam, Pacific)' : `zone ${z} and up`);
const beRows = [16, 48, 80, 160].map((oz) => [K.w(oz), beCell(be('pm_small', oz)), beCell(be('pm_medium', oz)), beCell(be('pm_large', oz))]);
const sz = (k: string) => K.FLAT_ITEMS.find((i) => i.key === k)!.size;
const small = K.flat('pm_small'), large = K.flat('pm_large'), env = K.flat('pm_env'), apo = K.flat('pm_apo');

export default definePage({
  id: 'flat-rate-box-prices', group: 'ship', order: 15, slug: 'flat-rate-box-prices',
  nav: 'Flat rate box prices', card: 'Envelope, small, medium and large box: today, online and in 2027, and when each one wins.',
  title: 'Flat Rate Box Prices 2027: USPS Small, Medium, Large Box',
  description: 'USPS flat rate box prices for 2027: envelopes, small, medium and large boxes at the counter and online, and the zone where each box beats the price by weight.',
  h1: 'Flat rate box prices and when a box beats the scale',
  intro: 'Flat rate box prices for every USPS envelope and box, and the test that matters: for your weight and ZIP Codes, is the box cheaper than paying by weight?',
  resume: `A Priority Mail flat rate box costs the same whatever it weighs, up to 70 pounds, and wherever it goes in the United States, as the Domestic Mail Manual states. Only boxes and envelopes made by the Postal Service and marked Flat Rate qualify. At a Post Office counter today the Flat Rate Envelope costs ${K.usd(env)}, the Small Flat Rate Box ${K.usd(small)}, the Medium ${K.usd(med)} and the Large ${K.usd(large)}. These prices include the holiday increase in force until January 16, 2027. From January 17 the proposed base price of the Medium box is ${K.usd(medJb)}, or ${K.usd(medJ)} once the 11% fuel surcharge is added, against ${K.usd(medJul)} in July 2026. A box only saves money when the same package would cost more by weight: for a light package near home, paying by weight is cheaper; for a heavy one going far, the box wins.`,
  faqs: [
    { q: 'What is the weight limit of a flat rate box?', a: 'Seventy pounds, the general limit of Priority Mail. Below that, the weight does not change the price: the Domestic Mail Manual charges the flat rate regardless of the actual weight up to 70 pounds and of the domestic destination. Pack the contents so they do not shift: the packaging rules of the Domestic Mail Manual apply to a flat rate box like any other.' },
    { q: 'Can I use my own box at the flat rate price?', a: 'No. The Domestic Mail Manual reserves the flat rate price for Flat Rate Envelopes and Flat Rate Boxes produced by the Postal Service. Your own box, or a plain Priority Mail box without the Flat Rate marking, is charged by weight and zone. Postal Service packaging must also be used only for the service printed on it, whatever you do to its markings.' },
    { q: 'Is the APO/FPO flat rate box cheaper?', a: `Yes. The Large Flat Rate Box sent to a military or diplomatic address (APO, FPO or DPO) costs ${K.usd(apo)} at the counter against ${K.usd(large)} for the regular Large box. It is the same box, sold at a lower price for military and diplomatic addresses in the Notice 123 price list.` },
  ],
  body: (h) => `
<h2>Flat rate box prices: July 2026, today, online and 2027</h2>
<p>The table follows each box through the three price lists of the Postal Service. Today's counter prices include the time-limited holiday change of October 4, 2026; the 2027 column is the proposed base price with the fuel surcharge.</p>
${h.table(['Envelope or box', 'July 2026', 'Today', 'Today online', K.JAN], rows, 'Post Office prices unless marked online. Notice 123 files of July 2026, October 2026 and January 2027 (proposed).', ['l', 'r', 'r', 'r', 'r'])}
<h2>Where the box starts to pay</h2>
<p>The table gives, for a few weights, the first zone in which the box costs less than Priority Mail by weight at the counter. A 1-pound item only belongs in a Small box if it travels far; a 10-pound item in a Medium box saves money from zone ${be('pm_medium', 160)}.</p>
${h.table(['Package weight', 'Small box wins from', 'Medium box wins from', 'Large box wins from'], beRows, `Counter prices today, against Priority Mail by weight, if the item fits: Small box ${sz('pm_small')}, Medium ${sz('pm_medium')}, Large ${sz('pm_large')}. Zone 1 is nearby, zone 8 across the country.`, ['l', 'l', 'l', 'l'])}
${h.mini('flatenv', { t: 'Documents instead? A flat rate envelope', p: ['item', 'to'] })}
<h2>Choosing the right box size</h2>
<p>Start from the item, not the price. The Small box suits a phone, a book or a few jars of spices; the Medium price covers two box models, sold at one price; the Large box is for bulky but dense loads such as tools or canned goods. Any of them can be filled to 70 pounds. Fill the gaps with padding, because the box must protect its contents through the network like any parcel, then compare the box price with the price by weight in the calculator before you pay.</p>
<p>Ground Advantage is not part of this test and can be cheaper than both, as the ${h.a('cheapest-way-to-ship-a-package', 'cheapest way page')} shows. For the per-pound prices, see ${h.a('priority-mail-rates', 'Priority Mail rates')}.</p>
`,
  tool: 'flat',
  related: ['priority-mail-rates', 'cheapest-way-to-ship-a-package', 'usps-price-increase-2027', 'shipping-a-heavy-package'],
  sources: ['notice123', 'dmm123', 'price_change', 'release_2027', 'release_2026_03'],
});
