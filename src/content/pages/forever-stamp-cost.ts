import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const H = K.STAMP_HISTORY;
const st = K.letter('current', 1)!, stC = Math.round(st * 100);
const first = H[0], y19 = H.find((x) => x.date === '2019-01-27')!, y21 = H.find((x) => x.date === '2021-08-29')!, y25 = H.find((x) => x.date === '2025-07-13')!;
const rise = (c: number) => K.chg((stC - c) / c);
const rows = [...H].reverse().map((x, i, a) => [K.day(x.date), `${x.cents}¢`, i < a.length - 1 ? `${x.cents - a[i + 1].cents > 0 ? '+' : ''}${x.cents - a[i + 1].cents}¢` : 'first row kept']);
const dropI = H.findIndex((x, i) => i > 0 && x.cents < H[i - 1].cents), drop = H[dropI], before = H[dropI - 1];
const changes21 = H.filter((x) => x.date >= '2021-08-29').length;

export default definePage({
  id: 'forever-stamp-cost', group: 'mail', order: 28, slug: 'forever-stamp-cost',
  nav: 'Forever stamp cost', card: 'Today’s price, every change since 2007 and what the stamps you hold are worth.',
  title: 'Forever Stamp Cost 2027: Price Today and History Since 2007',
  description: `Forever stamp cost in 2027: ${stC} cents today, unchanged on January 17. Every price change since 2007 and what Forever stamps bought earlier are worth now.`,
  h1: 'Forever stamp cost: today, in 2027 and since 2007',
  intro: 'The Forever stamp cost is set by the 1-ounce letter price. See its history and what the stamps in your drawer are worth today.',
  resume: `The Forever stamp costs ${stC} cents, the First-Class Mail price of a 1-ounce letter in the Notice 123 price list read on November 13, 2026. That price took effect on July 12, 2026, up from ${y25.cents} cents set on July 13, 2025, according to the chart of letter rates kept by the Historian of the Postal Service. A Forever stamp has no printed value: it always pays the current 1-ounce letter price, so a stamp bought at ${first.cents} cents in May 2007 mails the same letter today and is worth ${stC} cents, a rise of ${rise(first.cents)}. Since August 2021 the price has changed ${changes21} times, often twice a year, against once a year or less before. Nothing changes on January 17, 2027: the Postal Service said on November 12, 2026 that its filing makes no change to stamp prices, and the January 2027 file keeps the letter at ${stC} cents. The calculator values the stamps you hold at today's price.`,
  faqs: [
    { q: 'How much is a Forever stamp worth if I bought it years ago?', a: `It is worth today's 1-ounce letter price, ${K.usd(st)}, whatever you paid. A book of 20 bought at ${y19.cents} cents in 2019 cost ${K.usd(y19.cents * 20 / 100)} and now mails letters worth ${K.usd(st * 20)}. The stamp is never refunded in cash, but it keeps mailing a standard letter after every price change.` },
    { q: 'Has the Forever stamp price ever gone down?', a: `Once in the Historian's chart: on ${K.day(drop.date)} the first-ounce price fell to ${drop.cents} cents, from ${before.cents} cents. Every other change since 2007 was a rise, and the rises have come faster since ${K.day(y21.date)}, when the price reached ${y21.cents} cents.` },
    { q: 'Will the Forever stamp cost more in 2027?', a: `Not on January 17, 2027. The price change filed for that date concerns shipping products such as Ground Advantage and Priority Mail; the release states no change to stamp prices. Stamp prices move in separate mailing services filings, often in January or July, and none had been published when this page was read.` },
  ],
  body: (h) => `
<h2>Forever stamp cost at every change since 2007</h2>
<p>The table copies the first-ounce letter price from the Postal Service Historian, from the newest change back to May 2007. The column on the right gives the step from the change before.</p>
${h.table(['Effective', 'Price', 'Change'], rows, 'USPS Historian, Rates for Domestic Letters Since 1863 (page dated August 2026).', ['l', 'r', 'r'])}
<h2>What your Forever stamps are worth now</h2>
<p>Count the stamps you hold and pick the price you paid. The calculator multiplies by today's price and shows the gain; it is a value in postage, not money the Postal Service would pay back.</p>
${h.mini('book', { t: 'Buying new Forever stamps today', p: ['fmt', 'n'] })}
<h2>Stamps with a printed value</h2>
<p>Older stamps with a value printed in cents are worth only that value. To mail a letter with them, add stamps until the total reaches ${K.usd(st)}. For postcards, larger envelopes or several ounces, the ${h.a('first-class-postage', 'First-Class postage page')} has the price at each weight, and the ${h.a('book-of-stamps-cost', 'book of stamps page')} the price of a booklet or a coil.</p>
<p>Buying stamps ahead of a price change is the one saving a household can make on letters. The new price is announced weeks before it applies, so a book bought the day before still mails twenty letters afterwards.</p>
`,
  tool: 'forever',
  related: ['how-much-is-a-stamp', 'book-of-stamps-cost', 'first-class-postage', 'how-many-stamps-do-i-need'],
  sources: ['letter_history', 'notice123', 'release_2027', 'business_prices'],
});
