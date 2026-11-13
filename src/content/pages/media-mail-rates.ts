import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const Z = K.zone(K.EX.from, K.EX.to);
const rows = [1, 2, 3, 5, 10, 20, 70].map((lb) => [`${lb} lb`, K.usd(K.media(lb * 16)), K.usd(K.q('ga', Z, lb * 16)), K.usd(K.q('ga', Z, lb * 16) - K.media(lb * 16))]);
const m1 = K.media(16), m2 = K.media(32), m70 = K.media(70 * 16), mJ = K.media(32, 'jan2027');
const sc = K.extras('current').signature_confirmation_retail;

export default definePage({
  id: 'media-mail-rates', group: 'ship', order: 16, slug: 'media-mail-rates',
  nav: 'Media Mail rates', card: 'Books and recorded media by weight, any distance, and what may go in the box.',
  title: 'Media Mail Rates 2027: USPS Price for Books by Weight',
  description: 'Media Mail rates for 2027: the USPS price for books, records and printed music by the pound, any distance, what qualifies, and the saving over Ground Advantage.',
  h1: 'Media Mail rates: the book rate by the pound',
  intro: 'Media Mail rates by weight, the same for every distance. Add your ZIP Codes to see what Ground Advantage would charge instead.',
  resume: `Media Mail is the Postal Service's cheapest way to send books and other educational media, priced by the pound with no zone: ${K.usd(m1)} for 1 pound and ${K.usd(m2)} for 2 pounds at a counter, up to ${K.usd(m70)} for 70 pounds, the same from New York to Los Angeles as across town. It is a mailing service, not a shipping service, so it carries none of the 8% temporary increase of 2026 and none of the 11% fuel surcharge planned for January 17, 2027; the 2-pound price stays ${K.usd(mJ)} in the January 2027 file. The contents are restricted by the Domestic Mail Manual: books of at least eight pages, sound and video recordings, printed music, printed test materials and a few other educational items, with no advertising. Delivery is slow, 2 to 8 days according to usps.com, and no insurance is included.`,
  faqs: [
    { q: 'What can be sent by Media Mail?', a: 'Books of at least eight printed pages with no advertising beyond incidental announcements of books, sound and video recordings, printed music, printed test materials, 16-millimeter films, playscripts and manuscripts, educational charts and computer-readable media, as listed in section 173 of the Domestic Mail Manual. Video games, computer drives and digital drives do not qualify, usps.com says, and neither does clothing.' },
    { q: 'Can the Postal Service open a Media Mail package?', a: 'Yes. Media Mail is not sealed against inspection: the Postal Service may open a package to check that the contents qualify. If anything in the box is not allowed, usps.com warns that you or your recipient will have to pay the higher postage. That is why a mixed box, books plus a toy, should go by Ground Advantage.' },
    { q: 'Does Media Mail include insurance?', a: `Insurance is not included, unlike Ground Advantage and Priority Mail which cover $100 of value at no fee. The Domestic Mail Manual also gives Media Mail no delivery time guarantee. You can buy insurance by declared value, and add Signature Confirmation for ${K.usd(sc)} at the counter.` },
  ],
  body: (h) => `
<h2>Media Mail rates against Ground Advantage</h2>
<p>The saving grows with weight and distance. The table compares Media Mail with Ground Advantage at the counter for the New York to Los Angeles example, zone ${Z}. For a box of textbooks, the difference pays for a lot of patience.</p>
${h.table(['Weight', 'Media Mail, any zone', `Ground Advantage, zone ${Z}`, 'Saved'], rows, 'Post Office prices of Notice 123 in force today.', ['l', 'r', 'r', 'r'])}
<h2>Why the 2027 change skips Media Mail</h2>
<p>The Postal Service sorts its products in two groups. Mailing services, such as letters and Media Mail, have prices based on the consumer price index, as the November 12, 2026 release recalls. Shipping services, such as Ground Advantage and Priority Mail, are priced on the market and carry the fuel surcharge. The November 12, 2026 filing covers shipping services, which is why Media Mail prices do not move on January 17.</p>
${h.mini('media', { t: 'Media Mail for your books', p: ['lb', 'oz'], d: { lb: 5 } })}
<p>Weigh the packed box and round up to the next pound: 2 pounds 3 ounces pays the 3-pound price. For heavier non-book items, the ${h.a('shipping-a-heavy-package', 'heavy package page')} compares the other services, and the ${h.a('usps-ground-advantage-rates', 'Ground Advantage page')} gives its prices by zone.</p>
`,
  tool: 'media',
  related: ['cheapest-way-to-ship-a-package', 'usps-ground-advantage-rates', 'shipping-a-heavy-package', 'usps-insurance-cost'],
  sources: ['notice123', 'dmm173', 'services', 'release_2027', 'release_2026_03'],
});
