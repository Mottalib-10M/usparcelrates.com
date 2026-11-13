#!/usr/bin/env python3
"""Builds src/data/zones.json from the USPS Domestic Zone Chart (postcalc.usps.com/DomesticZoneChart/GetZoneChart).

Usage: python3 -I scripts/data/build-zones.py <dir with z001.json … z999.json>
One JSON per origin 3-digit ZIP prefix, as the Postal Service's own calculator serves it (query of 2026-11-13,
EffectiveDate "November 1, 2026"). Output: for each origin prefix with a chart, a 1000-character string, one
character per destination prefix 000-999: '1'..'9' the zone, '0' no chart for that destination. The '*' (local
zone) and '+' marks of the chart are kept in a second map of exceptions. Nothing is computed from distances.
"""
import json, os, re, sys

src = sys.argv[1]
zones, marks, zip5, eff = {}, {}, {}, set()
for n in range(1, 1000):
    p = os.path.join(src, f'z{n:03d}.json')
    if not os.path.exists(p): continue
    try: d = json.load(open(p))
    except Exception: continue
    if d.get('ZIPCodeError') or d.get('PageError'): continue
    eff.add(d.get('EffectiveDate'))
    row = ['0'] * 1000
    mk = {}
    extra5 = []
    for col in ('Column0', 'Column1', 'Column2', 'Column3'):
        for e in d.get(col) or []:
            z = str(e.get('Zone', '')).strip()
            m = re.match(r'^(\d)(\D*)$', z)
            if not m: continue
            zz, flag = m.group(1), m.group(2)
            rng = e['ZipCodes'].split('---')
            if len(rng[0].strip()) != 3:
                # a 5-digit range listed in the 3-digit columns: kept with the 5-digit exceptions
                extra5.append([rng[0].strip(), rng[-1].strip(), zz, ''])
                continue
            a, b = int(rng[0]), int(rng[-1])
            for k in range(a, b + 1):
                row[k] = zz
                if flag: mk[k] = flag
    if all(c == '0' for c in row): continue
    zones[f'{n:03d}'] = ''.join(row)
    z5 = list(extra5)
    for e in d.get('Zip5Digit') or []:
        m = re.match(r'^(\d)', str(e.get('Zone', '')).strip())
        if not m: continue
        rng = e['ZipCodes'].split('---')
        z5.append([rng[0], rng[-1], m.group(1), e.get('MailService') or ''])
    if z5: zip5[f'{n:03d}'] = z5
    if mk:
        # compress marks as {flag: [[a,b],…]}
        byflag = {}
        for k in sorted(mk):
            f = mk[k]; L = byflag.setdefault(f, [])
            if L and L[-1][1] == k - 1: L[-1][1] = k
            else: L.append([k, k])
        marks[f'{n:03d}'] = byflag
# symmetry check, for the method page
tot = sym = 0
for o, row in zones.items():
    for dst in range(1000):
        z = row[dst]
        if z == '0': continue
        back = zones.get(f'{dst:03d}')
        if not back: continue
        tot += 1; sym += back[int(o)] == z
out = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'src', 'data', 'zones.json')
json.dump({'_readme': 'USPS Domestic Zone Chart by 3-digit origin prefix, one character per destination prefix (000-999); 0 = no chart. Built by scripts/data/build-zones.py from postcalc.usps.com, read on 2026-11-13.', 'effective': sorted(eff), 'read_on': '2026-11-13', 'origins': len(zones), 'symmetric_share': round(sym / tot, 4) if tot else None, 'zones': zones, 'marks': marks, 'zip5': zip5}, open(out, 'w'), separators=(',', ':'))
print('origins', len(zones), 'effective', sorted(eff), 'symmetric', sym, '/', tot, 'bytes', os.path.getsize(out))
