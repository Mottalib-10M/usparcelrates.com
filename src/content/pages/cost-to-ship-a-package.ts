import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const Z = K.zone(K.EX.from, K.EX.to);
const w = [16, 48, 80, 160];
// Testers 2026-11-14 (round 3): each 2027 column names its channel and follows today's price of the same channel.
const row = (oz: number) => [K.w(oz), K.usd(K.q('ga', Z, oz, 'current', 'comm')), K.usd(K.q('ga', Z, oz, 'jan2027', 'comm')), K.usd(K.q('ga', Z, oz)), K.usd(K.q('ga', Z, oz, 'jan2027')), K.usd(K.q('pm', Z, oz))];
const ga2 = K.q('ga', Z, 32), ga2o = K.q('ga', Z, 32, 'current', 'comm');
const near = K.zone('10001', '02108');
const gaNear = K.q('ga', near, 32);
const saveShare = (ga2 - ga2o) / ga2;

export default definePage({
  id: 'cost-to-ship-a-package', group: 'ship', order: 10, slug: 'cost-to-ship-a-package',
  nav: 'Cost to ship a package', card: 'Every USPS service for your weight and ZIP Codes, at the counter and online, today and in 2027.',
  title: 'Cost to Ship a Package 2027: USPS Price by Weight, ZIP',
  description: 'Cost to ship a package with USPS in 2027: Ground Advantage, Priority Mail and Express by weight and ZIP Code, at the Post Office and online, with 2027 prices.',
  h1: 'Cost to ship a package with USPS, from your ZIP Code',
  intro: 'The cost to ship a package depends on its weight, the two ZIP Codes and the service. Type them: every USPS service is priced at once, at the counter and online.',
  resume: `The cost to ship a package with the Postal Service is read in two tables. The zone chart gives a number from 1 (nearby) to 8 (across the country), or 9 for some Pacific territories, for the pair of ZIP Codes, from their first three digits. Notice 123, the official price list, gives the price for that zone and the weight, rounded up to the next step. A 2-pound package from New York to Los Angeles, zone ${Z}, costs ${K.usd(ga2)} by Ground Advantage at a Post Office counter and ${K.usd(ga2o)} with an online label, ${K.pct(saveShare)} less. The same package to Boston, zone ${near}, costs ${K.usd(gaNear)} at the counter. Priority Mail is faster and dearer; Priority Mail Express adds a guaranteed date. Prices shown for January 17, 2027 are the proposed base prices plus the 11% fuel surcharge the Postal Service announced on November 12, 2026, still under review. The packed weight is what counts: box, padding and tape included.`,
  faqs: [
    { q: 'What is the cheapest way to mail a 2-pound package?', a: `For most trips, USPS Ground Advantage with a label bought online. New York to Los Angeles, it costs ${K.usd(ga2o)} online against ${K.usd(ga2)} at the counter. Media Mail is cheaper still for books and recorded media only. Check a flat rate box if the package is heavy and travels far.` },
    { q: 'Does the box size change the price of a package?', a: 'Only above one cubic foot, 1,728 cubic inches. Then the Postal Service divides length times width times height by 139 and charges the larger of that size weight and the real weight. Packages longer than 22 inches or larger than two cubic feet also pay a fee. Enter the size under More details to see it.' },
    { q: 'Can I pay the online price at the Post Office?', a: 'No. The counter charges the retail price of Notice 123. The lower Commercial price is for labels paid online, on usps.com with Click-N-Ship, and printed before you drop the package off. The online price is the same whether you buy one label a year or a thousand: no account volume is required, only an online payment. The label must be printed and attached before the package is handed over.' },
  ],
  body: (h) => `
<h2>What the cost to ship a package is made of</h2>
<p>Three facts set the price: the service, the weight step and the zone. Everything else is an option you add, such as insurance above the $100 included, a signature or a return receipt. The calculator above reads the zone from your ZIP Codes in the official chart, then reads the price of each service in the Notice 123 file of the Postal Service. It never estimates.</p>
<p>The weight step differs by service. Ground Advantage under 1 pound is charged up to 4, 8, 12 or 15.999 ounces, then by the pound. Priority Mail at a counter is charged by the pound from the first ounce. Any fraction of a pound counts as a full pound: 2 pounds 1 ounce pays the 3-pound price.</p>
${h.table(['Weight', 'Ground Advantage, online, today', `Ground Advantage, online, ${K.JAN}`, 'Ground Advantage, Post Office, today', `Ground Advantage, Post Office, ${K.JAN}`, 'Priority Mail, Post Office, today'], w.map(row), `New York (10001) to Los Angeles (90012), zone ${Z}. Prices of Notice 123 in force today; 2027 proposed. Compare online with online and Post Office with Post Office.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<h2>The counter or the online label</h2>
<p>The same package costs less with a label paid online. The gap is not a promotion: it is a second price list, called Commercial, that the Postal Service opens to anyone printing a label. On the 2-pound example, it saves ${K.usd(ga2 - ga2o)}. The ${h.a('usps-online-vs-post-office-prices', 'online or counter page')} measures the gap for each service and zone.</p>
${h.mini('ship', { t: 'Try another trip: from Chicago to Boston', p: ['from', 'to', 'lb'], d: { from: '60601', to: '02108', lb: 5 } })}
<h2>Before you pay</h2>
<p>Weigh the package once it is closed. Measure it if it is large, because a light but bulky box can be charged as if it weighed much more. Check the ${h.a('usps-package-size-limits', 'size limits')}: above 108 inches of length plus girth only Ground Advantage takes it, at an oversized price, and above 130 inches nothing does. Then pick the speed you need. The ${h.a('cheapest-way-to-ship-a-package', 'cheapest way page')} ranks the services for heavier packages.</p>
`,
  tool: 'ship',
  related: ['cheapest-way-to-ship-a-package', 'usps-ground-advantage-rates', 'priority-mail-rates', 'usps-zone-chart'],
  sources: ['notice123', 'zone_chart', 'dmm133', 'dmm123', 'business_prices', 'release_2027'],
});
