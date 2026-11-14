/**
 * Price of the first ounce of a First-Class Mail letter, the value of a Forever stamp, from the Postal Service
 * Historian's chart "Rates for Domestic Letters Since 1863" (about.usps.com, page dated August 2026), read on
 * 2026-11-14. Copied as listed, in cents, from 2007 (the 41-cent change) to the last row.
 */
export const STAMP_HISTORY: Array<{ date: string; cents: number }> = [
  { date: '2007-05-14', cents: 41 },
  { date: '2008-05-12', cents: 42 },
  { date: '2009-05-11', cents: 44 },
  { date: '2012-01-22', cents: 45 },
  { date: '2013-01-27', cents: 46 },
  { date: '2014-01-26', cents: 49 },
  { date: '2016-04-10', cents: 47 },
  { date: '2017-01-22', cents: 49 },
  { date: '2018-01-21', cents: 50 },
  { date: '2019-01-27', cents: 55 },
  { date: '2021-08-29', cents: 58 },
  { date: '2022-07-10', cents: 60 },
  { date: '2023-01-22', cents: 63 },
  { date: '2023-07-09', cents: 66 },
  { date: '2024-01-21', cents: 68 },
  { date: '2024-07-14', cents: 73 },
  { date: '2025-07-13', cents: 78 },
  { date: '2026-07-12', cents: 82 },
];
/** Stamp formats of the U.S. Flag Forever stamp issued June 9, 2026 (Postal Bulletin, item numbers). */
export const STAMP_FORMATS: Array<{ key: string; label: string; count: number }> = [
  { key: 'booklet', label: 'Double-sided booklet of 20', count: 20 },
  { key: 'pane', label: 'Pane (sheet) of 20', count: 20 },
  { key: 'coil100', label: 'Coil of 100', count: 100 },
  { key: 'coil3000', label: 'Coil of 3,000', count: 3000 },
  { key: 'coil10000', label: 'Coil of 10,000', count: 10000 },
];
