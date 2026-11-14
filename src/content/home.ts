/** Text of the home page (the pillar). Every price comes from the kit. */
import { KIT as K } from '../lib/kit';
import type { FAQ, Helpers } from '../lib/page-types';

const EX = K.EX, OZ2 = EX.lb * 16;
const Z = K.zone(EX.from, EX.to);
const ga = K.q('ga', Z, OZ2), pm = K.q('pm', Z, OZ2), pme = K.q('pme', Z, OZ2);
const gaO = K.q('ga', Z, OZ2, 'current', 'comm'), pmO = K.q('pm', Z, OZ2, 'current', 'comm');
const gaJ = K.q('ga', Z, OZ2, 'jan2027'), pmJ = K.q('pm', Z, OZ2, 'jan2027');
const stamp = K.letter('current', 1)!;
const ga1 = K.q('ga', 1, 16), ga8 = K.q('ga', 8, 16), pm1 = K.q('pm', 1, 16), pm8 = K.q('pm', 8, 16);
const med = K.flat('pm_medium'), medJ = K.flat('pm_medium', 'jan2027'), medO = K.flat('pm_medium', 'current', 'comm');
const small = K.flat('pm_small'), large = K.flat('pm_large'), env = K.flat('pm_env');
const book = K.media(OZ2);
const e = K.extras('current');
const gaLight = K.q('ga', 8, 8), gaLight1 = K.q('ga', 1, 8);
const hGa = K.history({ service: 'ga', zone: 5, weightOz: 80 }), hPm = K.history({ service: 'pm', zone: 5, weightOz: 80 });
const chi = K.zone('60601', '30303'), hou = K.zone('77002', '75201');

/** The value sentence (RECETTE §2.4), shown on the home page, the About page and the method page. */
export const VALUE = `The Postal Service publishes its prices as a spreadsheet of several dozen sheets and its zones as a chart per ZIP Code prefix; carrier calculators ask you to sign in, and price pages online quote last year or forget the fuel surcharge. This site reads both files and answers in one screen: what a package of this weight costs from your ZIP Code to theirs, at the Post Office and with an online label, today and from January 17, 2027, with the proposed 11% fuel surcharge counted.`;

export const HOME = {
  title: 'USPS Shipping Cost Calculator 2027: Price by ZIP Code',
  description: 'USPS shipping cost calculator for 2027: postage by weight and ZIP Code for Ground Advantage, Priority Mail and Express, at the Post Office and online.',
  h1: 'USPS shipping cost calculator: what your package costs',
  /** The answer in one sentence, one figure. */
  answer: `The USPS shipping cost of a 2-pound package from New York to Los Angeles is ${K.usd(gaO)} by Ground Advantage with a label bought online today, or ${K.usd(ga)} at the Post Office counter. A stamp for a letter is ${K.usd(stamp)}. Type your two ZIP Codes and the weight for your own price.`,
  resume: `The USPS shipping cost of a package depends on three things: the service, the weight rounded up to the next price step, and the zone, a distance band from 1 (nearby) to 8 (across the country), plus a zone 9 for some Pacific territories, that the Postal Service reads in its zone chart from the first three digits of each ZIP Code. A 1-pound package by Ground Advantage costs ${K.usd(ga1)} at a Post Office in zone 1 and ${K.usd(ga8)} in zone 8; by Priority Mail, ${K.usd(pm1)} and ${K.usd(pm8)}. These are the retail prices of Notice 123 in force from October 4, 2026 to January 16, 2027, which already include two time-limited increases, the 8% of April 2026 and the holiday prices of October 2026 (the dates are in the box below). A label bought online on usps.com is charged the lower Commercial price. On January 17, 2027 the Postal Service plans new base prices plus an 11% fuel surcharge that replaces the 8%: the filing is under review by the Postal Regulatory Commission, so the 2027 figures here are proposed, not final. Stamps do not change: a Forever stamp stays at ${K.usd(stamp)}.`,
  faqs: [
    { q: 'Why is the online price lower than the Post Office price?', a: `The Postal Service sells two price lists. Retail prices apply at a counter. Commercial prices apply to labels paid online, on usps.com with Click-N-Ship, with no volume required. For the 2-pound example, Priority Mail costs ${K.usd(pm)} at the counter and ${K.usd(pmO)} online. Both come from the same Notice 123 file.` } as FAQ,
    { q: 'Is this site the Postal Service?', a: 'No. US Parcel Rates is an independent site published by Radif Partners. It is not the United States Postal Service, sells no label and asks for no account, name or e-mail. It reads the price files and the zone chart the Postal Service publishes and shows them with the date they were read. The price at the counter or at checkout is the one you pay.' },
    { q: 'Are the January 2027 prices final?', a: `Not yet. The Postal Service filed them with the Postal Regulatory Commission on November 12, 2026 (docket CP2027-1) for January 17, 2027. The Commission reviews the filing before that date. The calculator shows the proposed base price plus the ${K.pct(K.SURCHARGE)} fuel surcharge announced the same day. If the Commission or the Postal Service changes them, this site rereads the file; nothing updates by itself.` },
    { q: 'Does the calculator include UPS and FedEx?', a: 'No. UPS and FedEx publish their list prices in pages that refuse automated reading, and their real price depends on your account and on surcharges that change each week. Rather than copy figures it could not check, this site covers the Postal Service only. Compare by asking each carrier for a quote with the same weight, size and ZIP Codes.' },
    { q: 'How do I find the zone of my package?', a: `Type the two ZIP Codes: the calculator reads the zone in the official domestic zone chart, effective November 1, 2026. The zone depends on the first three digits of the sender's ZIP Code and of the recipient's. New York to Los Angeles is zone ${Z}; Chicago to Atlanta is zone ${chi}; Houston to Dallas is zone ${hou}. Zone 9 covers some Pacific territories.` },
    { q: 'What weight should I enter for a package?', a: 'The weight of the package ready to mail: contents, box, padding and tape. Weigh it on a kitchen or bathroom scale and round up. The Postal Service charges Priority Mail by the pound, any fraction counting as a full pound, and Ground Advantage under 1 pound by steps of 4, 8, 12 and 15.999 ounces. A box larger than one cubic foot can also be charged by its size.' },
  ] as FAQ[],
  /** Right under the calculator: what to have at hand. */
  start: (h: Helpers) => `
<h2>What you need: two ZIP Codes, a weight, sometimes a size</h2>
<p>The calculator needs the ZIP Code you mail from, the ZIP Code of the recipient and the weight of the packed box. That is all the Postal Service uses for a box smaller than one cubic foot (1,728 cubic inches, for example 12 by 12 by 12). For a larger box, open “More details” and enter the length, width and height in inches: above one cubic foot, the price is charged on the larger of the real weight and the size weight. The ${h.a('usps-dimensional-weight', 'dimensional weight page')} explains the rule.</p>
<p>The result shows the cheapest price first: a label bought online, the Commercial price you pay on usps.com with Click-N-Ship. The Post Office counter price, the retail price, sits right beside it. Every other price, including the proposed prices from January 17, 2027 with the 11% fuel surcharge, is one tap away under “All prices”.</p>
`,
  /** Open sections. */
  guide: (h: Helpers) => `
<h2>USPS shipping cost by service: three speeds, three prices</h2>
<p><strong>USPS Ground Advantage</strong> is the cheapest way to send most packages, with an expected delivery of 2 to 5 days. On the 2-pound example from New York to Los Angeles it costs ${K.usd(ga)} at the Post Office. Under 1 pound it is charged by the ounce step: ${K.usd(gaLight1)} for 8 ounces in zone 1, ${K.usd(gaLight)} in zone 8. Details on the ${h.a('usps-ground-advantage-rates', 'Ground Advantage page')}.</p>
<p><strong>Priority Mail</strong> arrives in 2 to 3 days and costs ${K.usd(pm)} for the same package. It also sells flat rate boxes: one price whatever the weight up to 70 pounds and whatever the distance. The Medium Flat Rate Box is ${K.usd(med)} at a counter today, ${K.usd(medO)} online. The ${h.a('priority-mail-rates', 'Priority Mail page')} and the ${h.a('flat-rate-box-prices', 'flat rate page')} compare them.</p>
<p><strong>Priority Mail Express</strong> comes with a delivery date guaranteed in 1 to 3 days and a refund if it is missed, at ${K.usd(pme)} for the example: it is the USPS answer to ${h.a('usps-overnight-shipping-cost', 'overnight shipping')}. <strong>Media Mail</strong>, for books and recorded media only, costs ${K.usd(book)} for 2 pounds whatever the distance, but takes 2 to 8 days.</p>
${h.mini('flat', { t: 'Heavy package? Flat rate box or price by weight', p: ['item', 'lb'], d: { lb: 10 } })}
<p>Every service on one card is on the ${h.a('usps-rates', 'USPS rates page')}; letters, large envelopes and packages share one form in the ${h.a('usps-postage-calculator', 'postage calculator')}; packages abroad are priced by country on the ${h.a('usps-international-shipping', 'international shipping page')}, and documents in a ${h.a('usps-flat-rate-envelope', 'flat rate envelope')} cost the same at any distance.</p>
`,
  /** Folded sections (<details>, text kept in the HTML). */
  folds: [
    { id: 'zones', title: 'How zones work, and why zone 8 costs more', html: (h: Helpers) => `
<p>Zones measure distance from the sender's 3-digit ZIP Code prefix. Zone 1 is local; zone 8 is across the country; zone 9 covers some Pacific territories. The official chart lists ${K.num(K.ORIGINS)} origin prefixes. It is not quite symmetric: in ${K.pct(K.SYMMETRIC ?? 0, 1)} of pairs, the zone from A to B equals the zone from B to A, so always start from the sender.</p>
<p>A 1-pound Priority Mail package costs ${K.usd(pm1)} in zone 1 and ${K.usd(pm8)} in zone 8, a gap of ${K.usd(pm8 - pm1)}. A flat rate box ignores the zone, which is why it pays for heavy packages going far. The ${h.a('usps-zone-chart', 'zone page')} gives the zone of any two ZIP Codes.</p>
` },
    { id: 'flat', title: 'Flat rate boxes: when they win', html: (h: Helpers) => `
<p>Today at the Post Office the Flat Rate Envelope costs ${K.usd(env)}, the Small Flat Rate Box ${K.usd(small)}, the Medium ${K.usd(med)} and the Large ${K.usd(large)}. From January 17, 2027 the Medium box would cost ${K.usd(medJ)} with the fuel surcharge. The box wins when the package is heavy and goes far; for a light package to a near zone, paying by weight is cheaper. The ${h.a('flat-rate-box-prices', 'flat rate calculator')} compares both for your ZIP Codes.</p>
` },
    { id: 'letters', title: 'Stamps, letters and extra services', html: (h: Helpers) => `
<p>A Forever stamp mails a 1-ounce letter and costs ${K.usd(stamp)}; each extra ounce adds ${K.usd(K.additionalOunce('current'))}. A postcard stamp is ${K.usd(K.postcard('current'))}. No change was filed for January 2027. The ${h.a('how-much-is-a-stamp', 'stamp page')} counts the stamps for any letter or large envelope; a ${h.a('book-of-stamps-cost', 'book of 20 stamps')} costs ${K.usd(Math.round(stamp * 2000) / 100)}, and the ${h.a('forever-stamp-cost', 'Forever stamp history')} and ${h.a('first-class-postage', 'First Class postage by ounce')} have their own pages.</p>
<p>Extra services add a fee to the postage: Certified Mail ${K.usd(e.certified)}, a paper return receipt ${K.usd(e.return_receipt_retail)}, Signature Confirmation ${K.usd(e.signature_confirmation_retail)} at a counter. Priority Mail, Priority Mail Express and Ground Advantage include $100 of insurance; above that, the fee follows the declared value. See the ${h.a('certified-mail-cost', 'Certified Mail')} and ${h.a('usps-insurance-cost', 'insurance')} pages.</p>
` },
    { id: 'change', title: 'What the 2027 filing changes, service by service', html: (h: Helpers) => `
<p>On a 5-pound package in zone 5, Ground Advantage at the counter was ${K.usd(hGa.jul.price)} in July 2026, is ${K.usd(hGa.now.price)} today and would be ${K.usd(hGa.jan.price)} from January 17 (${K.chg(hGa.vsJul)} over six months). Priority Mail goes from ${K.usd(hPm.jul.price)} to ${K.usd(hPm.now.price)} and then ${K.usd(hPm.jan.price)}. Priority Mail Express rises more in far zones. The ${h.a('usps-fuel-surcharge', 'fuel surcharge page')} explains the 11% and the ${h.a('usps-holiday-price-change', 'holiday price page')} the prices in force until January 16.</p>
` },
  ],
  sources: ['release_2027', 'release_2026_03', 'price_change', 'notice123', 'zone_chart', 'dmm123', 'dmm133', 'services', 'prc_filings'],
};
