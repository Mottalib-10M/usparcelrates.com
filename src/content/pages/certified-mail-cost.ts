import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const e = K.extras('current'), l1 = K.letter('current', 1)!, l2 = K.letter('current', 2)!;
const flat3 = K.largeEnvelope('current', 3)!;
const tot = (post: number, rr: number, cert = e.certified) => K.usd(post + cert + rr);
const rows = [
  ['1 oz letter, Certified only', tot(l1, 0)],
  ['1 oz letter, Certified + green card', tot(l1, e.return_receipt_retail)],
  ['1 oz letter, Certified + e-mail receipt', tot(l1, e.return_receipt_electronic)],
  ['2 oz letter, Certified + green card', tot(l2, e.return_receipt_retail)],
  ['3 oz large envelope, Certified + green card', tot(flat3, e.return_receipt_retail)],
  ['1 oz letter, Restricted Delivery + green card', tot(l1, e.return_receipt_retail, e.certified_restricted)],
];
const full = l1 + e.certified + e.return_receipt_retail;

export default definePage({
  id: 'certified-mail-cost', group: 'extra', order: 40, slug: 'certified-mail-cost',
  nav: 'Certified Mail cost', card: 'Postage, the Certified fee and the return receipt added up, for a letter or an envelope.',
  title: 'Certified Mail Cost 2027: USPS Fee, Postage and Green Card',
  description: 'Certified Mail cost in 2027: the USPS fee, the postage and the return receipt (green card or e-mail) added up for a letter or envelope, Restricted Delivery too.',
  h1: 'Certified Mail cost: postage, fee and receipt added up',
  intro: 'The Certified Mail cost is three amounts: postage, the Certified fee and, if you want proof of who signed, a return receipt. Enter yours.',
  resume: `Certified Mail cost at a Post Office counter is the postage plus a fee of ${K.usd(e.certified)}, read in the extra services sheet of Notice 123 on November 13, 2026. For a 1-ounce letter that makes ${K.usd(l1 + e.certified)}. Certified Mail gives the sender a mailing receipt and, on request, electronic proof that the letter was delivered or that delivery was attempted; the Postal Service keeps a record of delivery with the recipient's signature. To receive that proof yourself, add a return receipt: ${K.usd(e.return_receipt_retail)} for the green card, PS Form 3811, mailed back to you, or ${K.usd(e.return_receipt_electronic)} by e-mail. The full package for a 1-ounce letter with the green card costs ${K.usd(full)}. Restricted Delivery, which limits delivery to the addressee or an authorized agent, raises the Certified fee to ${K.usd(e.certified_restricted)}. No change to these fees was filed for January 2027. Certified Mail carries no insurance.`,
  faqs: [
    { q: 'What is the difference between Certified Mail and a return receipt?', a: 'Certified Mail gives you a mailing receipt and a delivery record kept by the Postal Service, which you can check online. A return receipt is an extra service bought with it: it sends you the evidence of delivery, who signed and when, on the green card by mail or by e-mail. Courts and agencies often ask for the receipt.' },
    { q: 'Is Certified Mail insured?', a: 'No. The Domestic Mail Manual says no insurance coverage is provided when you buy Certified Mail, except the insurance already included with Priority Mail. If the contents have value, send them by Priority Mail with Certified Mail, or by Registered Mail, which includes insurance up to the declared value.' },
    { q: 'Can I send Certified Mail without going to the Post Office?', a: 'You need the green Certified Mail label, PS Form 3800, on the piece, above the address and to the right of the return address. A mailer printing its own barcoded shipping label can use the plain green label 3800-N instead. At a counter, the clerk gives you the mailing receipt that shows the date you sent it.' },
  ],
  body: (h) => `
<h2>Certified Mail cost for common pieces</h2>
${h.table(['What you send', 'Total at the counter'], rows, 'Postage and fees of Notice 123 in force today; no change filed for January 2027.', ['l', 'r'])}
<p>The fee is the same whatever the weight; only the postage changes. A thick envelope of papers costs more because its postage does, not because of the Certified fee.</p>
${h.mini('certified', { t: 'Certified Mail for your letter', p: ['w', 'rr'] })}
<h2>What Certified Mail proves, and what it does not</h2>
<p>Certified Mail proves that you mailed something on a given date and, through the delivery record, that it was delivered or that delivery was attempted. It does not prove what was inside the envelope, and it travels like ordinary First-Class Mail, no faster. If the recipient refuses or never collects it, the record shows the attempt, which is often what a deadline requires. Keep the mailing receipt with a copy of the letter.</p>
<p>Restricted Delivery is worth its higher fee only when the letter must reach one named person, not just the address: legal notices to an individual are the usual case. Adult Signature options exist for pieces that must go to someone 21 or older.</p>
<h2>Green card or e-mail</h2>
<p>The electronic return receipt costs ${K.usd(e.return_receipt_retail - e.return_receipt_electronic)} less and arrives faster; the green card is a physical document some offices still prefer. Both show who signed and when. The ${h.a('return-receipt-cost', 'return receipt page')} compares them, and the ${h.a('signature-confirmation-cost', 'signature page')} covers packages, for which Signature Confirmation is often the better tool.</p>
`,
  tool: 'certified',
  related: ['return-receipt-cost', 'signature-confirmation-cost', 'how-much-is-a-stamp', 'large-envelope-postage'],
  sources: ['dmm503', 'notice123', 'release_2027'],
});
