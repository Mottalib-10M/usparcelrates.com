import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.letter('current', 1)!;
const lrows = [1, 2, 3, 3.5].map((oz) => { const p = K.letter('current', oz)!; const n = K.stampsNeeded(p); return [`Letter up to ${oz} oz`, K.usd(p), String(n.count), K.usd(n.overpay)]; });
const frows = [1, 2, 3, 4, 6, 8, 10, 13].map((oz) => { const p = K.largeEnvelope('current', oz)!; const n = K.stampsNeeded(p); return [`Large envelope up to ${oz} oz`, K.usd(p), String(n.count), K.usd(n.overpay)]; });
const l2 = K.letter('current', 2)!, l3 = K.letter('current', 3)!, f4 = K.largeEnvelope('current', 4)!;

export default definePage({
  id: 'how-many-stamps-do-i-need', group: 'mail', order: 31, slug: 'how-many-stamps-do-i-need',
  nav: 'How many stamps do I need', card: 'Forever stamps for a letter or a large envelope by weight, and what you overpay.',
  title: 'Stamps Needed 2027: How Many Forever Stamps per Envelope',
  description: 'Stamps needed for a letter or large envelope in 2027: how many Forever stamps by weight, what you overpay, and when an envelope stops being a letter for USPS.',
  h1: 'Stamps needed for your letter or envelope',
  intro: 'How many stamps are needed depends on the weight and on whether it is a letter or a large envelope. Enter both to count your Forever stamps.',
  resume: `The number of Forever stamps needed is the postage divided by the stamp price, ${K.usd(st)}, rounded up. A letter up to 1 ounce takes one stamp. A 2-ounce letter costs ${K.usd(l2)} and a 3-ounce letter ${K.usd(l3)}: two stamps each, since each Forever stamp is worth a full 1-ounce letter and you overpay a few cents. Letters stop at 3.5 ounces; above, or if the envelope is larger than letter size, it is a large envelope, often called a flat, with its own scale from ${K.usd(K.largeEnvelope('current', 1)!)} for 1 ounce to ${K.usd(K.largeEnvelope('current', 13)!)} for 13 ounces. A 4-ounce large envelope costs ${K.usd(f4)}, or ${K.stampsNeeded(f4).count} Forever stamps. Over 13 ounces, the piece is a package and goes by Ground Advantage. Stamps cannot give change, so buying the exact postage at a counter saves the difference on heavy envelopes.`,
  faqs: [
    { q: 'How many stamps do I need for a 2-ounce letter?', a: `Two Forever stamps. A 2-ounce letter costs ${K.usd(l2)}: the 1-ounce price plus one additional ounce. Two Forever stamps are worth ${K.usd(2 * st)}, so you overpay ${K.usd(2 * st - l2)}. You could instead use one Forever stamp plus an additional-ounce stamp, if you have one, to pay the exact amount.` },
    { q: 'How many stamps does a large manila envelope need?', a: `It depends on its weight, not on its size. A large envelope pays the flat scale: ${K.usd(K.largeEnvelope('current', 1)!)} for 1 ounce, ${K.usd(f4)} for 4 ounces, so ${K.stampsNeeded(K.largeEnvelope('current', 1)!).count} Forever stamps for the lightest and ${K.stampsNeeded(f4).count} for 4 ounces. It must stay flat and flexible; if it is rigid or lumpy, it is charged as a package.` },
    { q: 'Does the size of the envelope change the stamps needed?', a: `Yes. usps.com describes letters as small envelopes up to 3.5 ounces and large envelopes as flat pieces up to 13 ounces that bend easily. The same 2 ounces cost ${K.usd(l2)} in a letter envelope and ${K.usd(K.largeEnvelope('current', 2)!)} in a large envelope. Folding the papers into a standard envelope is often the cheaper choice.` },
  ],
  body: (h) => `
<h2>Stamps needed for a letter</h2>
${h.table(['Letter', 'Postage', 'Forever stamps', 'Overpaid'], lrows, 'First-Class Mail retail prices, Notice 123.', ['l', 'r', 'r', 'r'])}
<h2>Stamps needed for a large envelope</h2>
<p>A large envelope is a flat piece bigger than a letter, up to 13 ounces. With Forever stamps alone the overpayment grows with the weight; at the counter you pay the exact postage.</p>
${h.table(['Large envelope', 'Postage', 'Forever stamps', 'Overpaid'], frows, 'First-Class Mail retail prices, Notice 123.', ['l', 'r', 'r', 'r'])}
${h.mini('stamps', { t: 'Stamps for another envelope', p: ['what', 'w'], d: { what: 'flat', w: 3 } })}
<h2>When it is no longer a letter</h2>
<p>Weigh before you stamp. A kitchen scale that reads in ounces is enough; round up, since 1.1 ounces pays the 2-ounce price. If you send the same envelope often, weigh one and keep the count of stamps on a note. The counter at a Post Office weighs and prices the piece for you and sells the exact postage, which avoids overpaying on large envelopes, where the gap between the price and a whole number of Forever stamps can reach several dimes.</p>
<p>A letter over 3.5 ounces pays the large envelope scale. A square, rigid or lumpy letter pays the nonmachinable surcharge, see the ${h.a('how-much-is-a-stamp', 'stamp page')}. Anything over 13 ounces is a package, see ${h.a('usps-ground-advantage-rates', 'Ground Advantage rates')}.</p>
`,
  tool: 'stamps', toolArg: { w: 2 },
  related: ['how-much-is-a-stamp', 'large-envelope-postage', 'postcard-stamp-price', 'usps-ground-advantage-rates'],
  sources: ['notice123', 'services', 'business_prices'],
});
