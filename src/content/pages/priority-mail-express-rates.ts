import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const Z = K.zone(K.EX.from, K.EX.to);
const rows = [8, 16, 32, 80, 160].map((oz) => [K.w(oz), K.usd(K.q('pme', 1, oz)), K.usd(K.q('pme', 5, oz)), K.usd(K.q('pme', 8, oz)), K.usd(K.q('pme', 8, oz, 'jan2027')), K.chg((K.q('pme', 8, oz, 'jan2027') - K.q('pme', 8, oz)) / K.q('pme', 8, oz))]);
const e2 = K.q('pme', Z, 32), e2o = K.q('pme', Z, 32, 'current', 'comm'), e2j = K.q('pme', Z, 32, 'jan2027'), p2 = K.q('pm', Z, 32);
const env = K.flat('pme_env'), envJ = K.flat('pme_env', 'jan2027');
const z1 = K.q('pme', 1, 32), z1j = K.q('pme', 1, 32, 'jan2027');

export default definePage({
  id: 'priority-mail-express-rates', group: 'ship', order: 14, slug: 'priority-mail-express-rates',
  nav: 'Priority Mail Express rates', card: 'The guaranteed USPS service: price by weight and zone, and the 2027 jump in far zones.',
  title: 'Priority Mail Express Rates 2027: Guaranteed Price by Zone',
  description: 'Priority Mail Express rates for 2027: the guaranteed USPS service priced by weight and zone, counter and online, with the larger 2027 rise in far zones shown.',
  h1: 'Priority Mail Express rates and what the guarantee costs',
  intro: 'Priority Mail Express rates for your weight and ZIP Codes, today and from January 17, 2027, with the online price and the flat rate envelope.',
  resume: `Priority Mail Express is the only USPS domestic service with a guaranteed delivery date, in 1 to 3 days with a money-back guarantee, delivered every day of the year with limited exceptions. Its rates start with a half-pound step, then go by the pound and zone. A 2-pound package from New York to Los Angeles, zone ${Z}, costs ${K.usd(e2)} at a counter today and ${K.usd(e2o)} with an online label; Priority Mail would charge ${K.usd(p2)} for the same trip without a guarantee. The prices from January 17, 2027 hits Express unevenly: in zone 1 the 2-pound price goes from ${K.usd(z1)} to ${K.usd(z1j)}, while in zone 8 it goes from ${K.usd(e2)} to ${K.usd(e2j)} once the 11% fuel surcharge is added to the proposed base price. The Flat Rate Envelope costs ${K.usd(env)} today and ${K.usd(envJ)} after the change. Insurance up to $100 is included.`,
  faqs: [
    { q: 'What does the Priority Mail Express guarantee cover?', a: 'A delivery date and time shown when you mail, with a refund of the postage if the Postal Service misses it, as usps.com describes the money-back guarantee. Some destinations and dates are excluded, and a package refused at acceptance for size or contents is not covered. Delivery on a Sunday or holiday costs a premium fee.' },
    { q: 'Why does Priority Mail Express rise more in far zones in 2027?', a: `The proposed base prices of the January 2027 filing rise more in zones 6 to 9 than near home, and the 11% fuel surcharge is then applied on top. For 2 pounds, zone 1 moves by ${K.usd(z1j - z1)} while zone ${Z} moves by ${K.usd(e2j - e2)}. Near trips change little; cross-country trips change a lot.` },
    { q: 'Is the Priority Mail Express Flat Rate Envelope worth it?', a: `It costs ${K.usd(env)} at the counter whatever the weight and zone, as long as the envelope closes normally. For documents going far it is usually cheaper than paying by weight, since 8 ounces in zone 8 already cost ${K.usd(K.q('pme', 8, 8))}. For a trip within zone 1 or 2, compare: paying by weight may cost about the same.` },
  ],
  body: (h) => `
<h2>Priority Mail Express rates by weight and zone</h2>
<p>The table gives counter prices in zones 1, 5 and 8 today, the proposed zone 8 price from January 17, 2027 and the change. The first row is the half-pound step that the counter applies to Express, unlike Priority Mail.</p>
${h.table(['Weight', 'Zone 1', 'Zone 5', 'Zone 8', `Zone 8 ${K.JAN}`, 'Change'], rows, 'Post Office prices of Notice 123; 2027 proposed, fuel surcharge included.', ['l', 'r', 'r', 'r', 'r', 'r'])}
<h2>What the guarantee costs you</h2>
<p>For the 2-pound example the guarantee costs ${K.usd(e2 - p2)} more than Priority Mail at the counter. That buys one or two days at most, and a refund if the date is missed. For a passport application, a court filing or a part a business waits on, it can be worth it. For a gift, Priority Mail usually arrives in time.</p>
${h.mini('pme', { t: 'Express for 5 lb to Chicago', p: ['lb', 'to'], d: { lb: 5, to: '60601' } })}
<h2>Online, Sunday and holiday</h2>
<p>Labels bought online pay the Commercial price, ${K.usd(e2o)} for the example. A Sunday or holiday delivery adds a premium fee listed in Notice 123. Insurance above the $100 included can be bought up to $5,000, see the ${h.a('usps-insurance-cost', 'insurance page')}. To see how much the whole filing moves your price, use the ${h.a('usps-price-increase-2027', '2027 calculator')}.</p>
`,
  tool: 'pme',
  related: ['priority-mail-rates', 'usps-price-increase-2027', 'usps-insurance-cost', 'flat-rate-box-prices'],
  sources: ['notice123', 'dmm113', 'services', 'dmm503', 'release_2027'],
});
