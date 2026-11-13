import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const boxes: Array<[number, number, number, number]> = [[12, 12, 12, 3], [12, 12, 13, 3], [16, 12, 10, 4], [18, 14, 12, 5], [20, 16, 14, 8], [24, 18, 18, 10]];
const rows = boxes.map(([l, w, h, lb]) => {
  const d = K.dimWeightLb(l, w, h); const billed = Math.max(d ?? 0, lb);
  const pm = K.quote({ service: 'pm', zone: 8, weightOz: lb * 16, dims: [l, w, h] }).price;
  return [`${l} x ${w} x ${h} in, ${lb} lb`, K.num(l * w * h), d ? `${d} lb` : 'none', `${billed} lb`, K.usd(pm)];
});
const ex = K.quote({ service: 'pm', zone: 8, weightOz: 80, dims: [18, 14, 12] }), ex0 = K.quote({ service: 'pm', zone: 8, weightOz: 80 });
const exD = K.dimWeightLb(18, 14, 12)!;
const g = K.quote({ service: 'ga', zone: 8, weightOz: 80, dims: [18, 14, 12] });

export default definePage({
  id: 'usps-dimensional-weight', group: 'size', order: 21, slug: 'usps-dimensional-weight',
  nav: 'Dimensional weight', card: 'When the size of the box, not the scale, sets the price: the 1,728 and 139 rule.',
  title: 'USPS Dimensional Weight 2027: When Box Size Sets the Price',
  description: 'USPS dimensional weight in 2027: when a box over one cubic foot is charged by size, the 139 divisor, and your box priced by Priority Mail or Ground Advantage.',
  h1: 'USPS dimensional weight: when the box size sets the price',
  intro: 'Enter the length, width and height of the box and its real weight: the calculator applies the USPS dimensional weight rule and prices the box in your zone.',
  resume: `USPS dimensional weight applies to Priority Mail, Priority Mail Express and Ground Advantage parcels larger than one cubic foot, 1,728 cubic inches, in every zone. The Domestic Mail Manual rounds each side up to a whole inch, multiplies length by width by height, divides the result by 139 and rounds up to the next pound; the Postal Service then charges the higher of that size weight and the real weight, never more than the 70-pound price. A box of 18 by 14 by 12 inches holds 3,024 cubic inches: its dimensional weight is ${exD} pounds. Filled with 5 pounds of pillows and sent by Priority Mail to zone 8, it costs ${K.usd(ex.price)} at a counter, against ${K.usd(ex0.price)} if only the scale counted. Ground Advantage charges ${K.usd(g.price)} for the same box. A box of exactly 12 by 12 by 12 inches stays under the rule. Light, bulky items are where the rule bites: the smaller the box, the lower the price.`,
  faqs: [
    { q: 'How do I calculate USPS dimensional weight?', a: 'Measure the box in inches, rounding each side up to the next whole inch. Multiply length, width and height. If the result is over 1,728 cubic inches, divide it by 139 and round up to a whole pound: that is the dimensional weight. The price is the higher of the dimensional weight and the real weight, up to the 70-pound price.' },
    { q: 'Do flat rate boxes have dimensional weight?', a: 'No. A Priority Mail flat rate box or envelope costs its flat price whatever it weighs up to 70 pounds and whatever its zone, so neither the real weight nor the size weight changes it. That is one reason a dense, heavy item travelling far can be cheaper in a flat rate box.' },
    { q: 'Does dimensional weight apply to small boxes?', a: 'No. Up to one cubic foot, 1,728 cubic inches, the Postal Service charges the real weight only. A 12 by 12 by 12 inch box is exactly one cubic foot and stays under the rule; adding one inch to any side puts it over. Long thin boxes can also pay length fees above 22 inches.' },
  ],
  body: (h) => `
<h2>USPS dimensional weight for common box sizes</h2>
<p>The table prices a few boxes by Priority Mail in zone 8 at a counter. The billed weight is the higher of the size weight and the real weight. Note the jump between the 12-inch cube and the same cube one inch taller.</p>
${h.table(['Box and real weight', 'Cubic inches', 'Size weight', 'Billed weight', 'Priority Mail, zone 8'], rows, 'Rule of the Domestic Mail Manual (sections 113, 123, 133); Notice 123 prices in force today.', ['l', 'r', 'r', 'r', 'r'])}
<h2>Fees on top of the size weight</h2>
<p>Two more charges can apply to a large box. A parcel longer than 22 inches pays a length fee, larger above 30 inches; a parcel over two cubic feet pays a volume fee. The calculator adds them when you enter the size. Above 108 inches of length plus girth, the ${h.a('usps-package-size-limits', 'size limits page')} explains what is still accepted.</p>
${h.mini('dim', { t: 'Dimensional weight of another box', p: ['l', 'w', 'h'], d: { l: 16, w: 12, h: 10, lb: 4 } })}
<p>To bring the price down, pick a box that just fits the item and measure it after closing, since a bulging side counts. Round each side up to the next whole inch, as the manual asks, or check a ${h.a('flat-rate-box-prices', 'flat rate box')} if the item is dense. The ${h.a('cost-to-ship-a-package', 'shipping cost calculator')} also takes the size under More details.</p>
`,
  tool: 'dim',
  related: ['usps-package-size-limits', 'flat-rate-box-prices', 'cost-to-ship-a-package', 'shipping-a-heavy-package'],
  sources: ['dmm123', 'dmm133', 'dmm113', 'notice123'],
});
