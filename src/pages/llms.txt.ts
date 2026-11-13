/** llms.txt (RECETTE §21), generated from the page registry. */
import { PAGES } from '../lib/pages';
import { SITE_URL, LAST_UPDATED, SITE_NAMES } from '../data/site-config';
import { route } from '../i18n/routes';
import { GROUPS } from '../i18n/nav';
export function GET() {
  const lines = [
    `# ${SITE_NAMES.en}`, '',
    `> USPS postage for a package or a letter, read in the Postal Service's own files: Ground Advantage, Priority Mail, Priority Mail Express, flat rate boxes, Media Mail, stamps and extra services, by weight and by the zone of two ZIP Codes (official domestic zone chart effective November 1, 2026). Post Office (retail) and online (Commercial) prices of the Notice 123 file in force October 4, 2026 to January 16, 2027, and the proposed prices of January 17, 2027 with the 11% fuel surcharge (USPS filing of November 12, 2026, docket CP2027-1, under review). No UPS or FedEx prices. Independent site published by Radif Partners, not the Postal Service. Last updated ${LAST_UPDATED}.`, '',
    ...GROUPS.flatMap((g) => [`## ${g.label}`, ...PAGES.filter((p) => p.group === g.id).map((p) => `- [${p.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.card}`), '']),
    '## About', `- [How the prices are built](${SITE_URL}${route('method', 'en')})`, `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
