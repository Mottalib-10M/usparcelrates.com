import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.letter('current', 1)!, pc = K.postcard('current'), add = K.additionalOunce('current'), nm = K.nonmachinable('current');
const met = K.letter('current', 1, true)!, stJ = K.letter('jan2027', 1)!, stJul = K.letter('jul2026', 1)!;
const rows = [['Forever stamp, 1 oz letter', K.usd(st)], ['Each extra ounce of a letter', K.usd(add)], ['Square, rigid or lumpy letter, 1 oz', K.usd(st + nm)], ['Postcard stamp', K.usd(pc)], ['Large envelope, 1 oz', K.usd(K.largeEnvelope('current', 1)!)], ['Letter paid by postage meter, 1 oz', K.usd(met)]];

export default definePage({
  id: 'how-much-is-a-stamp', group: 'mail', order: 30, slug: 'how-much-is-a-stamp',
  nav: 'How much is a stamp', card: 'The Forever stamp, the extra ounce, the postcard and the square envelope, and 2027.',
  title: 'Stamp Price 2027: How Much Is a Forever Stamp Today',
  description: `Stamp price in 2027: a Forever stamp costs ${K.usd(st)} for a 1-ounce letter, with no change filed for January 2027; the extra ounce, postcard and square envelope.`,
  h1: 'Stamp price: how much a Forever stamp costs',
  intro: 'The stamp price for a 1-ounce letter, and what to add for a heavier, square or larger envelope. Pick what you mail and its weight.',
  resume: `The price of a Forever stamp is ${K.usd(st)}, the First-Class Mail price of a standard letter up to 1 ounce, in the Notice 123 price list read on November 13, 2026. A Forever stamp has no value printed on it: it always pays the current 1-ounce letter price. Each extra ounce of a letter costs ${K.usd(add)}, up to 3.5 ounces. A postcard stamp costs ${K.usd(pc)}. A square, rigid or lumpy letter pays a nonmachinable surcharge of ${K.usd(nm)}, so ${K.usd(st + nm)} in all at 1 ounce, the figure usps.com lists for unusual envelopes. Nothing changes in January 2027: the Postal Service said on November 12, 2026 that its shipping price filing makes no change to the price of stamps, and the January 2027 file keeps the letter at ${K.usd(stJ)}. The 1-ounce letter was already ${K.usd(stJul)} in July 2026.`,
  faqs: [
    { q: 'Will stamp prices go up in January 2027?', a: `No change was filed. The Postal Service's release of November 12, 2026 on the January 17, 2027 price change says no changes are made to the price of stamps, and the price file published the same day keeps the 1-ounce letter at ${K.usd(stJ)}. Stamp prices change in separate filings for mailing services; this site will reread the price list if one is published.` },
    { q: 'Can I use an old Forever stamp?', a: `Yes. A Forever stamp is worth the current price of a 1-ounce First-Class letter on the day you mail, whatever you paid for it, so an old one still mails a 1-ounce letter today, worth ${K.usd(st)}. Stamps with a printed value are worth only that value; add stamps to reach the price.` },
    { q: 'How much is a stamp for a square envelope?', a: `A square envelope cannot go through the letter sorting machines, so it pays the nonmachinable surcharge on top of the letter price: ${K.usd(st)} plus ${K.usd(nm)}, ${K.usd(st + nm)} for 1 ounce. The same applies to rigid or lumpy letters and the other unusual envelopes usps.com prices from the same amount.` },
  ],
  body: (h) => `
<h2>The stamp price and what goes with it</h2>
<p>Every figure below is read in the First-Class Mail retail sheet of Notice 123. The postage meter price applies to businesses that print postage with a meter; a stamp bought at the counter or online costs the stamp price.</p>
${h.table(['Item', 'Price today'], rows, 'First-Class Mail, Notice 123. No change filed for January 17, 2027.', ['l', 'r'])}
<h2>One stamp or more</h2>
<p>A standard envelope with a few sheets of paper weighs about an ounce and needs one Forever stamp. Heavier letters need more postage, and a Forever stamp is always worth the 1-ounce price, so a 2-ounce letter at ${K.usd(K.letter('current', 2)!)} takes two stamps and overpays a little. The ${h.a('how-many-stamps-do-i-need', 'stamps calculator')} counts them for any weight.</p>
${h.mini('stamps', { t: 'Postage for your envelope', p: ['what', 'w'] })}
<h2>Mail that is not a letter</h2>
<p>The Postal Service sorts mail by shape before weight. A large envelope, flat and flexible, up to 13 ounces, has its own price scale on the ${h.a('large-envelope-postage', 'large envelope page')}. Postcards are on the ${h.a('postcard-stamp-price', 'postcard page')}. Anything thicker, stiffer or heavier is a package, priced by weight and zone rather than by ounce alone: see ${h.a('usps-ground-advantage-rates', 'Ground Advantage')}.</p>
`,
  tool: 'stamps',
  related: ['how-many-stamps-do-i-need', 'postcard-stamp-price', 'large-envelope-postage', 'certified-mail-cost'],
  sources: ['notice123', 'business_prices', 'release_2027', 'services'],
});
