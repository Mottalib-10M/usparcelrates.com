import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const Z = K.zone(K.EX.from, K.EX.to);
const gap = (s: 'ga' | 'pm' | 'pme', oz: number, z: 1 | 4 | 8) => { const r = K.q(s, z, oz), c = K.q(s, z, oz, 'current', 'comm'); return `${K.usd(r)} / ${K.usd(c)} (${K.chg((c - r) / r)})`; };
const rows = ([['Ground Advantage', 'ga', 8], ['Ground Advantage', 'ga', 32], ['Priority Mail', 'pm', 32], ['Priority Mail', 'pm', 160], ['Priority Mail Express', 'pme', 32]] as const).map(([n, s, oz]) => [`${n}, ${K.w(oz)}`, gap(s, oz, 1), gap(s, oz, 4), gap(s, oz, 8)]);
const g2 = K.q('ga', Z, 32), g2o = K.q('ga', Z, 32, 'current', 'comm');
const g8 = K.q('ga', 4, 8), g8o = K.q('ga', 4, 8, 'current', 'comm');
const med = K.flat('pm_medium'), medO = K.flat('pm_medium', 'current', 'comm');
const yr = 52 * (g2 - g2o);

export default definePage({
  id: 'usps-online-vs-post-office-prices', group: 'ship', order: 17, slug: 'usps-online-vs-post-office-prices',
  nav: 'Online or at the Post Office', card: 'What a label bought online saves against the counter, service by service.',
  title: 'USPS Online vs Post Office Prices 2027: What a Label Saves',
  description: 'USPS online vs Post Office prices in 2027: the Commercial price of a label bought online against the counter price, by service, weight and zone, and in 2027.',
  h1: 'USPS online vs Post Office prices: the same box, two prices',
  intro: 'USPS online vs Post Office prices for your package: choose “Online label” or “Post Office” in the calculator and see what the counter costs you.',
  resume: `The Postal Service runs two price lists for the same packages. Retail prices apply at a Post Office counter. Commercial prices apply to labels paid online, on usps.com with Click-N-Ship, which usps.com says domestic shippers get on many services when they use Click-N-Ship. Both lists come from the same Notice 123 file. For a 2-pound Ground Advantage package from New York to Los Angeles, zone ${Z}, the counter price is ${K.usd(g2)} and the online price ${K.usd(g2o)}. Light packages gain the most: under 1 pound, the online price of Ground Advantage has a single step for any weight up to 15.999 ounces, so 8 ounces in zone 4 cost ${K.usd(g8o)} online against ${K.usd(g8)} at the counter. Flat rate boxes are cheaper online too: the Medium box costs ${K.usd(medO)} instead of ${K.usd(med)}. A Forever stamp costs ${K.usd(K.letter('current', 1)!)} wherever it is bought; only a letter paid by postage meter gets a lower price, ${K.usd(K.letter('current', 1, true)!)}.`,
  faqs: [
    { q: 'Who can get USPS Commercial prices?', a: 'Anyone who ships online with Click-N-Ship on usps.com: the Postal Service says domestic shippers get lower Commercial Rates on many services that way. Businesses can opt in to a Business Rate Card for more savings on some services, which this site does not cover. Other label sellers set their own prices; only the Postal Service list is shown here.' },
    { q: 'Are Media Mail and stamps cheaper online too?', a: 'No. Media Mail has a single price list: usps.com quotes the same starting price at the Post Office and for Commercial pricing. A Forever stamp has one price wherever it is bought; only postage meters get a slightly lower letter price. The two price lists only differ for the shipping services: Ground Advantage, Priority Mail, Priority Mail Express and flat rate packaging.' },
    { q: 'Will online prices rise on January 17, 2027?', a: `Yes, most of them. The filing of November 12, 2026 covers both price lists, and the 11% fuel surcharge applies to online labels too. For the 2-pound Ground Advantage example, the online price goes from ${K.usd(g2o)} to ${K.usd(K.q('ga', Z, 32, 'jan2027', 'comm'))}, while the counter price goes to ${K.usd(K.q('ga', Z, 32, 'jan2027'))}.` },
  ],
  body: (h) => `
<h2>USPS online vs Post Office prices by service</h2>
<p>Each cell gives the counter price, the online price and the change between them. The online discount is largest for Ground Advantage in far zones and for light packages; it shrinks for heavy Priority Mail Express.</p>
${h.table(['Service and weight', 'Zone 1: counter / online', 'Zone 4: counter / online', 'Zone 8: counter / online'], rows, 'Notice 123 prices in force from October 4, 2026.', ['l', 'r', 'r', 'r'])}
<h2>What it adds up to</h2>
<p>A seller mailing one 2-pound package a week from New York to Los Angeles by Ground Advantage would pay about ${K.usd(yr)} more a year at the counter than online. The counter has its uses: no printer needed, a clerk who checks the address and the packaging, and stamps or other errands in the same visit.</p>
${h.mini('ga', { t: 'Counter or online for your package', p: ['ch', 'lb'], d: { ch: 'comm' } })}
<h2>Where the prices come from</h2>
<p>Both columns are read in the Notice 123 files the Postal Service publishes on Postal Explorer, sheet by sheet: “Retail” for the counter, “Commercial” for labels. The ${h.a('method', 'method page')} lists the files and the date they were read; the ${h.a('cheapest-way-to-ship-a-package', 'cheapest way page')} adds Media Mail and flat rate boxes to the comparison.</p>
`,
  tool: 'ga', toolArg: { ch: 'comm' },
  related: ['cost-to-ship-a-package', 'cheapest-way-to-ship-a-package', 'usps-ground-advantage-rates', 'flat-rate-box-prices'],
  sources: ['business_prices', 'notice123', 'price_change', 'release_2027'],
});
