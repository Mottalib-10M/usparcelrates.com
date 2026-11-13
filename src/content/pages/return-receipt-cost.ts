import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const e = K.extras('current'), l1 = K.letter('current', 1)!;
const paper = l1 + e.certified + e.return_receipt_retail, mail = l1 + e.certified + e.return_receipt_electronic;
const n = 20;

export default definePage({
  id: 'return-receipt-cost', group: 'extra', order: 41, slug: 'return-receipt-cost',
  nav: 'Return receipt cost', card: 'The green card or the e-mail receipt: price, what it proves, and for how many letters.',
  title: 'Return Receipt Cost 2027: USPS Green Card or Electronic',
  description: 'Return receipt cost in 2027: the USPS green card (PS Form 3811) or the electronic receipt by e-mail, what each proves, and the total with Certified Mail.',
  h1: 'Return receipt cost: green card or e-mail',
  intro: 'A return receipt cost depends on how you want the proof: the green card by mail or an e-mail. Pick one to see the total with Certified Mail.',
  resume: `A return receipt is the proof of delivery the Postal Service sends back to the sender: who received the piece, on what date, and the delivery address. In the extra services sheet of Notice 123 read on November 13, 2026, the return receipt costs ${K.usd(e.return_receipt_retail)} when you ask at the counter for the green card, PS Form 3811, returned by mail, and ${K.usd(e.return_receipt_electronic)} when you choose to receive it electronically, by e-mail. It is sold with another extra service, usually Certified Mail at ${K.usd(e.certified)}. For a 1-ounce letter, the total is ${K.usd(paper)} with the green card and ${K.usd(mail)} with the e-mail receipt. A return receipt must be bought at the time of mailing, and the piece needs a full return address. No change to these fees appears in the January 2027 filing.`,
  faqs: [
    { q: 'Is an electronic return receipt as good as the green card?', a: 'It gives the same evidence: who received the piece, the date of delivery and the delivery address, under section 503 of the Domestic Mail Manual. It arrives by e-mail and can be printed. If a rule or a contract asks for a particular form of proof, read it before you choose between the card and the e-mail.' },
    { q: 'Can I buy a return receipt after mailing?', a: 'Not a return receipt: the manual says it is purchased at the time of mailing. For Certified Mail, the Postal Service keeps a delivery record with the recipient’s signature, and you can follow the delivery status with the tracking number. Ask for the receipt when you mail.' },
    { q: 'Do I need a return receipt for every letter?', a: `Only when you need proof of who received it. For ${n} letters sent with Certified Mail and the green card, the receipts alone add ${K.usd(n * e.return_receipt_retail)}; by e-mail ${K.usd(n * e.return_receipt_electronic)}. Certified Mail alone already gives you the mailing receipt and an online delivery status.` },
  ],
  body: (h) => `
<h2>Return receipt cost with Certified Mail</h2>
${h.table(['Piece', 'Green card', 'E-mail receipt'], [['1 oz letter, Certified Mail', K.usd(paper), K.usd(mail)], ['Return receipt fee alone', K.usd(e.return_receipt_retail), K.usd(e.return_receipt_electronic)], [`${n} letters, receipts only`, K.usd(n * e.return_receipt_retail), K.usd(n * e.return_receipt_electronic)]], 'Notice 123, extra services, in force today.', ['l', 'r', 'r'])}
<p>The fee does not depend on the weight or the distance. It is added once per piece, on top of postage and the Certified Mail fee.</p>
${h.mini('certified', { t: 'Total with your return receipt', p: ['rr'], d: { rr: 'email' } })}
<h2>Filling in the green card</h2>
<p>For the paper receipt, you fill in PS Form 3811 with your address, since the card travels back to you once signed at delivery, and attach it to the piece. The electronic receipt needs only your e-mail address at the time of mailing, and it can be forwarded or printed as many times as needed. Either way, a complete return address must be printed on the piece itself.</p>
<h2>When a receipt is worth it</h2>
<p>Notices to a landlord or a tenant, letters to a court, disputes with a company: whenever someone may later say they never received the letter, the signed receipt answers. For a parcel worth money, insurance and a signature matter more; see the ${h.a('usps-insurance-cost', 'insurance page')}. The ${h.a('certified-mail-cost', 'Certified Mail page')} gives the totals for heavier envelopes.</p>
`,
  tool: 'certified', toolArg: { rr: 'email' },
  related: ['certified-mail-cost', 'signature-confirmation-cost', 'usps-insurance-cost', 'how-much-is-a-stamp'],
  sources: ['dmm503', 'notice123', 'release_2027'],
});
