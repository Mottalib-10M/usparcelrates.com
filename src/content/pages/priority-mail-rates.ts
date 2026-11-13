import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const Z = K.zone(K.EX.from, K.EX.to);
const rows = [1, 2, 3, 5, 10, 20].map((lb) => [`${lb} lb`, K.usd(K.q('pm', 1, lb * 16)), K.usd(K.q('pm', 5, lb * 16)), K.usd(K.q('pm', 8, lb * 16)), K.usd(K.q('pm', 8, lb * 16, 'current', 'comm')), K.usd(K.q('pm', 8, lb * 16, 'jan2027'))]);
const p2 = K.q('pm', Z, 32), p2o = K.q('pm', Z, 32, 'current', 'comm'), p2j = K.q('pm', Z, 32, 'jan2027'), g2 = K.q('ga', Z, 32);
const half = K.q('pm', 8, 8, 'current', 'comm'), one = K.q('pm', 8, 16, 'current', 'comm');
const z9 = K.q('pm', 9, 16), z8 = K.q('pm', 8, 16);

export default definePage({
  id: 'priority-mail-rates', group: 'ship', order: 13, slug: 'priority-mail-rates',
  nav: 'Priority Mail rates', card: 'Two to three days, priced by the pound and zone, at the counter and online.',
  title: 'Priority Mail Rates 2027: USPS Price by Weight and Zone',
  description: 'Priority Mail rates for 2027: USPS price by pound and zone at the Post Office and online, flat rate boxes compared, and proposed prices from January 17, 2027.',
  h1: 'Priority Mail rates for your weight and ZIP Codes',
  intro: 'Priority Mail rates by weight and ZIP Code: the Post Office price, the online price and the proposed price from January 17, 2027, side by side.',
  resume: `Priority Mail is the Postal Service's 2-to-3-day package service, up to 70 pounds, with tracking and $100 of insurance included. At a Post Office counter its rates are set by the pound, any fraction rounded up, and by zone. A 2-pound package from New York to Los Angeles, zone ${Z}, costs ${K.usd(p2)} at the counter, ${K.usd(p2o)} with an online label, and would cost ${K.usd(p2j)} from January 17, 2027 with the proposed base price and the 11% fuel surcharge. Ground Advantage carries the same package for ${K.usd(g2)} in 2 to 5 days. Online, Priority Mail adds a half-pound step, ${K.usd(half)} in zone 8 against ${K.usd(one)} for 1 pound. Zone 9, which covers some Pacific territories, costs much more: ${K.usd(z9)} for 1 pound at the counter against ${K.usd(z8)} in zone 8. Flat rate boxes and envelopes are a separate price list.`,
  faqs: [
    { q: 'Is Priority Mail delivery guaranteed?', a: 'No. The Postal Service gives Priority Mail an expected delivery of 2 to 3 days, depending on where the package starts and where it goes, and the date printed at checkout comes with no money-back guarantee. Only Priority Mail Express has a guaranteed date with a refund if it is missed.' },
    { q: 'Why is Priority Mail cheaper online?', a: `Labels paid online use the Commercial prices of Notice 123. For 2 pounds from New York to Los Angeles, that is ${K.usd(p2o)} instead of ${K.usd(p2)} at the counter. Online labels also get a half-pound step that the counter does not have, which helps packages of 8 ounces or less.` },
    { q: 'Does Priority Mail charge for box size?', a: 'Yes, for a box larger than one cubic foot. The Domestic Mail Manual divides length times width times height by 139 and charges the higher of that size weight and the real weight, capped at the 70-pound price. Free Priority Mail boxes from the Postal Service are not flat rate unless they say Flat Rate.' },
  ],
  body: (h) => `
<h2>Priority Mail rates at the counter and online</h2>
<p>The table gives the counter price in zones 1, 5 and 8, the online price in zone 8 and the proposed zone 8 price from January 17, 2027. A pound costs little near home and a lot across the country: 20 pounds cost several times more in zone 8 than in zone 1.</p>
${h.table(['Weight', 'Zone 1', 'Zone 5', 'Zone 8', 'Zone 8 online', `Zone 8 ${K.JAN}`], rows, 'Notice 123 prices in force from October 4, 2026; 2027 proposed, with the fuel surcharge.', ['l', 'r', 'r', 'r', 'r', 'r'])}
<h2>Priority Mail or Ground Advantage</h2>
<p>For the 2-pound example, Priority Mail costs ${K.usd(p2 - g2)} more than Ground Advantage at the counter and saves up to three days. For light items close to home the gap is small; for heavy packages going far, it grows quickly. The ${h.a('usps-ground-advantage-rates', 'Ground Advantage page')} gives the slower price for the same trip.</p>
${h.mini('pm', { t: 'Priority Mail price for another weight', p: ['lb', 'to'], d: { lb: 5 } })}
<h2>Flat rate or by weight</h2>
<p>Priority Mail also sells flat rate envelopes and boxes, one price whatever the weight up to 70 pounds and whatever the zone. They pay off for dense items going far. The ${h.a('flat-rate-box-prices', 'flat rate page')} compares the box with the price by weight for your trip, and the ${h.a('priority-mail-express-rates', 'Express page')} gives the guaranteed service.</p>
`,
  tool: 'pm',
  related: ['flat-rate-box-prices', 'usps-ground-advantage-rates', 'priority-mail-express-rates', 'usps-dimensional-weight'],
  sources: ['notice123', 'dmm123', 'services', 'dmm503', 'release_2027'],
});
