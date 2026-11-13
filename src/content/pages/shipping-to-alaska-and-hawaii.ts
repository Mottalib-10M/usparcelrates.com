import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const dest: Array<[string, string]> = [['96813', 'Honolulu, HI'], ['99501', 'Anchorage, AK'], ['00901', 'San Juan, PR'], ['96910', 'Hagåtña, Guam']];
const orig: Array<[string, string]> = [['10001', 'New York'], ['60601', 'Chicago'], ['90012', 'Los Angeles'], ['98101', 'Seattle']];
const rows = dest.map(([z, n]) => [n, ...orig.map(([o]) => `Zone ${K.zone(o, z, 'pm')}`)]);
const zh = K.zone('10001', '96813', 'pm'), zg = K.zone('10001', '96910', 'pm');
const pmH = K.q('pm', zh, 32), gaH = K.q('ga', zh, 32), pmG = K.q('pm', zg, 32), gaG = K.q('ga', zg, 32);
const med = K.flat('pm_medium'), pm10 = K.q('pm', zh, 160), pm10g = K.q('pm', zg, 160);
const zaS = K.zone('98101', '99501'), zaN = K.zone('10001', '99501');

export default definePage({
  id: 'shipping-to-alaska-and-hawaii', group: 'size', order: 23, slug: 'shipping-to-alaska-and-hawaii',
  nav: 'Alaska, Hawaii, territories', card: 'Zones 8 and 9, the flat rate box that ignores them, and prices to HI, AK, PR and Guam.',
  title: 'Shipping to Alaska and Hawaii 2027: USPS Zones and Prices',
  description: 'Shipping to Alaska and Hawaii in 2027: USPS zones from the mainland, prices by service, zone 9 for Guam, and why a flat rate box costs the same as next door.',
  h1: 'Shipping to Alaska and Hawaii with USPS',
  intro: 'Shipping to Alaska and Hawaii, Puerto Rico or Guam: type the ZIP Codes, and the calculator reads the zone and prices every USPS service.',
  resume: `Shipping to Alaska and Hawaii with the Postal Service costs the same as any domestic trip of the same zone: the price tables of Notice 123 have no separate column for Alaska or Hawaii, only zones. From New York, Honolulu and Anchorage are both zone ${zh} in the official zone chart, the highest mainland zone; from Seattle, Anchorage is zone ${zaS}. A 2-pound Priority Mail package from New York to Honolulu costs ${K.usd(pmH)} at a counter, Ground Advantage ${K.usd(gaH)}. Guam and the Northern Mariana Islands are zone ${zg}, where Priority Mail costs far more, ${K.usd(pmG)} for 2 pounds, while Ground Advantage keeps its zone 8 price, ${K.usd(gaG)}. Flat rate boxes ignore the zone completely: the Medium box costs ${K.usd(med)} to Honolulu or Guam as to the next town, which makes it the cheapest way to send heavy items there. Ground Advantage takes longer to these places than the 2 to 5 days quoted for most trips.`,
  faqs: [
    { q: 'Is there an extra charge for shipping to Hawaii with USPS?', a: `Not in the price tables of Notice 123, which go by zone only: a package to Hawaii pays the price of its zone, usually zone 8 from the mainland. That is already the most expensive mainland zone. A 10-pound Priority Mail package from New York to Honolulu costs ${K.usd(pm10)} at a counter, against ${K.usd(med)} for the same items in a Medium Flat Rate Box.` },
    { q: 'Why is Priority Mail to Guam so expensive?', a: `Guam and the Northern Mariana Islands are zone 9, and Priority Mail has its own, much higher, zone 9 column. Ten pounds from New York cost ${K.usd(pm10g)} by Priority Mail at a counter. Ground Advantage charges the zone 8 price there, and flat rate boxes the usual flat price, so both are far cheaper.` },
    { q: 'How long does USPS take to Alaska and Hawaii?', a: 'Longer than to the mainland. The Postal Service quotes 2 to 5 days for Ground Advantage in general but notes that packages going to certain places, Alaska and Hawaii among them, can take longer. Priority Mail Express keeps a guaranteed date where it is offered. Check the date shown at checkout.' },
  ],
  body: (h) => `
<h2>Zones for shipping to Alaska and Hawaii</h2>
<p>The table gives the Priority Mail zone from four large cities, read in the chart effective ${K.ZONE_EFFECTIVE}. The West Coast is closer to Alaska and Hawaii in zone terms, but both stay in the high zones from almost everywhere.</p>
${h.table(['To', ...orig.map(([o, n]) => `From ${n} (${o})`)], rows, 'Official domestic zone chart. Zone 9 has its own Priority Mail prices.', ['l', 'r', 'r', 'r', 'r'])}
<h2>The flat rate box is the island option</h2>
<p>A flat rate box costs the same to Honolulu as across town, so the heavier the package, the more it saves. From zone 8, a Medium Flat Rate Box beats Priority Mail by weight from a few pounds on; to zone 9 it wins almost from the first pound. Ground Advantage is the other cheap route to Guam because it charges zone 9 like zone 8.</p>
${h.mini('ship', { t: 'Price to Guam, Puerto Rico or Alaska', p: ['to', 'lb'], d: { to: '96910' } })}
<h2>Addresses and timing</h2>
<p>Write the full ZIP Code: in Hawaii, Alaska and the territories several prefixes share an island or a region, and the chart lists some 5-digit exceptions that the calculator applies only when it has all five digits. For gifts, count extra days for Ground Advantage, since the Postal Service warns that packages to these places can take longer than its usual 2 to 5 days.</p>
<p>For military addresses abroad, the Large Flat Rate Box has a lower APO/FPO price on the ${h.a('flat-rate-box-prices', 'flat rate page')}. The ${h.a('usps-zone-chart', 'zone chart page')} gives the zone of any other pair, from New York to Anchorage zone ${zaN}.</p>
`,
  tool: 'ship', toolArg: { to: '96813' },
  related: ['usps-zone-chart', 'flat-rate-box-prices', 'priority-mail-rates', 'cost-to-ship-a-package'],
  sources: ['zone_chart', 'notice123', 'services', 'dmm123'],
});
