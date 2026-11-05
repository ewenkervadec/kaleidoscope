import cv2, numpy as np, json
ROWS = {
 'p102': [list('ABCDEF'), list('MNOPQR'), list('YZ1234'), list('abcdef'), list('mnopqr'), ['y','z','[(',':;','~','&']],
 'p103': [list('GHIJKL'), list('STUVWX'), list('567890'), list('ghijkl'), list('stuvwx'), ['?','!','£','$','¥',')]']],
}
CENT = {'p102': [590, 970, 1360, 1735, 2115, 2495], 'p103': [606, 987, 1383, 1760, 2140, 2512]}
out = {}
for page, rows in ROWS.items():
    g = cv2.imread(page + '.jpg', cv2.IMREAD_GRAYSCALE); H, W = g.shape
    thr, m = cv2.threshold(g, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    n, lab, st, cen = cv2.connectedComponentsWithStats(m, 8)
    rowsC = [[] for _ in range(6)]
    for i in range(1, n):
        x, y, w, h, a = [int(v) for v in st[i]]
        if a < 250 or y < 400 or y + h > 2790 or x < 30 or (page == 'p103' and x + w > 2022) or (page == 'p102' and x + w > 2050) or w > 600 or h > 600: continue
        if h < 45 and 1470 < y < 1560: continue   # numéros de page
        cy = y + h / 2; r = int(np.argmin([abs(cy - c) for c in CENT[page]]))
        rowsC[r].append(dict(x=x, y=y, w=w, h=h, a=a, i=i))
    res = []
    for r, cs in enumerate(rowsC):
        cs.sort(key=lambda c: c['x']); cells = []
        for c in cs:
            if cells and c['x'] <= cells[-1]['x1'] + 45: cells[-1]['x1'] = max(cells[-1]['x1'], c['x'] + c['w']); cells[-1]['comps'].append(c)
            else: cells.append(dict(x0=c['x'], x1=c['x'] + c['w'], comps=[c]))
        labs = rows[r]
        print(page, 'ligne', r, len(cells), 'cellules', ''.join(l if len(l) == 1 else '«' + l + '»' for l in labs), [(c['x0'], c['x1'], len(c['comps'])) for c in cells])
        res.append(dict(labels=labs, cells=cells))
    out[page] = dict(thr=float(thr), rows=res)
json.dump(out, open('seg.json', 'w'))
