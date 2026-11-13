import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const cases: Array<[string, 'ga' | 'pm' | 'pme', number, 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8]> = [['Ground Advantage, 8 oz, zone 4', 'ga', 8, 4], ['Ground Advantage, 2 lb, zone 8', 'ga', 32, 8], ['Ground Advantage, 5 lb, zone 5', 'ga', 80, 5], ['Priority Mail, 1 lb, zone 1', 'pm', 16, 1], ['Priority Mail, 5 lb, zone 5', 'pm', 80, 5], ['Priority Mail, 10 lb, zone 8', 'pm', 160, 8], ['Priority Mail Express, 2 lb, zone 8', 'pme', 32, 8]];
const rows = cases.map(([n, s, oz, z]) => { const h = K.history({ service: s, zone: z, weightOz: oz }); return [n, K.usd(h.jul.price), K.usd(h.now.price), K.usd(h.jan.price), K.chg(h.vsNow), K.chg(h.vsJul)]; });
const g = K.history({ service: 'ga', zone: 8, weightOz: 32 });
const med = K.flat('pm_medium'), medJ = K.flat('pm_medium', 'jan2027'), medJul = K.flat('pm_medium', 'jul2026');
const st = K.letter('jan2027', 1)!;

export default definePage({
  id: 'usps-price-increase-2027', group: 'change', order: 50, slug: 'usps-price-increase-2027',
  nav: 'January 2027 price increase', card: 'What changes on January 17, 2027 for your package, against today and July 2026.',
  title: 'USPS Price Increase 2027: What Changes on January 17',
  description: 'USPS price increase for 2027: what the January 17 filing and the 11% fuel surcharge change for your package, against today and July 2026, with stamps unchanged.',
  h1: 'USPS price increase 2027: your package on January 17',
  intro: 'The USPS price increase of January 17, 2027, for your service, weight and zone: today’s counter price, the proposed price and the change.',
  resume: `The USPS price increase for 2027 was filed with the Postal Regulatory Commission on November 12, 2026, docket CP2027-1, for January 17, 2027. The Postal Service announced an average rise of 5.9% for Priority Mail, Priority Mail Express, Ground Advantage and Parcel Select, and the conversion of the temporary 8% increase of April 2026 into a permanent fuel surcharge of 8% plus 3%, 11% in all, to be reviewed in July 2027. The price file published that day gives base prices without the surcharge; this site adds the 11% to each one. For a 2-pound Ground Advantage package to zone 8, the counter price goes from ${K.usd(g.now.price)} today to ${K.usd(g.jan.price)}, ${K.chg(g.vsNow)}. Some prices fall, because the time-limited prices in force since October 4, 2026 end on January 16. Stamps do not change: the 1-ounce letter stays ${K.usd(st)}. Until the Commission rules, these 2027 prices are proposed.`,
  faqs: [
    { q: 'How much will USPS prices go up in January 2027?', a: `The Postal Service gave an average of 5.9% on its base prices for shipping services, before the fuel surcharge. What you pay depends on the service, weight and zone: for a 2-pound Ground Advantage package to zone 8 at a counter, ${K.chg(g.vsNow)} against today and ${K.chg(g.vsJul)} against July 2026. The calculator gives your case.` },
    { q: 'Is the January 2027 USPS price increase approved?', a: 'Not on November 13, 2026, when this page was written. The Postal Service filed it on November 12, 2026 after approval by its Board of Governors, and the Postal Regulatory Commission reviews it before January 17, 2027. The filing is public on the Commission portal under docket CP2027-1. This site will reread the files if the prices change.' },
    { q: 'Do stamp prices go up in January 2027?', a: `No. The release of November 12, 2026 says no changes are made to the price of stamps, and the price file keeps the 1-ounce letter at ${K.usd(st)}. Media Mail, postcards and Certified Mail keep their prices too. The January change concerns shipping services and some competitive extra services.` },
  ],
  body: (h) => `
<h2>The USPS price increase for common packages</h2>
${h.table(['Package, counter price', 'July 2026', 'Today', 'From Jan 17, 2027', 'vs today', 'vs July'], rows, 'Notice 123 files of July 2026, October 2026 and January 2027 (proposed, 11% fuel surcharge added).', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Two prices move in the table: the base price and the surcharge. Against July 2026, nearly every package costs more. Against today, the change is smaller, and some packages get cheaper, because today's prices carry the time-limited increase of October.</p>
${h.mini('history', { t: 'The change for your package', p: ['svc', 'lb'] })}
<h2>Which packages pay more, which pay less</h2>
<p>Comparing every weight and zone of the counter tables, most Ground Advantage prices rise on January 17, while a larger share of Priority Mail and Priority Mail Express prices fall slightly, heavy packages in near zones among them. Far zones rise the most, especially for Express. A seller who ships across the country will feel the change more than one who ships within the region. Online prices follow the same pattern from a lower base.</p>
<h2>Flat rate boxes in 2027</h2>
<p>The Medium Flat Rate Box went from ${K.usd(medJul)} in July 2026 to ${K.usd(med)} today and would cost ${K.usd(medJ)} from January 17, 2027. The ${h.a('flat-rate-box-prices', 'flat rate page')} lists every box. The ${h.a('usps-fuel-surcharge', 'fuel surcharge page')} explains the 11%, and the ${h.a('usps-holiday-price-change', 'October prices page')} the prices in force until January 16.</p>
`,
  tool: 'history',
  related: ['usps-fuel-surcharge', 'usps-holiday-price-change', 'flat-rate-box-prices', 'how-much-is-a-stamp'],
  sources: ['release_2027', 'price_change', 'prc_filings', 'notice123', 'release_2026_03'],
});
