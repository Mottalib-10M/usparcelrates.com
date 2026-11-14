import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const Z = K.zone(K.EX.from, K.EX.to);
const sun = K.sundayFee('current');
const env = K.flat('pme_env'), envO = K.flat('pme_env', 'current', 'comm'), envJ = K.flat('pme_env', 'jan2027');
const half8 = K.q('pme', 8, 8), half1 = K.q('pme', 1, 8);
const one = (z: 1 | 4 | 8) => K.q('pme', z, 16);
const rows = [8, 16, 48, 80].map((oz) => [K.w(oz), K.usd(K.q('pme', 1, oz)), K.usd(K.q('pme', 4, oz)), K.usd(K.q('pme', 8, oz)), K.usd(K.q('pme', 8, oz, 'current', 'comm')), K.usd(K.q('pme', 8, oz, 'jan2027'))]);
const ex1 = K.q('pme', Z, 16), ex1o = K.q('pme', Z, 16, 'current', 'comm'), pm1 = K.q('pm', Z, 16);
const chi = K.zone('60601', '30303');

export default definePage({
  id: 'usps-overnight-shipping-cost', group: 'ship', order: 9, slug: 'usps-overnight-shipping-cost',
  nav: 'USPS overnight shipping cost', card: 'The fastest USPS service: price by weight and distance, the envelope and the Sunday fee.',
  title: 'USPS Overnight Shipping Cost 2027: Express Price by Weight',
  description: 'USPS overnight shipping cost in 2027: Priority Mail Express by weight and ZIP Code, the flat rate envelope, the Sunday fee and the cheaper online price.',
  h1: 'USPS overnight shipping cost: what Express charges',
  intro: 'USPS overnight shipping cost means Priority Mail Express, the only USPS service with a guaranteed date. Type the ZIP Codes and weight to see the price.',
  resume: `USPS overnight shipping is sold as Priority Mail Express: the Postal Service has no separate overnight product, and Express is its only domestic service with a guaranteed delivery date, in 1 to 3 days, with the postage refunded if the date is missed. For many ZIP Code pairs the guaranteed date is the next day; the date shown when you pay is the one that counts. The price follows weight and zone. A 1-pound envelope or box from New York to Los Angeles, zone ${Z}, costs ${K.usd(ex1)} at a Post Office counter and ${K.usd(ex1o)} with a label bought online, against ${K.usd(pm1)} by Priority Mail with no guarantee. Documents can go in the Express Flat Rate Envelope at ${K.usd(env)}, any weight and distance. Delivery on a Sunday or a holiday adds ${K.usd(sun)}, a fee listed in Notice 123. From January 17, 2027 the envelope would cost ${K.usd(envJ)}, with the proposed 11% fuel surcharge counted.`,
  faqs: [
    { q: 'Does USPS have overnight shipping?', a: `Yes, through Priority Mail Express. The Postal Service guarantees a delivery date of 1 to 3 days depending on the ZIP Codes, and for many routes that date is the next day. If the package arrives late, the postage is refunded. A 1-pound package between two nearby ZIP Codes, zone 1, costs ${K.usd(one(1))} at a counter today.` },
    { q: 'How much is the USPS overnight envelope?', a: `The Priority Mail Express Flat Rate Envelope costs ${K.usd(env)} at a Post Office and ${K.usd(envO)} with an online label, whatever the weight and distance, as long as it closes normally. Legal and padded versions cost a little more. For a light document going far it is often cheaper than paying by weight: half a pound in zone 8 costs ${K.usd(half8)}.` },
    { q: 'Can I get USPS delivery on a Sunday?', a: `Priority Mail Express can be delivered on a Sunday or a holiday in many places for a premium of ${K.usd(sun)} on top of the postage, the fee listed in the Notice 123 Express sheet. Ask at the counter or check online whether the ZIP Code of the recipient offers it, because not every address does.` },
  ],
  body: (h) => `
<h2>USPS overnight shipping cost by weight and zone</h2>
<p>The zone is the distance band between the two ZIP Codes: zone 1 is local, zone 4 is a regional trip, zone 8 crosses the country (Chicago to Atlanta is zone ${chi}). The table gives counter prices of Priority Mail Express, then the online price and the proposed price from January 17, 2027 in zone 8.</p>
${h.table(['Weight', 'Zone 1', 'Zone 4', 'Zone 8', 'Zone 8 online', `Zone 8 ${K.JAN}`], rows, 'Priority Mail Express, Notice 123. Half a pound is the first step; then by the pound.', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>The first step is half a pound: ${K.usd(half1)} in zone 1 and ${K.usd(half8)} in zone 8 at a counter. A heavier package pays by the pound, so a 5-pound part sent overnight across the country costs several times the envelope price.</p>
${h.mini('overnight', { t: 'Delivered on a Sunday or holiday', p: ['to', 'lb'], d: { day: 'sun' } })}
<h2>Ways to pay less for a next-day package</h2>
<p>Buy the label online: the Commercial price is lower than the counter price for every weight. Use the flat rate envelope for papers, contracts or passports, since its price does not move with distance. Weigh before you go, because the step rounds up to the next pound. If a day or two later is fine, ${h.a('priority-mail-rates', 'Priority Mail')} costs far less, with no guarantee. The guarantee itself, the refund rules and the far-zone rise of 2027 are on the ${h.a('priority-mail-express-rates', 'Priority Mail Express rates page')}.</p>
`,
  tool: 'overnight',
  related: ['priority-mail-express-rates', 'usps-flat-rate-envelope', 'priority-mail-rates', 'usps-zone-chart'],
  sources: ['notice123', 'dmm113', 'services', 'release_2027'],
});
