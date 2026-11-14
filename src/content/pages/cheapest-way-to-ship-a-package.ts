import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const zc = K.zone('60601', '30303'), zf = K.zone(K.EX.from, K.EX.to);
const oz = 80;
/** Testers 2026-11-14: "the table ranks the options" must be true: sorted by price, cheapest first. */
const opts = (z: number) => ([
  ['Media Mail (books and media only)', K.media(oz)],
  ['Ground Advantage, online label', K.q('ga', z as never, oz, 'current', 'comm')],
  ['Ground Advantage, Post Office', K.q('ga', z as never, oz)],
  ['Priority Mail, online label', K.q('pm', z as never, oz, 'current', 'comm')],
  ['Priority Mail, Post Office', K.q('pm', z as never, oz)],
  ['Medium Flat Rate Box, Post Office', K.flat('pm_medium')],
] as Array<[string, number]>).sort((a, b) => a[1] - b[1]).map(([l, p], i) => [`${i + 1}. ${l}`, K.usd(p)]);
const near = opts(zc), far = opts(zf);
const gaFar = K.q('ga', zf, oz), med = K.flat('pm_medium'), gaFarO = K.q('ga', zf, oz, 'current', 'comm');
const gaNearO = K.q('ga', zc, oz, 'current', 'comm'), gaNear = K.q('ga', zc, oz);

export default definePage({
  id: 'cheapest-way-to-ship-a-package', group: 'ship', order: 11, slug: 'cheapest-way-to-ship-a-package',
  nav: 'Cheapest way to ship', card: 'The USPS options ranked by price for your package: Media Mail, Ground Advantage online, flat rate.',
  title: 'Cheapest Way to Ship a Package 2027: USPS Options Ranked',
  description: 'Cheapest way to ship a package in 2027: USPS Ground Advantage online, Media Mail and flat rate boxes ranked by price for your weight and ZIP Codes, 2027 too.',
  h1: 'The cheapest way to ship a package by USPS',
  intro: 'The cheapest way to ship a package changes with its weight, its contents and the distance. Enter yours: the big figure is the cheapest label, bought online; the counter price is beside it.',
  resume: `For most packages, the cheapest way to ship with the Postal Service is USPS Ground Advantage with a label bought online. A 5-pound package from Chicago to Atlanta, zone ${zc}, costs ${K.usd(gaNearO)} that way, against ${K.usd(gaNear)} for the same service at a Post Office counter. Two exceptions change the ranking. Books, sound recordings and printed music can go by Media Mail, ${K.usd(K.media(oz))} for 5 pounds whatever the distance, if the package holds nothing else and you accept 2 to 8 days. And a heavy package going far can be cheaper in a Priority Mail flat rate box: from New York to Los Angeles, zone ${zf}, 5 pounds by Ground Advantage cost ${K.usd(gaFar)} at the counter while the Medium Flat Rate Box costs ${K.usd(med)}, any weight up to 70 pounds. Prices are those of Notice 123 in force until January 16, 2027.`,
  faqs: [
    { q: 'Is it cheaper to ship at the Post Office or online?', a: `Online, for every package service. The Postal Service charges Commercial prices on labels paid online and retail prices at a counter. For a 5-pound package from Chicago to Atlanta by Ground Advantage, that is ${K.usd(gaNearO)} against ${K.usd(gaNear)}. Stamps and letters are the exception: a letter costs the same at the counter.` },
    { q: 'When is a flat rate box the cheapest option?', a: `When the package is heavy, dense and travels far. The box price ignores weight and zone. From New York to Los Angeles a 5-pound package costs ${K.usd(gaFar)} by Ground Advantage at the counter, more than the ${K.usd(med)} Medium Flat Rate Box. Online, Ground Advantage drops to ${K.usd(gaFarO)} and wins again. Run both in the calculator.` },
    { q: 'Can I send clothes or toys by Media Mail to save money?', a: 'No. Media Mail is limited by the Domestic Mail Manual to books of at least eight pages, sound and video recordings, printed music, printed test materials and a few educational items, with no advertising. The Postal Service may open a Media Mail package to check, and charges the difference if the contents do not qualify.' },
  ],
  body: (h) => `
<h2>The cheapest way to ship a package nearby</h2>
<p>Over a short or medium distance, Ground Advantage almost always wins. The table ranks the options from cheapest to dearest for a 5-pound package from Chicago (60601) to Atlanta (30303), zone ${zc}. The online label beats the counter by ${K.usd(gaNear - gaNearO)}, and Priority Mail only makes sense if 2 to 3 days matter more than the money.</p>
${h.table(['Option, 5 lb, Chicago to Atlanta, cheapest first', 'Price today'], near, `Zone ${zc}. Notice 123 prices in force from October 4, 2026.`, ['l', 'r'])}
<h2>Across the country the box can win</h2>
<p>The far zones change the order. For the same 5 pounds from New York to Los Angeles, zone ${zf}, the Medium Flat Rate Box at a counter costs less than Ground Advantage at a counter, because the box price is the same for every zone. Online, Ground Advantage falls back below the box. The ${h.a('flat-rate-box-prices', 'flat rate calculator')} finds the zone where the box starts to pay off for your weight.</p>
${h.table(['Option, 5 lb, New York to Los Angeles, cheapest first', 'Price today'], far, `Zone ${zf}.`, ['l', 'r'])}
${h.mini('flat', { t: 'Flat rate box or price by weight?', p: ['item', 'lb'], d: { lb: 5 } })}
<h2>Three habits that cut the bill</h2>
<p>Use the smallest box that protects the item: above one cubic foot, the ${h.a('usps-dimensional-weight', 'size weight')} can cost more than the real weight. Weigh to the ounce under 1 pound, where Ground Advantage charges by 4-ounce steps. And check the date: on January 17, 2027 the proposed prices and the 11% fuel surcharge raise most of these figures, as the ${h.a('usps-price-increase-2027', '2027 page')} shows.</p>
`,
  tool: 'ship', toolArg: { from: '60601', to: '30303', lb: 5 },
  related: ['cost-to-ship-a-package', 'flat-rate-box-prices', 'media-mail-rates', 'usps-online-vs-post-office-prices'],
  sources: ['notice123', 'zone_chart', 'dmm173', 'dmm123', 'business_prices'],
});
