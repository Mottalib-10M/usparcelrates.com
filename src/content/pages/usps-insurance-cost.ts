import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const vals = [50, 100, 150, 250, 500, 600, 1000, 2500, 5000];
const rows = vals.map((v) => [K.usd(v).replace('.00', ''), K.usd(K.insuranceFee('current', v)), v <= 100 ? 'nothing to buy with Priority Mail or Ground Advantage' : K.usd(K.insuranceFee('current', v))]);
const i250 = K.insuranceFee('current', 250), i1000 = K.insuranceFee('current', 1000), i5000 = K.insuranceFee('current', 5000);
const per = K.extras('current').insurance_per_100;
const pm2 = K.q('pm', 5, 32);

export default definePage({
  id: 'usps-insurance-cost', group: 'extra', order: 42, slug: 'usps-insurance-cost',
  nav: 'Shipping insurance cost', card: 'The $100 already included, the fee by declared value up to $5,000, and Media Mail.',
  title: 'USPS Insurance Cost 2027: Fee by Declared Value, to $5,000',
  description: 'USPS insurance cost in 2027: the $100 included with Priority Mail and Ground Advantage, the fee by declared value up to $5,000, and what Media Mail lacks.',
  h1: 'USPS insurance cost by declared value',
  intro: 'USPS insurance cost depends on the value you declare. Enter it and the service: the calculator subtracts the $100 already included where it applies.',
  resume: `USPS insurance cost is set by the declared value of the contents, in the extra services sheet of Notice 123 read on November 13, 2026. Priority Mail Express, Priority Mail and Ground Advantage already include coverage up to $100, as the Domestic Mail Manual states, so a package worth $100 or less needs nothing more. Above that, the fee follows the full value declared: ${K.usd(i250)} for $250, ${K.usd(i1000)} for $1,000, up to ${K.usd(i5000)} for $5,000, the maximum. From $600, each extra $100 or fraction adds ${K.usd(per)}. Media Mail includes no insurance, so any value has to be insured from the first dollar. Insurance covers loss, damage or missing contents, with a claim filed with the Postal Service. The January 2027 file keeps the same insurance fees. A 2-pound Priority Mail package to zone 5 worth $250 thus costs ${K.usd(pm2 + i250)} at a counter, postage and insurance together.`,
  faqs: [
    { q: 'Do I need to buy insurance for a $100 item?', a: 'Not with Priority Mail Express, Priority Mail or Ground Advantage: each includes coverage up to $100 against loss or damage. Buy insurance only for the value above that, and declare the full value. With Media Mail, which includes no coverage, a $100 item needs insurance bought at the counter or online.' },
    { q: 'What is the most I can insure a USPS package for?', a: `$5,000 for merchandise, the maximum of the domestic insurance table, for a fee of ${K.usd(i5000)}. For more valuable items, Registered Mail accepts declared values up to $50,000 with insurance built into its fee, and a system of receipts follows the piece from acceptance to delivery. Its fee and conditions are in section 503 of the Domestic Mail Manual.` },
    { q: 'Does insurance cover a package that arrives late?', a: 'No. Insurance covers loss, damage and missing contents. Delays are not covered, except the money-back guarantee of Priority Mail Express, which refunds postage when the guaranteed date is missed. Keep the mailing receipt and a proof of value, such as an invoice, for any claim.' },
  ],
  body: (h) => `
<h2>USPS insurance cost by declared value</h2>
${h.table(['Declared value', 'Fee with Media Mail', 'Fee with Priority Mail or Ground Advantage'], rows, 'Insurance for merchandise, Notice 123, in force today; same fees in the January 2027 file.', ['l', 'r', 'r'])}
<p>The fee is charged on the whole value declared, not only the part above $100. A $150 item therefore pays the fee of the $100.01 to $200 band, even though $100 of it was already covered.</p>
${h.mini('insure', { t: 'Insurance for your package', p: ['val', 'svc'] })}
<h2>Which service to insure</h2>
<p>Because Priority Mail and Ground Advantage include the first $100, the cheapest insured shipment is often Ground Advantage plus the fee for the declared value. Media Mail is cheap for books, but a rare edition worth $300 pays the insurance fee on the full amount with nothing included, which narrows the saving. Priority Mail Express also includes $100 and adds a guaranteed date, which matters for time-sensitive valuables.</p>
<h2>Insure the value, not the price paid</h2>
<p>Declare what it would cost to replace the item, and keep the proof: a receipt, an invoice or a listing. Pack it to survive handling: the Domestic Mail Manual asks for cushioning around fragile items and contents that cannot shift. For proof that someone received the package, add a signature, priced on the ${h.a('signature-confirmation-cost', 'signature page')}; for the postage itself, see ${h.a('priority-mail-rates', 'Priority Mail rates')}.</p>
`,
  tool: 'insure',
  related: ['signature-confirmation-cost', 'priority-mail-rates', 'media-mail-rates', 'certified-mail-cost'],
  sources: ['dmm503', 'notice123', 'services', 'release_2027'],
});
