import { route, type Locale } from './routes';
import { PAGES, pageById } from '../lib/pages';
import type { Group } from '../lib/page-types';
export interface NavLink { href: string; label: string } export interface NavCategory { label: string; links: NavLink[] }
const CORE: Record<string, string> = { home: 'USPS shipping cost calculator', method: 'How the prices are built', about: 'About', widget: 'Embed the calculator', contact: 'Contact', editorial: 'Editorial policy', privacy: 'Privacy', terms: 'Legal notice', cookies: 'Cookies' };
export const GROUPS: Array<{ id: Group; label: string }> = [
  { id: 'ship', label: 'Package prices' },
  { id: 'size', label: 'Zones, size and weight' },
  { id: 'mail', label: 'Stamps and letters' },
  { id: 'extra', label: 'Tracking, signature, insurance' },
  { id: 'change', label: 'January 2027 price change' },
];
export const label = (id: string, _lang?: Locale) => CORE[id] ?? pageById(id)?.nav ?? id;
const link = (id: string, lang: Locale): NavLink => ({ href: route(id, lang), label: label(id) });
const inMenu = (g: Group, lang: Locale): NavLink[] => PAGES.filter((p) => p.group === g).map((p) => link(p.id, lang));
export function navCategories(lang: Locale): NavCategory[] {
  return GROUPS.map((g) => ({ label: g.label, links: inMenu(g.id, lang) })).filter((c) => c.links.length);
}
export const navDirect = (_lang: Locale): NavLink[] => [];
export const footerColumns = (lang: Locale): NavCategory[] => [
  ...GROUPS.map((g) => ({ label: g.label, links: inMenu(g.id, lang) })).filter((c) => c.links.length),
  { label: 'This site', links: ['home', 'method', 'about', 'contact', 'editorial', 'widget', 'terms', 'privacy', 'cookies'].map((i) => link(i, lang)) },
];
/** The most asked questions, one click from any page (RECETTE §18.2). */
export const popularLinks = (lang: Locale): NavLink[] => ['how-much-is-a-stamp', 'usps-price-increase-2027', 'flat-rate-box-prices', 'cheapest-way-to-ship-a-package', 'usps-zone-chart'].filter((id) => pageById(id)).map((id) => link(id, lang));
