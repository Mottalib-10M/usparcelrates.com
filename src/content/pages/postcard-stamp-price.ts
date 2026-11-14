import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const pc = K.postcard('current'), pcJ = K.postcard('jan2027'), pcJul = K.postcard('jul2026'), st = K.letter('current', 1)!, nm = K.nonmachinable('current');
const n = 50;

export default definePage({
  id: 'postcard-stamp-price', group: 'mail', order: 32, slug: 'postcard-stamp-price',
  nav: 'Postcard stamp price', card: 'What a postcard costs, what makes a card a letter, and a stack of holiday cards.',
  title: 'Postcard Stamp Price 2027: What a Postcard Costs to Mail',
  description: 'Postcard stamp price in 2027: the USPS postcard rate, what turns a card into a letter, square cards and the cost of mailing a big stack of holiday cards.',
  h1: 'Postcard stamp price, and when a card costs a letter',
  intro: 'The postcard stamp price applies to standard rectangular postcards. A greeting card in an envelope is a letter. Pick “Postcard” or “Letter” to compare.',
  resume: `The postcard stamp price is ${K.usd(pc)} in the First-Class Mail retail sheet of Notice 123, read on November 13, 2026, for a standard-sized rectangular postcard as usps.com describes it. It was ${K.usd(pcJul)} in July 2026 and stays ${K.usd(pcJ)} in the January 2027 file, since the Postal Service made no change to stamp prices in its filing of November 12, 2026. A card in an envelope is not a postcard: it pays the letter price, ${K.usd(st)} for 1 ounce, and a square envelope adds the ${K.usd(nm)} nonmachinable surcharge. Mailing ${n} holiday greetings therefore costs ${K.usd(n * pc)} as postcards, ${K.usd(n * st)} as cards in standard envelopes and ${K.usd(n * (st + nm))} in square envelopes. A Forever stamp on a postcard pays it, with ${K.usd(st - pc)} overpaid, so postcard stamps are worth buying for a large mailing. Postcards travel as First-Class Mail, in 1 to 5 days according to usps.com.`,
  faqs: [
    { q: 'Can I put a Forever stamp on a postcard?', a: `Yes. A Forever stamp pays a 1-ounce letter, ${K.usd(st)}, which is more than the ${K.usd(pc)} postcard price, so the postcard goes through and you overpay ${K.usd(st - pc)}. Postcard stamps are sold separately at the postcard price if you mail many of them.` },
    { q: 'Is a greeting card a postcard?', a: `Only if it is a single card mailed without an envelope and has the shape of a standard rectangular postcard. A card inside an envelope is a letter and pays ${K.usd(st)} for 1 ounce. A square or oversized card in an envelope pays more, ${K.usd(st + nm)}, as usps.com lists for square, oversized or unusual envelopes.` },
    { q: 'How long does a postcard take?', a: 'Postcards travel as First-Class Mail, for which usps.com quotes 1 to 5 days. Like a letter they carry no tracking unless an extra service is added, and they are not insured. For something you must prove you sent, Certified Mail on a letter gives a receipt and a delivery record.' },
  ],
  body: (h) => `
<h2>The postcard stamp price for many cards</h2>
${h.table(['Mailing', '1 card', `${n} cards`], [['Postcard', K.usd(pc), K.usd(n * pc)], ['Card in a standard envelope, 1 oz', K.usd(st), K.usd(n * st)], ['Card in a square envelope, 1 oz', K.usd(st + nm), K.usd(n * (st + nm))]], 'First-Class Mail retail prices, Notice 123; unchanged in the January 2027 file.', ['l', 'r', 'r'])}
<p>For a holiday mailing, the shape of the card decides more of the cost than the number of cards. A square envelope looks good on the shelf but is the dearest option; a rectangular postcard is the cheapest way to send a greeting by mail.</p>
${h.mini('stamps', { t: 'The same message in an envelope', p: ['what'], d: { what: 'letter' } })}
<p>Count the return cards too. A reply postcard enclosed for a guest to send back needs its own postcard stamp, and a reply card in an envelope needs a letter stamp.</p>
<h2>Check before you buy cards</h2>
<p>A postcard has to be a rectangle of standard size and thickness, the kind sold as a postcard. Large or thick cards, or cards cut into shapes, are not postcards and pay letter or large envelope prices. When in doubt, mail it in an envelope at the letter price, or show it at a counter before you buy a stack of stamps. The ${h.a('how-much-is-a-stamp', 'stamp page')} gives the letter prices and the ${h.a('large-envelope-postage', 'large envelope page')} the prices for bigger pieces.</p>
`,
  tool: 'stamps', toolArg: { what: 'postcard' },
  related: ['how-much-is-a-stamp', 'how-many-stamps-do-i-need', 'large-envelope-postage', 'certified-mail-cost'],
  sources: ['notice123', 'business_prices', 'services', 'release_2027'],
});
