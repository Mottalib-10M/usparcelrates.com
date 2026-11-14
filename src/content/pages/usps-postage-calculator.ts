import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const Z = K.zone(K.EX.from, K.EX.to);
const st = K.letter('current', 1)!, l2 = K.letter('current', 2)!, f4 = K.largeEnvelope('current', 4)!, pc = K.postcard('current');
const ga1 = K.q('ga', Z, 16), ga1o = K.q('ga', Z, 16, 'current', 'comm'), ga1j = K.q('ga', Z, 16, 'jan2027');
const ga1n = K.q('ga', 1, 16), gaLight = K.q('ga', Z, 4);
const cases = [
  ['Card or letter, 1 oz', K.usd(st), 'any distance', '1 Forever stamp'],
  ['Letter, 2 oz', K.usd(l2), 'any distance', `${K.stampsNeeded(l2).count} Forever stamps`],
  ['Postcard', K.usd(pc), 'any distance', 'postcard stamp'],
  ['Large envelope, 4 oz', K.usd(f4), 'any distance', `${K.stampsNeeded(f4).count} Forever stamps`],
  ['Small package, 4 oz', K.usd(gaLight), `zone ${Z}`, 'label or counter'],
  ['Package, 1 lb', K.usd(ga1), `zone ${Z}`, 'label or counter'],
];

export default definePage({
  id: 'usps-postage-calculator', group: 'ship', order: 6, slug: 'usps-postage-calculator',
  nav: 'USPS postage calculator', card: 'Letter, large envelope or package: the postage of any piece from one form.',
  title: 'USPS Postage Calculator 2027: Letter, Envelope or Package',
  description: 'USPS postage calculator for 2027: postage of a letter, a large envelope or a package from its weight and ZIP Codes, the stamps to use and the online price.',
  h1: 'USPS postage calculator: letter, envelope or package',
  intro: 'A USPS postage calculator for any piece: say what you send and its weight, add ZIP Codes for a package, and read the postage and the stamps.',
  resume: `A USPS postage calculator has to start with the shape of the piece, because the Postal Service prices letters, large envelopes and packages on different scales. Letters and large envelopes pay First-Class Mail postage by the ounce, the same anywhere in the United States: ${K.usd(st)} for a 1-ounce letter, ${K.usd(l2)} for 2 ounces and ${K.usd(f4)} for a 4-ounce large envelope, in the Notice 123 list read on November 13, 2026. Packages pay by weight and by zone, the distance band read from the two ZIP Codes. A 1-pound package from New York to Los Angeles, zone ${Z}, costs ${K.usd(ga1)} by Ground Advantage at a Post Office counter and ${K.usd(ga1o)} with a label printed online; the same pound costs ${K.usd(ga1n)} between two nearby ZIP Codes. Stamps can pay postage on any piece, but a package is easier to pay with a label. From January 17, 2027 the proposed package price of the example becomes ${K.usd(ga1j)}, fuel surcharge included; letter postage does not change.`,
  faqs: [
    { q: 'Can I pay package postage with stamps?', a: `Yes. Stamps are postage like any other, and their total must cover the price of the service. Since a Forever stamp is worth ${K.usd(st)}, a ${K.usd(ga1)} package would need ${K.stampsNeeded(ga1).count} of them and overpay ${K.usd(K.stampsNeeded(ga1).overpay)}. A label printed online or bought at the counter pays the exact price, and online it is cheaper.` },
    { q: 'Why does my letter cost the same to any state but my package does not?', a: 'First-Class Mail letters and large envelopes have a single national price by weight in Notice 123, whatever the distance. Packages are priced by zone, from the first three digits of each ZIP Code, because transport cost grows with distance. That is why the calculator asks for ZIP Codes only for a package.' },
    { q: 'How do I weigh mail without a postal scale?', a: 'A kitchen scale that reads ounces is enough. Weigh the piece ready to mail, with envelope or box, padding and tape, and round up: 1.2 ounces pays the 2-ounce price. A sheet of printer paper weighs about 0.2 ounce, so a few sheets in a standard envelope stay near 1 ounce.' },
  ],
  body: (h) => `
<h2>USPS postage calculator results for common pieces</h2>
<p>The table runs the calculator on six usual cases. Postage for letters and large envelopes does not depend on distance; the two package lines use the New York to Los Angeles example.</p>
${h.table(['What you send', 'Postage', 'Distance', 'How to pay'], cases, 'Counter prices of Notice 123. Packages: Ground Advantage, the lowest domestic service.', ['l', 'r', 'l', 'l'])}
${h.mini('postage', { t: 'Postage for your piece', p: ['what', 'oz'], d: { what: 'letter', lb: 0, oz: 1 } })}
<h2>Three steps to the right postage</h2>
<p>First the shape: a standard envelope is a letter up to 3.5 ounces; a bigger flat one is a large envelope up to 13 ounces; anything stiff, thick or heavier is a package. Then the weight, rounded up. Then, for a package only, the two ZIP Codes, which give the zone. The calculator follows the same order. For a package, the ${h.a('cost-to-ship-a-package', 'shipping cost page')} compares Ground Advantage, Priority Mail and Express; for letters, the ${h.a('how-many-stamps-do-i-need', 'stamps page')} counts stamps on odd envelopes.</p>
<h2>Stamps or a label</h2>
<p>Stamps suit letters and large envelopes: they never expire, and a Forever stamp follows the letter price. For a package, a label is the better tool. Bought online, it is charged the Commercial price, lower than the counter, and it carries tracking from the first scan. Bought at the counter, the clerk weighs the package and reads the zone for you, which avoids paying too little and seeing the piece come back. The calculator gives both prices for a package so you can decide before leaving home.</p>
`,
  tool: 'postage',
  related: ['cost-to-ship-a-package', 'first-class-postage', 'how-many-stamps-do-i-need', 'usps-rates'],
  sources: ['notice123', 'zone_chart', 'dmm133', 'business_prices', 'release_2027'],
});
