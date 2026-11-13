#!/usr/bin/env python3
"""Builds src/data/rates.json from the USPS Notice 123 price files (Postal Explorer, pe.usps.com/PriceChange/Index).

Usage: python3 -I scripts/data/build-rates.py   (reads data-raw/*.xlsx, kept out of git; writes src/data/rates.json)

Three workbooks, read on 2026-11-13:
  - "Time-Limited OCT 2026 Price Change - Notice 123 - Final.xlsx"  -> prices in force Oct 4, 2026 to Jan 16, 2027 (key: current)
  - "January 2027 Price Change - 11122026 - Notice 123.xlsx"         -> proposed prices from Jan 17, 2027, BASE prices
                                                                        before the 11% fuel surcharge (key: jan2027)
  - "July 2026 Price Change - 07082026 - Notice 123.xlsx"            -> prices of July 12 to Oct 3, 2026 (key: jul2026)
Every number comes out of a cell; nothing is typed here. The surcharge is NOT applied here: the engine applies it.
"""
import json, os, re, sys
import openpyxl

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
RAW = os.path.join(ROOT, 'data-raw')
OUT = os.path.join(ROOT, 'src', 'data', 'rates.json')
FILES = {'current': 'oct2026-notice123.xlsx', 'jan2027': 'jan2027-notice123.xlsx', 'jul2026': 'jul2026-notice123.xlsx'}


def rows_of(wb, title):
    ws = next(w for w in wb.worksheets if w.title.strip() == title)
    return [list(r) for r in ws.iter_rows(values_only=True)]


def num(x):
    if isinstance(x, (int, float)): return float(x)
    if isinstance(x, str):
        m = re.match(r'^\s*\$?\s*([0-9]+(?:\.[0-9]+)?)\s*$', x)
        if m: return float(m.group(1))
    return None


def zone_table(rows):
    """Flat-rate lines before the zone header, then weight x zone rows, then fee lines."""
    out = {'flat': {}, 'oz': {}, 'lb': {}, 'oversized': None, 'fees': {}}
    hdr = next(i for i, r in enumerate(rows) if any(isinstance(c, str) and c.strip() == 'Zone 1' for c in r))
    zcols = [j for j, c in enumerate(rows[hdr]) if isinstance(c, str) and re.match(r'^Zone \d$', c.strip())]
    assert len(zcols) == 9, zcols
    for r in rows[:hdr]:
        if isinstance(r[0], str) and num(r[1]) is not None:
            out['flat'][r[0].strip()] = num(r[1])
    # Ground Advantage opens with ounce rows: the "(ounces)" label sits on the line above the zone header.
    unit = 'oz' if any(isinstance(c, str) and 'ounces' in c.lower() for r in rows[:hdr] for c in r) else 'lb'
    for r in rows[hdr + 1:]:
        a = r[0]
        if isinstance(a, str):
            s = a.strip()
            if s.lower().startswith('weight not over (ounces)'): unit = 'oz'; continue
            if s.lower().startswith('weight not over (pounds)') or s.lower().startswith('weight not over (lbs)'): unit = 'lb'; continue
            if s == 'Oversized':
                out['oversized'] = [num(r[j]) for j in zcols]; continue
            fee = num(next((c for c in r[1:] if num(c) is not None), None))
            if fee is not None and s and not s.startswith('Parcels exceeding'):
                out['fees'][s] = fee
            continue
        w = num(a)
        if w is None: continue
        vals = [num(r[j]) for j in zcols]
        if any(v is None for v in vals): continue
        key = ('%g' % w)
        out[unit][key] = vals
    # The first worksheet row (title) tells ounces/pounds for Priority: weights <= 0.5 lb are pounds there.
    return out


def media(rows):
    out = {}
    for r in rows:
        w, p = num(r[0]), num(r[1])
        if w is not None and p is not None: out['%g' % w] = p
    return out


def fcm(rows):
    out = {'letter': {}, 'letter_metered': {}, 'flat': {}, 'postcard': None, 'additional_ounce': None, 'nonmachinable': None}
    mode = 'letter'
    for r in rows:
        a = r[0]
        if isinstance(a, str) and a.strip().upper().startswith('LETTERS - METERED'): mode = 'letter_metered'
        if isinstance(a, str):
            s = a.strip()
            if s == 'Postcard': out['postcard'] = num(r[1]); continue
            if s.startswith('Single-Piece Additional Ounce'): out['additional_ounce'] = num(next(c for c in r[1:] if num(c) is not None)); continue
            if s.startswith('Nonmachinable Surcharge'): out['nonmachinable'] = num(next(c for c in r[1:] if num(c) is not None)); continue
        w = num(a)
        if w is not None and num(r[1]) is not None: out[mode]['%g' % w] = num(r[1])
        w2 = num(r[2]) if len(r) > 2 else None
        if w2 is not None and len(r) > 3 and num(r[3]) is not None: out['flat']['%g' % w2] = num(r[3])
    return out


def extra(rows):
    """Domestic extra services: a few named fees, insurance and registered tiers."""
    out = {'insurance': [], 'registered': [], 'cod': []}
    section = None
    for r in rows:
        cells = [c for c in r if c is not None and str(c).strip() != '']
        if not cells: continue
        a = r[0]
        if isinstance(a, str) and a.strip():
            section = a.strip()
            if section.startswith('Certified Mail'): out['certified'] = num(next(c for c in r[1:] if num(c) is not None))
            continue
        label = next((str(c).strip() for c in r[1:] if isinstance(c, str) and c.strip()), '')
        val = next((num(c) for c in r[1:] if num(c) is not None), None)
        if section is None: continue
        if section.startswith('Certified Mail'):
            if label.startswith('Restricted Delivery'): out['certified_restricted'] = val
            if label.startswith('Adult Signature Required'): out['certified_adult_signature'] = val
        elif section.startswith('Insurance'):
            m = re.match(r'^\$?([\d,.]+)\s*-\s*\$?([\d,.]+)$', label.replace(' ', ''))
            if m: out['insurance'].append([float(m.group(1).replace(',', '')), float(m.group(2).replace(',', '')), val])
            elif label.startswith('Per each additional'): out['insurance_per_100'] = val
        elif section.startswith('Registered Mail'):
            m = re.match(r'^\$?([\d,.]+)\s*-\s*\$?([\d,.]+)$', label.replace(' ', ''))
            if m: out['registered'].append([float(m.group(1).replace(',', '')), float(m.group(2).replace(',', '')), val])
            elif label == '0': out['registered'].insert(0, [0, 0, val])
        elif section.startswith('Collect on Delivery'):
            m = re.match(r'^\$?([\d,.]+)to\$?([\d,.]+)$', label.replace(' ', ''))
            if m: out['cod'].append([float(m.group(1).replace(',', '')), float(m.group(2).replace(',', '')), val])
        elif section.startswith('Return Receipt'):
            lab2 = [str(c).strip() for c in r if isinstance(c, str)]
            if 'Retail' in lab2: out['return_receipt_retail'] = val
            if 'Electronic' in lab2: out['return_receipt_electronic'] = val
        elif section.startswith('Signature Confirmation'):
            labs = ' '.join(str(c) for c in r if isinstance(c, str))
            if labs.startswith('Priority Mail') and 'Retail' in labs: out['signature_confirmation_retail'] = val
            if 'Electornic' in labs or ('Electronic' in labs and 'Priority' not in labs and 'Ground' not in labs and 'Restricted' not in labs and 'Package' not in labs and 'Parcel' not in labs):
                out.setdefault('signature_confirmation_electronic', val)
            if labs.startswith('USPS Ground Advantage - Retail') and 'Retail' in labs: out['signature_confirmation_retail'] = val
            if labs.startswith('Adult Signature Required'): out['adult_signature'] = val
            if labs.startswith('Adult Signature Restricted'): out['adult_signature_restricted'] = val
        elif section.startswith('Certificate of Mailing'):
            if label == 'Basic': out['certificate_of_mailing'] = val
    return out


data = {}
for key, f in FILES.items():
    wb = openpyxl.load_workbook(os.path.join(RAW, f), read_only=True, data_only=True)
    head = rows_of(wb, 'PM Retail')[0]
    status = next((str(c) for c in head if isinstance(c, str) and c.strip() in ('Proposed', 'Final')), '')
    data[key] = {
        'status': status,
        'pm_retail': zone_table(rows_of(wb, 'PM Retail')),
        'pm_comm': zone_table(rows_of(wb, 'PM Comm')),
        'ga_retail': zone_table(rows_of(wb, 'USPS Ground Advantage Retail')),
        'ga_comm': zone_table(rows_of(wb, 'USPS Ground Advantage Comm')),
        'pme_retail': zone_table(rows_of(wb, 'PME Retail')),
        'pme_comm': zone_table(rows_of(wb, 'PME Comm')),
        'media': media(rows_of(wb, 'Media Mail')),
        'fcm': fcm(rows_of(wb, 'FCM & EDDM - Retail')),
        'extra': extra(rows_of(wb, 'Dom Extra Svcs')),
    }
    wb.close()

meta = {
    '_readme': 'Built by scripts/data/build-rates.py from the USPS Notice 123 price files (Postal Explorer). Base prices as published; the January 2027 tables are BASE prices before the 11% fuel surcharge, which the engine adds.',
    'read_on': '2026-11-13',
    'periods': {
        'current': {'effective': '2026-10-04', 'through': '2027-01-16', 'file': 'Time-Limited OCT 2026 Price Change - Notice 123 - Final.xlsx', 'surcharge_included': True},
        'jan2027': {'effective': '2027-01-17', 'file': 'January 2027 Price Change - 11122026 - Notice 123.xlsx', 'proposed': True, 'fuel_surcharge': 0.11, 'docket': 'CP2027-1'},
        'jul2026': {'effective': '2026-07-12', 'through': '2026-10-03', 'file': 'July 2026 Price Change - 07082026 - Notice 123.xlsx', 'surcharge_included': True},
    },
}
json.dump({**meta, **data}, open(OUT, 'w'), separators=(',', ':'))
# Summary for the log
for k, d in data.items():
    print(k, d['status'], 'PM retail lb rows', len(d['pm_retail']['lb']), 'GA oz', list(d['ga_retail']['oz']), 'GA lb rows', len(d['ga_retail']['lb']),
          'flat', d['pm_retail']['flat'], 'fees', d['pm_retail']['fees'], 'media rows', len(d['media']), 'fcm', d['fcm']['letter'], d['fcm']['postcard'], 'extra', {x: y for x, y in d['extra'].items() if not isinstance(y, list)}, 'ins', d['extra']['insurance'][:2], 'reg', d['extra']['registered'][:2])
print('wrote', OUT, os.path.getsize(OUT), 'bytes')
