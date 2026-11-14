/**
 * Country price groups of the International Mail Manual, "Country Price Groups and Weight Limits"
 * (pe.usps.com/text/imm/immpg.htm), read on 2026-11-14 for the 34 destinations below. Copied as listed, never guessed:
 *   pmei / pmi       price group of Priority Mail Express International / Priority Mail International (1 to 20)
 *   pmeiMax / pmiMax maximum weight in pounds for that country
 *   pmeiFlat / pmiFlat price group of the flat rate envelopes and boxes (1 to 8)
 *   fcmi             First-Class Mail International group (letters, large envelopes, postcards)
 *   fcpis            First-Class Package International Service group (1 to 20)
 * A country missing here is not priced by the site: the reader is sent to the Postal Service's own lookup.
 */
export interface Country { name: string; pmei: number; pmeiMax: number; pmeiFlat: number; pmi: number; pmiMax: number; pmiFlat: number; fcmi: number; fcpis: number }
const C = (name: string, pmei: number, pmeiMax: number, pmeiFlat: number, pmi: number, pmiMax: number, pmiFlat: number, fcmi: number, fcpis: number): Country => ({ name, pmei, pmeiMax, pmeiFlat, pmi, pmiMax, pmiFlat, fcmi, fcpis });

export const COUNTRIES: Country[] = [
  C('Australia', 12, 44, 6, 12, 44, 6, 3, 12),
  C('Brazil', 13, 66, 2, 13, 66, 2, 9, 13),
  C('Canada', 1, 66, 1, 1, 66, 1, 1, 1),
  C('China', 14, 66, 3, 14, 66, 3, 3, 14),
  C('Colombia', 10, 44, 2, 10, 66, 2, 9, 6),
  C('Dominican Republic', 11, 66, 2, 11, 44, 2, 9, 6),
  C('El Salvador', 11, 66, 8, 11, 44, 8, 9, 6),
  C('France', 15, 66, 4, 15, 66, 4, 5, 15),
  C('Germany', 16, 66, 4, 16, 70, 4, 5, 16),
  C('Ghana', 9, 66, 8, 9, 66, 8, 7, 5),
  C('Guatemala', 10, 66, 8, 10, 44, 8, 9, 6),
  C('Haiti', 10, 66, 8, 10, 55, 8, 9, 6),
  C('Hong Kong', 18, 66, 3, 18, 66, 3, 3, 18),
  C('India', 6, 70, 3, 6, 44, 3, 6, 10),
  C('Ireland', 4, 66, 4, 4, 66, 4, 5, 9),
  C('Israel', 4, 44, 4, 4, 44, 4, 5, 8),
  C('Italy', 4, 66, 4, 4, 66, 4, 5, 9),
  C('Jamaica', 11, 66, 8, 11, 22, 8, 9, 6),
  C('Japan', 17, 66, 3, 17, 66, 3, 3, 17),
  C('Mexico', 2, 70, 2, 2, 70, 2, 2, 2),
  C('Netherlands', 4, 66, 4, 4, 66, 4, 5, 9),
  C('New Zealand', 12, 66, 6, 12, 66, 6, 6, 12),
  C('Nigeria', 9, 66, 8, 9, 66, 8, 7, 5),
  C('Pakistan', 6, 66, 8, 6, 70, 8, 6, 4),
  C('Philippines', 6, 44, 3, 6, 44, 3, 6, 4),
  C('Poland', 3, 44, 4, 3, 44, 4, 4, 7),
  C('South Africa', 9, 66, 8, 9, 66, 8, 7, 5),
  C('South Korea', 18, 66, 3, 18, 44, 3, 3, 18),
  C('Spain', 4, 66, 4, 4, 44, 4, 5, 8),
  C('Switzerland', 5, 66, 4, 5, 66, 4, 5, 9),
  C('Taiwan', 7, 33, 3, 7, 44, 3, 6, 10),
  C('United Arab Emirates', 7, 66, 8, 7, 66, 8, 8, 10),
  C('United Kingdom', 20, 66, 5, 20, 66, 5, 5, 20),
  C('Vietnam', 6, 66, 3, 6, 70, 3, 6, 4),
];
export const countryByName = (n: string) => COUNTRIES.find((c) => c.name === n);
