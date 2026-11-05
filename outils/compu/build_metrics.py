import json, statistics as stt
SEG = json.load(open('seg.json'))
DESC = set('gjpqy')
def glyph_groups():
    """(page, ligne, caractère, composantes) pour chaque glyphe, en séparant les cases doubles."""
    for page, P in SEG.items():
        for r, row in enumerate(P['rows']):
            for k, cell in enumerate(row['cells']):
                lab = row['labels'][k]; cs = sorted(cell['comps'], key=lambda c: c['x'])
                if lab == '~':
                    # un tiret long (rectangle plein) au-dessus, la vague dessous
                    bar = max(cs, key=lambda c: c['a'] / (c['w'] * c['h'])); yield page, r, '–', [bar]; yield page, r, '~', [c for c in cs if c is not bar]; continue
                if len(lab) == 1: yield page, r, lab, cs; continue
                if lab in ('[(', ')]'):
                    # deux glyphes côte à côte : on coupe au plus grand écart horizontal
                    xs = sorted(cs, key=lambda c: c['x']); gaps = [(xs[i + 1]['x'] - (xs[i]['x'] + xs[i]['w']), i) for i in range(len(xs) - 1)]
                    i = max(gaps)[1]; yield page, r, lab[0], xs[:i + 1]; yield page, r, lab[1], xs[i + 1:]; continue
                if lab == ':;':
                    # à gauche : un trait d’union (barre large) au-dessus des deux points ; à droite : le point-virgule
                    cx = [c['x'] + c['w'] / 2 for c in cs]; mid = (min(cx) + max(cx)) / 2
                    left = [c for c in cs if c['x'] + c['w'] / 2 < mid]; right = [c for c in cs if c['x'] + c['w'] / 2 >= mid]
                    bar = max(left, key=lambda c: c['w'] / c['h'])
                    yield page, r, '-', [bar]; yield page, r, ':', [c for c in left if c is not bar]; yield page, r, ';', right; continue
                if lab == '~':
                    big = max(cs, key=lambda c: c['a']); yield page, r, '~', [big]; yield page, r, '-', [c for c in cs if c is not big]; continue
                raise SystemExit('case inconnue ' + lab)

G = list(glyph_groups())
def bbox(cs): return min(c['x'] for c in cs), min(c['y'] for c in cs), max(c['x'] + c['w'] for c in cs), max(c['y'] + c['h'] for c in cs)
base = {}
for page, P in SEG.items():
    for r in range(6):
        bots = [bbox(cs)[3] for (pg, rr, ch, cs) in G if pg == page and rr == r and ch not in DESC and ch not in ',;([])-–~']
        base[(page, r)] = stt.median(bots)
caps = {}
for page in SEG:
    hs = [base[(page, r)] - bbox(cs)[1] for (pg, r, ch, cs) in G if pg == page and r in (0, 1, 2) and ch not in 'Q']
    caps[page] = stt.median(hs)
