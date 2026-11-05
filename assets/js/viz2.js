/* Moteur des cours — visualisations communes : utilitaires d’affinité, géométrie des métaballes,
   illustrations en tuile, carte des substances en tuiles fusionnées. */
'use strict';

/* ───────── Empreintes réceptorielles ─────────
   Ki en nM (plus petit = plus affin). Une plage « a–b » prend la moyenne géométrique ; « ≥ x », « > x », « x+ » valent x.
   pKi = 9 − log10(Ki nM). Une pastille par affinité, à la manière d’un code QR. */
function parseKi(raw) {
  if (raw === undefined || raw === null) return null; const s = String(raw).replace(/\s/g, '').replace(',', '.');
  if (!s || /^(ND|—|-)$/i.test(s)) return null;
  const m = s.match(/^([<>≥≤]?)([\d.]+)(?:[–-]([\d.]+))?(\+?)$/); if (!m) return null;
  const a = +m[2], b = m[3] ? +m[3] : null; const v = b ? Math.sqrt(a * b) : a;
  return { v, lo: !!(m[1] === '>' || m[1] === '≥' || m[4]), raw: String(raw) };
}
const pKi = ki => 9 - Math.log10(ki);
function affWord(p) { return p >= 9 ? 'très forte (≤ 1 nM)' : p >= 8 ? 'forte (1 à 10 nM)' : p >= 7 ? 'moyenne (10 à 100 nM)' : p >= 6 ? 'faible (0,1 à 1 µM)' : 'négligeable (> 1 µM)'; }

/* ───────── Géométrie des métaballes ─────────
   Des cercles posés sur une grille, reliés à leurs voisins : par des côtés droits (voisins orthogonaux) ou par des
   raccords concaves qui suivent les cercles vides d’à côté (voisins diagonaux) ; et la grille de construction. */
function chainPath(cells, s, rho, ox, oy) {
  const P = cells.map(([c, r]) => [ox + (c + .5) * s, oy + (r + .5) * s]), n = P.length, R = s - rho;
  const f = v => +v.toFixed(2), pt = p => f(p[0]) + ' ' + f(p[1]);
  if (n === 1) { const [x, y] = P[0]; return 'M' + f(x - rho) + ' ' + f(y) + 'a' + f(rho) + ' ' + f(rho) + ' 0 1 1 ' + f(2 * rho) + ' 0a' + f(rho) + ' ' + f(rho) + ' 0 1 1 ' + f(-2 * rho) + ' 0Z'; }
  /* un côté (gauche ou droit, dans le sens de la chaîne) de la liaison k → k+1 */
  const side = (k, left) => {
    const [x0, y0] = P[k], [x1, y1] = P[k + 1], a = Math.sign(x1 - x0), b = Math.sign(y1 - y0);
    if (!a || !b) { const nx = left ? b : -b, ny = left ? -a : a; return { p0: [x0 + rho * nx, y0 + rho * ny], p1: [x1 + rho * nx, y1 + rho * ny] }; }
    const Q = left === (a * b > 0) ? [x0 + a * s, y0] : [x0, y0 + b * s];
    return { Q, p0: [x0 + rho * (Q[0] - x0) / s, y0 + rho * (Q[1] - y0) / s], p1: [x1 + rho * (Q[0] - x1) / s, y1 + rho * (Q[1] - y1) / s] };
  };
  const L = [], Rt = [];
  for (let k = 0; k < n - 1; k++) { L.push(side(k, true)); Rt.push(side(k, false)); }
  /* arc convexe d’un cercle de la chaîne, dans le sens horaire ; les raccords concaves tournent dans l’autre sens */
  const convex = (c, p, q) => {
    let d = Math.atan2(q[1] - c[1], q[0] - c[0]) - Math.atan2(p[1] - c[1], p[0] - c[0]);
    while (d < 0) d += 2 * Math.PI; while (d >= 2 * Math.PI) d -= 2 * Math.PI;
    return d < 1e-4 || 2 * Math.PI - d < 1e-4 ? '' : 'A' + f(rho) + ' ' + f(rho) + ' 0 ' + (d > Math.PI ? 1 : 0) + ' 1 ' + pt(q);
  };
  const join = (j, to) => j.Q ? 'A' + f(R) + ' ' + f(R) + ' 0 0 0 ' + pt(to) : 'L' + pt(to);
  let d = 'M' + pt(L[0].p0);
  for (let k = 0; k < n - 1; k++) d += join(L[k], L[k].p1) + convex(P[k + 1], L[k].p1, k + 1 < n - 1 ? L[k + 1].p0 : Rt[k].p1);
  for (let k = n - 2; k >= 0; k--) d += join(Rt[k], Rt[k].p0) + convex(P[k], Rt[k].p0, k > 0 ? Rt[k - 1].p1 : L[0].p0);
  return d + 'Z';
}
/* la grille de construction : carrés, médianes, diagonales et cercles inscrits */
function constructionGrid(C, Rw, s, gx, gy) {
  let sq = '', fine = '';
  for (let c = 0; c <= C; c++) sq += 'M' + (gx + c * s) + ' ' + gy + 'V' + (gy + Rw * s);
  for (let r = 0; r <= Rw; r++) sq += 'M' + gx + ' ' + (gy + r * s) + 'H' + (gx + C * s);
  for (let c = 0; c < C; c++) fine += 'M' + (gx + (c + .5) * s) + ' ' + gy + 'V' + (gy + Rw * s);
  for (let r = 0; r < Rw; r++) fine += 'M' + gx + ' ' + (gy + (r + .5) * s) + 'H' + (gx + C * s);
  for (let c = 0; c < C; c++) for (let r = 0; r < Rw; r++) {
    const x = gx + c * s, y = gy + r * s, h = s / 2;
    fine += 'M' + x + ' ' + y + 'l' + s + ' ' + s + 'M' + (x + s) + ' ' + y + 'l' + (-s) + ' ' + s;
    fine += 'M' + (x + s) + ' ' + (y + h) + 'a' + h + ' ' + h + ' 0 1 1 ' + (-s) + ' 0a' + h + ' ' + h + ' 0 1 1 ' + s + ' 0';
  }
  return { sq, fine };
}
/* les quatre pièces, sur une grille de 9 × 9 : la composition occupe les colonnes 2 à 6 */

/* ───────── Illustrations de la diapositive « Des pistes » ─────────
   Dans l’idée du logo : une tuile sombre aux angles très arrondis, un pictogramme blanc fait seulement de gélules
   (traits épais à bouts ronds) et de points ; en noir et blanc, inversé en mode sombre comme le logo. Décoratives. */
const ILL = {};
(() => {
  const tile = inner => '<svg class="ill" viewBox="0 0 100 100" width="100" height="100" aria-hidden="true" focusable="false"><rect x="2" y="2" width="96" height="96" rx="28" class="ill-bg"/>' + inner + '</svg>';
  const cap = (x1, y1, x2, y2, w) => '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" class="ill-st" stroke-width="' + w + '"/>';
  const dot = (x, y, r) => '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" class="ill-fg"/>';
  const P = (a, r) => { const t = (a - 90) * Math.PI / 180; return [+(50 + r * Math.cos(t)).toFixed(1), +(50 + r * Math.sin(t)).toFixed(1)]; };
  /* pramipexole : une étincelle, l’élan retrouvé */
  ILL.pramipexole = () => tile(dot(50, 50, 8.5) + [0, 90, 180, 270].map(a => { const [x1, y1] = P(a, 19), [x2, y2] = P(a, 32); return cap(x1, y1, x2, y2, 11); }).join('') +
    [45, 135, 225, 315].map(a => { const [x, y] = P(a, 27); return dot(x, y, 5.5); }).join(''));
  /* psilocybine : un champignon, deux spores */
  ILL.psilocybine = () => tile('<path d="M19 55C19 35 33 22 50 22C67 22 81 35 81 55Q81 59 77 59H23Q19 59 19 55Z" class="ill-fg"/>' +
    '<rect x="42.5" y="63" width="15" height="20" rx="7.5" class="ill-fg"/>' + dot(28, 70, 4.5) + dot(72, 70, 4.5));
  /* psychostimulants : un œil grand ouvert */
  ILL.psychostimulants = () => tile('<path d="M14 59Q50 27 86 59Q50 91 14 59Z" class="ill-fg"/><circle cx="50" cy="59" r="13.5" class="ill-bg"/>' + dot(50, 59, 5.5) +
    cap(50, 14, 50, 24, 8) + cap(29, 20, 34, 28, 8) + cap(71, 20, 66, 28, 8));
  /* dextrométhorphane-bupropion : le flacon de sirop et le comprimé */
  ILL.dxmbupropion = () => tile('<rect x="36" y="17" width="17" height="11" rx="5.5" class="ill-fg"/><rect x="26" y="31" width="37" height="52" rx="13" class="ill-fg"/>' +
    '<rect x="33" y="50" width="23" height="13" rx="6.5" class="ill-bg"/>' + dot(77, 72, 11.5) + '<path d="M70.5 72H83.5" class="ill-cut" stroke-width="3"/>');
})();

/* ───────── Pharmacopée en tuiles fusionnées (planche 4) ───────── */
const FILTERS = D.filters || [];
VIZ.tiles = {
  html(cfg) {
    const groups = (D.tileGroups || []).filter(g => !cfg.groups || cfg.groups.includes(g.id));
    let h = '<div class="tiles' + (cfg.mode === 'deck' ? ' in-deck' : '') + '">' + (cfg.mode === 'deck' ? '' : '<div class="tl-filters" role="group" aria-label="Filtrer selon le profil">' + FILTERS.map(([k, l]) => '<button type="button" class="chip" data-flt="' + k + '" aria-pressed="false">' + esc(l) + '</button>').join('') + '<button type="button" class="chip ghost" data-flt="" hidden>Effacer</button></div>') + '<div class="tl-map"' + (cfg.gridCols && cfg.mode === 'deck' ? ' style="grid-template-columns:' + esc(cfg.gridCols) + '"' : '') + '>';
    groups.forEach(gr => {
      h += '<section class="tl-grp" data-grp="' + gr.id + '"><header><span class="eyebrow">' + esc(gr.t) + '</span>' + (gr.nbn ? '<span class="nbn">' + md(gr.nbn) + '</span>' : '') + '</header><div class="tl-blob">' + gr.mols.map(id => { const M = MOLS[id]; if (!M) return ''; return '<button type="button" class="tile" data-pane="' + id + '" data-tags="' + esc((M.tags || []).join(' ')) + '"><b>' + esc(M.dci) + '</b><span class="br">' + esc(M.brand || '') + '</span>' + (M.note ? '<span class="tn">' + esc(M.note) + '</span>' : '') + '</button>'; }).join('') + '</div></section>';
    });
    return h + '</div><p class="tl-count note" aria-live="polite"></p></div>';
  },
  mount(el, cfg) {
    const root = $('.tiles', el); const on = new Set(cfg.tags || []);
    const apply = () => {
      let n = 0, tot = 0; $$('.tile', root).forEach(t => { tot++; const tg = (t.dataset.tags || '').split(' '); const ok = [...on].every(k => tg.includes(k)); t.classList.toggle('dim', on.size > 0 && !ok); t.classList.toggle('hit', on.size > 0 && ok); if (ok) n++; });
      $$('[data-flt]', root).forEach(b => { if (b.dataset.flt) b.setAttribute('aria-pressed', on.has(b.dataset.flt)); else b.hidden = !on.size; });
      const c = $('.tl-count', root); if (c) c.textContent = on.size ? n + ' ' + (n > 1 ? (D.site.molWord || 'molécules') : (D.site.molWord1 || 'molécule')) + ' sur ' + tot + ' : ' + [...on].map(k => FILTERS.find(f => f[0] === k)[1].toLowerCase()).join(' + ') + '.' : tot + ' ' + (D.site.molWord || 'molécules') + '. ' + (FILTERS.length ? 'Choisis un ou plusieurs profils pour filtrer ; un' : 'Un') + ' clic sur une tuile ouvre sa fiche.';
    };
    root.addEventListener('click', e => { const b = e.target.closest('[data-flt]'); if (!b) return; const k = b.dataset.flt; if (!k) on.clear(); else on.has(k) ? on.delete(k) : on.add(k); apply(); });
    apply();
    return { step(s) { let st = null; cfg.steps.forEach(x => { if (x.f <= s) st = x; }); on.clear(); ((st && st.tags) || cfg.tags || []).forEach(t => on.add(t)); apply(); } };
  }
};

