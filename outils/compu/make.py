"""Compu — construit la police à partir des tracés (build.py) : métriques, approches, signes ajoutés, accents."""
import json, re, statistics as stt
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.t2CharStringPen import T2CharStringPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.recordingPen import RecordingPen, DecomposingRecordingPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.areaPen import AreaPen
from fontTools.pens.reverseContourPen import ReverseContourPen
from fontTools.svgLib.path import parse_path
from fontTools.ttLib import TTFont

SEG = json.load(open('seg.json')); META = json.load(open('trace/meta.json'))
CAP, UP = 700, 4
DESC = set('gjpqy')
def bbox(cs): return min(c['x'] for c in cs), min(c['y'] for c in cs), max(c['x'] + c['w'] for c in cs), max(c['y'] + c['h'] for c in cs)
# lignes de base et hauteurs de capitale recalculées comme dans build.py
import build_metrics as BM
base, caps = BM.base, BM.caps

def contours_of(ch):
    """Contours du glyphe en unités de la police (non décalés horizontalement), une liste d’enregistrements par contour."""
    M = META[ch]; s = CAP / caps[M['page']]; B = base[(M['page'], M['row'])]
    svg = open('trace/%04x.svg' % ord(ch)).read()
    a, d = M['sx'] * s / UP, -M['sy'] * s / UP
    e, f = M['cx0'] * s, (B - M['cy0'] - M['ty'] / UP) * s
    rec = RecordingPen()
    for p in re.findall(r'<path d="([^"]+)"', svg, re.S):
        parse_path(p, TransformPen(rec, (a, 0, 0, d, e, f)))
    # découpe en contours
    cs, cur = [], []
    for op, args in rec.value:
        cur.append((op, args))
        if op in ('closePath', 'endPath'): cs.append(cur); cur = []
    if cur: cs.append(cur)
    return cs

def replay(contours, pen, dx=0, dy=0, sxs=1.0):
    for c in contours:
        for op, args in c:
            pts = [((x * sxs) + dx, y + dy) for (x, y) in args]
            getattr(pen, op)(*pts)

def bounds(contours):
    bp = BoundsPen(None); replay(contours, bp); return bp.bounds

def area(contour):
    ap = AreaPen(); replay([contour], ap); return ap.value

OUT = {}   # nom → (contours, avance)
CH = {}
for ch in META: CH[ch] = contours_of(ch)
# orientation : contour extérieur dans le sens antihoraire (convention PostScript)
for ch, cs in CH.items():
    big = max(cs, key=lambda c: abs(area(c)))
    if area(big) < 0:
        fixed = []
        for c in cs:
            r = RecordingPen(); rp = ReverseContourPen(r); replay([c], rp); fixed.append(r.value)
        CH[ch] = fixed

STEM = bounds(CH['I'])[2] - bounds(CH['I'])[0]
XH = stt.median([bounds(CH[c])[3] for c in 'acemnorsuvwxz'])
ASC = stt.median([bounds(CH[c])[3] for c in 'bdhkl'])
DSC = stt.median([bounds(CH[c])[1] for c in 'gpqy'])
print('graisse (fût de I) %.0f · hauteur d’x %.0f · ascendante %.0f · descendante %.0f' % (STEM, XH, ASC, DSC))


# ───────── approches : fûts droits, formes rondes, diagonales, côtés ouverts ─────────
SB = 0.40 * STEM
ROUND = set('OCGQSoces0689235?&$')
DIAG = set('AVWXYKkvwxyZz7T4')
OPENR = set('EFLPRCcfrtJ1')
OPENL = set('Jj')
def sidebearings(ch):
    l = r = SB
    if ch in ROUND: l = r = 0.30 * STEM
    if ch in DIAG: l = r = 0.10 * STEM
    if ch in OPENR: r = 0.20 * STEM
    if ch == 'T': l = r = 0.10 * STEM
    if ch == 'L': r = 0.08 * STEM
    if ch == 'J': l = 0.12 * STEM
    if ch == 'j': l = -0.05 * STEM
    if ch in '.:;,!': l = r = 0.45 * STEM
    if ch in '-–~': l = r = 0.25 * STEM
    return l, r

GL = {}   # nom de glyphe → (contours positionnés, avance)
def put(name, contours, l=None, r=None, adv=None):
    b = bounds(contours); dx = (l if l is not None else SB) - b[0]
    moved = []
    for c in contours:
        moved.append([(op, [(x + dx, y) for (x, y) in args]) for op, args in c])
    GL[name] = (moved, adv if adv is not None else round(b[2] + dx + (r if r is not None else SB)))
    return GL[name]

NAMES = {}
def uname(ch):
    import unicodedata
    special = {' ': 'space', '-': 'hyphen', '–': 'endash', '—': 'emdash', '.': 'period', ',': 'comma', ':': 'colon', ';': 'semicolon', '!': 'exclam', '?': 'question',
               '(': 'parenleft', ')': 'parenright', '[': 'bracketleft', ']': 'bracketright', '&': 'ampersand', '~': 'asciitilde', '$': 'dollar', '£': 'sterling', '¥': 'yen',
               '’': 'quoteright', "'": 'quotesingle', ' ': 'uni00A0', ' ': 'uni202F', '«': 'guillemotleft', '»': 'guillemotright', '/': 'slash', 'ı': 'dotlessi'}
    if ch in special: return special[ch]
    if ch.isdigit(): return ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'][int(ch)]
    if ch.isascii() and ch.isalpha(): return ch
    return 'uni%04X' % ord(ch)

for ch, cs in CH.items():
    if ch in '-': continue
    l, r = sidebearings(ch); put(uname(ch), cs, l, r); NAMES[ch] = uname(ch)

# trait d’union recentré sur la hauteur d’x ; tiret moyen : la barre longue, au même niveau
def rect(x0, y0, x1, y1):
    return [('moveTo', [(x0, y0)]), ('lineTo', [(x1, y0)]), ('lineTo', [(x1, y1)]), ('lineTo', [(x0, y1)]), ('closePath', [])]
def poly(pts):
    c = [('moveTo', [pts[0]])] + [('lineTo', [p]) for p in pts[1:]] + [('closePath', [])]
    # sens antihoraire
    a = sum(pts[i][0] * pts[(i + 1) % len(pts)][1] - pts[(i + 1) % len(pts)][0] * pts[i][1] for i in range(len(pts)))
    if a < 0: c = [('moveTo', [pts[0]])] + [('lineTo', [p]) for p in pts[:0:-1]] + [('closePath', [])]
    return c
def shift(contours, dx=0, dy=0):
    return [[(op, [(x + dx, y + dy) for (x, y) in args]) for op, args in c] for c in contours]

hb = bounds(CH['-']); hy = XH / 2 - (hb[3] - hb[1]) / 2 - hb[1]
put('hyphen', shift(CH['-'], 0, hy), 0.25 * STEM, 0.25 * STEM); NAMES['-'] = 'hyphen'
eb = bounds(GL['endash'][0]); GL['endash'] = (shift(GL['endash'][0], 0, XH / 2 - (eb[3] + eb[1]) / 2), GL['endash'][1])
DOT = bounds([CH[':'][1]])  # le point du bas des deux-points
d = DOT[2] - DOT[0]
put('period', [rect(0, 0, d, d)], 0.45 * STEM, 0.45 * STEM); NAMES['.'] = 'period'
comma = [c for c in CH[';'] if bounds([c])[1] < 40][0]
cb = bounds([comma]); put('comma', shift([comma], 0, -cb[1] - 0.55 * d), 0.4 * STEM, 0.4 * STEM); NAMES[','] = 'comma'
put('quoteright', shift([comma], 0, CAP - cb[3]), 0.4 * STEM, 0.4 * STEM); NAMES['’'] = 'quoteright'
put('quotesingle', [rect(0, CAP - 2.0 * d, 0.8 * d, CAP)], 0.4 * STEM, 0.4 * STEM); NAMES["'"] = 'quotesingle'
SPACE = round(0.30 * CAP)
GL['space'] = ([], SPACE); NAMES[' '] = 'space'
GL['uni00A0'] = ([], SPACE); NAMES[' '] = 'uni00A0'
GL['uni202F'] = ([], round(SPACE * 0.55)); NAMES[' '] = 'uni202F'
# barre oblique : un parallélogramme de la graisse des fûts
put('slash', [poly([(0, -60), (STEM * 0.95, -60), (STEM * 0.95 + 300, CAP + 20), (300, CAP + 20)])], 0.1 * STEM, 0.1 * STEM); NAMES['/'] = 'slash'
# guillemets : deux chevrons faits de deux barres obliques
def chevron(x, y, w, h, t, left=True):
    s_ = -1 if left else 1
    pts = [(x, y), (x + s_ * w, y + h / 2), (x, y + h), (x + t, y + h), (x + s_ * w + t * (1 if left else -1) * 0 + (t if not left else t) * (1), y + h / 2)]
    return None
def guill(left):
    t, w, h = 0.62 * STEM, 0.62 * STEM * 2.1, XH * 0.62
    y = XH / 2 - h / 2; out = []
    for k in range(2):
        x = k * (w + 0.35 * STEM)
        if left: out.append(poly([(x + w, y), (x + w + t, y), (x + t, y + h / 2), (x + w + t, y + h), (x + w, y + h), (x, y + h / 2)]))
        else: out.append(poly([(x, y), (x + t, y), (x + w + t, y + h / 2), (x + t, y + h), (x, y + h), (x + w, y + h / 2)]))
    return out
put('guillemotleft', guill(True), 0.15 * STEM, 0.15 * STEM); NAMES['«'] = 'guillemotleft'
put('guillemotright', guill(False), 0.15 * STEM, 0.15 * STEM); NAMES['»'] = 'guillemotright'

# point médian, tiret cadratin, points de suspension
pb = bounds(GL['period'][0]); pd_ = pb[3] - pb[1]
put('periodcentered', [rect(0, XH / 2 - pd_ / 2, pd_, XH / 2 + pd_ / 2)], 0.45 * STEM, 0.45 * STEM); NAMES['·'] = 'periodcentered'
eb2 = bounds(GL['endash'][0]); bar_h = eb2[3] - eb2[1]
put('emdash', [rect(0, XH / 2 - bar_h / 2, 1000 - 0.5 * STEM, XH / 2 + bar_h / 2)], 0.25 * STEM, 0.25 * STEM); NAMES['—'] = 'emdash'
put('ellipsis', [rect(k * (pd_ + 0.75 * STEM), 0, k * (pd_ + 0.75 * STEM) + pd_, pd_) for k in range(3)], 0.45 * STEM, 0.45 * STEM); NAMES['…'] = 'ellipsis'

# ───────── accents : barres obliques et carrés, de la taille du point du i ─────────
idot = [c for c in CH['i'] if bounds([c])[1] > 300][0]; ib = bounds([idot]); D = ib[2] - ib[0]
istem = [c for c in CH['i'] if bounds([c])[1] < 300]
put('dotlessi', istem, *sidebearings('i')); NAMES['ı'] = 'dotlessi'
GAP_L, GAP_U = 0.55 * D, 0.42 * D
def acute(cx, yb):
    w, h, t = 1.55 * D, 1.15 * D, 0.92 * D
    return [poly([(cx - w / 2, yb), (cx - w / 2 + t, yb), (cx + w / 2, yb + h), (cx + w / 2 - t, yb + h)])]
def grave(cx, yb):
    w, h, t = 1.55 * D, 1.15 * D, 0.92 * D
    return [poly([(cx + w / 2 - t, yb), (cx + w / 2, yb), (cx - w / 2 + t, yb + h), (cx - w / 2, yb + h)])]
def circ(cx, yb):
    w, h, t = 1.25 * D, 1.0 * D, 0.82 * D
    return [poly([(cx - w - t / 2, yb), (cx - w + t / 2, yb), (cx, yb + h - t * 0.55), (cx + w - t / 2, yb), (cx + w + t / 2, yb), (cx + t * 0.55, yb + h), (cx - t * 0.55, yb + h)])]
def diaer(cx, yb):
    s_ = 0.86 * D; g = 0.55 * D
    return [rect(cx - g / 2 - s_, yb, cx - g / 2, yb + s_), rect(cx + g / 2, yb, cx + g / 2 + s_, yb + s_)]
def cedilla(cx):
    t = 0.78 * D
    return [poly([(cx - t / 2, -0.85 * D), (cx + t / 2, -0.85 * D), (cx + t / 2, 6), (cx - t / 2, 6)]), rect(cx - 1.25 * D, -0.85 * D - 0.62 * D, cx + t / 2, -0.85 * D)]
ACC = {'acute': acute, 'grave': grave, 'circ': circ, 'diaer': diaer}
def stem_center(name):
    cs, adv = GL[name]; b = bounds(cs)
    return (b[0] + b[2]) / 2
COMPOSE = {
    'à': ('a', 'grave'), 'â': ('a', 'circ'), 'ä': ('a', 'diaer'), 'é': ('e', 'acute'), 'è': ('e', 'grave'), 'ê': ('e', 'circ'), 'ë': ('e', 'diaer'),
    'î': ('dotlessi', 'circ'), 'ï': ('dotlessi', 'diaer'), 'ô': ('o', 'circ'), 'ö': ('o', 'diaer'), 'ù': ('u', 'grave'), 'û': ('u', 'circ'), 'ü': ('u', 'diaer'), 'ÿ': ('y', 'diaer'),
    'À': ('A', 'grave'), 'Â': ('A', 'circ'), 'Ä': ('A', 'diaer'), 'É': ('E', 'acute'), 'È': ('E', 'grave'), 'Ê': ('E', 'circ'), 'Ë': ('E', 'diaer'),
    'Î': ('I', 'circ'), 'Ï': ('I', 'diaer'), 'Ô': ('O', 'circ'), 'Ö': ('O', 'diaer'), 'Ù': ('U', 'grave'), 'Û': ('U', 'circ'), 'Ü': ('U', 'diaer'), 'Ÿ': ('Y', 'diaer'),
}
# ───────── c redessiné (V1.3) : le c d’origine (barre en haut, crochet remontant à droite) se lisait comme un t.
# Nouveau c : les deux coins gauches arrondis, deux bras de même longueur, ouvert à droite ; même graisse que le o.
def c_new(x0=36, x1=500, y0=3, y1=467, t=117, R1=150, R2=200):
    k, xi = 0.5523, x0 + t
    r1, r2 = R1 - t, R2 - t
    return [[('moveTo', [(x1, y1)]), ('lineTo', [(x0 + R1, y1)]),
             ('curveTo', [(x0 + R1 - k * R1, y1), (x0, y1 - R1 + k * R1), (x0, y1 - R1)]),
             ('lineTo', [(x0, y0 + R2)]),
             ('curveTo', [(x0, y0 + R2 - k * R2), (x0 + R2 - k * R2, y0), (x0 + R2, y0)]),
             ('lineTo', [(x1, y0)]), ('lineTo', [(x1, y0 + t)]), ('lineTo', [(xi + r2, y0 + t)]),
             ('curveTo', [(xi + r2 - k * r2, y0 + t), (xi, y0 + t + r2 - k * r2), (xi, y0 + t + r2)]),
             ('lineTo', [(xi, y1 - t - r1)]),
             ('curveTo', [(xi, y1 - t - r1 + k * r1), (xi + r1 - k * r1, y1 - t), (xi + r1, y1 - t)]),
             ('lineTo', [(x1, y1 - t)]), ('closePath', [])]]
GL['c'] = (c_new(), GL['c'][1])
for ch, (bn, acc) in COMPOSE.items():
    cs, adv = GL[bn]; b = bounds(cs); cx = (b[0] + b[2]) / 2
    if bn == 'E': cx = b[0] + (b[2] - b[0]) * 0.52
    upper = ch.isupper(); yb = (CAP + GAP_U) if upper else (XH + GAP_L)
    GL[uname(ch)] = (cs + ACC[acc](cx, yb), adv); NAMES[ch] = uname(ch)
for ch, bn in (('ç', 'c'), ('Ç', 'C')):
    cs, adv = GL[bn]; b = bounds(cs); cx = (b[0] + b[2]) / 2
    GL[uname(ch)] = (cs + cedilla(cx), adv); NAMES[ch] = uname(ch)

# ───────── crénage de quelques paires de titre ─────────
KERN = {('T', 'o'): -60, ('T', 'e'): -60, ('T', 'a'): -60, ('P', 'a'): -30, ('L', 'T'): -60, ('A', 'V'): -40, ('V', 'A'): -40, ('f', 'o'): -20, ('r', 'a'): -20, ('r', 'e'): -20, ('r', 'o'): -20, ('y', 'c'): -10}

# ───────── la police ─────────
order = ['.notdef'] + sorted(GL.keys())
fb = FontBuilder(1000, isTTF=False)
fb.setupGlyphOrder(order)
fb.setupCharacterMap({ord(ch): name for ch, name in NAMES.items()})
cs_dict, metrics = {}, {}
nd = T2CharStringPen(500, None); replay([rect(60, 0, 440, CAP), rect(140, 80, 360, CAP - 80)[::1]], nd)
cs_dict['.notdef'] = nd.getCharString(); metrics['.notdef'] = (500, 60)
for name in order[1:]:
    cs, adv = GL[name]
    pen = T2CharStringPen(adv, None); replay(cs, pen)
    cs_dict[name] = pen.getCharString()
    b = bounds(cs) if cs else (0, 0, 0, 0)
    metrics[name] = (adv, round(b[0]))
fb.setupCFF('Compu-Regular', {'FullName': 'Compu', 'FamilyName': 'Compu', 'Weight': 'Regular'}, cs_dict, {})
fb.setupHorizontalMetrics(metrics)
fb.setupHorizontalHeader(ascent=960, descent=-260)
fb.setupNameTable({'familyName': 'Compu', 'styleName': 'Regular', 'uniqueFontIdentifier': 'Compu-Regular-2026', 'fullName': 'Compu', 'psName': 'Compu-Regular',
                   'version': 'Version 1.000', 'designer': 'd’après OS COMPU BOLD d’Osamu Sato (The Art of Computer Designing, 1990)',
                   'description': 'Redessin de l’alphabet OS COMPU BOLD pour le cours « Chimioarchitecture des psychédéliques » ; accents ajoutés.'})
fb.setupOS2(sTypoAscender=960, sTypoDescender=-260, sTypoLineGap=0, usWinAscent=1000, usWinDescent=300, sxHeight=round(XH), sCapHeight=CAP, achVendID='NONE', usWeightClass=400, fsSelection=0x40)
fb.setupPost()
# crénage (table kern simple, format 0 : suffisant pour des titres)
from fontTools.ttLib.tables._k_e_r_n import KernTable_format_0
from fontTools.ttLib import newTable
kern = newTable('kern'); kern.version = 0; st = KernTable_format_0(); st.coverage = 1; st.format = 0; st.version = 0
st.kernTable = {(NAMES[a], NAMES[b]): v for (a, b), v in KERN.items() if a in NAMES and b in NAMES}
kern.kernTables = [st]; fb.font['kern'] = kern
fb.save('Compu.otf')
f = TTFont('Compu.otf'); f.flavor = 'woff2'; f.save('compu.woff2')
import os; print('Compu.otf', os.path.getsize('Compu.otf'), 'octets ; compu.woff2', os.path.getsize('compu.woff2'), 'octets ;', len(order), 'glyphes')
