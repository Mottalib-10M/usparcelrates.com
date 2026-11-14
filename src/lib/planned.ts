/** Every page id the site is meant to have. Content tests accept links to these ids while pages are being
 *  written; the "all planned pages exist" test fails until each has its file. */
export const PLANNED_GUIDES = [
  'cost-to-ship-a-package', 'cheapest-way-to-ship-a-package', 'usps-ground-advantage-rates', 'priority-mail-rates', 'priority-mail-express-rates',
  'flat-rate-box-prices', 'media-mail-rates', 'usps-online-vs-post-office-prices',
  'usps-zone-chart', 'usps-dimensional-weight', 'usps-package-size-limits', 'shipping-to-alaska-and-hawaii', 'shipping-a-heavy-package',
  'how-much-is-a-stamp', 'how-many-stamps-do-i-need', 'postcard-stamp-price', 'large-envelope-postage',
  'certified-mail-cost', 'return-receipt-cost', 'usps-insurance-cost', 'signature-confirmation-cost',
  'usps-price-increase-2027', 'usps-fuel-surcharge', 'usps-holiday-price-change',
  // 2026-11-14: head queries measured at the Keyword Planner (10k-100k).
  'usps-postage-calculator', 'usps-rates', 'usps-international-shipping', 'usps-overnight-shipping-cost', 'usps-flat-rate-envelope',
  'forever-stamp-cost', 'book-of-stamps-cost', 'first-class-postage',
];
export const PLANNED_IDS = new Set<string>(PLANNED_GUIDES);
