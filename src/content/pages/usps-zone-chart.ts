import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const pairs: Array<[string, string, string, string]> = [['10001', 'New York', '02108', 'Boston'], ['10001', 'New York', '60601', 'Chicago'], ['10001', 'New York', '33130', 'Miami'], ['10001', 'New York', '90012', 'Los Angeles'], ['60601', 'Chicago', '30303', 'Atlanta'], ['77002', 'Houston', '75201', 'Dallas'], ['94103', 'San Francisco', '98101', 'Seattle'], ['80202', 'Denver', '84101', 'Salt Lake City']];
const rows = pairs.map(([a, an, b, bn]) => [`${an} (${a}) to ${bn} (${b})`, `Zone ${K.zone(a, b)}`, `Zone ${K.zone(b, a)}`]);
const sh = K.zoneShares('10001')!, shc = K.zoneShares('60601')!;
const far = (x: Record<number, number>) => (x[8] ?? 0) + (x[9] ?? 0);
const p1 = K.q('pm', 1, 16), p8 = K.q('pm', 8, 16), g1 = K.q('ga', 1, 16), g8 = K.q('ga', 8, 16);

export default definePage({
  id: 'usps-zone-chart', group: 'size', order: 20, slug: 'usps-zone-chart',
  nav: 'Zone chart by ZIP Code', card: 'The zone between two ZIP Codes, read in the official chart, and what each zone costs.',
  title: 'USPS Zone Chart 2027: Find the Zone Between Two ZIP Codes',
  description: 'USPS zone chart for 2027: the zone from 1 to 9 between any two ZIP Codes, read in the official domestic chart, and what each zone adds to a package price.',
  h1: 'USPS zone chart: the zone between two ZIP Codes',
  intro: 'Type two ZIP Codes to read their zone in the USPS zone chart. Zones run from 1, local, to 8 across the country, and 9 for some Pacific territories.',
  resume: `The USPS zone chart turns two ZIP Codes into a zone from 1 to 9, the distance band that sets the price of Ground Advantage, Priority Mail and Priority Mail Express. It works from the first three digits of each ZIP Code. The Postal Service publishes one chart per origin prefix; this site read all of them on November 13, 2026 from its official tool, in the version effective November 1, 2026, ${K.num(K.ORIGINS)} origin prefixes in all. Zone 1 means the two addresses are close, often in the same network distribution center; zone 8 means across the country. The zone matters: a 1-pound Priority Mail package costs ${K.usd(p1)} at a counter in zone 1 and ${K.usd(p8)} in zone 8, and by Ground Advantage ${K.usd(g1)} and ${K.usd(g8)}. The chart is nearly but not fully symmetric, so read it from the sender's ZIP Code. Some destinations have 5-digit exceptions, which the calculator applies.`,
  faqs: [
    { q: 'What does the asterisk mean in the USPS zone chart?', a: 'In the official chart, an asterisk next to a zone marks a destination served by the same network distribution center as the origin. A plus sign marks a range with 5-digit exceptions, listed under the chart, where some ZIP Codes have a different zone. The calculator applies both, so you do not need to read the legend yourself.' },
    { q: 'Is the zone from A to B the same as from B to A?', a: `Almost always, not always. Across the whole chart read on November 13, 2026, the zone matches in both directions in ${K.pct(K.SYMMETRIC ?? 0, 1)} of origin and destination pairs. For a return label, check the zone from the customer's ZIP Code to yours rather than assuming it is the same.` },
    { q: 'Which ZIP Codes are in zone 9?', a: 'Zone 9 is used for some Pacific territories served from the mainland, such as Guam and the Northern Mariana Islands (prefix 969), from every large origin checked. Hawaii and Alaska are usually zone 8 from the mainland. Priority Mail costs much more in zone 9, while Ground Advantage charges the zone 8 price. Type the ZIP Code to see its zone.' },
  ],
  body: (h) => `
<h2>Reading the USPS zone chart for common trips</h2>
<p>The table gives the zone of a few well-known trips in both directions. Short trips inside a region are zones 1 to 3; trips between neighbouring regions are zones 4 to 6; coast to coast is zone 8.</p>
${h.table(['Trip', 'Zone', 'Zone on the way back'], rows, `Domestic zone chart effective ${K.ZONE_EFFECTIVE}, read on November 13, 2026.`, ['l', 'r', 'r'])}
<h2>How much of the country is far away</h2>
<p>From New York, ${K.pct(far(sh))} of the destination prefixes in the chart are zone 8 or 9; from Chicago, near the middle of the country, ${K.pct(far(shc))}. A seller in the center reaches more of the country in mid zones, which is one reason the same product can cost less to ship from Illinois than from Maine.</p>
${h.mini('zone', { t: 'Zone of another trip', p: ['from', 'to'], d: { from: '60601', to: '30303' } })}
<h2>Where the zones come from</h2>
<p>The Postal Service does not publish a formula: it publishes the chart. This site downloaded the chart of every origin prefix from the official Domestic Zone Chart tool and stores it as it was served, with its legend. No zone is guessed from a map or a distance. When the Postal Service issues a new chart, the date on this page tells you which version you see.</p>
<p>Once you have the zone, the ${h.a('cost-to-ship-a-package', 'shipping cost calculator')} gives the price of every service, and the ${h.a('flat-rate-box-prices', 'flat rate page')} tells you whether a box that ignores the zone would be cheaper.</p>
`,
  tool: 'zone',
  related: ['cost-to-ship-a-package', 'shipping-to-alaska-and-hawaii', 'flat-rate-box-prices', 'priority-mail-rates'],
  sources: ['zone_chart', 'notice123', 'dmm123', 'dmm133'],
});
