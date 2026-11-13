import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const Z = K.zone(K.EX.from, K.EX.to);
const steps = [4, 8, 12, 15.999];
const ozRows = steps.map((oz) => [oz === 15.999 ? 'Up to 15.999 oz' : `Up to ${oz} oz`, K.usd(K.q('ga', 1, oz)), K.usd(K.q('ga', 4, oz)), K.usd(K.q('ga', 8, oz)), K.usd(K.q('ga', 8, oz, 'current', 'comm'))]);
const lbRows = [1, 2, 5, 10, 20].map((lb) => [`${lb} lb`, K.usd(K.q('ga', 1, lb * 16)), K.usd(K.q('ga', 4, lb * 16)), K.usd(K.q('ga', 8, lb * 16)), K.usd(K.q('ga', 8, lb * 16, 'jan2027'))]);
const g2 = K.q('ga', Z, 32), g2j = K.q('ga', Z, 32, 'jan2027');
const g12 = K.q('ga', 8, 12), g16 = K.q('ga', 8, 16), g8 = K.q('ga', 8, 8);

export default definePage({
  id: 'usps-ground-advantage-rates', group: 'ship', order: 12, slug: 'usps-ground-advantage-rates',
  nav: 'Ground Advantage rates', card: 'The cheapest USPS package service, priced by ounce step and pound, zone 1 to 9.',
  title: 'USPS Ground Advantage Rates 2027: Price by Weight, Zone',
  description: 'USPS Ground Advantage rates for 2027: price by ounce and pound in every zone, at the Post Office and online, and the proposed prices from January 17, 2027.',
  h1: 'USPS Ground Advantage rates by weight and zone',
  intro: 'USPS Ground Advantage rates by your weight and ZIP Codes: the price at a Post Office counter or online today, and from January 17, 2027.',
  resume: `USPS Ground Advantage is the Postal Service's everyday package service, with an expected delivery of 2 to 5 days and up to 70 pounds. Its rates follow two scales. Under 1 pound, the price steps at 4, 8, 12 and 15.999 ounces; at a counter the 4- and 8-ounce steps share one price, and so do the 12-ounce and 15.999-ounce steps. From 1 pound, each pound or fraction is a new step. A 2-pound package from New York to Los Angeles, zone ${Z}, costs ${K.usd(g2)} at the counter today and would cost ${K.usd(g2j)} from January 17, 2027 with the proposed base price and the 11% fuel surcharge. Zone 9 has the same prices as zone 8. Every price includes $100 of insurance and tracking. Labels bought online pay the lower Commercial rates, shown in the last column of the tables.`,
  faqs: [
    { q: 'How are Ground Advantage packages under 1 pound charged?', a: `By ounce steps: up to 4, 8, 12 and 15.999 ounces, as the Domestic Mail Manual sets them. At a counter in zone 8, 8 ounces cost ${K.usd(g8)} and 12 ounces ${K.usd(g12)}. A package of exactly 16 ounces is 1 pound and pays ${K.usd(g16)}. Weigh to the ounce: a fraction moves you to the next step.` },
    { q: 'How long does Ground Advantage take?', a: 'The Postal Service states an expected delivery of 2 to 5 days for mailable items up to 70 pounds, longer for some places such as Alaska, Hawaii and the territories. It is an expected time, not a guarantee: no refund applies if it arrives later. For a date with a refund, Priority Mail Express is the guaranteed service.' },
    { q: 'Is insurance included with Ground Advantage?', a: 'Yes, up to $100 of coverage against loss or damage is included in the price, with tracking. Above $100 of value you buy additional insurance at the counter or online, priced by declared value up to $5,000. The insurance page of this site gives the fee for your value.' },
  ],
  body: (h) => `
<h2>Ground Advantage rates under 1 pound</h2>
<p>Many small packages, a phone case or a pair of socks, weigh less than a pound. The table gives the counter price in three zones and the online price in zone 8. Online, the four ounce steps share one price, which makes light packages much cheaper to label at home.</p>
${h.table(['Weight', 'Zone 1', 'Zone 4', 'Zone 8', 'Zone 8 online'], ozRows, 'Post Office prices unless marked online. Notice 123 in force from October 4, 2026.', ['l', 'r', 'r', 'r', 'r'])}
<h2>Ground Advantage rates by the pound</h2>
<p>From 1 pound, the price climbs with each pound and much faster in far zones. At 10 pounds, zone 8 costs more than twice zone 1. The last column gives the proposed zone 8 price from January 17, 2027.</p>
${h.table(['Weight', 'Zone 1', 'Zone 4', 'Zone 8', `Zone 8 ${K.JAN}`], lbRows, 'Post Office prices.', ['l', 'r', 'r', 'r', 'r'])}
${h.mini('ga', { t: 'Ground Advantage price for a light package', p: ['lb', 'oz'], d: { lb: 0, oz: 12 } })}
<h2>Size, length and the oversized price</h2>
<p>A box over one cubic foot is charged on its size weight if that is higher, as the ${h.a('usps-dimensional-weight', 'dimensional weight page')} explains. Ground Advantage is the only service that accepts a parcel between 108 and 130 inches in length plus girth, at a single oversized price per zone. Fees also apply over 22 and 30 inches long and over 2 cubic feet. For a faster trip, see ${h.a('priority-mail-rates', 'Priority Mail rates')}.</p>
`,
  tool: 'ga',
  related: ['priority-mail-rates', 'usps-online-vs-post-office-prices', 'usps-dimensional-weight', 'usps-insurance-cost'],
  sources: ['notice123', 'dmm133', 'services', 'dmm503', 'release_2027'],
});
