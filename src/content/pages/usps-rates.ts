import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const W = [8, 16, 32, 80, 160, 320];
const rows = W.map((oz) => [K.w(oz), K.usd(K.q('ga', 5, oz)), K.usd(K.q('pm', 5, oz)), K.usd(K.q('pme', 5, oz)), K.usd(K.media(Math.max(oz, 16)))]);
const rowsJ = W.map((oz) => [K.w(oz), K.usd(K.q('ga', 5, oz, 'jan2027')), K.usd(K.q('pm', 5, oz, 'jan2027')), K.usd(K.q('pme', 5, oz, 'jan2027'))]);
const gaR = K.q('ga', 5, 32), gaO = K.q('ga', 5, 32, 'current', 'comm'), pmR = K.q('pm', 5, 32), pmO = K.q('pm', 5, 32, 'current', 'comm');
const pmeR = K.q('pme', 5, 32), md2 = K.media(32), st = K.letter('current', 1)!, med = K.flat('pm_medium'), env = K.flat('pm_env');
const gaJ = K.q('ga', 5, 32, 'jan2027'), pmJ = K.q('pm', 5, 32, 'jan2027');
const off = (r: number, o: number) => K.pct((r - o) / r);

export default definePage({
  id: 'usps-rates', group: 'ship', order: 7, slug: 'usps-rates',
  nav: 'USPS rates', card: 'Every USPS service on one rate card: by weight and zone, counter and online, and 2027.',
  title: 'USPS Rates 2027: Every Service by Weight and Zone, One Table',
  description: 'USPS rates for 2027 on one card: Ground Advantage, Priority Mail, Express and Media Mail by weight and zone, at the counter and online, now and from January 17.',
  h1: 'USPS rates: every service by weight and zone',
  intro: 'USPS rates for every package service on one card. Pick a weight and a zone to read all prices side by side, counter and online.',
  resume: `USPS rates for packages come from one price list, Notice 123, and depend on the service, the weight and the zone, a distance band from 1 to 9. For a 2-pound package in zone 5, the middle of the distance scale, the Post Office charges ${K.usd(gaR)} by Ground Advantage, ${K.usd(pmR)} by Priority Mail and ${K.usd(pmeR)} by Priority Mail Express, in the prices in force from October 4, 2026 to January 16, 2027. Media Mail, for books and recorded media only, costs ${K.usd(md2)} for 2 pounds at any distance. Labels bought online pay the Commercial rates, ${K.usd(gaO)} and ${K.usd(pmO)} for the same Ground Advantage and Priority Mail package, ${off(gaR, gaO)} and ${off(pmR, pmO)} less. The flat rate items ignore weight and zone: the Medium box costs ${K.usd(med)} at a counter. On January 17, 2027 the proposed rates with the 11% fuel surcharge put the zone 5 package at ${K.usd(gaJ)} by Ground Advantage and ${K.usd(pmJ)} by Priority Mail. Letters are apart: a stamp stays at ${K.usd(st)}.`,
  faqs: [
    { q: 'Where does USPS publish its rates?', a: 'In Notice 123, the official price list, published on Postal Explorer as a web page and as a spreadsheet with one sheet per product. Each price change brings a new file. This site reads the files of July 2026, October 2026 and January 2027 and shows their figures with the date they were read, with no rounding of its own.' },
    { q: 'Are commercial rates only for businesses?', a: `No. Commercial prices apply to anyone who buys a label online on usps.com with Click-N-Ship, with no account volume required, as well as to shipping software users. For a 2-pound Priority Mail package in zone 5 that is ${K.usd(pmO)} instead of ${K.usd(pmR)} at the counter. Media Mail has a single price.` },
    { q: 'Which USPS rate applies to a box over one cubic foot?', a: `The larger of its weight and its dimensional weight: length times width times height, in inches, divided by 139 and rounded up. A light but bulky box can therefore cost the rate of a much heavier one. The rate card here assumes boxes under one cubic foot; the dimensional weight page does the size check.` },
  ],
  body: (h) => `
<h2>USPS rates at the Post Office, zone 5</h2>
<p>Zone 5 sits in the middle of the scale; the calculator above gives every other zone. Media Mail is shown with its 1-pound minimum, since it charges by the pound.</p>
${h.table(['Weight', 'Ground Advantage', 'Priority Mail', 'Priority Mail Express', 'Media Mail'], rows, 'Retail prices in force October 4, 2026 to January 16, 2027, Notice 123.', ['l', 'r', 'r', 'r', 'r'])}
<h2>USPS rates from January 17, 2027</h2>
<p>The same weights in the proposed file of November 12, 2026, with the 11% fuel surcharge added by this site as the Postal Service announced. The Postal Regulatory Commission reviews the filing before that date.</p>
${h.table(['Weight', 'Ground Advantage', 'Priority Mail', 'Priority Mail Express'], rowsJ, 'Proposed base price plus 11%, docket CP2027-1.', ['l', 'r', 'r', 'r'])}
${h.mini('rates', { t: 'All rates for your weight', p: ['lb', 'zone'] })}
<h2>Reading the rate card</h2>
<p>Start from the weight of the packed box and round up as the Postal Service does: by ounce steps under a pound for Ground Advantage, by the pound above. Find the zone of your two ZIP Codes on the ${h.a('usps-zone-chart', 'zone chart page')}. Then compare the columns: Ground Advantage is usually the lowest, Priority Mail is a day or two faster, and the Flat Rate Envelope at ${K.usd(env)} beats both for a heavy document going far. For a single answer with your ZIP Codes, use the ${h.a('cost-to-ship-a-package', 'shipping cost calculator')}.</p>
`,
  tool: 'rates',
  related: ['cost-to-ship-a-package', 'usps-zone-chart', 'usps-online-vs-post-office-prices', 'usps-price-increase-2027'],
  sources: ['notice123', 'price_change', 'dmm123', 'dmm133', 'release_2027', 'prc'],
});
