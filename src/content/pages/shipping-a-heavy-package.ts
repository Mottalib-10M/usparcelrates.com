import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const lbs = [20, 30, 40, 50, 70];
const rows = lbs.map((lb) => [`${lb} lb`, K.usd(K.q('ga', 4, lb * 16)), K.usd(K.q('ga', 8, lb * 16)), K.usd(K.q('ga', 8, lb * 16, 'current', 'comm')), K.usd(K.q('pm', 8, lb * 16)), K.usd(K.media(lb * 16))]);
const g30 = K.q('ga', 8, 480), g30o = K.q('ga', 8, 480, 'current', 'comm'), g30j = K.q('ga', 8, 480, 'jan2027');
const large = K.flat('pm_large'), m30 = K.media(480);
const g30n = K.q('ga', 2, 480);

export default definePage({
  id: 'shipping-a-heavy-package', group: 'size', order: 24, slug: 'shipping-a-heavy-package',
  nav: 'Heavy packages (20 to 70 lb)', card: 'Twenty to seventy pounds: Ground Advantage, Priority Mail, flat rate and Media Mail compared.',
  title: 'Shipping a Heavy Package 2027: USPS Prices from 20 to 70 lb',
  description: 'Shipping a heavy package with USPS in 2027: prices from 20 to 70 pounds by Ground Advantage, Priority Mail, flat rate box and Media Mail, counter and online.',
  h1: 'Shipping a heavy package with USPS, up to 70 pounds',
  intro: 'Shipping a heavy package costs most in far zones. Enter the weight and ZIP Codes to price it by every USPS service up to the 70-pound limit.',
  resume: `Shipping a heavy package with the Postal Service is possible up to 70 pounds, and the price climbs with each pound and each zone. A 30-pound package by Ground Advantage costs ${K.usd(g30n)} at a counter in zone 2 and ${K.usd(g30)} in zone 8; with an online label the zone 8 price falls to ${K.usd(g30o)}. From January 17, 2027 the same counter price would be ${K.usd(g30j)}, with the proposed base price and the 11% fuel surcharge. Two alternatives often beat it. A Large Flat Rate Box costs ${K.usd(large)} whatever it weighs up to 70 pounds and wherever it goes, if the items fit in it. And books or recorded media go by Media Mail for ${K.usd(m30)} at 30 pounds, any distance. Above 70 pounds the Postal Service accepts nothing: split the load into two boxes. A large box can also be charged on its size rather than its weight.`,
  faqs: [
    { q: 'What is the cheapest way to ship a 50-pound package?', a: `By weight, Ground Advantage with an online label, ${K.usd(K.q('ga', 8, 800, 'current', 'comm'))} to zone 8 against ${K.usd(K.q('ga', 8, 800))} at the counter. If the items fit in a Large Flat Rate Box, ${K.usd(large)} is much less in far zones. Books only: Media Mail at ${K.usd(K.media(800))}. Check the size weight if the box is large.` },
    { q: 'Can I send two boxes taped together as one package?', a: 'Section 201 of the Domestic Mail Manual allows two or more packages to travel as a single parcel if they are about the same size or shape, securely fastened together and within the weight and size limits. Flat Rate boxes are excluded from this rule. Above 70 pounds in total, they must go as separate packages.' },
    { q: 'Is Priority Mail worth it for heavy packages?', a: `Rarely, unless speed matters. At 30 pounds in zone 8, Priority Mail costs ${K.usd(K.q('pm', 8, 480))} at a counter against ${K.usd(g30)} by Ground Advantage, for one to three days less. In near zones the two are closer. The Large Flat Rate Box, which is Priority Mail, is the exception: it is often the cheapest.` },
  ],
  body: (h) => `
<h2>Prices for shipping a heavy package</h2>
<p>The table gives counter prices in zones 4 and 8, the online Ground Advantage price in zone 8, Priority Mail in zone 8 and Media Mail. Every price is read in Notice 123 for the period in force until January 16, 2027.</p>
${h.table(['Weight', 'Ground Advantage, zone 4', 'Ground Advantage, zone 8', 'Ground Advantage online, zone 8', 'Priority Mail, zone 8', 'Media Mail'], rows, 'Post Office prices unless marked online.', ['l', 'r', 'r', 'r', 'r', 'r'])}
<h2>Pack it to arrive</h2>
<p>The Domestic Mail Manual asks for packaging that withstands normal handling: cushion fragile items, keep the contents from shifting and brace heavy items so they do not damage other mail. A heavy box in a weak carton is the first to split. Use a double-wall box for loads near the limit and tape every seam.</p>
${h.mini('ga', { t: 'Ground Advantage for your heavy package', p: ['lb', 'to'], d: { lb: 30 } })}
<p>Above 70 pounds, split the load. Splitting costs more: two boxes of 35 pounds cost ${K.usd(2 * K.q('ga', 8, 560))} by Ground Advantage to zone 8 at a counter, one box of 70 pounds ${K.usd(K.q('ga', 8, 1120))}. Below the limit, keep one box; above it, there is no other way. Weigh each one after packing; the price goes by the pound, any fraction counting as a full pound.</p>
<p>If the box is large as well as heavy, check the ${h.a('usps-dimensional-weight', 'size weight')} and the ${h.a('usps-package-size-limits', 'size limits')}. The ${h.a('flat-rate-box-prices', 'flat rate page')} shows from which zone the Large box wins for your weight.</p>
`,
  tool: 'ga', toolArg: { lb: 30 },
  related: ['flat-rate-box-prices', 'media-mail-rates', 'usps-dimensional-weight', 'usps-package-size-limits'],
  sources: ['notice123', 'dmm133', 'dmm201', 'dmm601', 'dmm173'],
});
