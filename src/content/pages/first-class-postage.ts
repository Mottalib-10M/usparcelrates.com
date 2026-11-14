import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const L = (oz: number, m = false) => K.letter('current', oz, m)!;
const F = (oz: number) => K.largeEnvelope('current', oz)!;
const rows = [1, 2, 3, 3.5].map((oz) => [`${oz} oz`, K.usd(L(oz)), K.usd(L(oz, true)), K.usd(F(Math.ceil(oz)))]);
const flatRows = [4, 5, 6, 7, 8, 10, 12, 13].map((oz) => [`${oz} oz`, K.usd(F(oz)), String(K.stampsNeeded(F(oz)).count)]);
const st = L(1), met = L(1, true), add = K.additionalOunce('current'), nm = K.nonmachinable('current'), pc = K.postcard('current');
const f1 = F(1), f13 = F(13), ga = K.q('ga', 1, 16), ga8 = K.q('ga', 8, 16);
const save100 = Math.round((st - met) * 100 * 100) / 100;

export default definePage({
  id: 'first-class-postage', group: 'mail', order: 34, slug: 'first-class-postage',
  nav: 'First-Class postage', card: 'Letters, large envelopes and postcards by ounce, with stamps or a postage meter.',
  title: 'First Class Postage 2027: Letter, Large Envelope, Postcard',
  description: `First Class postage for 2027: letters from ${K.usd(st)}, large envelopes from ${K.usd(f1)} and postcards at ${K.usd(pc)}, ounce by ounce, with the cheaper meter price shown.`,
  h1: 'First Class postage: letters, large envelopes, postcards',
  intro: 'First Class postage for anything flat you mail in the United States, by shape and ounce. Choose what you send and its weight.',
  resume: `First Class postage is the price of First-Class Mail, the class for letters, large envelopes and postcards. It depends on the shape first, then on the weight in ounces, and never on distance. In the Notice 123 retail list read on November 13, 2026, a letter costs ${K.usd(st)} up to 1 ounce, plus ${K.usd(add)} for each extra ounce up to 3.5 ounces. A large envelope, flat and flexible, starts at ${K.usd(f1)} for 1 ounce and goes up to ${K.usd(f13)} at 13 ounces, its limit. A postcard costs ${K.usd(pc)}. Businesses that print postage with a meter pay ${K.usd(met)} for a 1-ounce letter, ${K.usd(st - met)} less than a stamp. Square, rigid or lumpy letters add ${K.usd(nm)}. Above 13 ounces the piece is a package, sent by Ground Advantage from ${K.usd(ga)} for a pound nearby. The January 17, 2027 filing changes none of these prices: the Postal Service said stamp prices stay as they are.`,
  faqs: [
    { q: 'What is the difference between a letter and a large envelope?', a: `Shape. A letter is a standard envelope or card up to 3.5 ounces that machines can sort; a large envelope, or flat, is bigger but still flat and flexible, up to 13 ounces. The same 1-ounce item costs ${K.usd(st)} as a letter and ${K.usd(f1)} as a large envelope, so folding a document into a standard envelope saves money.` },
    { q: 'Is metered postage cheaper than stamps?', a: `Yes, for letters. A 1-ounce letter costs ${K.usd(met)} with a postage meter against ${K.usd(st)} with a stamp, as Notice 123 lists. On 100 letters that saves ${K.usd(save100)}. Meters are rented by businesses; for an occasional letter, the stamp price applies.` },
    { q: 'What happens if a large envelope is rigid or lumpy?', a: `It stops being a large envelope. A flat that is rigid, uneven or thicker than allowed is priced as a package, by Ground Advantage, which costs ${K.usd(ga)} for up to a pound in zone 1 and ${K.usd(ga8)} in zone 8. Keep contents flat and even to stay at the large envelope price.` },
  ],
  body: (h) => `
<h2>First Class postage by ounce</h2>
<p>The table gives the three prices that matter for a letter: with stamps, with a postage meter and, for the same weight, as a large envelope. A letter stops at 3.5 ounces; above that, the large envelope scale goes on.</p>
${h.table(['Weight not over', 'Letter, stamps', 'Letter, meter', 'Large envelope'], rows, 'First-Class Mail retail prices, Notice 123. No change filed for January 17, 2027.', ['l', 'r', 'r', 'r'])}
${h.mini('fcm', { t: 'First Class postage for your piece', p: ['what', 'w'] })}
<h2>Large envelopes from 4 to 13 ounces</h2>
<p>A catalog, a stack of forms or a thin booklet in a 9 by 12 inch envelope often weighs between 4 and 13 ounces. The number of Forever stamps assumes each stamp is worth the 1-ounce letter price and rounds up.</p>
${h.table(['Weight not over', 'Postage', 'Forever stamps'], flatRows, 'First-Class Mail large envelopes (flats), Notice 123.', ['l', 'r', 'r'])}
<p>Folding the same papers into a standard envelope turns a large envelope into a letter, often at a lower price, as long as it stays flexible and under 3.5 ounces.</p>
<h2>Which page answers your question</h2>
<p>For the stamp alone, see ${h.a('forever-stamp-cost', 'the Forever stamp cost')}; to count stamps on an odd envelope, the ${h.a('how-many-stamps-do-i-need', 'stamps calculator')}; for cards, the ${h.a('postcard-stamp-price', 'postcard page')}. A letter that needs proof of mailing adds a fee, shown on the ${h.a('certified-mail-cost', 'Certified Mail page')}.</p>
`,
  tool: 'fcm',
  related: ['how-much-is-a-stamp', 'large-envelope-postage', 'forever-stamp-cost', 'certified-mail-cost'],
  sources: ['notice123', 'business_prices', 'release_2027', 'dmm201'],
});
