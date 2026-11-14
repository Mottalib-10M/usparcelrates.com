#!/usr/bin/env python3
"""Builds src/data/intl.json: the international retail prices of the same three USPS Notice 123 files as
build-rates.py (data-raw/*.xlsx, Postal Explorer, read on 2026-11-13).

Usage: python3 -I scripts/data/build-intl.py

Sheets read, retail prices only (what a Post Office counter charges):
  - "FCMI Ltrs" / "FCMI Flats": First-Class Mail International letters, postcards and large envelopes,
    four columns (price group 1, 2, 3-5, 6-9);
  - "FCPIS Retail": First-Class Package International Service, by ounce step up to 64 oz, price groups 1-20;
  - "PMI Retail": Priority Mail International, flat rate envelopes and boxes, then by pound, price groups 1-20;
  - "PMEI Retail": Priority Mail Express International, flat rate envelope, then 0.5 lb and by pound, 1-20.
Cells are read by column position ("-" and empty cells = no price). Nothing is typed here.
The USPS release of November 12, 2026 says the 11% fuel surcharge "will not impact international products at
this time": the January 2027 international prices are used as published, with no surcharge.
"""
import json, os
import openpyxl

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
RAW = os.path.join(ROOT, 'data-raw')
OUT = os.path.join(ROOT, 'src', 'data', 'intl.json')
# July 2026 international prices equal those of October 2026 (no international holiday change): not kept.
FILES = {'current': 'oct2026-notice123.xlsx', 'jan2027': 'jan2027-notice123.xlsx'}


def rows_of(wb, title):
    ws = next(w for w in wb.worksheets if w.title.strip() == title)
    return [list(r) for r in ws.iter_rows(values_only=True)]


def num(x):
    return float(x) if isinstance(x, (int, float)) and not isinstance(x, bool) else None


def group_cols(row):
    """Columns of price groups 1..n in a header row ('Canada 1', 2, 3 ... or 1, 2, 3 ...)."""
    cols = {}
    for j, c in enumerate(row):
        if c is None:
            continue
        g = 1 if isinstance(c, str) and c.strip() == 'Canada 1' else (int(c) if isinstance(c, (int, float)) and float(c).is_integer() else None)
        if g == len(cols) + 1:
            cols[g] = j
        elif cols and not (isinstance(c, str) and not c.strip()):
            break
    return cols if len(cols) >= 8 else {}


def grid(rows, start, cols, stop_on_text=True):
    """Weight rows after a header: {weight: [price group 1..n or None]}."""
    out = {}
    for r in rows[start + 1:]:
        a = r[0]
        if a is None or isinstance(a, str):
            if out and stop_on_text and isinstance(a, str):
                break
            continue
        w = num(a)
        if w is None:
            continue
        n = max(cols)
        out[f'{w:g}'] = [num(r[cols[g]]) if g in cols and cols[g] < len(r) else None for g in range(1, n + 1)]
    return out


def header_index(rows, after=0, pred=None):
    for i in range(after, len(rows)):
        cs = group_cols(rows[i])
        if len(cs) >= 8 and (pred is None or pred(rows[i])):
            return i, cs
    raise ValueError('no header')


def fcmi(rows):
    """Letters / flats: weight -> [g1, g2, g3-5, g6-9]; plus postcard and nonmachinable."""
    out, extra = {}, {}
    hdr = next(i for i, r in enumerate(rows) if isinstance(r[0], str) and r[0].strip().lower().startswith('weight not over'))
    for r in rows[hdr + 1:]:
        vals = [num(c) for c in r[1:] if num(c) is not None]
        a = r[0]
        if num(a) is not None and len(vals) == 4:
            out[f'{num(a):g}'] = vals
        elif isinstance(a, str) and len(vals) == 4:
            k = a.strip().lower()
            if k.startswith('postcard'): extra['postcard'] = vals
            elif 'letters only' in k: extra['nonmachinable'] = vals
    return out, extra


def period(fname):
    wb = openpyxl.load_workbook(os.path.join(RAW, fname), read_only=True, data_only=True)
    status = next(c for c in rows_of(wb, 'PMI Retail')[0] if c in ('Final', 'Proposed'))
    letters, lx = fcmi(rows_of(wb, 'FCMI Ltrs'))
    flats, _ = fcmi(rows_of(wb, 'FCMI Flats'))
    # FCPIS
    r = rows_of(wb, 'FCPIS Retail')
    h, cs = header_index(r)
    fcpis = grid(r, h, cs)
    # PMI: flat block (first header), weight block (second header)
    r = rows_of(wb, 'PMI Retail')
    h1, c1 = header_index(r)
    flat = {}
    for row in r[h1 + 1:]:
        if isinstance(row[0], str) and 'Flat Rate' in row[0]:
            flat[row[0].strip()] = [num(row[c1[g]]) if c1[g] < len(row) else None for g in sorted(c1)]
        elif isinstance(row[0], str) and row[0].strip().lower().startswith('weight'):
            break
    h2, c2 = header_index(r, h1 + 1)
    pmi = grid(r, h2, c2)
    # PMEI
    r = rows_of(wb, 'PMEI Retail')
    h1, c1 = header_index(r)
    pmei_flat = None
    for row in r[h1 + 1:]:
        if isinstance(row[0], str) and 'Flat Rate' in row[0]:
            pmei_flat = [num(row[c1[g]]) if c1[g] < len(row) else None for g in sorted(c1)]
            break
    h2, c2 = header_index(r, h1 + 1)
    pmei = grid(r, h2, c2)
    return {'status': status, 'fcmi_letter': letters, 'fcmi_flat': flats, 'fcmi_postcard': lx.get('postcard'), 'fcmi_nonmachinable': lx.get('nonmachinable'),
            'fcpis': fcpis, 'pmi_flat': flat, 'pmi': pmi, 'pmei_flat_env': pmei_flat, 'pmei': pmei}


def main():
    out = {'_readme': 'Built by scripts/data/build-intl.py from the USPS Notice 123 files (retail international sheets). jan2027 = proposed, no fuel surcharge on international products (USPS release of November 12, 2026).',
           'read_on': '2026-11-13'}
    for k, f in FILES.items():
        out[k] = period(f)
        p = out[k]
        assert len(p['fcpis']) >= 10 and len(p['pmi']) == 70 and len(p['pmei']) == 71, (k, len(p['fcpis']), len(p['pmi']), len(p['pmei']))
        assert all(len(v) == 20 for v in p['pmi'].values()) and all(len(v) == 20 for v in p['pmei'].values())
    with open(OUT, 'w') as fh:
        json.dump(out, fh, separators=(',', ':'))
    print('wrote', OUT)


if __name__ == '__main__':
    main()
