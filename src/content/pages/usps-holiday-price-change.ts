import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const cases = ([['Ground Advantage, 8 oz, zone 4', 'ga', 8, 4], ['Ground Advantage, 2 lb, zone 8', 'ga', 32, 8], ['Priority Mail, 1 lb, zone 1', 'pm', 16, 1], ['Priority Mail, 5 lb, zone 5', 'pm', 80, 5], ['Priority Mail Express, 2 lb, zone 8', 'pme', 32, 8]] as const);
const rows = cases.map(([n, s, oz, z]) => { const h = K.history({ service: s, zone: z, weightOz: oz }); return [n, K.usd(h.jul.price), K.usd(h.now.price), K.chg(h.holidayVsJul)]; });
const flats = (['pm_env', 'pm_small', 'pm_medium', 'pm_large'] as const).map((k) => [K.FLAT_ITEMS.find((i) => i.key === k)!.label.replace('Priority Mail ', ''), K.usd(K.flat(k, 'jul2026')), K.usd(K.flat(k)), K.usd(K.flat(k) - K.flat(k, 'jul2026'))]);
const p = K.PERIODS.current;

export default definePage({
  id: 'usps-holiday-price-change', group: 'change', order: 52, slug: 'usps-holiday-price-change',
  nav: 'Prices until January 16', card: 'The time-limited prices in force since October 4, 2026, against July, and when they end.',
  title: 'USPS Holiday Prices 2027: The Time-Limited Rates to Jan 16',
  description: 'USPS holiday prices until January 2027: the time-limited rates in force since October 4, 2026, what they add to July prices, and what replaces them in January.',
  h1: 'USPS holiday prices: the time-limited rates until January 16',
  intro: 'USPS holiday prices for your package: the time-limited counter price in force since October 4, 2026, against July 2026 and against January 17, 2027.',
  resume: `The USPS holiday prices are the time-limited price change that Postal Explorer lists as starting October 4, 2026 and running through January 17, 2027; the Notice 123 file of that change is the one in force when this page was written. They come on top of the 8% increase applied since April 2026, and they apply to shipping services and flat rate packaging, not to stamps, letters or Media Mail. Against the July 12, 2026 prices, a 2-pound Ground Advantage package to zone 8 costs ${K.usd(K.q('ga', 8, 32))} at a counter instead of ${K.usd(K.q('ga', 8, 32, 'jul2026'))}, and the Medium Flat Rate Box ${K.usd(K.flat('pm_medium'))} instead of ${K.usd(K.flat('pm_medium', 'jul2026'))}. On January 17, 2027 they give way to the proposed 2027 prices with the 11% fuel surcharge, which are higher for most packages but lower for some. Every price on this site labelled today is a holiday price, valid from ${K.day(p.effective)} to ${K.day(p.through!)}.`,
  faqs: [
    { q: 'When do the USPS holiday prices end?', a: 'Postal Explorer lists the time-limited price change as running from October 4, 2026 through January 17, 2027, the day the 2027 prices are scheduled to take effect. Packages mailed from January 17 pay the new prices, once the Postal Regulatory Commission has reviewed them. Until then, the holiday counter and online prices apply.' },
    { q: 'Do holiday prices apply to stamps and letters?', a: `No. The First-Class Mail prices did not change with the October 2026 file: a 1-ounce letter costs ${K.usd(K.letter('current', 1)!)} as in July, a postcard ${K.usd(K.postcard('current'))}. Media Mail did not change either. The time-limited prices cover Ground Advantage, Priority Mail, Priority Mail Express and flat rate packaging.` },
    { q: 'Is it cheaper to wait until January 17 to ship?', a: 'Sometimes, but rarely by much. For most packages the 2027 price with the fuel surcharge is higher than today. For some, mostly heavier Priority Mail and Express packages in near zones, it is a little lower. The calculator above shows today and January 17 side by side for your package.' },
  ],
  body: (h) => `
<h2>USPS holiday prices against July 2026</h2>
${h.table(['Package, counter price', 'July 2026', 'Holiday price', 'Change'], rows, 'Notice 123 files of July 2026 and of the time-limited change of October 4, 2026.', ['l', 'r', 'r', 'r'])}
<p>Flat rate envelopes and boxes rose by a round amount, one or two dollars at the counter:</p>
${h.table(['Envelope or box', 'July 2026', 'Holiday price', 'Added'], flats, 'Counter prices.', ['l', 'r', 'r', 'r'])}
${h.mini('history', { t: 'A 5 lb Priority Mail package: July, today, January', p: ['svc', 'lb'], d: { svc: 'pm', lb: 5 } })}
<h2>Why prices moved three times in a year</h2>
<p>The Postal Service changed its shipping prices in April 2026 with a time-limited 8% increase tied to transportation costs, again in July 2026, and once more on October 4 for the holiday season. Each change was published as a Notice 123 file on Postal Explorer, which this site keeps and compares. The holiday prices are the highest of the three, which is why a package mailed in December costs more than the same package in September. Extra services such as Certified Mail, the return receipt and insurance did not change in October.</p>
<h2>What comes next</h2>
<p>On January 17, 2027 the proposed 2027 prices take over, with the 11% fuel surcharge added to base prices. The ${h.a('usps-price-increase-2027', '2027 page')} compares them with today, and the ${h.a('usps-fuel-surcharge', 'fuel surcharge page')} explains the 11%. For the cheapest way to ship during the holidays, see the ${h.a('cheapest-way-to-ship-a-package', 'cheapest way page')}.</p>
`,
  tool: 'history',
  related: ['usps-price-increase-2027', 'usps-fuel-surcharge', 'flat-rate-box-prices', 'cheapest-way-to-ship-a-package'],
  sources: ['price_change', 'notice123', 'release_2026_03', 'release_2027'],
});
