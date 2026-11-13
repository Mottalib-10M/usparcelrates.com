import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = (p: 'current' | 'jan2027') => {
  const q = (dims: [number, number, number], s: 'ga' | 'pm') => K.quote({ service: s, zone: 5, weightOz: 160, period: p, dims });
  return { l22: q([24, 10, 6], 'pm').fees, l30: q([32, 8, 6], 'pm').fees, l30g: q([32, 8, 6], 'ga').fees, l22g: q([24, 10, 6], 'ga').fees };
};
const now = F('current'), jan = F('jan2027');
const over = K.quote({ service: 'ga', zone: 8, weightOz: 160, dims: [40, 20, 15] });
const overPm = K.quote({ service: 'pm', zone: 8, weightOz: 160, dims: [40, 20, 15] });
const lg = K.lengthGirth(40, 20, 15);
const lgOk = K.lengthGirth(30, 18, 12);

export default definePage({
  id: 'usps-package-size-limits', group: 'size', order: 22, slug: 'usps-package-size-limits',
  nav: 'Package size limits', card: '70 pounds, 108 and 130 inches, and the fees for long or bulky boxes.',
  title: 'USPS Package Size Limits 2027: 70 lb, 108 and 130 Inches',
  description: 'USPS package size limits in 2027: 70 pounds, 108 and 130 inches of length plus girth, the oversized Ground Advantage price and the fees for long or bulky boxes.',
  h1: 'USPS package size limits and the fees for big boxes',
  intro: 'Enter the three sides of the box: the calculator checks the USPS package size limits, adds the fees for length and volume and gives the price.',
  resume: `The USPS package size limits are set in the Domestic Mail Manual. No piece may weigh more than 70 pounds, and no piece may measure more than 130 inches in length plus girth: above that it is not mailable. Length is the longest side; girth is the distance around the thickest part, twice the width plus twice the height. Most services stop at 108 inches. Between 108 and 130 inches, Notice 123 gives USPS Ground Advantage a single oversized price per zone, whatever the weight: ${K.usd(over.price)} in zone 8 at a counter today. Below these limits, fees apply to awkward boxes: ${K.usd(now.l22)} for a Priority Mail box longer than 22 inches, ${K.usd(now.l30)} above 30 inches, and a volume fee above two cubic feet. The proposed January 2027 file raises the 22-inch fee to ${K.usd(jan.l22)} and the 30-inch Priority Mail fee to ${K.usd(jan.l30)}.`,
  faqs: [
    { q: 'How do I measure length plus girth?', a: `Measure the longest side: that is the length. Then measure around the box at its thickest point, which for a rectangular box is twice the width plus twice the height: that is the girth. Add them. A box of 30 by 18 by 12 inches measures ${K.num(lgOk)} inches in length plus girth, under the 108-inch limit.` },
    { q: 'Can I mail a box over 108 inches at the Post Office?', a: 'Notice 123 prices Ground Advantage retail parcels between 108 and 130 inches at an oversized price, but section 201 of the Domestic Mail Manual lists the 130-inch limit for Ground Advantage Commercial and keeps 108 inches for other pieces. Buying the label online at Commercial prices is the route the manual clearly allows; ask the counter before you go.' },
    { q: 'What is the heaviest package USPS takes?', a: 'Seventy pounds for every domestic service, flat rate boxes included. A heavier item has to be split into two packages, each up to 70 pounds, or sent by another carrier. Some military and diplomatic addresses have lower limits. The weight is that of the packed box, padding included.' },
  ],
  body: (h) => `
<h2>USPS package size limits in one table</h2>
${h.table(['Limit', 'Rule', 'Source'], [
  ['Weight', '70 lb for every service', 'DMM 201.7.3.1'],
  ['Size, most services', '108 in of length plus girth', 'DMM 201.7.3.2'],
  ['Size, Ground Advantage Commercial', '130 in of length plus girth', 'DMM 201.7.3.2'],
  ['Not mailable', 'over 70 lb or over 130 in', 'DMM 601.1.2'],
  ['Size weight', 'over 1,728 cubic inches', 'DMM 123, 133, 113'],
  ['Length fee', 'over 22 in, larger over 30 in', 'Notice 123'],
  ['Volume fee', 'over 2 cubic feet', 'Notice 123'],
], 'Domestic Mail Manual and Notice 123, read on November 13, 2026.', ['l', 'l', 'l'])}
<h2>A box over 108 inches</h2>
<p>A box of 40 by 20 by 15 inches measures ${K.num(lg)} inches in length plus girth. Priority Mail does not take it (${overPm.available ? 'priced' : 'refused'}); Ground Advantage prices it at the oversized rate whatever its weight, ${K.usd(over.price)} in zone 8 at a counter. The oversized rate replaces the length and volume fees.</p>
${h.mini('dim', { t: 'Check your box', p: ['l', 'w', 'h'], d: { l: 30, w: 18, h: 12, lb: 10 } })}
<h2>Before you pack a large item</h2>
<p>Measure before you buy the box. A box that fits the item tightly keeps the length plus girth low, the size weight low and the fees away. If the item itself is long, such as a rolled poster or a fishing rod, compare a long thin tube with a squarer box: the tube may pay a length fee but stay under the size weight rule, while the squarer box may avoid the length fee but cross one cubic foot. The calculator prices both in a few seconds. Two items packed together are one parcel only if they are about the same size and fastened securely, as section 201 of the manual requires.</p>
<p>For boxes between one and two cubic feet, the ${h.a('usps-dimensional-weight', 'dimensional weight page')} shows how the size weight raises the price. For heavy but compact items, see ${h.a('shipping-a-heavy-package', 'heavy packages')}.</p>
`,
  tool: 'dim', toolArg: { l: 30, w: 18, h: 12, lb: 10 },
  related: ['usps-dimensional-weight', 'shipping-a-heavy-package', 'usps-ground-advantage-rates', 'cost-to-ship-a-package'],
  sources: ['dmm201', 'dmm601', 'notice123', 'dmm133'],
});
