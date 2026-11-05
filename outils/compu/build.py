"""Compu : redessin de l’alphabet OS COMPU BOLD (Osamu Sato, The Art of Computer Designing, 1990, p. 102-103).
   Vectorisation des glyphes imprimés (potrace), mise à l’échelle (capitale = 700 unités), accents français dessinés
   dans le même esprit (barres et carrés), police CFF puis WOFF2."""
import cv2, numpy as np, json, subprocess, re, os, statistics as stt
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.t2CharStringPen import T2CharStringPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.areaPen import AreaPen
from fontTools.pens.reverseContourPen import ReverseContourPen
from fontTools.svgLib.path import parse_path

SEG = json.load(open('seg.json'))
UP = 4                       # suréchantillonnage avant vectorisation
DESC = set('gjpqy')
CAP = 700
os.makedirs('trace', exist_ok=True)

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
print(len(G), 'glyphes :', ''.join(g[2] for g in G))

# ── métriques par ligne : ligne de base, hauteur de capitale (en pixels) ──
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
print('hauteur de capitale (px)', caps, 'lignes de base', base)

LAB = {}
for page in SEG:
    g = cv2.imread(page + '.jpg', cv2.IMREAD_GRAYSCALE)
    t, m = cv2.threshold(g, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    n, lab, st, cen = cv2.connectedComponentsWithStats(m, 8)
    LAB[page] = (g, lab, t)

def trace(page, ch, cs):
    g, lab, t = LAB[page]
    x0, y0, x1, y1 = bbox(cs); pad = 12
    cx0, cy0 = max(0, x0 - pad), max(0, y0 - pad); cx1, cy1 = x1 + pad, y1 + pad
    crop = g[cy0:cy1, cx0:cx1].astype(np.float32)
    keep = np.isin(lab[cy0:cy1, cx0:cx1], [c['i'] for c in cs]).astype(np.uint8)
    keep = cv2.dilate(keep, np.ones((7, 7), np.uint8))
    crop[keep == 0] = 255
    big = cv2.resize(crop, None, fx=UP, fy=UP, interpolation=cv2.INTER_CUBIC)
    big = cv2.GaussianBlur(big, (0, 0), 1.6)
    bw = np.where(big < t, 0, 255).astype(np.uint8)
    name = 'trace/' + '%04x' % ord(ch)
    cv2.imwrite(name + '.pgm', bw)
    subprocess.run(['potrace', name + '.pgm', '-s', '-o', name + '.svg', '--turdsize', '120', '--alphamax', '0.72', '--opttolerance', '0.25'], check=True)
    svg = open(name + '.svg').read()
    tr = re.search(r'translate\(([-\d.]+),([-\d.]+)\) scale\(([-\d.]+),([-\d.]+)\)', svg)
    ty, sx, sy = float(tr.group(2)), float(tr.group(3)), float(tr.group(4))
    paths = re.findall(r'<path d="([^"]+)"', svg, re.S)
    return dict(paths=paths, cx0=cx0, cy0=cy0, Hb=bw.shape[0], ty=ty, sx=sx, sy=sy, ink=(x0, y0, x1, y1))

DATA = {}
for page, r, ch, cs in G:
    DATA[ch] = dict(page=page, row=r, **trace(page, ch, cs))
json.dump({k: {kk: vv for kk, vv in v.items() if kk != 'paths'} for k, v in DATA.items()}, open('trace/meta.json', 'w'))
print('vectorisation terminée')
