import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((oz) => [`${oz} oz`, K.usd(K.largeEnvelope('current', oz)!), K.usd(K.largeEnvelope('jul2026', oz)!)]);
const f1 = K.largeEnvelope('current', 1)!, f13 = K.largeEnvelope('current', 13)!, f8 = K.largeEnvelope('current', 8)!;
const ga8 = K.q('ga', 8, 8), ga1 = K.q('ga', 1, 8), pmEnv = K.flat('pm_env');
const step = K.largeEnvelope('current', 2)! - f1;

export default definePage({
  id: 'large-envelope-postage', group: 'mail', order: 33, slug: 'large-envelope-postage',
  nav: 'Large envelope postage', card: 'Flats from 1 to 13 ounces: the price by ounce and when a package is cheaper.',
  title: 'Large Envelope Postage 2027: USPS Flat Price by Ounce',
  description: 'Large envelope postage in 2027: the USPS First-Class price of a flat from 1 to 13 ounces, the stamps it needs, and when a package or flat rate envelope wins.',
  h1: 'Large envelope postage, ounce by ounce',
  intro: 'Large envelope postage for a flat piece up to 13 ounces: choose “Large envelope”, enter the weight and see the price and the stamps.',
  resume: `Large envelope postage applies to First-Class Mail pieces larger than a letter that stay flat and flexible, up to 13 ounces; the Postal Service also calls them flats. In the Notice 123 retail sheet read on November 13, 2026, the price starts at ${K.usd(f1)} for 1 ounce and rises with each ounce, by ${K.usd(step)} at first, to ${K.usd(f13)} at 13 ounces. These prices did not change with the holiday price change of October 2026, which covered shipping products only, and the January 2027 filing makes no change to them either. A large envelope must bend: a rigid or lumpy envelope is charged as a package. For anything over 13 ounces, USPS Ground Advantage takes over, from ${K.usd(ga1)} for 8 ounces in zone 1 at a counter. Documents that must arrive in 2 to 3 days can go in the Priority Mail Flat Rate Envelope, ${K.usd(pmEnv)} whatever they weigh.`,
  faqs: [
    { q: 'What counts as a large envelope for USPS?', a: 'A flat, flexible piece bigger than a letter, up to 13 ounces, as usps.com describes First-Class Mail large envelopes. A full-size document envelope with papers inside is the usual example. If it is stiff, uneven or thicker than a flat piece, the Postal Service charges it as a package, which costs more.' },
    { q: 'Is a large envelope cheaper than a package?', a: `Yes, while it stays flat. An 8-ounce large envelope costs ${K.usd(f8)}; the same 8 ounces as a Ground Advantage package cost ${K.usd(ga1)} in zone 1 and ${K.usd(ga8)} in zone 8 at a counter. The package adds tracking and $100 of insurance, which the large envelope lacks.` },
    { q: 'Can I track a large envelope?', a: 'Not with First-Class Mail alone: usps.com notes that tracking is not included for letters and large envelopes unless you buy certain extra services. Certified Mail adds a mailing receipt and a delivery record. For tracking and insurance included, send it as a Ground Advantage package or in a Priority Mail Flat Rate Envelope.' },
  ],
  body: (h) => `
<h2>Large envelope postage from 1 to 13 ounces</h2>
${h.table(['Weight', 'Price today', 'July 2026'], rows, 'First-Class Mail retail, Notice 123. No change filed for January 2027.', ['l', 'r', 'r'])}
<p>The price climbs steadily, so the weight matters more than the size of the envelope. A thick report of 6 ounces in a large envelope costs ${K.usd(K.largeEnvelope('current', 6)!)}. Split into two letters of 3 ounces each it would cost ${K.usd(2 * K.letter('current', 3)!)}, less, but the pages travel separately and may not arrive the same day.</p>
${h.mini('stamps', { t: 'Postage for your large envelope', p: ['w'], d: { what: 'flat', w: 5 } })}
<h2>Flat, flexible, under 13 ounces</h2>
<p>Three checks keep a piece in the large envelope price. It must be larger than a letter, so a standard business envelope is a letter, not a flat. It must stay flat and bend: a padded mailer with a box inside, a binder or a thick booklet that will not flex is a package. And it must weigh 13 ounces or less; one more ounce and Ground Advantage applies.</p>
<h2>Stamps or a label</h2>
<p>Forever stamps work on a large envelope, but they rarely match the price, as the ${h.a('how-many-stamps-do-i-need', 'stamps calculator')} shows. A counter weighs the piece and prints the exact postage. For legal papers that need a proof of mailing and delivery, add Certified Mail, priced on the ${h.a('certified-mail-cost', 'Certified Mail page')}.</p>
`,
  tool: 'stamps', toolArg: { what: 'flat', w: 5 },
  related: ['how-many-stamps-do-i-need', 'how-much-is-a-stamp', 'certified-mail-cost', 'usps-ground-advantage-rates'],
  sources: ['notice123', 'services', 'business_prices', 'release_2027'],
});
