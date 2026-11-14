import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const rows = ([['Ground Advantage, 1 lb, zone 5', 'ga', 16, 5], ['Ground Advantage, 5 lb, zone 8', 'ga', 80, 8], ['Priority Mail, 2 lb, zone 4', 'pm', 32, 4], ['Priority Mail, 10 lb, zone 8', 'pm', 160, 8], ['Priority Mail Express, 1 lb, zone 6', 'pme', 16, 6]] as const).map(([n, s, oz, z]) => { const x = K.quote({ service: s, zone: z, weightOz: oz, period: 'jan2027' }); return [n, K.usd(x.base), K.usd(x.surcharge), K.usd(x.price)]; });
const med = K.flatBase('pm_medium', 'jan2027'), medP = K.flat('pm_medium', 'jan2027');
const pm = K.quote({ service: 'pm', zone: 8, weightOz: 160, period: 'jan2027' });

export default definePage({
  id: 'usps-fuel-surcharge', group: 'change', order: 51, slug: 'usps-fuel-surcharge',
  nav: 'The 11% fuel surcharge', card: 'Where the 11% comes from, what it applies to, and how much it adds to your label.',
  title: 'USPS Fuel Surcharge 2027: The 11% Added on January 17',
  description: 'USPS fuel surcharge for 2027: the 11% added to shipping prices on January 17, where it comes from, which services pay it, and what it adds to your package.',
  h1: 'USPS fuel surcharge: the 11% on top of the 2027 prices',
  intro: 'The USPS fuel surcharge adds 11% to the base price of shipping services from January 17, 2027. Pick a service and weight to see the base, the surcharge and the total.',
  resume: `The USPS fuel surcharge is a permanent surcharge on domestic shipping, announced on November 12, 2026, eight months after a release in which the Postal Service said it had steadfastly avoided surcharges. It replaces the time-limited 8% increase applied since April 26, 2026, which the March 25, 2026 release described as a bridge to a permanent mechanism. From January 17, 2027 the Postal Service plans an 8% fuel surcharge plus 3% for the further rise in fuel prices: 11% on Priority Mail Express, Priority Mail, Ground Advantage and Parcel Select, not on international products for now, to be reevaluated in July 2027 on fuel prices of the first half of 2027. The January 2027 price file carries two new sheets, for diesel and jet fuel, both set at 11%, and its price tables are base prices without it. A Medium Flat Rate Box with a ${K.usd(med)} base price therefore costs ${K.usd(medP)}. Stamps, letters and Media Mail carry no fuel surcharge.`,
  faqs: [
    { q: 'Does the USPS fuel surcharge apply to stamps?', a: 'No. The release of November 12, 2026 lists the domestic shipping services: Priority Mail Express, Priority Mail, USPS Ground Advantage and Parcel Select. First-Class Mail letters, postcards and stamps are not included, and the Postal Service said no changes are made to stamp prices. Media Mail, a mailing service, is not included either.' },
    { q: 'Will the 11% fuel surcharge change?', a: 'The Postal Service said it will reevaluate the surcharge in July 2027 based on fuel prices in the first half of 2027. The January 2027 file sets 11% at every fuel price level in its diesel and jet fuel tables, so the rate does not move with fuel prices before that review. This site will reread any new file.' },
    { q: 'Is the fuel surcharge shown on the label price?', a: `It is part of the price you pay: the calculator shows the total, then the base and the surcharge separately. For a 10-pound Priority Mail package to zone 8, the proposed base price is ${K.usd(pm.base)} and the surcharge ${K.usd(pm.surcharge)}, ${K.usd(pm.price)} in all at a counter. How the Postal Service displays it at checkout may differ.` },
  ],
  body: (h) => `
<h2>What the USPS fuel surcharge adds</h2>
${h.table(['Package, counter price from Jan 17, 2027', 'Base price', 'Fuel surcharge (11%)', 'Total'], rows, 'January 2027 Notice 123 file (proposed): base price; surcharge computed at 11% and rounded to the cent.', ['l', 'r', 'r', 'r'])}
<p>The surcharge is a percentage, so it adds more to expensive labels: a few dimes on a light package near home, several dollars on a heavy package across the country.</p>
${h.mini('history', { t: 'Base price and surcharge by Ground Advantage', p: ['svc', 'lb', 'zone'], d: { svc: 'ga', lb: 5 } })}
<h2>How the surcharge is computed here</h2>
<p>The January 2027 file gives each price without the surcharge. This site multiplies it by 1.11 and rounds to the nearest cent, for every weight, zone and service the surcharge covers, counter and online alike. Flat rate envelopes and boxes are treated the same way, since they are Priority Mail and Priority Mail Express products. The Postal Service may round differently at checkout; a difference of a cent is possible, and the price shown at checkout is the one you pay.</p>
<h2>From time-limited to permanent</h2>
<p>The 8% of April 2026 was presented as a temporary bridge, due to end on January 17, 2027. Instead of ending, it becomes part of a fuel surcharge with 3 more points. That is why the comparison with July 2026, on the ${h.a('usps-price-increase-2027', 'price increase page')}, shows a larger change than the 5.9% average announced on base prices. How each cent is computed is on the ${h.a('method', 'method page')}.</p>
`,
  tool: 'history', toolArg: { svc: 'pm' },
  related: ['usps-price-increase-2027', 'usps-holiday-price-change', 'priority-mail-rates', 'media-mail-rates'],
  sources: ['release_2027', 'release_2026_03', 'price_change', 'prc_filings'],
});
