import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.letter('current', 1)!, stJul25 = K.STAMP_HISTORY.find((x) => x.date === '2025-07-13')!.cents / 100;
const book = Math.round(st * 20 * 100) / 100, bookOld = Math.round(stJul25 * 20 * 100) / 100;
const rows = K.STAMP_FORMATS.map((f) => [f.label, K.num(f.count), K.usd(Math.round(f.count * st * 100) / 100)]);
const pc = K.postcard('current'), add = K.additionalOunce('current');
const hist = K.STAMP_HISTORY.slice(-6).map((x) => [K.day(x.date), `${x.cents}¢`, K.usd(x.cents * 20 / 100)]);

export default definePage({
  id: 'book-of-stamps-cost', group: 'mail', order: 29, slug: 'book-of-stamps-cost',
  nav: 'Book of stamps cost', card: 'A booklet of 20 Forever stamps, panes and coils of 100: what they cost today.',
  title: 'Book of Stamps Cost 2027: Booklet of 20 Forever Stamps Price',
  description: `Book of stamps cost in 2027: a booklet of 20 Forever stamps costs ${K.usd(book)} at ${K.usd(st)} a stamp. Panes, coils of 100 and what a book of stamps cost in past years.`,
  h1: 'Book of stamps cost: a booklet of 20 Forever stamps',
  intro: 'The book of stamps cost is 20 times the price of a Forever stamp. Pick a booklet, a pane or a coil and how many you buy.',
  resume: `A book of stamps is a booklet of 20 Forever stamps, and its cost is 20 times the First-Class Mail price of a 1-ounce letter. With a Forever stamp at ${K.usd(st)} in the Notice 123 price list read on November 13, 2026, a booklet of 20 costs ${K.usd(book)}. The same 20 stamps also come as a pane, or sheet, at the same total. Coils of 100 cost ${K.usd(Math.round(st * 100 * 100) / 100)}, and larger coils of 3,000 and 10,000 exist for businesses; these formats are listed for the U.S. Flag Forever stamp issued on June 9, 2026 in the Postal Bulletin. The price of a book changes only when the letter price changes: it was ${K.usd(bookOld)} after the July 13, 2025 change, when a stamp was ${K.STAMP_HISTORY.find((x) => x.date === '2025-07-13')!.cents} cents, and has been ${K.usd(book)} since July 12, 2026. The Postal Service filing for January 2027 makes no change to stamp prices, so a book bought today still costs ${K.usd(book)} after January 17.`,
  faqs: [
    { q: 'How many stamps are in a book of stamps?', a: `Twenty. The Postal Service sells Forever stamps in double-sided booklets of 20 and panes of 20, as the Postal Bulletin lists for the U.S. Flag stamp of 2026. A booklet therefore costs 20 times the stamp price, ${K.usd(book)} today, and mails 20 standard letters of up to 1 ounce each anywhere in the United States.` },
    { q: 'Is a book of stamps cheaper than buying single stamps?', a: `No. A booklet costs exactly 20 times the price of one stamp, ${K.usd(st)}, with no discount for the quantity. Coils of 100 are priced the same way. The only saving is buying before a price change: Forever stamps keep mailing a 1-ounce letter after the price goes up.` },
    { q: 'Can I mail a postcard or a heavier letter with a book of stamps?', a: `Yes. A Forever stamp on a postcard pays ${K.usd(st)} where the postcard price is ${K.usd(pc)}, so it overpays a little. For a 2-ounce letter, add a second stamp or ${K.usd(add)} of postage for the extra ounce; two Forever stamps overpay slightly but are simpler.` },
  ],
  body: (h) => `
<h2>Book of stamps cost by format</h2>
<p>Every format below holds Forever stamps at the same unit price; only the number of stamps changes the total. The formats are those the Postal Bulletin lists for the U.S. Flag Forever stamp issued on June 9, 2026.</p>
${h.table(['Format', 'Stamps', 'Cost today'], rows, `At ${K.usd(st)} per Forever stamp (First-Class Mail, 1-ounce letter, Notice 123).`, ['l', 'r', 'r'])}
${h.mini('stamps', { t: 'How many of those stamps for your envelope?', p: ['what', 'w'], d: { w: 2 } })}
<h2>What a book of 20 cost over the past changes</h2>
<p>The Historian of the Postal Service publishes the first-ounce letter price at each change. Multiplied by 20, it gives the price of a book on each date.</p>
${h.table(['Price change', 'One stamp', 'Book of 20'], hist, 'USPS Historian, Rates for Domestic Letters Since 1863 (August 2026).', ['l', 'r', 'r'])}
<h2>Making a book of stamps last</h2>
<p>Weigh before you stick: a standard envelope with a few sheets of paper weighs about an ounce and takes one stamp, while a thick card or a square envelope needs more postage. The ${h.a('how-many-stamps-do-i-need', 'stamps calculator')} counts them. Stamps you already hold keep their full value after a change, which the ${h.a('forever-stamp-cost', 'Forever stamp page')} works out for any purchase date. Keep booklets flat and dry so the self-adhesive stamps peel off cleanly when you need them.</p>
`,
  tool: 'book',
  related: ['forever-stamp-cost', 'how-much-is-a-stamp', 'how-many-stamps-do-i-need', 'first-class-postage'],
  sources: ['notice123', 'flag_stamp_2026', 'letter_history', 'release_2027'],
});
