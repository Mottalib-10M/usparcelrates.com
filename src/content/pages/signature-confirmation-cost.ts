import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const e = K.extras('current'), j = K.extras('jan2027');
const rows = [
  ['Signature Confirmation, at the counter', K.usd(e.signature_confirmation_retail), K.usd(j.signature_confirmation_retail)],
  ['Signature Confirmation, electronic (online label)', K.usd(e.signature_confirmation_electronic), K.usd(j.signature_confirmation_electronic)],
  ['Adult Signature Required (21 or older)', K.usd(e.adult_signature), K.usd(j.adult_signature)],
  ['Adult Signature Restricted Delivery', K.usd(e.adult_signature_restricted), K.usd(j.adult_signature_restricted)],
  ['Certified Mail (letters and flats)', K.usd(e.certified), K.usd(j.certified)],
];
const ga = K.q('ga', 5, 32), pm = K.q('pm', 5, 32);

export default definePage({
  id: 'signature-confirmation-cost', group: 'extra', order: 43, slug: 'signature-confirmation-cost',
  nav: 'Signature Confirmation cost', card: 'Signature, Adult Signature and their 2027 prices, on a package or a letter.',
  title: 'Signature Confirmation Cost 2027: USPS Signature Fees',
  description: 'Signature Confirmation cost in 2027: USPS fees for a signature at delivery, Adult Signature for 21 and older, counter or online, and the January 2027 rise.',
  h1: 'Signature Confirmation cost and the adult signature fees',
  intro: 'Signature Confirmation cost is a fee added to the postage of a package. Pick the signature you need and the value of the contents to see the total fees.',
  resume: `Signature Confirmation cost is ${K.usd(e.signature_confirmation_retail)} at a Post Office counter and ${K.usd(e.signature_confirmation_electronic)} when bought electronically with a label, in the extra services sheet of Notice 123 read on November 13, 2026. It asks for a signature at delivery and adds it to the delivery record of the package. Adult Signature Required, for packages that must go to someone 21 or older who shows identification, costs ${K.usd(e.adult_signature)}; with Restricted Delivery to a named addressee, ${K.usd(e.adult_signature_restricted)}. The Domestic Mail Manual says the Postal Service keeps the record of an adult signature delivery, with the signature, for two years. The January 2027 filing raises the adult signature fees, which are competitive services, to ${K.usd(j.adult_signature)} and ${K.usd(j.adult_signature_restricted)}; Signature Confirmation keeps its price. On a 2-pound Ground Advantage package to zone 5, a signature brings the counter total from ${K.usd(ga)} to ${K.usd(ga + e.signature_confirmation_retail)}.`,
  faqs: [
    { q: 'What is the difference between Signature Confirmation and Certified Mail?', a: `Certified Mail is for letters and large envelopes sent by First-Class Mail or Priority Mail, with a mailing receipt, at ${K.usd(e.certified)}. Signature Confirmation is meant for packages: Ground Advantage, Priority Mail, Media Mail and others, at ${K.usd(e.signature_confirmation_retail)} at the counter. Both give a delivery record with a signature.` },
    { q: 'Who can sign for an Adult Signature package?', a: 'Someone 21 years of age or older, who must show an acceptable form of identification before signing, under section 503 of the Domestic Mail Manual. With Adult Signature Restricted Delivery, only the named addressee or an authorized agent aged 21 or older can sign; otherwise the package goes back to the sender.' },
    { q: 'Why does the Adult Signature fee rise in 2027 and not Signature Confirmation?', a: `The Postal Service's filing of November 12, 2026 adjusts competitive products and some competitive special services. In the January 2027 file, Adult Signature moves from ${K.usd(e.adult_signature)} to ${K.usd(j.adult_signature)}, while Signature Confirmation, Certified Mail and the return receipt keep their prices.` },
  ],
  body: (h) => `
<h2>Signature Confirmation cost and the other signature fees</h2>
${h.table(['Service', 'Today', K.JAN], rows, 'Extra services of Notice 123; the January 2027 file is proposed.', ['l', 'r', 'r'])}
<p>The fee is per piece and does not depend on weight or zone. It is added once to the postage and to any insurance fee. The electronic price applies when the signature is bought with a label online; at a counter the retail price applies. For a seller sending many packages with a signature, the gap between the two adds up, which is one more reason to buy labels online.</p>
${h.mini('insure', { t: 'Adult Signature instead', p: ['sig', 'val'], d: { sig: 'adult', val: 50 } })}
<h2>When a signature is worth paying for</h2>
<p>Without a signature, a package can be left at the address. A signature makes the handover explicit: useful for expensive items, for buyers who might dispute receipt, and for anything that must not be left unattended. For age-restricted goods that the law allows to be mailed, Adult Signature is the tool. The signature does not insure the contents: for that, see the ${h.a('usps-insurance-cost', 'insurance page')}. For letters, the ${h.a('certified-mail-cost', 'Certified Mail page')} is the right place.</p>
`,
  tool: 'insure', toolArg: { sig: 'sc', val: 50 },
  related: ['usps-insurance-cost', 'certified-mail-cost', 'return-receipt-cost', 'usps-ground-advantage-rates'],
  sources: ['dmm503', 'notice123', 'release_2027'],
});
