import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const envs = K.FLAT_ITEMS.filter((i) => /env|legal|padded/.test(i.key));
const rows = envs.map((i) => [i.label, i.size, K.usd(K.flat(i.key)), K.usd(K.flat(i.key, 'current', 'comm')), K.usd(K.flat(i.key, 'jan2027'))]);
const env = K.flat('pm_env'), envO = K.flat('pm_env', 'current', 'comm'), envJ = K.flat('pm_env', 'jan2027'), envJul = K.flat('pm_env', 'jul2026');
const legal = K.flat('pm_legal'), padded = K.flat('pm_padded'), xenv = K.flat('pme_env');
const be = (oz: number) => K.flatBreakEven('pm_env', oz).zone;
const pm1z1 = K.q('pm', 1, 16), pm2z8 = K.q('pm', 8, 32), ga8z8 = K.q('ga', 8, 8);

export default definePage({
  id: 'usps-flat-rate-envelope', group: 'ship', order: 18, slug: 'usps-flat-rate-envelope',
  nav: 'USPS flat rate envelope', card: 'Regular, legal and padded envelopes, Priority Mail and Express: price and when it pays.',
  title: 'USPS Flat Rate Envelope 2027: Price, Sizes and Padded Option',
  description: 'USPS flat rate envelope prices for 2027: regular, legal and padded, Priority Mail and Express, at the counter and online, and when one beats paying by weight.',
  h1: 'USPS flat rate envelope: price, sizes and when it pays',
  intro: 'The USPS flat rate envelope costs one price for any weight and any US address. Compare it with the price by weight for your own ZIP Codes.',
  resume: `A USPS flat rate envelope is a Postal Service envelope sold with Priority Mail or Priority Mail Express at one price, whatever it weighs up to 70 pounds and wherever it goes in the United States, provided its flap closes normally. Three models exist for each service: the regular envelope of 12 1/2 by 9 1/2 inches, the legal envelope of 15 by 9 1/2 inches and the padded envelope. At a Post Office counter today the Priority Mail Flat Rate Envelope costs ${K.usd(env)}, the legal one ${K.usd(legal)} and the padded one ${K.usd(padded)}; online, the regular envelope costs ${K.usd(envO)}. These prices include the holiday increase in force until January 16, 2027. The Express envelope, with its guaranteed date, costs ${K.usd(xenv)}. On January 17, 2027 the regular Priority Mail envelope would cost ${K.usd(envJ)} with the proposed 11% fuel surcharge, against ${K.usd(envJul)} in July 2026. Only envelopes made by the Postal Service and marked Flat Rate qualify.`,
  faqs: [
    { q: 'How much does a USPS flat rate envelope cost?', a: `At a Post Office counter today: ${K.usd(env)} for the Priority Mail Flat Rate Envelope, ${K.usd(legal)} for the legal size and ${K.usd(padded)} for the padded one. A label bought online costs less, ${K.usd(envO)} for the regular envelope. Priority Mail Express envelopes cost more because they come with a delivery date guarantee.` },
    { q: 'Is the padded flat rate envelope worth the extra cost?', a: `The padded envelope costs ${K.usd(padded - env)} more than the regular one at the counter. It protects small items such as a phone case or jewelry without a box. For flat papers, the regular or the legal envelope is enough, and the legal size takes long documents without folding them.` },
    { q: 'When is paying by weight cheaper than the envelope?', a: `For a light piece going a short distance. A 1-pound Priority Mail package in zone 1 costs ${K.usd(pm1z1)}, less than the ${K.usd(env)} envelope, while 2 pounds across the country cost ${K.usd(pm2z8)}. For papers under 8 ounces with no hurry, Ground Advantage costs ${K.usd(ga8z8)} even in zone 8.` },
  ],
  body: (h) => `
<h2>USPS flat rate envelope prices by model</h2>
<p>The table lists the six flat rate envelopes of the Notice 123 price list, with their size, the counter price today, the online price and the proposed price from January 17, 2027, fuel surcharge counted.</p>
${h.table(['Envelope', 'Size', 'Post Office', 'Online', K.JAN], rows, 'Notice 123: Priority Mail and Priority Mail Express flat rate envelopes.', ['l', 'l', 'r', 'r', 'r'])}
<h2>When the envelope beats the scale</h2>
<p>The regular Priority Mail envelope wins from zone ${be(16) ?? 'none'} for a 1-pound piece and from zone ${be(32) ?? 'none'} for 2 pounds, at counter prices. Below those zones, the same piece in your own envelope costs less by weight. The calculator does the comparison for your two ZIP Codes.</p>
${h.mini('flatenv', { t: 'Envelope or price by weight', p: ['item', 'to'] })}
<h2>Filling a flat rate envelope</h2>
<p>The envelope must close with its own flap, without being stretched out of shape by its contents. A plain Priority Mail envelope without the Flat Rate marking is charged by weight and zone, like your own envelope. For bulkier things, the ${h.a('flat-rate-box-prices', 'flat rate boxes')} start with the small box, and for a guaranteed date the Express envelope is on the ${h.a('usps-overnight-shipping-cost', 'overnight shipping page')}.</p>
`,
  tool: 'flatenv',
  related: ['flat-rate-box-prices', 'priority-mail-rates', 'usps-overnight-shipping-cost', 'cheapest-way-to-ship-a-package'],
  sources: ['notice123', 'dmm123', 'price_change', 'release_2027'],
});
