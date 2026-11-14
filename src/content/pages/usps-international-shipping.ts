import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const OZ2 = 32, OZ1 = 16;
const pick = ['Canada', 'Mexico', 'United Kingdom', 'Germany', 'France', 'Japan', 'Australia', 'India', 'Philippines', 'China'];
const rows = pick.map((c) => [c, K.usd(K.iq('fcpis', c, OZ1)), K.usd(K.iq('fcpis', c, OZ2)), K.usd(K.iq('pmi', c, OZ2)), K.usd(K.iq('pmi', c, OZ2, 'jan2027')), K.usd(K.iq('pmei', c, OZ2))]);
const ca = K.iq('fcpis', 'Canada', OZ2), caJ = K.iq('fcpis', 'Canada', OZ2, 'jan2027'), caP = K.iq('pmi', 'Canada', OZ2), caE = K.iq('pmei', 'Canada', OZ2);
const uk = K.iq('fcpis', 'United Kingdom', OZ2), ukP = K.iq('pmi', 'United Kingdom', OZ2), ukPJ = K.iq('pmi', 'United Kingdom', OZ2, 'jan2027');
const au4 = K.iq('fcpis', 'Australia', 64);
const flatRows = K.COUNTRIES.filter((c) => ['Canada', 'Mexico', 'United Kingdom', 'Germany', 'Japan', 'Australia'].includes(c.name)).map((c) => [c.name, K.usd(K.iflat('Flat Rate Envelopes', c)!), K.usd(K.iflat('Small Flat Rate Priced Boxes', c)!), K.usd(K.iflat('Medium Flat Rate Boxes', c)!), K.usd(K.iflat('Large Flat Rate Boxes', c)!)]);
const caMed = K.iflat('Medium Flat Rate Boxes', K.country('Canada'))!;
const caLetter = K.iletter(K.country('Canada'), 1)!, ukLetter2 = K.iletter(K.country('United Kingdom'), 2)!;

export default definePage({
  id: 'usps-international-shipping', group: 'ship', order: 8, slug: 'usps-international-shipping',
  nav: 'USPS international shipping', card: 'Price to 34 countries by weight: First-Class Package, Priority Mail and Express International.',
  title: 'USPS International Shipping 2027: Price by Country & Weight',
  description: 'USPS international shipping prices for 2027 by country and weight: First-Class Package, Priority Mail and Express International, today and from January 17.',
  h1: 'USPS international shipping: price by country and weight',
  intro: 'USPS international shipping costs for a package to 34 common destinations, by service and weight, at the Post Office today and in the proposed January 2027 prices.',
  resume: `USPS international shipping is priced by service, weight and the price group of the destination country, read in the International Mail Manual. A 2-pound package to Canada costs ${K.usd(ca)} by First-Class Package International Service at a Post Office counter, ${K.usd(caP)} by Priority Mail International and ${K.usd(caE)} by Priority Mail Express International, in the Notice 123 prices in force since October 4, 2026. To the United Kingdom, the same package costs ${K.usd(uk)} by First-Class Package International Service and ${K.usd(ukP)} by Priority Mail International. First-Class Package International Service stops at 4 pounds; above that, Priority Mail International is the lowest retail service, up to the weight limit of each country. The proposed prices of January 17, 2027 raise international prices too, with no fuel surcharge: the Postal Service said on November 12, 2026 that the surcharge does not apply to international products at this time. Canada at 2 pounds goes to ${K.usd(caJ)} by First-Class Package International Service.`,
  faqs: [
    { q: 'What is the cheapest way to ship a package internationally with USPS?', a: `Up to 4 pounds, First-Class Package International Service is almost always the lowest retail price: ${K.usd(ca)} for 2 pounds to Canada against ${K.usd(caP)} by Priority Mail International. Above 4 pounds it is not available, and Priority Mail International or one of its flat rate boxes becomes the cheapest choice. Delivery takes longer and tracking depends on the country.` },
    { q: 'Does the 11% fuel surcharge apply to international mail in 2027?', a: 'No, not at this time. The Postal Service release of November 12, 2026 says the surcharge will not affect international products for now and will be reviewed in July 2027. The January 2027 international prices shown here are the proposed figures of the price file, used as published, without any surcharge added.' },
    { q: 'Why does the price change from one country to another?', a: 'Each country belongs to a price group, from 1 to 20 for packages, listed in the International Mail Manual. Canada is group 1 and Mexico group 2 for every service; the United Kingdom, Germany, Japan and Australia have groups of their own. A group fixes one column of the price table, and each country also has its own maximum weight.' },
    { q: 'How much is a letter to another country?', a: `A First-Class Mail International letter up to 1 ounce costs ${K.usd(caLetter)} to any country in the Notice 123 letter sheet. Heavier letters depend on the group: 2 ounces to the United Kingdom cost ${K.usd(ukLetter2)}. A letter that is square, rigid or lumpy pays a nonmachinable surcharge as well.` },
  ],
  body: (h) => `
<h2>USPS international shipping prices for 10 destinations</h2>
<p>The table gives the Post Office price of a 1-pound and a 2-pound package by First-Class Package International Service, then the 2-pound price by Priority Mail International today and from January 17, 2027, and by Priority Mail Express International. Every figure is a cell of the Notice 123 retail sheets; the country is placed in its price group from the International Mail Manual.</p>
${h.table(['Country', 'First-Class Pkg 1 lb', 'First-Class Pkg 2 lb', 'Priority Intl 2 lb', `Priority Intl 2 lb ${K.JAN}`, 'Express Intl 2 lb'], rows, 'Post Office (retail) prices, Notice 123. January 2027 prices proposed, no fuel surcharge on international mail.', ['l', 'r', 'r', 'r', 'r', 'r'])}
<h2>Choosing the service for a package abroad</h2>
<p>First-Class Package International Service takes packages up to 4 pounds and is the cheapest retail service for them; a 4-pound package to Australia still costs ${K.usd(au4)}. Priority Mail International goes up to the weight limit of the country, 66 pounds for Canada and 44 for Australia, and adds flat rate envelopes and boxes. Priority Mail Express International is the fastest of the three and the dearest. Every package abroad needs a customs declaration describing its contents.</p>
${h.mini('intl', { t: 'The same 2 lb to Mexico', p: ['country', 'lb'], d: { country: 'Mexico' } })}
<h2>International flat rate boxes</h2>
<p>Priority Mail International flat rate boxes are priced by a separate list of 8 flat rate groups. The Medium box to Canada costs ${K.usd(caMed)} today whatever it weighs, up to the box limit. The 2027 file lists these boxes over the 20 package groups instead, so the site shows their price for today only.</p>
${h.table(['Country', 'Envelope', 'Small box', 'Medium box', 'Large box'], flatRows, 'Priority Mail International flat rate prices at the Post Office today, Notice 123.', ['l', 'r', 'r', 'r', 'r'])}
<p>The United Kingdom shows how fast prices climb with weight: Priority Mail International costs ${K.usd(ukP)} for 2 pounds today and ${K.usd(ukPJ)} in the proposed 2027 prices. Within the United States, compare the ${h.a('usps-rates', 'domestic USPS rates')} or ship to ${h.a('shipping-to-alaska-and-hawaii', 'Alaska and Hawaii')} at domestic prices.</p>
`,
  tool: 'intl',
  related: ['usps-rates', 'priority-mail-rates', 'usps-insurance-cost', 'shipping-to-alaska-and-hawaii'],
  sources: ['notice123', 'price_change', 'imm_price_groups', 'release_2027'],
});
