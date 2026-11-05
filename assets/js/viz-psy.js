/* Kaléidoscopiques Psychédéliques — visualisations du cours : durées des effets, neurone pyramidal, cerveau bayésien,
   paysage des attracteurs en relief, cycle de l’addiction, intensité de l’expérience, jour de la session ;
   figure statique des réseaux.
   Chaque visualisation suit le registre de base.js : html(cfg) → chaîne ; mount(el, cfg, mode) → { step, start, stop, destroy }.
   En projection, les étapes (cfg.steps, indices f) pilotent l’état ; à la lecture, un pas-à-pas et des réglages. */
'use strict';
(() => {

/* ───────── Utilitaires partagés ───────── */
const r1 = v => Math.round(v * 10) / 10;
const L10 = Math.log10;
const ss = x => x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x);
const lerp = (a, b, t) => a + (b - a) * t;
/* texte SVG : échappé, indices typographiques (5-HT2A), espaces insécables ; jamais de flèches dessinées */
const st = s => typoS(esc(s));
const T = (x, y, s, cls, anchor, extra) => '<text x="' + r1(x) + '" y="' + r1(y) + '"' + (cls ? ' class="' + cls + '"' : '') + (anchor && anchor !== 'start' ? ' text-anchor="' + anchor + '"' : '') + (extra || '') + '>' + st(s) + '</text>';
const svgOpen = (w, h, cls, label) => '<svg class="' + cls + '" viewBox="0 0 ' + Math.round(w) + ' ' + Math.round(h) + '" width="' + Math.round(w) + '" height="' + Math.round(h) + '" role="img" aria-label="' + esc(label) + '">';
/* l’étape courante en projection : la dernière dont l’indice f est atteint (aucune à l’étape 0) */
const stepAt = (cfg, s) => { let x = null; (cfg.steps || []).forEach(y => { if (y.f <= s) x = y; }); return x; };
/* largeur disponible (lecture) : redessiner quand elle change vraiment */
function watchW(el, fn) {
  if (!('ResizeObserver' in window)) { fn(el.clientWidth || 900); return () => { }; }
  let last = -99, raf = 0;
  const ro = new ResizeObserver(es => { const w = Math.round(es[0].contentRect.width); if (!w || Math.abs(w - last) < 10) return; last = w; cancelAnimationFrame(raf); raf = requestAnimationFrame(() => fn(w)); });
  ro.observe(el); return () => { ro.disconnect(); cancelAnimationFrame(raf); };
}
/* interpolation douce entre deux jeux de paramètres (désactivée si mouvement réduit) */
function tweener(apply) {
  let raf = 0, cur = null;
  return {
    to(target, ms = 700) {
      cancelAnimationFrame(raf);
      if (!cur || reduceMotion() || !ms) { cur = { ...target }; apply(cur); return; }
      const from = { ...cur }, t0 = performance.now();
      const tick = now => { const k = ss(Math.min(1, (now - t0) / ms)); const o = {}; for (const key in target) o[key] = typeof target[key] === 'number' && typeof from[key] === 'number' ? lerp(from[key], target[key], k) : target[key]; cur = o; apply(o); if (k < 1) raf = requestAnimationFrame(tick); };
      raf = requestAnimationFrame(tick);
    },
    get cur() { return cur; },
    stop() { cancelAnimationFrame(raf); }
  };
}
/* pas-à-pas de la lecture : étapes nommées, précédent / suivant */
function stepperHTML(labels, label) {
  return '<div class="px-steps" role="group" aria-label="' + esc(label || 'Étapes') + '"><button type="button" class="px-nav" data-nav="-1" aria-label="Étape précédente">' + arrow('l', 'in') + '</button><ol>' +
    labels.map((l, i) => '<li><button type="button" class="px-st" data-st="' + i + '"><span class="n">' + (i + 1) + '</span>' + esc(l) + '</button></li>').join('') +
    '</ol><button type="button" class="px-nav" data-nav="1" aria-label="Étape suivante">' + arrow('r', 'in') + '</button></div>';
}
function stepperBind(root, n, go) {
  const box = $('.px-steps', root); if (!box) return () => { };
  let cur = 0;
  const show = i => { cur = i; $$('.px-st', box).forEach((b, j) => { b.setAttribute('aria-current', j === i ? 'step' : 'false'); b.classList.toggle('done', j < i); }); $$('.px-nav', box).forEach(b => { b.disabled = (+b.dataset.nav < 0 && i <= 0) || (+b.dataset.nav > 0 && i >= n - 1); }); };
  box.addEventListener('click', e => { const b = e.target.closest('button'); if (!b || b.disabled) return; const i = b.dataset.st !== undefined ? +b.dataset.st : clamp(cur + +b.dataset.nav, 0, n - 1); show(i); go(i); });
  return show;
}
const chip = (k, lab, pressed, cls) => '<button type="button" class="chip' + (cls ? ' ' + cls : '') + '" data-k="' + k + '" aria-pressed="' + (pressed ? 'true' : 'false') + '">' + lab + '</button>';
const capHTML = (eyebrow, title, text) => '<span class="eyebrow">' + esc(eyebrow) + '</span><h4>' + md(title) + '</h4>' + (text ? '<p>' + md(text) + '</p>' : '');
/* en projection, la légende d’une étape se réduit à son titre et à une ligne (ds) ; le texte complet va dans les notes */
const capPick = (deck, p, ds) => deck ? (ds || '') : p;
const notesList = rows => '<ol class="nt-steps">' + rows.map(([t, p]) => '<li><b>' + md(t) + '</b> · ' + md(p) + '</li>').join('') + '</ol>';

/* ═════════ 1. Durées des effets : une crête par substance, sur une échelle de temps linéaire, en heures ═════════ */
/* p : début, début du plateau, fin du plateau, fin (minutes après la prise) : allure d’après les fiches (SPF 2022,
   Ley 2023, RCP) ; m : repères affichés (début, pic, fin) ; sh : épaulement de l’ibogaïne (phase de réflexion) */
const DUR = {
  dmt: { n: 'DMT', s: 'inhalée', fam: 'cl', p: [0.25, 1.5, 5, 20], d: '≈ 15 min', m: ['quelques secondes', '2–5 min', '15–20 min'] },
  meodmt: { n: '5-MeO-DMT', s: 'inhalée', fam: 'cl', p: [0.25, 1.2, 6, 30], d: '15–30 min', m: ['quelques secondes', 'quelques minutes', '15–30 min'] },
  ketamine: { n: 'Kétamine', s: 'IV, 0,5 mg/kg en 40 min', fam: 'di', p: [3, 15, 40, 110], d: '1–2 h', m: ['pendant la perfusion', 'fin de perfusion', '1–2 h'] },
  psilocybine: { n: 'Psilocybine', s: 'orale, 25 mg', fam: 'cl', p: [25, 70, 160, 330], d: '4–6 h', m: ['20–40 min', '1–2 h', '4–6 h'] },
  mdma: { n: 'MDMA', s: 'orale', fam: 'en', p: [35, 80, 140, 330], d: '4–6 h', m: ['30–60 min', '1,5–2 h', '4–6 h'] },
  ayahuasca: { n: 'Ayahuasca', s: 'orale, DMT + IMAO', fam: 'cl', p: [35, 80, 130, 320], d: '4–6 h', m: ['30–60 min', '1,5–2 h', '4–6 h'] },
  lsd: { n: 'LSD', s: 'orale, 100 µg', fam: 'cl', p: [40, 120, 270, 640], d: '8–12 h', m: ['30–60 min', '2–3 h', '8–12 h'] },
  mescaline: { n: 'Mescaline', s: 'orale, 500 mg', fam: 'cl', p: [75, 200, 330, 820], d: '12–14 h', m: ['1–2 h', '3–4 h', '12–14 h'] },
  ibogaine: { n: 'Ibogaïne', s: 'orale', fam: 'at', p: [100, 260, 480, 2160], d: '24–36 h', m: ['1–3 h', '4–8 h, visions', '24–36 h'], sh: [720, 1440, 0.42] }
};
const DUR_ORDER = ['dmt', 'meodmt', 'ketamine', 'psilocybine', 'mdma', 'ayahuasca', 'lsd', 'mescaline', 'ibogaine'];
const FAM_LAB = { cl: 'Psychédélique classique', di: 'Dissociatif', en: 'Entactogène', at: 'Atypique' };
/* le temps est en heures, sur un axe linéaire : la longueur d’une crête est sa durée. L’axe va de 0 à 18 h ;
   l’ibogaïne (24 à 36 h) sort du cadre, une flèche le signale. */
const T_MAX = 1080;
function intensity(D, t) {
  const [t0, a, b, t1] = D.p; if (t <= t0 || t >= t1) return 0;
  if (t < a) return ss((t - t0) / (a - t0));
  if (t <= b) return 1;
  if (D.sh) { const [c, d, lv] = D.sh; if (t < c) return 1 - (1 - lv) * ss((t - b) / (c - b)); if (t < d) return lv; return lv * (1 - ss((t - d) / (t1 - d))); }
  return 1 - ss((t - b) / (t1 - b));
}
/* LSD 100 µg puis kétansérine 40 mg à 1 h : la durée moyenne des effets passe de 8,5 à 3,5 h (Becker 2023) */
const ketK = t => t < 75 ? 1 : t > 215 ? 0 : 1 - ss((t - 75) / (215 - 75));
/* graduations : « 0 », « 30 min », « 1 h », « 1 h 30 »… ; le pas dépend de la place disponible */
const hLab = m => m === 0 ? '0' : m < 60 ? m + NB + 'min' : (m / 60 | 0) + NB + 'h' + (m % 60 ? NB + (m % 60) : '');
function hTicks(tmax, pxPerMin, gap) {
  const st = [15, 30, 60, 120, 180, 240, 360, 720].find(x => x * pxPerMin >= gap) || 720;
  const out = []; for (let t = 0; t <= tmax + 0.01; t += st) out.push([t, hLab(t)]); return out;
}
/* repères d’une crête seule à l’écran : trois points (début, pic, fin) et une ligne de texte au-dessus */
function durMarks(D, X, yb, hh, F, fz, tmax) {
  const [t0, pa, pb, t1] = D.p, tEnd = Math.min(D.sh ? D.sh[1] * 1.25 : t1, tmax);
  const dots = [[t0, yb], [(pa + pb) / 2, yb - hh], [tEnd, yb]].map(([t, y]) => '<circle cx="' + r1(X(t)) + '" cy="' + r1(y) + '" r="' + F.r + '"/>').join('');
  const txt = 'début : ' + D.m[0] + '  ·  pic : ' + D.m[1] + '  ·  fin : ' + D.m[2] + (D.p[3] > tmax ? ' →' : '');
  return '<g class="marks">' + dots + T(X(t0), yb - hh - F.mk * 0.95, txt, 'mk', 'start', fz('mk')) + '</g>';
}

VIZ.durees = {
  html(cfg) {
    const deck = cfg.mode === 'deck', ids = rowsFor(cfg), fams = [...new Set(ids.map(id => DUR[id].fam))];
    return '<div class="dur' + (deck ? ' in-deck' : '') + '"><div class="dur-top"><div class="px-leg" aria-label="Familles">' + fams.map(fm => '<span><i class="sw fam-' + fm + '"></i>' + esc(FAM_LAB[fm]) + '</span>').join('') + '</div>' +
      (deck ? '' : '<div class="dur-chips" role="group" aria-label="Substances affichées">' + ids.map(id => chip(id, esc(DUR[id].n), true)).join('') + chip('ket', 'LSD + kétansérine', false, 'k-ket') + '</div>') +
      '</div><div class="dur-fig">' + (deck ? durSVG(ids, 1408, true) : '') + '</div></div>';
  },
  mount(el, cfg, mode) {
    const deck = mode === 'deck', root = $('.dur', el), fig = $('.dur-fig', root), ids = rowsFor(cfg);
    const on = new Set(deck ? [] : ids); let ket = false, stopW = null;
    const apply = () => {
      const svg = $('svg', fig); if (!svg) return;
      const single = on.size === 1 && !ket ? [...on][0] : null;
      $$('.dr-row', svg).forEach(g => { const id = g.dataset.id; g.classList.toggle('off', !on.has(id) && !(ket && deck)); g.classList.toggle('dim', ket && id !== 'lsd'); g.classList.toggle('ann', id === single); });
      svg.classList.toggle('ket', ket);
      $$('.chip', root).forEach(b => b.setAttribute('aria-pressed', b.dataset.k === 'ket' ? ket : on.has(b.dataset.k)));
    };
    const draw = w => { fig.innerHTML = durSVG(ids, w, deck); apply(); };
    if (deck) apply();
    else {
      stopW = watchW(fig, draw);
      root.addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; const k = b.dataset.k;
        if (k === 'ket') { ket = !ket; if (ket) on.add('lsd'); } else { on.has(k) ? on.delete(k) : on.add(k); if (k === 'lsd' && !on.has('lsd')) ket = false; } apply(); });
    }
    return {
      step(s) { if (!deck) return; const x = stepAt(cfg, s); on.clear(); ket = !!(x && x.ket); ((x && x.on) || []).forEach(k => { if (DUR[k]) on.add(k); }); apply(); },
      destroy() { stopW && stopW(); }
    };
  }
};
/* profil d’action en miniature, pour les diapositives de molécule : le même temps linéaire, en heures, sur un axe
   ajusté aux substances montrées ; une colline par substance, la durée à droite (et le nom à gauche quand il y en a plusieurs) */
function durMini(ids, w, deck) {
  ids = (ids || []).filter(id => DUR[id]); if (!ids.length) return '';
  const many = ids.length > 1, F = deck ? { nm: 19, sb: 14, du: 19, ax: 14.5 } : { nm: 13.5, sb: 11, du: 13.5, ax: 11.5 };
  const LW = many ? (deck ? 150 : 106) : 0, RW = deck ? 92 : 66, x0 = LW + (many ? 14 : 2), x1 = w - RW - 6;
  const RH = many ? (deck ? 60 : 46) : (deck ? 104 : 76), top = deck ? 10 : 8, axY = top + RH * ids.length + 4, H = axY + F.ax * 1.9 + 4;
  const tmax = [120, 180, 240, 360, 480, 720, 960, 1440, 2160].find(x => x >= Math.max(...ids.map(id => DUR[id].p[3])) - 0.01) || 2160;
  const X = t => x0 + Math.min(t, tmax) / tmax * (x1 - x0);
  let g = '';
  hTicks(tmax, (x1 - x0) / tmax, deck ? 90 : 70).forEach(([t, lab]) => {
    g += '<line class="grid" x1="' + r1(X(t)) + '" x2="' + r1(X(t)) + '" y1="' + top + '" y2="' + axY + '"/>' + T(X(t), axY + F.ax * 1.45, lab, 'ax', t === 0 ? 'start' : 'middle', ' font-size="' + F.ax + '"'); });
  g += '<line class="axis" x1="' + x0 + '" x2="' + x1 + '" y1="' + axY + '" y2="' + axY + '"/>';
  ids.forEach((id, i) => {
    const D = DUR[id], yb = top + (i + 1) * RH - 4, hh = RH - (many ? 12 : 16), a = D.p[0], b = Math.min(tmax, D.p[3]);
    let d = ''; const n = 160; for (let k = 0; k <= n; k++) { const t = a + (b - a) * k / n; d += (k ? 'L' : 'M') + r1(X(t)) + ' ' + r1(yb - intensity(D, t) * hh); }
    g += '<g class="dr-row"><title>' + esc(D.n + ' (' + D.s + ') : ' + D.d) + '</title><line class="base" x1="' + x0 + '" x2="' + x1 + '" y1="' + yb + '" y2="' + yb + '"/>' +
      '<path class="hill fam-' + D.fam + '" d="' + d + 'L' + r1(X(b)) + ' ' + yb + 'L' + r1(X(a)) + ' ' + yb + 'Z"/>' +
      (many ? T(LW, yb - hh / 2 - F.sb * 0.2, D.n, 'nm', 'end', ' font-size="' + F.nm + '"') + T(LW, yb - hh / 2 + F.sb * 1.15, D.s, 'sb', 'end', ' font-size="' + F.sb + '"') : '') +
      T(w - 4, yb - hh / 2 + F.du * 0.35, D.d, 'du', 'end', ' font-size="' + F.du + '"') + '</g>';
  });
  return svgOpen(w, H, 'dur-svg dur-mini', 'Profil d’action de ' + ids.map(id => DUR[id].n).join(', ') + ' : intensité des effets heure par heure, sur un axe de 0 à ' + (tmax / 60) + ' heures') + g + '</svg>';
}
window.durMini = durMini;
/* les lignes : en projection, seulement les substances qui apparaissent à une étape */
function rowsFor(cfg) {
  if (cfg.mode === 'deck' && cfg.steps && cfg.steps.length) { const u = new Set(); cfg.steps.forEach(x => (x.on || []).forEach(k => u.add(k))); return DUR_ORDER.filter(k => u.has(k)); }
  return DUR_ORDER.slice();
}
function durSVG(ids, w, deck) {
  const narrow = !deck && w < 640;
  const F = deck ? { nm: 23, sb: 15.5, ax: 15, hd: 13, du: 19, mk: 15, care: 15, k: 17, r: 5.5 } : narrow ? { nm: 14, sb: 11.5, ax: 11.5, hd: 11, du: 12.5, mk: 11.5, care: 11.5, k: 12, r: 4 } : { nm: 15.5, sb: 12, ax: 12.5, hd: 11.5, du: 14, mk: 12.5, care: 12.5, k: 13.5, r: 4 };
  const fz = k => ' font-size="' + F[k] + '"';
  const LW = narrow ? 0 : Math.round(deck ? 252 : Math.min(200, Math.max(150, w * 0.2))), RW = Math.round(deck ? 118 : narrow ? 66 : 86);
  const x0 = LW + (narrow ? 2 : 18), x1 = w - RW - 10;
  const RH = deck ? Math.min(66, 500 / ids.length) : narrow ? 64 : 52, top = deck ? 34 : 28;
  const axY = top + RH * ids.length + 6, cy = axY + F.ax * 3.4 + (deck ? 22 : 16), H = cy + F.care * 2.8;
  const X = t => x0 + Math.min(t, T_MAX) / T_MAX * (x1 - x0);
  let g = '';
  hTicks(T_MAX, (x1 - x0) / T_MAX, deck ? 50 : narrow ? 36 : 42).forEach(([t, lab]) => { g += '<line class="grid" x1="' + r1(X(t)) + '" x2="' + r1(X(t)) + '" y1="' + (top - 4) + '" y2="' + axY + '"/>' + T(X(t), axY + F.ax * 1.45, lab, 'ax', t === 0 ? 'start' : 'middle', fz('ax')); });
  g += '<line class="axis" x1="' + x0 + '" x2="' + x1 + '" y1="' + axY + '" y2="' + axY + '"/>';
  g += T(x0, axY + F.ax * 2.9, narrow ? 'Temps après la prise, en heures' : 'Temps après la prise, en heures ; hauteur : intensité ressentie', 'ax2', 'start', fz('ax'));
  if (!narrow) g += T(LW, top - 12, 'SUBSTANCE', 'hd', 'end', fz('hd')) + T(w - 10, top - 12, 'DURÉE', 'hd', 'end', fz('hd'));
  /* l’organisation des soins qu’impose la durée ; la première bande, étroite, porte son mot en commençant à gauche */
  const CARE = [[0, 60, 'consultation'], [60, 480, 'hôpital de jour'], [480, 900, 'longue journée'], [900, T_MAX, 'hospitalisation']];
  if (!narrow) CARE.forEach(([a, b, lab], i) => { const xa = X(a) + 3, xb = X(b) - 3, two = (xb - xa) < F.care * 0.56 * lab.length && i > 0;
    g += '<path class="care-l" d="M' + r1(xa) + ' ' + (cy - 7) + 'V' + cy + 'H' + r1(xb) + 'V' + (cy - 7) + '"/>' +
      (i === 0 ? T(xa, cy + F.care * 1.25, lab, 'care', 'start', fz('care'))
        : two ? T((xa + xb) / 2, cy + F.care * 1.25, lab.split(' ')[0], 'care', 'middle', fz('care')) + T((xa + xb) / 2, cy + F.care * 2.35, lab.split(' ').slice(1).join(' '), 'care', 'middle', fz('care'))
        : T((xa + xb) / 2, cy + F.care * 1.25, lab, 'care', 'middle', fz('care'))); });
  ids.forEach((id, i) => {
    const D = DUR[id], yb = top + (i + 1) * RH - 6, hh = narrow ? RH - 28 : RH - 14;
    const path = (fn, a, b) => { let d = ''; const n = 180; for (let k = 0; k <= n; k++) { const t = a + (b - a) * k / n; d += (k ? 'L' : 'M') + r1(X(t)) + ' ' + r1(yb - fn(t) * hh); } return d; };
    const a = D.p[0], b = Math.min(T_MAX, D.p[3]), cut = D.p[3] > T_MAX;
    const dHill = path(t => intensity(D, t), a, b);
    let row = '<g class="dr-row" data-id="' + id + '"><title>' + esc(D.n + ' (' + D.s + ') : ' + (MOLS[id] && MOLS[id].pk ? plain(MOLS[id].pk) : D.d)) + '</title>';
    row += '<line class="base" x1="' + x0 + '" x2="' + x1 + '" y1="' + yb + '" y2="' + yb + '"/>';
    row += '<path class="hill fam-' + D.fam + '" d="' + dHill + 'L' + r1(X(b)) + ' ' + yb + 'L' + r1(X(a)) + ' ' + yb + 'Z"/>';
    /* au-delà de 18 h : une flèche dans le prolongement de la crête */
    if (cut) { const ye = r1(yb - intensity(D, T_MAX) * hh / 2), L = deck ? 24 : 16; row += '<path class="cont fam-' + D.fam + '" d="M' + r1(x1 + 5) + ' ' + ye + 'h' + L + 'm-6 -5.5l6 5.5l-6 5.5"/>'; }
    const lab = narrow
      ? '<text x="' + x0 + '" y="' + r1(yb - hh - 8) + '"><tspan class="nm"' + fz('nm') + '>' + st(D.n) + '</tspan><tspan class="sb" dx="7"' + fz('sb') + '>' + st(D.s) + '</tspan></text>'
      : T(LW, yb - hh / 2 - F.sb * 0.25, D.n, 'nm', 'end', fz('nm')) + T(LW, yb - hh / 2 + F.sb * 1.1, D.s, 'sb', 'end', fz('sb'));
    const hit = narrow ? '<rect class="hit" x="' + x0 + '" y="' + r1(yb - hh - 8 - F.nm) + '" width="' + r1((x1 - x0) * 0.62) + '" height="' + r1(F.nm + 8) + '"/>' : '<rect class="hit" x="0" y="' + r1(yb - RH + 8) + '" width="' + (LW + 6) + '" height="' + r1(RH - 6) + '"/>';
    row += '<g class="lab" data-pane="' + id + '" role="button" tabindex="0" aria-label="Fiche : ' + esc(D.n) + '">' + hit + lab + '</g>';
    row += T(w - 10, narrow ? yb - hh - 8 : yb - hh / 2 + F.du * 0.35, D.d, 'du', 'end', fz('du'));
    /* repères début · pic · fin, quand la substance est seule à l’écran */
    if (!narrow) row += durMarks(D, X, yb, hh, F, fz, T_MAX);
    if (id === 'lsd') {
      const dK = path(t => intensity(D, t) * ketK(t), 40, 215);
      row += '<g class="ketg"><path class="ghost" d="' + dHill + '"/><path class="hill-k" d="' + dK + 'L' + r1(X(215)) + ' ' + yb + 'L' + r1(X(40)) + ' ' + yb + 'Z"/>' +
        '<line class="kmark" x1="' + r1(X(60)) + '" x2="' + r1(X(60)) + '" y1="' + r1(yb + 4) + '" y2="' + r1(yb - hh - 10) + '"/>' +
        T(X(60) + 8, yb - hh - 4, 'kétansérine à 1 h', 'kl', 'start', fz('k')) +
        T(X(560), yb - hh * 0.55, 'seul : 8,5 h', 'kl', 'start', fz('k')) + T(X(230), yb - 6, 'avec : 3,5 h', 'kl strong', 'start', fz('k')) + '</g>';
    }
    g += row + '</g>';
  });
  return svgOpen(w, H, 'dur-svg', 'Durée des effets de ' + ids.map(id => DUR[id].n).join(', ') + ', sur un axe du temps en heures, de 0 à 18 h') + g + '</svg>';
}

/* ═════════ 2. Le neurone pyramidal : de la psilocybine aux nouvelles épines, en sept étapes ═════════ */
const RC_STEPS = [
  ['Un neurone pyramidal de la couche V', 'Avançons pas à pas : de la molécule au récepteur, du récepteur au neurone, du neurone aux nouvelles connexions. Modèle simplifié, issu surtout de l’animal.'],
  ['5-HT2A, sur les dendrites apicales', 'Le récepteur {{c-5ht2a|5-HT2A}} est très dense sur les dendrites apicales des [[neurone-pyramidal|neurones pyramidaux]] de la couche V du cortex associatif : ils intègrent l’information de tout le cortex et la renvoient vers le thalamus et les autres aires.'],
  ['La psilocybine devient psilocine', 'La psilocybine est un [[promedicament|promédicament]] : dans l’intestin et le foie, des phosphatases lui retirent son phosphate. La psilocine, plus lipophile, franchit la barrière hémato-encéphalique.'],
  ['Le neurone s’excite', 'La psilocine active 5-HT2A, couplé à la protéine [[gq|Gq]] : phospholipase C, IP3, calcium. Le neurone se dépolarise et décharge davantage, de façon moins ordonnée : l’une des sources de l’[[entropie]].'],
  ['Une bouffée de glutamate', 'Excités, les neurones pyramidaux libèrent davantage de glutamate, qui active les récepteurs [[ampa|AMPA]] de leurs voisins : le cortex devient plus excitable (Aghajanian et Marek 1997).'],
  ['BDNF et TrkB : deux portes', 'L’activité libère du [[bdnf|BDNF]], qui se fixe à son récepteur {{c-trkb|TrkB}}. Seconde porte : le LSD et la psilocine se fixent eux-mêmes à TrkB et y renforcent l’action du BDNF (Moliner 2023).'],
  ['De nouvelles épines', 'TrkB active [[mtor|mTOR]] et la synthèse de protéines synaptiques : de nouvelles [[epine|épines dendritiques]] apparaissent. Chez la souris, une dose de psilocybine les augmente d’environ 10 % en 24 heures, pour au moins un mois (Shao 2021).'],
  ['Des récepteurs à l’intérieur', 'Une partie des récepteurs 5-HT2A est à l’intérieur du neurone. La psilocine, lipophile, traverse la membrane et les active ; la sérotonine, chargée, ne le peut pas : ce serait l’une des raisons pour lesquelles elle ne déclenche pas cette plasticité (Vargas 2023).']
];
const RC_SHORT = ['5-HT2A', 'Psilocine', 'Excitation', 'Glutamate', 'BDNF et TrkB', 'Épines', 'Récepteurs internes'];
const RC_DS = ['De la molécule aux nouvelles connexions.', 'Dense sur les dendrites apicales, couche V.', 'Un promédicament : la psilocine entre dans le cerveau.', 'Gq, calcium : une décharge accrue, moins ordonnée.', 'Les voisins s’excitent à leur tour (AMPA).', 'Le BDNF, et une fixation directe sur TrkB.', 'mTOR : 10 % d’épines en plus en 24 h (souris).', 'La psilocine les atteint ; la sérotonine, non.'];
VIZ.recepteur = {
  notes() { return notesList(RC_STEPS.slice(1)); },
  html(cfg) {
    const deck = cfg.mode === 'deck';
    return '<div class="rc' + (deck ? ' in-deck' : '') + '">' + (deck ? '' : stepperHTML(RC_SHORT, 'Étapes de la cascade')) +
      '<div class="rc-grid"><div class="rc-fig">' + rcSVG() + '</div><div class="rc-side"><div class="px-cap" aria-live="polite"></div>' +
      (deck ? '<ol class="rc-list">' + RC_SHORT.map((t, i) => '<li data-i="' + (i + 1) + '"><span class="n">' + (i + 1) + '</span>' + esc(t) + '</li>').join('') + '</ol>' : '') + '</div></div></div>';
  },
  mount(el, cfg, mode) {
    const deck = mode === 'deck', root = $('.rc', el), svg = $('.rc-svg', root), cap = $('.px-cap', root);
    let cur = -1;
    const set = k => {
      if (k === cur) return; cur = k;
      $$('[data-s]', svg).forEach(g => { const s0 = +g.dataset.s, to = +(g.dataset.to || 99), hl = (g.dataset.hl || g.dataset.s).split(',').map(Number), on = s0 <= k && k <= to; g.classList.toggle('on', on); g.classList.toggle('cur', on && hl.includes(k)); });
      svg.dataset.k = k;
      const [t, p] = RC_STEPS[k]; cap.innerHTML = capHTML(k ? 'Étape ' + k + ' sur 7' : 'Le neurone', t, capPick(deck, p, RC_DS[k])); cap.classList.remove('px-fade'); void cap.offsetWidth; cap.classList.add('px-fade');
      $$('.rc-list li', root).forEach(li => { const i = +li.dataset.i; li.classList.toggle('done', i < k); li.classList.toggle('cur', i === k); });
    };
    let show = null;
    if (!deck) { show = stepperBind(root, 7, i => set(i + 1)); show(0); }
    /* en lecture : vue resserrée sur le zoom quand la place manque */
    const stopW = deck ? null : watchW($('.rc-fig', root), w => svg.setAttribute('viewBox', w < 520 ? '322 18 586 604' : '0 0 910 640'));
    set(deck ? 0 : 1);
    return { step(s) { if (!deck) return; let k = 0; (cfg.steps || []).forEach((x, i) => { if (x.f <= s) k = x.s || i + 1; }); set(k); }, destroy() { stopW && stopW(); } };
  }
};
function rcSVG() {
  const P = (d, cls, extra) => '<path d="' + d + '" class="' + cls + '"' + (extra || '') + '/>';
  const C = (x, y, r, cls) => '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" class="' + cls + '"/>';
  const hex = (x, y, r, cls) => '<polygon class="' + cls + '" points="' + [0, 1, 2, 3, 4, 5].map(i => { const a = Math.PI / 6 + i * Math.PI / 3; return r1(x + r * Math.cos(a)) + ',' + r1(y + r * Math.sin(a)); }).join(' ') + '"/>';
  /* un groupe par étape : s = étape d’apparition, hl = étapes où il est mis en avant, to = dernière étape où il reste ; ses
     étiquettes (lb) ne se lisent que lorsqu’il est mis en avant */
  const G = (s, inner, lb, o = {}) => '<g class="rc-g" data-s="' + s + '"' + (o.hl ? ' data-hl="' + o.hl + '"' : '') + (o.to ? ' data-to="' + o.to + '"' : '') + '>' + inner + (lb ? '<g class="lb">' + lb + '</g>' : '') + '</g>';
  const arrowTo = (x1, y1, x2, y2) => { const a = Math.atan2(y2 - y1, x2 - x1), h = 9; return P('M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2, 'rc-ar') + '<path class="rc-arh" d="M' + r1(x2) + ' ' + r1(y2) + 'L' + r1(x2 - h * Math.cos(a - 0.45)) + ' ' + r1(y2 - h * Math.sin(a - 0.45)) + 'L' + r1(x2 - h * Math.cos(a + 0.45)) + ' ' + r1(y2 - h * Math.sin(a + 0.45)) + 'Z"/>'; };
  let g = '';
  /* — vue d’ensemble : couches du cortex et neurone pyramidal — */
  const LY = [['I', 30, 92], ['II–III', 92, 246], ['IV', 246, 322], ['V', 322, 500], ['VI', 500, 606]];
  g += '<g class="rc-layers">' + LY.map(([n, a, b], i) => '<rect x="8" y="' + a + '" width="296" height="' + (b - a) + '" class="ly' + (i % 2) + '"/>' + T(18, a + 22, n, 'lyl')).join('') + T(296, 630, 'cortex', 'lyl', 'end') + '</g>';
  g += G(3, '<circle cx="165" cy="430" r="46" class="glow"/>', '', { hl: '3,4' });
  const N = 'M165 398 C 164 330 167 260 165 190 C 163 150 166 115 165 92';
  g += '<g class="rc-neuron">' +
    P(N, 'nd', ' stroke-width="6"') + P('M165 300 C 163 250 166 200 165 160', 'nd', ' stroke-width="7.5"') +
    P('M165 92 C 150 78 128 62 104 44 M165 92 C 158 70 150 54 142 36 M165 92 C 174 70 184 52 196 38 M165 92 C 184 80 210 68 232 56 M128 62 C 118 64 104 70 92 74 M184 52 C 192 44 206 36 218 32', 'nd', ' stroke-width="3"') +
    P('M165 330 C 148 318 132 304 116 288 M165 296 C 182 286 198 274 216 260 M165 236 C 150 226 138 214 126 200 M165 196 C 178 188 192 178 206 166', 'nd', ' stroke-width="3.4"') +
    P('M147 452 C 132 470 118 486 100 498 M158 456 C 150 478 140 500 126 520 M174 456 C 184 480 196 500 210 516 M184 450 C 200 464 214 474 232 482', 'nd', ' stroke-width="3.6"') +
    P('M165 458 C 166 500 164 560 165 612', 'nd', ' stroke-width="2"') + P('M165 540 C 182 552 200 562 220 566', 'nd', ' stroke-width="1.6"') +
    '<path class="soma" d="M165 386 C 170 386 196 440 197 452 C 198 460 132 460 133 452 C 134 440 160 386 165 386 Z"/>' +
    T(208, 424, 'corps cellulaire', 'lab-s') + T(150, 600, 'axone', 'lab-s', 'end') + T(178, 126, 'dendrite apicale', 'lab-s') + '</g>';
  const RD = [[165, 112], [165, 140], [165, 168], [165, 214], [165, 262], [165, 310], [165, 354], [140, 48], [115, 54], [196, 44], [218, 61], [100, 72], [130, 210], [207, 168], [121, 292], [210, 266]];
  g += G(1, RD.map(([x, y]) => C(x + (x === 165 ? (y % 2 ? 6 : -6) : 0), y, 4.6, 'r5')).join(''), '', { hl: '1,7' });
  g += '<g class="rc-zoom">' + C(165, 186, 30, 'zc') + P('M190 170 L 330 30 M190 204 L 330 618', 'zl') + '</g>';
  let spk = ''; [0, 9, 13, 27, 31, 34, 48, 58, 61, 66, 80, 87, 98].forEach(t => { spk += 'M' + (226 + t * 0.8) + ' 588 v-20'; });
  g += G(3, P(spk, 'spk'), T(226, 610, 'décharges', 'lab-s'), { hl: '3,4' });
  /* — zoom : la membrane d’une dendrite apicale — */
  g += '<rect x="330" y="20" width="572" height="600" rx="22" class="zoom-bg"/>' + T(352, 50, 'ZOOM : UNE DENDRITE APICALE', 'eyeb');
  const MEM = 'M342 330 H 752 C 762 330 764 318 764 304 L 764 286 C 750 278 750 236 790 232 C 830 236 830 278 816 286 L 816 304 C 816 318 818 330 828 330 H 890';
  g += '<g class="rc-mem">' + P(MEM, 'mem-o') + P(MEM, 'mem-i') + T(888, 308, 'extérieur', 'lab-s', 'end') + T(888, 364, 'intérieur', 'lab-s', 'end') + '</g>';
  g += '<g class="rc-pre"><path class="bouton" d="M736 186 C 730 150 742 112 790 108 C 838 112 850 150 844 186 C 832 200 748 200 736 186 Z"/>' + T(790, 98, 'terminaison voisine', 'lab-s', 'middle') + '</g>';
  /* étape 4 : glutamate et récepteurs AMPA de l’épine */
  g += G(4, [770, 790, 810].map((x, i) => '<rect x="' + (x - 5) + '" y="' + (226 + (i === 1 ? -4 : 0)) + '" width="10" height="20" rx="3" class="ampa"/>').join('') +
    [[760, 160], [782, 150], [806, 162], [822, 146], [770, 136]].map(([x, y]) => C(x, y, 9, 'ves') + C(x, y, 3, 'glu')).join('') +
    '<g class="rel">' + [[764, 206], [778, 213], [790, 204], [802, 214], [815, 207], [785, 220], [797, 222]].map(([x, y]) => C(x, y, 3.6, 'glu')).join('') + '</g>',
    T(726, 172, 'glutamate', 'lab-c', 'end') + T(744, 256, 'AMPA', 'lab-c', 'end'));
  /* les récepteurs 5-HT2A de la membrane : sept hélices */
  const R7 = x => '<rect x="' + (x - 21) + '" y="306" width="42" height="48" rx="9" class="r7"/>' + [0, 1, 2, 3, 4, 5, 6].map(i => '<line x1="' + (x - 15 + i * 5) + '" x2="' + (x - 15 + i * 5) + '" y1="311" y2="349" class="r7h"/>').join('');
  g += G(1, R7(440) + R7(590), T(440, 280, '5-HT2A', 'lab-c', 'middle') + T(590, 280, '5-HT2A', 'lab-c', 'middle'), { hl: '1,3,7' });
  /* étape 2 : psilocybine → psilocine ; la psilocine arrive dans l’espace extracellulaire */
  g += G(2, '<rect x="350" y="64" width="364" height="92" rx="14" class="flow-bg"/>' + hex(384, 102, 15, 'psb') + C(404, 88, 9, 'pho') + '<text x="404" y="92" class="pho-t" text-anchor="middle">P</text>' +
    '<path d="M424 102 H 506" class="rc-ar"/><path class="rc-arh" d="M512 102 l -10 -5 v 10 z"/>' + hex(540, 102, 15, 'psi') + '<path d="M562 102 H 634" class="rc-ar"/><path class="rc-arh" d="M640 102 l -10 -5 v 10 z"/>',
    T(384, 140, 'psilocybine', 'lab-s', 'middle') + T(468, 90, 'phosphatases', 'lab-s', 'middle') + T(468, 124, 'intestin, foie', 'lab-s', 'middle') + T(540, 140, 'psilocine', 'lab-s', 'middle') + T(600, 90, 'sang', 'lab-s', 'middle') + T(676, 106, 'cerveau', 'lab-s', 'middle'), { to: 2 });
  g += G(2, [[410, 216], [470, 240], [522, 196], [556, 244], [628, 210], [478, 182]].map(([x, y]) => hex(x, y, 11, 'psi')).join(''), '', { hl: '2,3', to: 4 });
  /* étape 3 : liaison, Gq, PLC, IP3, calcium, dépolarisation */
  g += G(3, hex(440, 296, 10, 'psi bound') + hex(590, 296, 10, 'psi bound') + '<g class="gq"><circle cx="428" cy="378" r="13" class="gqa"/><circle cx="452" cy="372" r="9" class="gqb"/><circle cx="450" cy="392" r="7" class="gqb"/></g>' +
    arrowTo(440, 396, 440, 420) + '<rect x="410" y="422" width="60" height="26" rx="8" class="node"/>' + arrowTo(440, 450, 440, 474) + '<rect x="410" y="476" width="60" height="26" rx="8" class="node"/>' +
    arrowTo(440, 504, 440, 528) + '<rect x="396" y="530" width="88" height="28" rx="8" class="node ca"/>' + '<g class="plus">' + [372, 400, 520, 548, 626].map(x => T(x, 368, '+', 'pl', 'middle')).join('') + '</g>',
    T(470, 384, 'Gq', 'lab-c', 'start') + T(440, 440, 'PLC', 'lab-n', 'middle') + T(440, 494, 'IP3', 'lab-n', 'middle') + T(440, 549, 'Ca²⁺ ↑', 'lab-n', 'middle'));
  /* étape 5 : BDNF et TrkB ; la psilocine se fixe aussi, directement, à TrkB */
  const TRK = x => '<rect x="' + (x - 10) + '" y="304" width="7" height="54" rx="3" class="trk"/><rect x="' + (x + 3) + '" y="304" width="7" height="54" rx="3" class="trk"/>' + C(x - 7, 296, 7, 'trk') + C(x + 7, 296, 7, 'trk');
  const DIA = (x, y) => '<rect x="' + (x - 6) + '" y="' + (y - 6) + '" width="12" height="12" rx="2" transform="rotate(45 ' + x + ' ' + y + ')" class="bdnf"/>';
  g += G(5, TRK(668) + DIA(640, 236) + DIA(694, 244) + DIA(668, 212) + DIA(668, 280) + hex(684, 334, 8, 'psi bound'),
    T(706, 300, 'TrkB', 'lab-c', 'start') + T(624, 222, 'BDNF', 'lab-c', 'end') + T(692, 386, 'psilocine : liaison directe', 'lab-s', 'start'));
  /* étape 6 : mTOR, synthèse de protéines, nouvelles épines */
  const SP = (x, h) => { const d = 'M' + (x - 9) + ' 330 C ' + (x - 6) + ' ' + (330 - h * 0.4) + ' ' + (x - 6) + ' ' + (330 - h * 0.7) + ' ' + (x - 10) + ' ' + (330 - h * 0.8) + ' C ' + (x - 18) + ' ' + (330 - h * 1.2) + ' ' + (x + 18) + ' ' + (330 - h * 1.2) + ' ' + (x + 10) + ' ' + (330 - h * 0.8) + ' C ' + (x + 6) + ' ' + (330 - h * 0.7) + ' ' + (x + 6) + ' ' + (330 - h * 0.4) + ' ' + (x + 9) + ' 330'; return '<g class="newsp" style="transform-origin:' + x + 'px 330px">' + P(d, 'mem-o') + P(d, 'mem-i') + '</g>'; };
  g += G(6, arrowTo(668, 364, 668, 418) + '<rect x="633" y="420" width="70" height="28" rx="8" class="node"/>' + arrowTo(668, 450, 668, 474) + SP(516, 44) + SP(724, 38),
    T(668, 439, 'mTOR', 'lab-n', 'middle') + T(668, 494, 'protéines synaptiques', 'lab-s', 'middle') + T(516, 262, 'nouvelles épines', 'lab-c', 'middle'));
  /* étape 7 : récepteurs intracellulaires ; la sérotonine reste dehors */
  g += G(7, '<path d="M560 540 C 600 526 650 526 690 540 M556 556 C 600 542 650 542 694 556 M560 572 C 600 558 650 558 690 572" class="golgi"/>' +
    '<rect x="604" y="527" width="22" height="16" rx="4" class="r7"/><rect x="646" y="543" width="22" height="16" rx="4" class="r7"/>' +
    hex(488, 214, 11, 'psi') + P('M490 228 C 492 300 494 400 590 518', 'cross') + '<path class="rc-arh" d="M596 524 L 582 518 L 592 508 Z"/>' +
    C(372, 222, 11, 'sero') + P('M376 236 L 392 316 L 410 246', 'bounce') + '<path d="M384 308 l 16 16 M400 308 l -16 16" class="xx"/>',
    T(625, 600, 'Golgi : 5-HT2A internes', 'lab-s', 'middle') + T(506, 206, 'psilocine', 'lab-c', 'start') + T(352, 200, 'sérotonine', 'lab-c', 'start'));
  return '<svg class="rc-svg" viewBox="0 0 910 640" role="img" aria-label="Schéma d’un neurone pyramidal de la couche V et de la membrane d’une dendrite apicale : récepteurs 5-HT2A, psilocine, glutamate, BDNF, TrkB, nouvelles épines">' + g + '</svg>';
}

/* ═════════ 4. Le cerveau bayésien : prior × vraisemblance → postérieur ; précision ; REBUS ═════════
   Croyances gaussiennes : π = 1/σ² ; μpost = (πp·μp + πd·μd) / (πp + πd) ; πpost = πp + πd.
   Exemple filé : « les autres me rejettent » (à gauche) ou « m’apprécient » (à droite) ; un ami appelle. */
const BZ_STATES = [
  { k: 'intro', ds: 'Combiner ce que l’on attend et ce que disent les sens.', l: 'Croire', t: 'Croire, c’est parier', p: 'Pour le modèle du cerveau bayésien, percevoir et croire, c’est combiner ce que l’on attend (le [[prior]]) avec ce que disent les sens et l’expérience (la [[vraisemblance]]), chacun pesé selon sa **précision**.', P: [-0.6, 0.8], L: [1.6, 0.8], v: [0, 0, 0] },
  { k: 'prior', ds: 'Une croyance : un sommet, une précision.', l: 'Le prior', t: 'Le prior : ce que l’on croit déjà', p: 'Une croyance est une distribution : son sommet dit ce que l’on attend, sa largeur l’incertitude. Étroite, elle est **précise** : on en est sûr. Ici, une légère impression d’être rejeté.', P: [-0.6, 0.8], L: [1.6, 0.8], v: [1, 0, 0], lab: { p: 't' } },
  { k: 'data', ds: 'Un ami appelle : la donnée tire de l’autre côté.', l: 'Une donnée', t: 'Une donnée : un ami appelle', p: 'L’expérience apporte une information, avec sa propre précision : la [[vraisemblance]]. Elle tire ici vers « les autres m’apprécient ».', P: [-0.6, 0.8], L: [1.6, 0.8], v: [1, 1, 0], lab: { p: 't', l: 't' } },
  { k: 'post', ds: 'La conclusion, entre les deux, près du plus précis.', l: 'La conclusion', t: 'Le postérieur : la conclusion', p: 'Le cerveau combine les deux, chacun pondéré par sa [[precision|précision]] : la conclusion se place entre la croyance et la donnée, plus près de la plus précise. Ici, elles pèsent autant l’une que l’autre.', P: [-0.6, 0.8], L: [1.6, 0.8], v: [1, 1, 1], lab: { p: 'l', l: 'r', po: 't' } },
  { k: 'stuck', ds: 'Trop précise, la croyance ne bouge plus : la rigidité.', l: 'Dépression', t: 'Dans la dépression : un prior trop précis', p: '« Les autres me rejettent », avec une grande précision. L’ami appelle : la donnée arrive, mais la conclusion bouge à peine. La croyance se protège d’elle-même : c’est la **rigidité**.', P: [-1.9, 0.25], L: [1.6, 0.8], v: [1, 1, 1], lab: { p: 'l', l: 't', po: 'r' } },
  { k: 'rebus', ds: 'La précision se relâche : la donnée l’emporte.', l: 'REBUS', t: 'Sous psychédélique : des croyances relâchées', p: 'Le modèle [[rebus|REBUS]] propose que les psychédéliques diminuent la précision des croyances de haut niveau. La même donnée pèse alors davantage : la conclusion bascule.', P: [-1.9, 1.1], L: [1.6, 0.8], v: [1, 1, 1], lab: { p: 'l', l: 'r', po: 't' } },
  { k: 'new', ds: 'La conclusion devient le prior du lendemain.', l: 'Après', t: 'Après : une nouvelle croyance', p: 'La conclusion devient le prior du lendemain. Si l’[[integration|intégration]] et la vie la confirment, une croyance plus nuancée se stabilise et retrouve de la précision.', P: [0.3, 0.6], L: [1.6, 0.8], v: [1, 0, 0], ghost: [-1.9, 0.25], lab: { p: 't' } },
  { k: 'risk', ds: 'Une remarque blessante pèse aussi.', l: 'Le revers', t: 'Le revers : tout pèse davantage', p: 'Le relâchement vaut pour **toutes** les données : un cadre hostile, une remarque blessante, une suggestion de l’accompagnant pèsent elles aussi, et peuvent ancrer la croyance. D’où le cadre, l’attitude non directive, l’intégration.', P: [-1.9, 1.1], L: [-2.5, 0.5], v: [1, 1, 1], tag: 'une remarque blessante', lab: { p: 'r', l: 'l', po: 'r' } }
];
const BZ_X0 = -3.6, BZ_X1 = 3.6, BZ_YM = 1.75;
const gauss = (x, m, s) => Math.exp(-0.5 * ((x - m) / s) ** 2) / (s * Math.sqrt(2 * Math.PI));
const bzTarget = s => ({ mp: s.P[0], sp: s.P[1], ml: s.L[0], sl: s.L[1], vp: s.v[0], vl: s.v[1], vpo: s.v[2], gv: s.ghost ? 1 : 0 });
function bzPost(o) { const pp = 1 / o.sp ** 2, pl = 1 / o.sl ** 2; return { m: (pp * o.mp + pl * o.ml) / (pp + pl), s: 1 / Math.sqrt(pp + pl), wp: pp / (pp + pl) }; }
/* la figure seule (chaîne SVG) : au montage, et pour la vignette de la vue d’ensemble */
function bzSVG(o, st, W, deck) {
  const H = deck ? 560 : Math.round(clamp(W * 0.62, 300, 470)), x0 = 18, x1 = W - 18, yb = H - (deck ? 104 : 86), yt = deck ? 34 : 26;
  const X = v => x0 + (v - BZ_X0) / (BZ_X1 - BZ_X0) * (x1 - x0), Y = d => yb - d / BZ_YM * (yb - yt);
  const fs = deck ? 1 : W < 520 ? 0.74 : 0.84;
  const curve = (m, sd) => { let d = ''; for (let i = 0; i <= 160; i++) { const v = BZ_X0 + (BZ_X1 - BZ_X0) * i / 160; d += (i ? 'L' : 'M') + r1(X(v)) + ' ' + r1(Y(gauss(v, m, sd))); } return d; };
  const area = (m, sd) => curve(m, sd) + 'L' + r1(X(BZ_X1)) + ' ' + yb + 'L' + r1(X(BZ_X0)) + ' ' + yb + 'Z';
  const po = bzPost(o);
  let g = '<line class="axis" x1="' + x0 + '" x2="' + x1 + '" y1="' + yb + '" y2="' + yb + '"/><line class="tick" x1="' + r1(X(0)) + '" x2="' + r1(X(0)) + '" y1="' + yb + '" y2="' + (yb + 8) + '"/>';
  g += T(X(0), yb + 22 * fs, 'neutre', 'ax', 'middle', ' font-size="' + 15 * fs + '"') + T(x0, yb + 84 * fs, '« les autres me rejettent »', 'ends', 'start', ' font-size="' + 19 * fs + '"') + T(x1, yb + 84 * fs, '« les autres m’apprécient »', 'ends', 'end', ' font-size="' + 19 * fs + '"');
  if (o.gv > 0.01 && st.ghost) g += '<path class="ghost" style="opacity:' + r1(o.gv) + '" d="' + curve(st.ghost[0], st.ghost[1]) + '"/>' + T(X(st.ghost[0]) - 14, Y(gauss(st.ghost[0], st.ghost[0], st.ghost[1])) + 10, 'l’ancienne', 'lab ghost-t', 'end', ' style="opacity:' + r1(o.gv) + '" font-size="' + 17 * fs + '"');
  /* étiquettes directes : au-dessus du sommet, ou sur un flanc ; repliées vers l’intérieur si elles débordent */
  const lab = (k, m, sd, txt, cls) => { const side = (st.lab || {})[k] || 't', xp = X(m), yp = Y(gauss(m, m, sd)), w = Math.abs(X(m + sd) - X(m)), tw = txt.length * 18 * fs * 0.52;
    let [x, y, a] = side === 't' ? [clamp(xp, x0 + tw / 2, x1 - tw / 2), yp - 14, 'middle'] : side === 'l' ? [xp - Math.max(16, w * 0.9), yp + 22, 'end'] : [xp + Math.max(16, w * 0.9), yp + 22, 'start'];
    if (a === 'end' && x - tw < x0) { x = x0; a = 'start'; y = yp - 40; } else if (a === 'start' && x + tw > x1) { x = x1; a = 'end'; y = yp - 40; }
    return T(x, Math.max(yt + 6, y), txt, 'lab ' + cls, a, ' font-size="' + 18 * fs + '"'); };
  if (o.vl > 0.01) g += '<g style="opacity:' + r1(o.vl) + '"><path class="a-l" d="' + area(o.ml, o.sl) + '"/><path class="c-l" d="' + curve(o.ml, o.sl) + '"/><line class="mu mu-l" x1="' + r1(X(o.ml)) + '" x2="' + r1(X(o.ml)) + '" y1="' + yb + '" y2="' + r1(Y(gauss(o.ml, o.ml, o.sl))) + '"/>' + lab('l', o.ml, o.sl, st.tag || 'un ami appelle', 't-l') + '</g>';
  if (o.vpo > 0.01) g += '<g style="opacity:' + r1(o.vpo) + '"><path class="a-po" d="' + area(po.m, po.s) + '"/><path class="c-po" d="' + curve(po.m, po.s) + '"/><line class="mu mu-po" x1="' + r1(X(po.m)) + '" x2="' + r1(X(po.m)) + '" y1="' + yb + '" y2="' + r1(Y(gauss(po.m, po.m, po.s))) + '"/>' + lab('po', po.m, po.s, 'la conclusion', 't-po') + '</g>';
  if (o.vp > 0.01) g += '<g style="opacity:' + r1(o.vp) + '"><path class="c-p" d="' + curve(o.mp, o.sp) + '"/><line class="mu mu-p" x1="' + r1(X(o.mp)) + '" x2="' + r1(X(o.mp)) + '" y1="' + yb + '" y2="' + r1(Y(gauss(o.mp, o.mp, o.sp))) + '"/>' + lab('p', o.mp, o.sp, st.k === 'new' ? 'la nouvelle croyance' : 'la croyance', 't-p') + '</g>';
  /* le déplacement de la croyance : du sommet du prior à celui du postérieur */
  if (o.vpo > 0.5 && o.vp > 0.5 && Math.abs(X(po.m) - X(o.mp)) > 6) { const ya = yb + (deck ? 48 : 40) * fs, xa = X(o.mp), xb = X(po.m), dir = Math.sign(xb - xa);
    g += '<g class="shift" style="opacity:' + r1(Math.min(o.vpo, o.vp)) + '"><path d="M' + r1(xa) + ' ' + ya + 'H' + r1(xb - dir * 9) + '"/><path class="hd" d="M' + r1(xb) + ' ' + ya + 'l' + (-dir * 11) + ' -6v12z"/></g>'; }
  return svgOpen(W, H, 'bz-svg', 'Courbes de croyance : prior, vraisemblance et postérieur') + g + '</svg>';
}
VIZ.bayes = {
  notes() { return notesList(BZ_STATES.slice(1).map(z => [z.t, z.p])); },
  html(cfg) {
    const deck = cfg.mode === 'deck';
    return '<div class="bz' + (deck ? ' in-deck' : '') + '">' + (deck ? '' : stepperHTML(BZ_STATES.slice(1).map(x => x.l), 'Étapes')) +
      '<div class="bz-grid"><div class="bz-fig"><div class="bz-leg px-leg" aria-hidden="true"><span><i class="ln ln-p"></i>prior : ce que l’on croit</span><span><i class="ln ln-l"></i>vraisemblance : la donnée</span><span><i class="ln ln-po"></i>postérieur : la conclusion</span></div><div class="bz-svgbox">' + (deck ? bzSVG(bzTarget(BZ_STATES[3]), BZ_STATES[3], 900, true) : '') + '</div></div>' +
      '<div class="bz-side"><div class="px-cap" aria-live="polite"></div><div class="bz-w"><span class="eyebrow">Poids dans la conclusion</span><div class="bz-bar"><i class="bp"></i><i class="bl"></i></div><div class="bz-wl"><span class="wp"></span><span class="wl"></span></div></div>' +
      (deck ? '' : '<p class="bz-f mono"></p><div class="bz-ctl"><label class="rng"><span class="rl">Précision du prior <output data-o="pp"></output></span><input type="range" min="0" max="1" step="0.01" data-k="pp"></label><label class="rng"><span class="rl">Croyance de départ <output data-o="mp"></output></span><input type="range" min="-3" max="3" step="0.05" data-k="mp"></label><label class="rng"><span class="rl">Précision de la donnée <output data-o="pl"></output></span><input type="range" min="0" max="1" step="0.01" data-k="pl"></label><label class="rng"><span class="rl">Ce que dit la donnée <output data-o="ml"></output></span><input type="range" min="-3" max="3" step="0.05" data-k="ml"></label></div>') +
      '</div></div></div>';
  },
  mount(el, cfg, mode) {
    const deck = mode === 'deck', root = $('.bz', el), box = $('.bz-svgbox', root), cap = $('.px-cap', root);
    let W = deck ? 900 : 700, cur = null, st = BZ_STATES[0];
    /* précision ↔ curseur (échelle logarithmique de 0,5 à 16) */
    const p2r = s => Math.log(1 / s ** 2 / 0.5) / Math.log(32), r2s = r => 1 / Math.sqrt(0.5 * Math.pow(32, r));
    const draw = o => {
      const po = bzPost(o);
      box.innerHTML = bzSVG(o, st, W, deck);
      /* poids et formule */
      const wp = (o.vl > 0.5 && o.vpo > 0.5) ? po.wp : null;
      $('.bz-w', root).classList.toggle('off', wp === null);
      if (wp !== null) { $('.bz-bar .bp', root).style.width = (wp * 100) + '%'; $('.bz-bar .bl', root).style.width = ((1 - wp) * 100) + '%'; $('.wp', root).textContent = 'prior ' + Math.round(wp * 100) + ' %'; $('.wl', root).textContent = 'donnée ' + Math.round((1 - wp) * 100) + ' %'; }
      const f = $('.bz-f', root); if (f) { const pp = 1 / o.sp ** 2, pl = 1 / o.sl ** 2; f.textContent = 'μpost = (πp·μp + πd·μd) / (πp + πd) = (' + fmt(pp, 1) + ' × ' + fmt(o.mp, 1) + ' + ' + fmt(pl, 1) + ' × ' + fmt(o.ml, 1) + ') / ' + fmt(pp + pl, 1) + ' = ' + fmt(po.m, 2); }
      if (!deck) { const set = (k, v, txt) => { const i = $('input[data-k="' + k + '"]', root); if (i && document.activeElement !== i) i.value = v; const out = $('output[data-o="' + k + '"]', root); if (out) out.textContent = txt; };
        set('pp', p2r(o.sp), 'π = ' + fmt(1 / o.sp ** 2, 1)); set('pl', p2r(o.sl), 'π = ' + fmt(1 / o.sl ** 2, 1)); set('mp', o.mp, fmt(o.mp, 1)); set('ml', o.ml, fmt(o.ml, 1)); }
    };
    const tw = tweener(o => { cur = o; draw(o); });
    const go = (i, fast) => { st = BZ_STATES[i]; tw.to(bzTarget(st), fast ? 0 : 750); cap.innerHTML = capHTML(i ? 'Étape ' + i + ' sur 7' : 'Le cerveau bayésien', st.t, capPick(deck, st.p, st.ds)); cap.classList.remove('px-fade'); void cap.offsetWidth; cap.classList.add('px-fade'); };
    let stopW = null;
    if (!deck) {
      const show = stepperBind(root, 7, i => go(i + 1));
      $('.bz-ctl', root).addEventListener('input', e => { const k = e.target.dataset.k; if (!k || !cur) return; const o = { ...cur }; const v = +e.target.value;
        if (k === 'pp') o.sp = r2s(v); else if (k === 'pl') o.sl = r2s(v); else if (k === 'mp') o.mp = v; else o.ml = v;
        o.vp = o.vl = o.vpo = 1; o.gv = 0; st = { ...st, lab: { p: 'l', l: 'r', po: 't' }, ghost: null, tag: 'la donnée' }; tw.to(o, 0); cap.innerHTML = capHTML('Réglage libre', 'À vous de régler', 'Rendez le prior très précis : la conclusion ne bouge plus. Relâchez-le : elle suit la donnée, bonne ou mauvaise.'); });
      stopW = watchW(box, w => { W = Math.max(300, w); if (cur) draw(cur); });
      show(0); go(1, true);
    } else go(0, true);
    return { step(s) { if (!deck) return; let k = 0; (cfg.steps || []).forEach(x => { if (x.f <= s) { const j = BZ_STATES.findIndex(y => y.k === x.s); if (j >= 0) k = j; } }); if (BZ_STATES[k] !== st || !cur) go(k); }, destroy() { tw.stop(); stopW && stopW(); } };
  }
};

/* ═════════ 5. Le paysage des attracteurs, en trois dimensions : une bille dans un paysage d’états (Hipólito et al. 2023) ═════════
   V(x, y) = − Σ dᵢ·exp(−|p − cᵢ|² / 2w²) + parois + relief doux ; dynamique de Langevin suramortie en deux dimensions :
   dp = −∇V(p)·μ·dt + √(2Tμ·dt)·N(0, 1), plus un rappel discret vers une cible dans les états de transition.
   Rendu : une grille en pointillés projetée en perspective (canevas), colorée selon l’altitude (vallées bordeaux, crêtes roses). */
const PY_C = [[-2, 0.28], [0, -0.32], [2, 0.22]], PY_W = 0.62, PY_HZ = 0.5;
const PY_STATES = [
  { k: 'intro', ds: 'Chaque vallée, une façon d’être où l’on retombe.', l: 'Le paysage', t: 'Un paysage d’états possibles', p: 'Chaque point du paysage est un état de l’esprit ; chaque vallée, un [[attracteur]] : une façon d’être vers laquelle on retombe. La bille, c’est l’état présent ; ses secousses, le bruit de la vie.', d: [1, 1, 1], T: 0.36 },
  { k: 'sain', ds: 'Plusieurs vallées : la flexibilité.', l: 'Santé', t: 'La santé : plusieurs vallées', p: 'Plusieurs états stables, et assez d’agitation pour passer de l’un à l’autre : c’est la [[multistabilite|multistabilité]], ce que les cliniciens appellent la [[flexibilite-psychologique|flexibilité psychologique]].', d: [1, 1, 1], T: 0.4 },
  { k: 'canal', ds: 'La répétition creuse la vallée.', l: 'Canalisation', t: 'À force de répétition, la vallée se creuse', p: 'Chaque passage creuse un peu plus la même vallée, comme l’eau creuse son lit : c’est la [[canalisation]]. L’habitude, la croyance deviennent plus profondes, plus précises.', d: [2.5, 0.7, 0.7], T: 0.24, home: -2, kp: 2.4, ms: 6500, lab: ['le pattern se creuse', '', ''] },
  { k: 'pris', ds: 'Trop profonde : on n’en sort plus.', l: 'Pris', t: 'Pris dans un pattern', p: 'Une vallée trop profonde : la rumination, le craving, la compulsion. Les secousses ordinaires ne suffisent plus à en sortir : un [[attracteur]] pathologique, un état « coincé ».', d: [3.0, 0.5, 0.5], T: 0.2, home: -2, kp: 1.8, ms: 2200, lab: ['rumination, craving', '', ''] },
  { k: 'chaleur', ds: 'La température monte, le relief s’aplatit.', l: 'Température', t: 'Sous psychédélique : la température monte', p: 'L’[[entropie]] augmente : les fluctuations deviennent plus amples et, selon REBUS, le relief s’aplatit un temps. C’est l’effet aigu, en quelques heures.', d: [1.35, 0.35, 0.35], T: 0.95, ms: 1600 },
  { k: 'sortie', ds: 'La bille explore d’autres états.', l: 'Sortie', t: 'La bille quitte la vallée', p: 'Le paysage aplati, la bille explore d’autres états : un autre regard sur soi, une émotion longtemps évitée, une autre façon de voir le problème.', d: [0.4, 0.3, 0.3], T: 0.78, home: [0.7, 0], kp: 0.9, ms: 1400 },
  { k: 'integ', ds: 'Creuser un autre chemin : l’intégration.', l: 'Intégration', t: 'L’intégration : creuser un autre chemin', p: 'En refroidissant, le système se stabilise ; ce qui se passe alors décide où. Changer les renforçateurs, l’entourage, les habitudes creuse une autre vallée et laisse l’ancienne se combler : le travail, plus lent, de l’[[integration|intégration]].', d: [0.25, 0.5, 2.3], T: 0.16, home: 2, kp: 1.0, ms: 4500, lab: ['l’ancien pattern', '', 'un nouveau chemin'] },
  { k: 'chaos', ds: 'Plus aucun état stable.', l: 'Trop de chaos', t: 'Trop de chaos n’est pas la santé', p: 'Un paysage plat n’a plus d’états stables : la bille erre sans se poser. Aplatir n’est pas un but en soi ; ce qui compte est un équilibre entre ordre et désordre, la [[criticite|criticité]].', d: [0.1, 0.1, 0.1], T: 1.2, ms: 1600, lab: ['', 'plus aucun état stable', ''] }
];
function pyV(x, y, o) {
  let v = 0;
  for (let i = 0; i < 3; i++) { const dx = x - PY_C[i][0], dy = y - PY_C[i][1]; v -= o['d' + i] * Math.exp(-(dx * dx + dy * dy) / (2 * PY_W * PY_W)); }
  const ax = Math.abs(x) - 2.55, ay = Math.abs(y) - 1.45;
  if (ax > 0) v += 2.4 * ax * ax; if (ay > 0) v += 2.4 * ay * ay;
  return v + 0.07 * Math.sin(1.9 * x + 0.6) * Math.cos(2.3 * y - 0.4);
}
function randn() { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
/* la cible d’un état : un puits (indice), ou un point [x, y] */
const pyHome = h => h === undefined ? null : Array.isArray(h) ? h : PY_C[clamp(Math.round(h / 2) + 1, 0, 2)];
/* les points de la grille en pointillés : lignes à y constant et à x constant, un point tous les 0,05 */
const PY_DOTS = (() => { const out = []; const XM = 3, YM = 1.9, step = 0.05;
  for (let j = 0; j <= 18; j++) { const y = -YM + 2 * YM * j / 18; for (let x = -XM; x <= XM + 1e-9; x += step) out.push(x, y); }
  for (let i = 0; i <= 30; i++) { const x = -XM + 2 * XM * i / 30; for (let y = -YM; y <= YM + 1e-9; y += step) out.push(x, y); }
  return new Float32Array(out); })();
/* le dégradé des altitudes : vallées prune et bordeaux, versants framboise, crêtes roses */
const PY_RAMP = ['#5A0840', '#7A0C35', '#A5134A', '#C8124A', '#E01C50', '#F2265A', '#FE3C6F', '#FF6A9A', '#FF8EB4', '#FFB3CD'];
const pyMix = (() => { const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); const P = PY_RAMP.map(hex);
  return t => { const u = clamp(t, 0, 1) * (P.length - 1), i = Math.min(P.length - 2, Math.floor(u)), f = u - i; return P[i].map((c, k) => Math.round(c + (P[i + 1][k] - c) * f)); }; })();
const PY_NC = 24, PY_COLS = Array.from({ length: PY_NC }, (_, i) => pyMix(i / (PY_NC - 1)));
/* sur un fond saturé (la pause), une grille claire : vallées rose pâle, crêtes blanches */
/* en sombre : du rouge (fond des vallées) au rose très pâle (crêtes), pour rester lisible sur le fond aubergine */
const PY_COLS_D = (() => { const R = ['#B3124A', '#D0164E', '#E01C50', '#F2265A', '#FE3C6F', '#FF6A9A', '#FF8EB4', '#FFB3CD', '#FFD0E0', '#FFE7EF'].map(h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)));
  return Array.from({ length: PY_NC }, (_, k) => { const t = k / (PY_NC - 1) * (R.length - 1), i = Math.min(R.length - 2, Math.floor(t)), f = t - i; return R[i].map((v, j) => Math.round(v + (R[i + 1][j] - v) * f)); }); })();
const pyDark = c => { const m = /^#([0-9a-f]{6})$/i.exec(c), n = m ? [0, 8, 16].map(k => (parseInt(m[1], 16) >> (16 - k)) & 255) : (c.match(/[\d.]+/g) || []).slice(0, 3).map(Number); return n.length === 3 && 0.299 * n[0] + 0.587 * n[1] + 0.114 * n[2] < 110; };
const PY_COLS_L = Array.from({ length: PY_NC }, (_, i) => { const t = i / (PY_NC - 1); return [255, Math.round(178 + 77 * t), Math.round(205 + 50 * t)]; });
/* projection : lacet (yaw) autour de la verticale, tangage (pitch) vers l’observateur, perspective */
function pyCam(W, H, deck) { return { W, H, cx: W / 2, cy: H * (deck ? 0.47 : 0.5), S: W / 7.0, D: 9, pitch: 0.98, yaw: -0.32 }; }
function pyProj(c, x, y, z) {
  const cy = Math.cos(c.yaw), sy = Math.sin(c.yaw), X = x * cy - y * sy, Y = x * sy + y * cy;
  const cp = Math.cos(c.pitch), sp = Math.sin(c.pitch), dep = Y * cp - z * sp, up = Y * sp + z * cp, k = c.S * c.D / (c.D + dep);
  return [c.cx + X * k, c.cy - up * k, dep, k];
}
/* une version figée en SVG (vignette de la vue d’ensemble, avant le montage) : un point sur deux */
function pyStatic(W, H, deck, s) {
  const c = pyCam(W, H, deck), o = { d0: s.d[0], d1: s.d[1], d2: s.d[2] };
  let zmin = 1e9, zmax = -1e9; const z = []; for (let i = 0; i < PY_DOTS.length; i += 4) { const v = pyV(PY_DOTS[i], PY_DOTS[i + 1], o) * PY_HZ; z.push(v); if (v < zmin) zmin = v; if (v > zmax) zmax = v; }
  let g = ''; for (let i = 0, n = 0; i < PY_DOTS.length; i += 4, n++) { const [px, py] = pyProj(c, PY_DOTS[i], PY_DOTS[i + 1], z[n]); const col = PY_COLS[Math.round((z[n] - zmin) / (zmax - zmin) * (PY_NC - 1))]; g += '<rect x="' + r1(px - 1) + '" y="' + r1(py - 1) + '" width="2" height="2" fill="rgb(' + col.join(',') + ')"/>'; }
  const b = pyProj(c, PY_C[0][0], PY_C[0][1], pyV(PY_C[0][0], PY_C[0][1], o) * PY_HZ + 0.16);
  return svgOpen(W, H, 'py-static', 'Paysage d’attracteurs en relief') + g + '<circle cx="' + r1(b[0]) + '" cy="' + r1(b[1]) + '" r="' + r1(0.16 * b[3]) + '" fill="#FE3C6F"/></svg>';
}
VIZ.paysage = {
  notes(cfg) { return cfg && cfg.ambient ? '' : notesList(PY_STATES.slice(1).map(z => [z.t, z.p])); },
  html(cfg) {
    const deck = cfg.mode === 'deck', amb = !!cfg.ambient;
    const fig = '<div class="py-fig">' + (deck ? pyStatic(amb ? 760 : 920, amb ? 600 : 600, true, PY_STATES[3]) : '') + '<canvas class="py-cv" aria-hidden="true"></canvas></div>';
    if (amb) return '<div class="py py-amb' + (deck ? ' in-deck' : '') + '" role="img" aria-label="Paysage des attracteurs en relief : une bille passe d’une vallée à l’autre">' + fig + '</div>';
    return '<div class="py' + (deck ? ' in-deck' : '') + '">' + (deck ? '' : stepperHTML(PY_STATES.slice(1).map(x => x.l), 'Étapes')) +
      '<div class="py-grid">' + fig + '<div class="py-side"><div class="px-cap" aria-live="polite"></div>' +
      '<div class="py-gauges"><div class="gauge"><span class="eyebrow">Température</span><div class="gbar"><i class="g-t"></i></div></div><div class="gauge"><span class="eyebrow">Profondeur des vallées</span><div class="gbar"><i class="g-d"></i></div></div></div>' +
      (deck ? '' : '<div class="py-ctl"><label class="rng"><span class="rl">Température <output data-o="T"></output></span><input type="range" min="0.05" max="1.4" step="0.01" data-k="T"></label><label class="rng"><span class="rl">Aplatir le paysage <output data-o="f"></output></span><input type="range" min="0" max="1" step="0.01" value="0" data-k="f"></label><button type="button" class="btn ghost small" data-k="reset">' + ICON.reset + ' Replacer la bille dans la vallée de gauche</button><p class="note">Faites glisser le paysage pour le faire tourner.</p></div>') +
      '</div></div></div>';
  },
  mount(el, cfg, mode) {
    const deck = mode === 'deck', amb = !!cfg.ambient, root = $('.py', el), fig = $('.py-fig', root), cv = $('.py-cv', root), cap = $('.px-cap', root);
    const ctx = cv.getContext('2d');
    let W = deck ? (amb ? 760 : 920) : 700, H = 600, dpr = 1, cam = null;
    let x = PY_C[0][0], y = PY_C[0][1], xs = x, ys = y, trail = [], st = PY_STATES[0], P = null, flat = 0, raf = 0, last = 0, running = false, t0 = performance.now(), drag = 0, dragging = null;
    const n = PY_DOTS.length / 2, Z = new Float32Array(n); let zmin = 0, zmax = 1, needZ = true;
    const size = () => {
      if (!deck) { W = Math.max(280, Math.round(fig.clientWidth || 700)); H = Math.round(clamp(W * 0.62, 240, 520)); }
      else { W = Math.round(fig.offsetWidth || W); H = amb ? Math.round(fig.offsetHeight || 640) : 600; }
      /* en projection, la scène est mise à l’échelle : la résolution du canevas suit l’échelle réelle */
      const scale = deck && fig.offsetWidth ? fig.getBoundingClientRect().width / fig.offsetWidth : 1;
      dpr = clamp((window.devicePixelRatio || 1) * (scale || 1), 1, 3);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); cv.style.width = W + 'px'; cv.style.height = H + 'px';
      cam = pyCam(W, H, deck);
      const sv = $('.py-static', fig); if (sv) sv.remove();
    };
    const eff = () => { const o = { ...P }; for (let i = 0; i < 3; i++) o['d' + i] = P['d' + i] * (1 - 0.88 * flat); return o; };
    const computeZ = () => { const o = eff(); zmin = 1e9; zmax = -1e9; for (let i = 0; i < n; i++) { const v = pyV(PY_DOTS[2 * i], PY_DOTS[2 * i + 1], o) * PY_HZ; Z[i] = v; if (v < zmin) zmin = v; if (v > zmax) zmax = v; } needZ = false; };
    const gauges = () => {
      if (amb) return; const o = eff(); const dm = Math.max(o.d0, o.d1, o.d2);
      $('.g-d', root).style.width = clamp(dm / 2.7 * 100, 2, 100) + '%'; $('.g-t', root).style.width = clamp(o.T / 1.25 * 100, 2, 100) + '%';
      if (!deck) { const iT = $('input[data-k="T"]', root); if (document.activeElement !== iT) iT.value = o.T; $('output[data-o="T"]', root).textContent = fmt(o.T, 2); $('output[data-o="f"]', root).textContent = Math.round(flat * 100) + ' %'; }
    };
    /* couleurs du canevas lues dans la feuille de style (clair ou sombre) */
    const ink = () => { const cs = getComputedStyle(root), paper = cs.getPropertyValue('--paper').trim() || '#EFEAE4'; return { ink: cs.getPropertyValue('--ink').trim() || '#1F151B', paper, dark: pyDark(paper) }; };
    let colors = ink();
    const draw = now => {
      if (needZ) computeZ();
      const c = cam; c.yaw = -0.32 + drag + (reduceMotion() ? 0 : 0.3 * Math.sin((now - t0) / 1000 * 2 * Math.PI / 26));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      /* points : regroupés par couleur et par profondeur, du plus loin au plus proche */
      const B = new Map(); const ZLO = -3.0 * PY_HZ, ZHI = 0.22, span = ZHI - ZLO;
      for (let i = 0; i < n; i++) {
        const [px, py, dep] = pyProj(c, PY_DOTS[2 * i], PY_DOTS[2 * i + 1], Z[i]);
        const ci = clamp(Math.round((Z[i] - ZLO) / span * (PY_NC - 1)), 0, PY_NC - 1), di = dep > 0.9 ? 0 : dep > -0.6 ? 1 : 2, key = di * PY_NC + ci;
        let a = B.get(key); if (!a) { a = []; B.set(key, a); } a.push(px, py);
      }
      const keys = [...B.keys()].sort((p, q) => p - q), sz = [1.25, 1.7, 2.2], al = [0.55, 0.8, 0.97];
      for (const key of keys) { const di = Math.floor(key / PY_NC), ci = key % PY_NC, a = B.get(key), col = (amb ? PY_COLS_L : colors.dark ? PY_COLS_D : PY_COLS)[ci], s = sz[di] * (deck ? 1.15 : 1); ctx.fillStyle = 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + al[di] + ')'; for (let j = 0; j < a.length; j += 2) ctx.fillRect(a[j] - s / 2, a[j + 1] - s / 2, s, s); }
      /* étiquettes des vallées */
      const o = eff(); const lab = st.lab || ['', '', '']; const fs = deck ? 21 : W < 520 ? 12 : 14;
      ctx.font = '600 ' + fs + 'px Jost, Futura, sans-serif'; ctx.textAlign = 'center'; ctx.lineJoin = 'round';
      lab.forEach((t, i) => { if (!t) return; const [px, py] = pyProj(c, PY_C[i][0], PY_C[i][1] - 0.95, pyV(PY_C[i][0], PY_C[i][1] - 0.95, o) * PY_HZ); ctx.lineWidth = 6; ctx.strokeStyle = colors.paper; ctx.strokeText(t, px, py + fs * 1.6); ctx.fillStyle = colors.ink; ctx.fillText(t, px, py + fs * 1.6); });
      /* traînée, ombre et bille */
      trail.forEach(([tx, ty], i) => { const [px, py, , k] = pyProj(c, tx, ty, pyV(tx, ty, o) * PY_HZ + 0.06); ctx.fillStyle = 'rgba(254,60,111,' + r1((i + 1) / trail.length * 0.5) + ')'; ctx.beginPath(); ctx.arc(px, py, Math.max(1.5, 0.045 * k), 0, 7); ctx.fill(); });
      const zb = pyV(xs, ys, o) * PY_HZ, rb = 0.17, [sx, sy, , sk] = pyProj(c, xs, ys, zb), [bx, by, , bk] = pyProj(c, xs, ys, zb + rb), R = rb * bk;
      ctx.fillStyle = amb ? 'rgba(46,5,38,.35)' : 'rgba(46,5,38,.28)'; ctx.beginPath(); ctx.ellipse(sx, sy, R * 1.05, R * 0.42, 0, 0, 7); ctx.fill();
      const g = ctx.createRadialGradient(bx - R * 0.38, by - R * 0.42, R * 0.08, bx, by, R);
      g.addColorStop(0, '#FFFFFF'); g.addColorStop(0.22, '#FFC2D6'); g.addColorStop(0.62, '#FE3C6F'); g.addColorStop(1, '#9E0F42');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(bx, by, R, 0, 7); ctx.fill(); ctx.lineWidth = 1.2; ctx.strokeStyle = 'rgba(82,7,66,.45)'; ctx.stroke(); void sk;
    };
    const tw = tweener(o => { P = o; needZ = true; gauges(); if (!running) draw(performance.now()); });
    const physics = dt => {
      const o = eff(), mu = 1.2, steps = 3, h = dt / steps, home = pyHome(st.home), e = 1e-3;
      for (let k = 0; k < steps; k++) {
        const gx = (pyV(x + e, y, o) - pyV(x - e, y, o)) / (2 * e), gy = (pyV(x, y + e, o) - pyV(x, y - e, o)) / (2 * e);
        const px = home ? (st.kp || 0) * (home[0] - x) : 0, py = home ? (st.kp || 0) * (home[1] - y) : 0, s = Math.sqrt(2 * o.T * mu * h);
        x = clamp(x + (-gx + px) * mu * h + s * randn(), -2.9, 2.9); y = clamp(y + (-gy + py) * mu * h + s * randn() * 0.8, -1.75, 1.75);
      }
    };
    let acc = 0, ambT = 0, ambI = 1;
    const AMB = ['sain', 'canal', 'pris', 'chaleur', 'sortie', 'integ'];
    const frame = now => {
      raf = requestAnimationFrame(frame); const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
      if (amb) { ambT += dt; if (ambT > 7.5) { ambT = 0; ambI = (ambI + 1) % AMB.length; go(PY_STATES.findIndex(z => z.k === AMB[ambI])); } }
      physics(dt); const k = 1 - Math.exp(-dt / 0.07); xs += (x - xs) * k; ys += (y - ys) * k;
      acc += dt; if (acc > 0.06) { acc = 0; trail.push([xs, ys]); if (trail.length > 24) trail.shift(); }
      draw(now);
    };
    const target = s => ({ d0: s.d[0], d1: s.d[1], d2: s.d[2], T: s.T });
    const go = (i, fast) => {
      st = PY_STATES[i]; tw.to(target(st), fast ? 0 : st.ms || 1200);
      if (cap) { cap.innerHTML = capHTML(i ? 'Étape ' + i + ' sur 7' : 'Le paysage des attracteurs', st.t, capPick(deck, st.p, st.ds)); cap.classList.remove('px-fade'); void cap.offsetWidth; cap.classList.add('px-fade'); }
      if (reduceMotion()) { const h = pyHome(st.home); if (h) { x = xs = h[0]; y = ys = h[1]; } trail = []; draw(performance.now()); }
    };
    size();
    let stopW = null;
    if (!deck && !amb) {
      const show = stepperBind(root, 7, i => { flat = 0; const f = $('input[data-k="f"]', root); if (f) f.value = 0; go(i + 1); });
      $('.py-ctl', root).addEventListener('input', e => { const k = e.target.dataset.k; if (k === 'T') { tw.to({ ...P, T: +e.target.value }, 0); } else if (k === 'f') { flat = +e.target.value; needZ = true; gauges(); if (!running) draw(performance.now()); } });
      $('.py-ctl', root).addEventListener('click', e => { if (e.target.closest('[data-k="reset"]')) { x = xs = PY_C[0][0]; y = ys = PY_C[0][1]; trail = []; if (!running) draw(performance.now()); } });
      cv.addEventListener('pointerdown', e => { dragging = { x: e.clientX, d: drag }; cv.setPointerCapture(e.pointerId); });
      cv.addEventListener('pointermove', e => { if (!dragging) return; drag = clamp(dragging.d + (e.clientX - dragging.x) / W * 2.2, -1.2, 1.2); if (!running) draw(performance.now()); });
      cv.addEventListener('pointerup', () => { dragging = null; });
      stopW = watchW(fig, () => { size(); colors = ink(); if (P) draw(performance.now()); });
      show(0); go(1, true);
    } else if (!deck) {
      /* en lecture, le paysage de la pause tourne seul, sans commandes */
      stopW = watchW(fig, () => { size(); colors = ink(); if (P) draw(performance.now()); });
      go(1, true);
    } else { go(amb ? 1 : 0, true); }
    const start = () => { if (running) return; colors = ink(); if (reduceMotion()) { draw(performance.now()); return; } running = true; last = 0; raf = requestAnimationFrame(frame); };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    if (!P) go(0, true); draw(performance.now());
    /* en projection, la taille réelle n’est connue qu’après la mise en page */
    if (deck) requestAnimationFrame(() => { size(); colors = ink(); draw(performance.now()); });
    return {
      step(s) { if (!deck || amb) return; let k = 0; (cfg.steps || []).forEach(z => { if (z.f <= s) { const j = PY_STATES.findIndex(q => q.k === z.s); if (j >= 0) k = j; } }); if (PY_STATES[k] !== st) go(k); },
      start, stop, destroy() { stop(); tw.stop(); stopW && stopW(); }
    };
  }
};

/* ═════════ 6. Addiction : le cycle en trois temps (Koob et Volkow) et ce que les psychédéliques pourraient y changer ═════════
   D’après Koob et Volkow (Lancet Psychiatry 2016), Volkow, Koob et McLellan (NEJM 2016) et la figure de revue PSYCOMADD (2023).
   Un cycle (intoxication → sevrage → préoccupation), un cerveau en coupe sagittale au centre ; à chaque étape, un temps du
   cycle, son circuit, ce que fait l’addiction et ce que pourraient faire les psychédéliques (hypothèses, niveau de preuve). */
const AD_ST = [
  { e: 'Koob et Volkow, 2016', h: 'Un cycle en trois temps', dp: 'Intoxication, sevrage, préoccupation : trois temps, trois circuits, trois cibles.', p: 'L’addiction tourne en boucle : l’**intoxication** (la récompense), le **sevrage** (les affects négatifs, le stress), la **préoccupation** (le craving, la perte de contrôle). Chaque temps a ses circuits, donc ses cibles possibles.' },
  { e: '1 · ganglions de la base : noyau accumbens, striatum', h: 'Intoxication : la récompense captée', reg: 'nac',
    dd: ['Dopamine, puis sensibilisation', 'La substance capte la saillance'], dps: ['Peu addictifs', 'D’autres récompenses redeviennent visibles'],
    drug: ['Libération de dopamine, puis sensibilisation', 'La substance capte la saillance : le reste pâlit', 'Du striatum ventral au dorsal : l’habitude, puis la compulsion'],
    psy: ['Peu addictifs : pas d’auto-administration chez l’animal', 'Récepteurs 5-HT2A désensibilisés', 'Défocalisation : d’autres récompenses redeviennent visibles'], ev: 'Données surtout animales' },
  { e: '2 · amygdale étendue et axe du stress', h: 'Sevrage : le versant sombre', reg: 'amy',
    dd: ['L’« anti-récompense » s’emballe', 'Consommer pour soulager'], dps: ['Moins d’affects négatifs', 'Plus de flexibilité'],
    drug: ['CRF, dynorphine, cortisol : l’« anti-récompense » s’emballe', 'Dysphorie, anxiété, irritabilité au sevrage', 'On consomme pour soulager : le renforcement négatif'],
    psy: ['Meilleure régulation des émotions', 'Moins d’affects négatifs ; percée émotionnelle', 'Accepter plutôt qu’éviter : plus de flexibilité psychologique'], ev: 'Enquêtes et petits essais chez l’humain' },
  { e: '3 · cortex préfrontal : orbitofrontal, cingulaire', h: 'Préoccupation : le craving', reg: 'pfc',
    dd: ['Moins de plasticité, moins de contrôle', 'Le craving revient sans cesse'], dps: ['La plasticité retrouvée', 'Moins de craving (pilote PAD)'],
    drug: ['Moins de plasticité, moins de synapses', 'Contrôle affaibli : impulsivité, compulsion', 'La pensée revient sans cesse au produit'],
    psy: ['Plasticité : BDNF, TrkB, nouvelles épines', 'Flexibilité cognitive retrouvée', 'Moins de craving (pilote PAD, 2025)'], ev: 'Animal pour la plasticité ; humain pour le craving, à confirmer' },
  { e: 'Au total', h: 'Une fenêtre, pas une cure', dp: 'Quelques semaines de plasticité : ce que l’on en fait décide de la suite.', p: 'Les psychédéliques ne réparent pas un circuit : ils ouvrent quelques semaines de plasticité et de flexibilité. Ce que l’on y fait décide de la suite : d’autres renforçateurs, un autre entourage, d’autres habitudes, la prévention de la rechute. C’est l’[[integration|intégration]].' }
];
/* le cycle : trois nœuds sur un cercle, des arcs fléchés, le cerveau au centre */
function adSVG() {
  const C = 300, R = 214, A = [-90, 30, 150].map(a => a * Math.PI / 180), N = A.map(a => [C + R * Math.cos(a), C + R * Math.sin(a)]);
  const lab = [['Intoxication', 'excès'], ['Sevrage', 'affects négatifs'], ['Préoccupation', 'craving']];
  const LP = [[N[0][0] + 84, N[0][1] - 30, 'start'], [N[1][0] + 4, N[1][1] + 104, 'middle'], [N[2][0] - 4, N[2][1] + 104, 'middle']];
  let g = '<circle class="ad-track" cx="' + C + '" cy="' + C + '" r="' + R + '"/>';
  /* arcs : du bord d’un nœud au bord du suivant, dans le sens des aiguilles d’une montre */
  for (let i = 0; i < 3; i++) {
    const a0 = A[i] + 0.36, a1 = A[(i + 1) % 3] - 0.36 + (i === 2 ? 2 * Math.PI : 0), p0 = [C + R * Math.cos(a0), C + R * Math.sin(a0)], p1 = [C + R * Math.cos(a1), C + R * Math.sin(a1)];
    const t = [-Math.sin(a1), Math.cos(a1)], q = [p1[0] - t[0] * 15, p1[1] - t[1] * 15], nrm = [Math.cos(a1), Math.sin(a1)];
    g += '<g class="ad-arc s' + (i + 1) + '"><path d="M' + r1(p0[0]) + ' ' + r1(p0[1]) + ' A ' + R + ' ' + R + ' 0 0 1 ' + r1(q[0]) + ' ' + r1(q[1]) + '"/><path class="hd" d="M' + r1(p1[0]) + ' ' + r1(p1[1]) + ' L' + r1(q[0] + nrm[0] * 8) + ' ' + r1(q[1] + nrm[1] * 8) + ' L' + r1(q[0] - nrm[0] * 8) + ' ' + r1(q[1] - nrm[1] * 8) + 'Z"/></g>';
  }
  /* le cerveau, coupe sagittale (avant à gauche), et ses trois régions */
  const B = 'M12 50 C 8 28 28 8 58 8 C 88 8 112 24 112 46 C 112 58 104 64 94 64 L 82 64 C 78 72 70 74 62 70 C 56 67 50 66 44 66 C 30 66 14 62 12 50 Z';
  g += '<g class="ad-brain" transform="translate(' + (C - 156) + ' ' + (C - 128) + ') scale(2.6)"><path class="cx" d="' + B + '"/><path class="cb" d="M86 64 C 94 61 108 63 108 72 C 108 81 95 83 87 78 Z"/><path class="bs" d="M80 66 C 83 74 83 82 81 90"/><path class="sul" d="M58 10 C 54 26 60 40 52 52 M84 14 C 80 28 88 38 82 50"/>' +
    '<ellipse class="reg r-pfc" cx="25" cy="38" rx="12" ry="17"/><circle class="reg r-nac" cx="46" cy="50" r="8"/><g class="reg r-amy"><circle cx="63" cy="57" r="8"/><circle cx="54" cy="50" r="4.5"/></g></g>';
  N.forEach(([x, y], i) => {
    g += '<g class="ad-node s' + (i + 1) + '"><circle class="halo" cx="' + r1(x) + '" cy="' + r1(y) + '" r="76"/><circle class="disc" cx="' + r1(x) + '" cy="' + r1(y) + '" r="58"/><circle class="shine" cx="' + r1(x - 17) + '" cy="' + r1(y - 19) + '" r="22"/>' + T(x, y + 15, String(i + 1), 'num', 'middle') +
      T(LP[i][0], LP[i][1], lab[i][0], 'nl', LP[i][2]) + T(LP[i][0], LP[i][1] + 26, lab[i][1], 'ns', LP[i][2]) + '</g>';
  });
  return '<svg class="ad-svg" viewBox="-40 -14 680 664" role="img" aria-label="Le cycle de l’addiction : intoxication, sevrage, préoccupation ; un cerveau au centre">' +
    g + '</svg>';
}
const adPane = (s, i, deck) => '<section class="ad-pane' + (s.reg ? ' st s' + i : '') + '" data-i="' + i + '"><span class="eyebrow">' + esc(s.e) + '</span><h4>' + md(s.h) + '</h4>' +
  (s.p ? '<p>' + md(deck && s.dp ? s.dp : s.p) + '</p>' : '<div class="ad-two"><div><b>Ce que fait l’addiction</b><ul>' + (deck && s.dd ? s.dd : s.drug).map(t => '<li>' + md(t) + '</li>').join('') + '</ul></div><div class="ps"><b>Ce que pourraient faire les psychédéliques</b><ul>' + (deck && s.dps ? s.dps : s.psy).map(t => '<li>' + md(t) + '</li>').join('') + '</ul></div></div><span class="ad-ev">' + esc(s.ev) + '</span>') + '</section>';
VIZ.addiction = {
  notes() { return '<ul>' + AD_ST.map(z => '<li><b>' + md(z.h) + '</b> · ' + (z.p ? md(z.p) : md(z.drug.join(' ; ')) + '. Psychédéliques : ' + md(z.psy.join(' ; ')) + ' (' + esc(z.ev) + ')') + '</li>').join('') + '</ul>'; },
  html(cfg) {
    const deck = cfg.mode === 'deck';
    return '<div class="ad2' + (deck ? ' in-deck' : '') + '" data-k="0">' + (deck ? '' : stepperHTML(['Le cycle', 'Intoxication', 'Sevrage', 'Préoccupation', 'Une fenêtre'], 'Étapes')) +
      '<div class="ad-grid"><div class="ad-fig">' + adSVG() + '</div><div class="ad-panes">' + AD_ST.map((z, i) => adPane(z, i, deck)).join('') + '</div></div></div>';
  },
  mount(el, cfg, mode) {
    const root = $('.ad2', el), set = k => { root.dataset.k = k; };
    if (mode !== 'deck') { const show = stepperBind(root, 5, i => set(i)); show(0); set(0); }
    return { step(s) { if (mode !== 'deck') return; let k = 0; (cfg.steps || []).forEach((x, i) => { if (x.f <= s) k = i + 1; }); set(k); } };
  }
};

/* ═════════ 7. L’intensité compte : corrélations de la méta-analyse de Romeo, Kervadec et al. (Neurosci Biobehav Rev 2025) ═════════ */
const IN_ROWS = [
  { ds: 'Plus l’expérience est intense, plus l’amélioration est grande.', g: 'Ensemble des études', pts: [['', 0.33]], t: 'Ensemble : r = 0,33', p: 'Une corrélation modérée et très significative (p < 0,0001) entre l’intensité de l’expérience (MEQ, 5D-ASC…) et l’amélioration : l’expérience aiguë n’est pas un simple effet secondaire.' },
  { ds: 'Plus fort dans l’humeur que dans les addictions.', g: 'Selon le trouble', pts: [['addictions', 0.19], ['humeur', 0.41]], note: 'p = 0,02', t: 'Selon le trouble', p: 'Le lien est plus fort dans les troubles de l’humeur (r = 0,41) que dans les addictions (r = 0,19) ; la différence est significative (p = 0,02).' },
  { ds: 'Plus fort en cadre clinique qu’en contexte naturaliste.', g: 'Selon le cadre', pts: [['naturaliste', 0.14], ['clinique', 0.5]], t: 'Selon le cadre', p: 'Bien plus fort en cadre clinique (r = 0,50) qu’en contexte naturaliste (r = 0,14) : sélection, préparation, accompagnement, intention.' },
  { ds: 'Plus fort en prospectif : pas un simple biais de mémoire.', g: 'Selon le type d’étude', pts: [['rétrospectif', 0.14], ['prospectif', 0.43]], t: 'Selon le type d’étude', p: 'Plus fort dans les études prospectives (r = 0,43) que rétrospectives (r = 0,14) : ce n’est pas un simple biais de mémoire. Une corrélation ne prouve pas pour autant que l’expérience soit la cause.' }
];
function inSVG(W, deck) {
  const narrow = W < 560, fs = deck ? 1 : narrow ? 0.78 : 0.88, LW = deck ? 250 : narrow ? 0 : 190, x0 = LW + (narrow ? 12 : 30), x1 = W - (deck ? 40 : 22);
  const RH = deck ? 116 : narrow ? 104 : 92, top = deck ? 30 : 24, H = top + RH * 4 + (deck ? 92 : 78);
  const X = r => x0 + r / 0.6 * (x1 - x0), axY = top + RH * 4 + 4;
  let g = '';
  [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6].forEach(r => { g += '<line class="grid" x1="' + r1(X(r)) + '" x2="' + r1(X(r)) + '" y1="' + top + '" y2="' + axY + '"/>' + T(X(r), axY + 22 * fs, fmt(r, 1), 'ax', 'middle', ' font-size="' + 15 * fs + '"'); });
  [[0.1, 'faible'], [0.3, 'moyenne'], [0.5, 'forte']].forEach(([r, l]) => { g += T(X(r), axY + 46 * fs, 'corrélation ' + l, 'ax2', 'middle', ' font-size="' + 14 * fs + '"'); });
  g += '<line class="axis" x1="' + x0 + '" x2="' + x1 + '" y1="' + axY + '" y2="' + axY + '"/>' + T(x1, axY + 70 * fs, 'r : corrélation entre l’intensité de l’expérience et l’amélioration clinique', 'ax2', 'end', ' font-size="' + 14 * fs + '"');
  g += '<line class="ref" x1="' + r1(X(0.33)) + '" x2="' + r1(X(0.33)) + '" y1="' + (top + RH * 0.5) + '" y2="' + axY + '"/>';
  IN_ROWS.forEach((R, i) => {
    const y = top + RH * i + RH * (narrow ? 0.62 : 0.55);
    let row = '<g class="in-row" data-i="' + (i + 1) + '">';
    row += narrow ? T(x0 - 4, y - RH * 0.42, R.g, 'gl', 'start', ' font-size="' + 18 * fs + '"') : T(LW, y + 6 * fs, R.g, 'gl', 'end', ' font-size="' + 20 * fs + '"');
    if (R.pts.length === 2) row += '<line class="db" x1="' + r1(X(R.pts[0][1])) + '" x2="' + r1(X(R.pts[1][1])) + '" y1="' + r1(y) + '" y2="' + r1(y) + '"/>';
    R.pts.forEach(([l, v], j) => {
      row += '<circle class="dot' + (R.pts.length === 1 ? ' all' : j ? ' hi' : ' lo') + '" cx="' + r1(X(v)) + '" cy="' + r1(y) + '" r="' + (deck ? 12 : 9) + '"/>';
      row += T(X(v), y + (deck ? 38 : 30) * fs, fmt(v, 2), 'val', 'middle', ' font-size="' + 19 * fs + '"');
      if (l) row += T(X(v), y - (deck ? 22 : 17) * fs, l, 'cat', 'middle', ' font-size="' + 17 * fs + '"');
    });
    if (R.note) row += T(X(R.pts[1][1]) + (deck ? 24 : 18), y + 6 * fs, 'écart : ' + R.note, 'pn', 'start', ' font-size="' + 15 * fs + '"');
    g += row + '</g>';
  });
  return svgOpen(W, H, 'in-svg', 'Corrélations entre l’intensité de l’expérience psychédélique et l’amélioration clinique, au total et selon le trouble, le cadre et le type d’étude') + g + '</svg>';
}
VIZ.intensite = {
  notes() { return notesList(IN_ROWS.map(z => [z.t, z.p])); },
  html(cfg) {
    const deck = cfg.mode === 'deck';
    return '<div class="in' + (deck ? ' in-deck' : '') + '"><div class="in-grid"><div class="in-fig">' + (deck ? inSVG(900, true) : '') + '</div>' + (deck ? '<div class="px-cap" aria-live="polite"></div>' : '') + '</div></div>';
  },
  mount(el, cfg, mode) {
    const deck = mode === 'deck', root = $('.in', el), fig = $('.in-fig', root), cap = $('.px-cap', root);
    let k = deck ? 0 : 4, stopW = null;
    const draw = W => {
      fig.innerHTML = inSVG(W, deck);
      apply();
    };
    const apply = () => {
      $$('.in-row', fig).forEach(g => g.classList.toggle('off', +g.dataset.i > k)); const ref = $('.ref', fig); if (ref) ref.classList.toggle('off', k < 2);
      if (cap) { const R = k ? IN_ROWS[k - 1] : null; cap.innerHTML = R ? capHTML('Romeo, Kervadec et al. 2025 · ' + k + ' sur 4', R.t, capPick(deck, R.p, R.ds)) : capHTML('Romeo, Kervadec et al. 2025', 'Plus l’expérience est intense, plus l’amélioration est grande ?', capPick(deck, 'Romeo, Kervadec et al. (2025) : les études cliniques et naturalistiques qui mesurent à la fois l’intensité de l’expérience et l’évolution des symptômes.', 'Intensité de l’expérience et amélioration clinique.')); cap.classList.remove('px-fade'); void cap.offsetWidth; cap.classList.add('px-fade'); }
    };
    if (deck) apply(); else stopW = watchW(fig, w => draw(Math.max(300, w)));
    return { step(s) { if (!deck) return; let n = 0; (cfg.steps || []).forEach((x, i) => { if (x.f <= s) n = i + 1; }); if (n !== k) { k = n; apply(); } }, destroy() { stopW && stopW(); } };
  }
};

/* ═════════ 8. Le jour de la session : psilocybine 25 mg, heure par heure ═════════
   D’après les recommandations de Johnson, Richards et Griffiths (2008) et les protocoles d’essais. */
const SE_STEPS = [
  { h: -1, clock: '8 h', dpat: 'Relit son intention', dacc: 'Rappellent le déroulé convenu', dsur: 'Constantes de référence', ph: 'Arrivée', pat: 'Arrive accompagné, après un petit déjeuner léger ; relit son intention avec les accompagnants.', acc: 'Accueillent, rappellent le déroulé et ce qui a été convenu : rester dans la salle, contact physique accepté ou non.', sur: 'Constantes de référence (pression artérielle, pouls) ; traitements, absence de consommation ; test de grossesse si besoin.' },
  { h: 0, clock: '9 h', dpat: 'Psilocybine 25 mg ; bandeau, casque', dacc: 'Lancent la musique, sans diriger', dsur: 'Heure de prise, constantes', ph: 'Prise', pat: 'Prend la gélule de psilocybine (25 mg) ; s’installe sur le divan, bandeau et casque à portée de main.', acc: 'Brève mise en intention ; lancent la musique ; restent présents, sans diriger.', sur: 'Heure de prise notée ; pression artérielle et pouls.' },
  { h: 0.75, clock: '9 h 45', dpat: 'Vagues d’émotion, parfois anxiété', dacc: '« Laissez-vous aller, je suis là »', dsur: 'Hausse tensionnelle modérée', ph: 'Montée', pat: 'Premiers effets : vagues d’émotion, parfois nausées ou anxiété ; souvent le moment le plus délicat.', acc: 'Rassurent : « c’est l’effet de la substance, laissez-vous aller, je suis là » ; invitent à traverser plutôt qu’à lutter.', sur: 'Pression artérielle et pouls à intervalles réguliers : une hausse modérée est attendue.' },
  { h: 2, clock: '11 h', dpat: 'Tourné vers l’intérieur ; on parle peu', dacc: 'Présence silencieuse', dsur: 'Jamais seul dans la salle', ph: 'Pic', pat: 'Expérience intense, tournée vers l’intérieur, sous le bandeau ; on parle peu.', acc: 'Présence silencieuse ; la musique porte ; aident à boire, à aller aux toilettes ; main tenue si c’était convenu.', sur: 'Constantes, sécurité physique ; le patient n’est jamais seul dans la salle.' },
  { h: 4, clock: '13 h', dpat: 'Envie de raconter', dacc: 'Écouter plutôt qu’interpréter', dsur: 'Retour progressif', ph: 'Descente', pat: 'Revient peu à peu ; envie de raconter, d’écrire, de dessiner.', acc: 'Écoutent plus qu’ils n’interprètent : l’analyse viendra plus tard ; collation.', sur: 'Constantes, orientation : retour progressif à l’état de base.' },
  { h: 6, clock: '15 h', dpat: 'Fatigué, ému', dacc: 'Recueillent un premier récit', dsur: 'État de base vérifié', ph: 'Fin des effets', pat: 'Fatigué, souvent ému ; note ce qui lui semble important.', acc: 'Recueillent un premier récit ; rappellent la session d’intégration du lendemain.', sur: 'Retour à l’état de base vérifié : orientation, humeur, constantes.' },
  { h: 7.5, clock: '16 h 30', dpat: 'Repart avec un proche, sans conduire', dacc: 'Un numéro joignable la nuit', dsur: 'Intégration dès le lendemain', ph: 'Sortie', pat: 'Repart avec un proche ; ne conduit pas ce jour-là.', acc: 'Vérifient les critères de sortie ; donnent un numéro joignable le soir et la nuit.', sur: 'Entretien le lendemain, puis sessions d’intégration ; idées suicidaires réévaluées en cas de dépression.' }
];
const SE_INTRO = { dpat: 'Préparé : huit heures, quatre rencontres', dacc: 'Deux accompagnants, toute la journée', dsur: 'Une salle calme, comme un salon', pat: 'Préparé en amont : au moins huit heures, en quatre rencontres ou plus.', acc: 'Deux accompagnants, présents toute la journée.', sur: 'Une salle calme et sûre, aménagée comme un salon ; bandeau et musique.' };
const SE_H0 = -1.5, SE_H1 = 8.5;
const seI = h => h <= 0.3 ? 0 : h < 1.5 ? ss((h - 0.3) / 1.2) : h <= 3 ? 1 : h < 6 ? 1 - ss((h - 3) / 3) : 0;
/* géométrie et figure de la journée (chaînes SVG) : au montage, et pour la vignette de la vue d’ensemble */
let seUid = 0;
const clockOf = h => { const m = Math.round((9 + h) * 60); return Math.floor(m / 60) + ' h' + (m % 60 ? ' ' + String(m % 60).padStart(2, '0') : ''); };
function seGeo(W, deck) {
  const narrow = W < 560, fs = deck ? 1 : narrow ? 0.78 : 0.9, H = deck ? 250 : narrow ? 190 : 210, x0 = deck ? 10 : 6, x1 = W - (deck ? 10 : 6), yb = H - (deck ? 58 : 48), yt = deck ? 64 : 52;
  const X = h => x0 + (h - SE_H0) / (SE_H1 - SE_H0) * (x1 - x0), Y = v => yb - v * (yb - yt);
  return { narrow, fs, H, x0, x1, yb, yt, X, Y };
}
function seSVG(W, deck, cur) {
  const { narrow, fs, H, x0, x1, yb, yt, X, Y } = seGeo(W, deck);
  let d = ''; for (let i = 0; i <= 200; i++) { const h = SE_H0 + (SE_H1 - SE_H0) * i / 200; d += (i ? 'L' : 'M') + r1(X(h)) + ' ' + r1(Y(seI(h))); }
  const area = d + 'L' + r1(X(SE_H1)) + ' ' + yb + 'L' + r1(X(SE_H0)) + ' ' + yb + 'Z';
  const cid = 'seclip' + (++seUid);
  let g = '<defs><clipPath id="' + cid + '"><rect class="se-cl" x="' + x0 + '" y="0" width="' + r1(X(cur) - x0) + '" height="' + H + '"/></clipPath></defs>';
  for (let h = -1; h <= 8; h++) g += '<line class="grid" x1="' + r1(X(h)) + '" x2="' + r1(X(h)) + '" y1="' + (yt - 16) + '" y2="' + yb + '"/>' + ((narrow && h % 2 !== 1 && h !== 0) ? '' : T(X(h), yb + 22 * fs, clockOf(h), 'ax', 'middle', ' font-size="' + 15 * fs + '"'));
  g += '<path class="se-a0" d="' + area + '"/><path class="se-a1" d="' + area + '" clip-path="url(#' + cid + ')"/><path class="se-l" d="' + d + '"/>';
  g += '<line class="axis" x1="' + x0 + '" x2="' + x1 + '" y1="' + yb + '" y2="' + yb + '"/>' + T(x1, yb + 46 * fs, 'intensité des effets (allure) · psilocybine 25 mg', 'ax2', 'end', ' font-size="' + 14 * fs + '"');
  SE_STEPS.forEach((S, i) => { const x = X(S.h); g += '<g class="se-m" data-i="' + i + '"><line x1="' + r1(x) + '" x2="' + r1(x) + '" y1="' + (yt - 22) + '" y2="' + r1(Y(seI(S.h))) + '"/><circle cx="' + r1(x) + '" cy="' + (yt - 22) + '" r="' + (deck ? 6 : 4.5) + '"/>' + ((narrow && ![0, 3, 6].includes(i)) ? '' : T(x, yt - 34, S.ph, 'mlab', i === 0 ? 'start' : i === SE_STEPS.length - 1 ? 'end' : 'middle', ' font-size="' + 16 * fs + '"')) + '</g>'; });
  g += '<g class="se-cur" transform="translate(' + r1(X(cur)) + ' 0)"><line class="cl" y1="' + (yt - 16) + '" y2="' + yb + '"/><circle class="cd" cy="' + r1(Y(seI(cur))) + '" r="' + (deck ? 10 : 7) + '"/></g>';
  return svgOpen(W, H, 'se-svg', 'Déroulé d’une session de psilocybine : intensité des effets heure par heure') + g + '</svg>';
}
function sePlace(fig, W, deck, h) { const { x0, X, Y } = seGeo(W, deck), c = $('.se-cur', fig), r = $('.se-cl', fig); if (!c) return; c.setAttribute('transform', 'translate(' + r1(X(h)) + ' 0)'); $('.cd', c).setAttribute('cy', r1(Y(seI(h)))); r.setAttribute('width', r1(Math.max(0, X(h) - x0))); }
VIZ.seance = {
  notes() { return '<ol class="nt-steps">' + SE_STEPS.map(z => '<li><b>' + esc(z.clock + ' · ' + z.ph) + '</b> · ' + md(z.pat) + ' ' + md(z.acc) + ' ' + md(z.sur) + '</li>').join('') + '</ol>'; },
  html(cfg) {
    const deck = cfg.mode === 'deck';
    return '<div class="se' + (deck ? ' in-deck' : '') + '">' + (deck ? '' : stepperHTML(SE_STEPS.map(x => x.ph), 'Moments de la journée') + '<label class="rng se-rng"><span class="rl">Heure de la journée <output></output></span><input type="range" min="-1" max="8" step="0.25" value="-1"></label>') +
      '<div class="se-fig">' + (deck ? seSVG(1408, true, -1.4) : '') + '</div><div class="se-now"><b class="se-clock">8 h – 17 h</b><span class="se-ph">Le jour de la session</span></div>' +
      '<div class="se-cols"><section class="se-c"><span class="eyebrow">Le patient</span><p data-k="pat">' + md(SE_INTRO.pat) + '</p></section><section class="se-c"><span class="eyebrow">Les deux accompagnants</span><p data-k="acc">' + md(SE_INTRO.acc) + '</p></section><section class="se-c"><span class="eyebrow">La surveillance</span><p data-k="sur">' + md(SE_INTRO.sur) + '</p></section></div></div>';
  },
  mount(el, cfg, mode) {
    const deck = mode === 'deck', root = $('.se', el), fig = $('.se-fig', root);
    let W = deck ? 1408 : 800, cur = -1.25, si = -99, stopW = null;
    const draw = () => { fig.innerHTML = seSVG(W, deck, cur); sePlace(fig, W, deck, cur); };
    const tw = tweener(o => { cur = o.h; sePlace(fig, W, deck, cur); const rg = $('.se-rng output', root); if (rg) rg.textContent = clockOf(cur); });
    const text = i => { if (i === si) return; si = i; const S = SE_STEPS[i] || null;
      $('.se-clock', root).textContent = S ? S.clock : '8 h – 17 h'; $('.se-ph', root).textContent = S ? S.ph : 'Le jour de la session';
      $$('.se-c p', root).forEach(p => { const X = S || SE_INTRO, kk = p.dataset.k; p.innerHTML = md(deck && X['d' + kk] ? X['d' + kk] : X[kk]); }); $$('.se-m', fig).forEach(m => { m.classList.toggle('on', +m.dataset.i <= i); m.classList.toggle('cur', +m.dataset.i === i); });
      const c = $('.se-cols', root); c.classList.remove('px-fade'); void c.offsetWidth; c.classList.add('px-fade'); };
    const goH = (h, fast) => { tw.to({ h }, fast ? 0 : 900); let i = -1; SE_STEPS.forEach((S, j) => { if (S.h <= h + 1e-6) i = j; }); text(i); };
    if (deck) { draw(); goH(-1.4, true); }
    else {
      const show = stepperBind(root, SE_STEPS.length, i => { goH(SE_STEPS[i].h); $('.se-rng input', root).value = SE_STEPS[i].h; });
      $('.se-rng input', root).addEventListener('input', e => { const h = +e.target.value; tw.to({ h }, 0); let i = 0; SE_STEPS.forEach((S, j) => { if (S.h <= h) i = j; }); show(i); text(i); });
      stopW = watchW(fig, w => { W = Math.max(300, w); si = -2; draw(); text(SE_STEPS.findIndex(S => S.h === cur) >= 0 ? SE_STEPS.findIndex(S => S.h === cur) : 0); });
      show(0); goH(-1, true);
    }
    return { step(s) { if (!deck) return; const x = stepAt(cfg, s); goH(x ? x.h : -1.4, !x && s === 0); }, destroy() { tw.stop(); stopW && stopW(); } };
  }
};

/* ═════════ Figure : la salle de session, vue de dessus (d’après Johnson, Richards et Griffiths 2008) ═════════ */
FIG.salle = () => {
  const lab = (x, y, t, a) => T(x, y, t, 'sl-t', a || 'middle');
  let g = '<defs><linearGradient id="slBl" x1="0" x2="1"><stop offset="0" stop-color="#FFB3CD"/><stop offset="1" stop-color="#E01C50"/></linearGradient>' +
    '<radialGradient id="slLamp"><stop offset="0" stop-color="#FFD6E4" stop-opacity=".95"/><stop offset="1" stop-color="#FFD6E4" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="slSun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF8EB4" stop-opacity=".45"/><stop offset="1" stop-color="#FF8EB4" stop-opacity="0"/></linearGradient></defs>';
  /* la pièce, la fenêtre et sa lumière, la porte */
  g += '<rect class="sl-room" x="20" y="24" width="600" height="420" rx="24"/>';
  g += '<path d="M232 26 L408 26 L470 190 L170 190 Z" fill="url(#slSun)"/><rect class="sl-win" x="226" y="17" width="188" height="14" rx="5"/>';
  g += '<path class="sl-door" d="M520 444 A 64 64 0 0 1 584 380"/><line class="sl-wall" x1="520" y1="444" x2="584" y2="444"/>';
  /* le tapis, le divan, le patient (masque, casque, couverture) */
  g += '<ellipse class="sl-rug" cx="300" cy="262" rx="205" ry="128"/>';
  g += '<rect class="sl-couch" x="146" y="188" width="300" height="128" rx="30"/><rect class="sl-cush" x="160" y="204" width="58" height="96" rx="18"/>';
  g += '<rect x="226" y="214" width="204" height="76" rx="24" fill="url(#slBl)"/>';
  g += '<circle class="sl-skin" cx="196" cy="252" r="23"/><rect class="sl-mask" x="181" y="241" width="30" height="10" rx="5"/><path class="sl-hp" d="M175 240 A 24 24 0 0 1 217 240"/><rect class="sl-cup" x="170" y="238" width="9" height="16" rx="4"/><rect class="sl-cup" x="213" y="238" width="9" height="16" rx="4"/>';
  /* deux accompagnants, la table (eau, mouchoirs), la lampe, la plante, la musique */
  [[300, 372], [512, 230]].forEach(([x, y]) => { g += '<rect class="sl-chair" x="' + (x - 38) + '" y="' + (y - 34) + '" width="76" height="70" rx="20"/><circle class="sl-guide" cx="' + x + '" cy="' + y + '" r="17"/>'; });
  g += '<circle class="sl-table" cx="92" cy="252" r="30"/><circle class="sl-glass" cx="84" cy="244" r="8"/><rect class="sl-tiss" x="90" y="254" width="18" height="12" rx="3"/>';
  g += '<circle cx="82" cy="86" r="60" fill="url(#slLamp)"/><circle class="sl-lamp" cx="82" cy="86" r="15"/>';
  for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2; g += '<ellipse class="sl-leaf" cx="' + r1(560 + 15 * Math.cos(a)) + '" cy="' + r1(84 + 15 * Math.sin(a)) + '" rx="13" ry="6" transform="rotate(' + r1(a * 180 / Math.PI) + ' ' + r1(560 + 15 * Math.cos(a)) + ' ' + r1(84 + 15 * Math.sin(a)) + ')"/>'; }
  g += '<circle class="sl-pot" cx="560" cy="84" r="9"/>';
  g += '<rect class="sl-spk" x="96" y="364" width="34" height="46" rx="8"/><circle class="sl-cone" cx="113" cy="392" r="9"/>' + [16, 26].map(r => '<path class="sl-wave" d="M' + (130 + r * 0.5) + ' ' + (392 - r) + ' A ' + r + ' ' + r + ' 0 0 1 ' + (130 + r * 0.5) + ' ' + (392 + r) + '"/>').join('');
  /* étiquettes */
  g += lab(320, 54, 'lumière douce') + lab(196, 340, 'masque, casque') + lab(330, 438, 'accompagnant') + lab(512, 290, 'accompagnant') + lab(92, 308, 'eau, mouchoirs') + lab(82, 148, 'lampe') + lab(560, 134, 'plante') + lab(113, 434, 'musique') + lab(552, 372, 'toilettes à côté');
  return '<svg class="sl-svg" viewBox="0 0 640 468" role="img" aria-label="Plan d’une salle de session : un divan où le patient est allongé avec un masque et un casque, deux fauteuils pour les accompagnants, une lampe, une plante, de l’eau, de la musique">' + g + '</svg>';
};

/* ═════════ Figure : des réseaux qui se désynchronisent (schéma, d’après Carhart-Harris 2012 et Siegel 2024) ═════════ */
FIG.reseaux = () => {
  let seed = 23; const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const NET = [['mode par défaut', 'cl', 92, 92], ['visuel', 'di', 252, 92], ['saillance', 'en', 92, 228], ['sensorimoteur', 'at', 252, 228]];
  const nodes = []; NET.forEach(([l, f, cx, cy], n) => { for (let i = 0; i < 7; i++) { const a = i / 6 * Math.PI * 2 + n, r = i ? 40 : 0; nodes.push({ n, f, x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), jx: (rnd() - .5) * 52, jy: (rnd() - .5) * 52 }); } });
  const intra = [], inter = [];
  nodes.forEach((a, i) => nodes.forEach((b, j) => { if (j <= i) return; const d = Math.hypot(a.x - b.x, a.y - b.y); if (a.n === b.n && d < 62) intra.push([i, j]); else if (a.n !== b.n) inter.push([i, j, d]); }));
  inter.sort((p, q) => p[2] - q[2]);
  /* positions désordonnées : décalées au hasard, puis écartées pour que deux nœuds ne se chevauchent pas */
  const ALT = nodes.map(nd => [nd.x + nd.jx * 0.9, nd.y + nd.jy * 0.9]);
  for (let it = 0; it < 40; it++) ALT.forEach((a, i) => ALT.forEach((b, j) => { if (j <= i) return; const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1; if (d < 24) { const k = (24 - d) / 2 / d; a[0] -= dx * k; a[1] -= dy * k; b[0] += dx * k; b[1] += dy * k; } }));
  const panel = (alt) => {
    const P = i => alt ? ALT[i] : [nodes[i].x, nodes[i].y];
    let g = '';
    const keepIntra = intra.filter((e, k) => !alt || k % 3 !== 0), keepInter = alt ? inter.slice(0, Math.round(inter.length * 0.45)).filter((e, k) => k % 4 === 1).slice(0, 20) : inter.slice(0, 3);
    keepInter.forEach(([i, j]) => { const [x1, y1] = P(i), [x2, y2] = P(j); g += '<line class="e-x" x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '"/>'; });
    keepIntra.forEach(([i, j]) => { const [x1, y1] = P(i), [x2, y2] = P(j); g += '<line class="e-i fam-' + nodes[i].f + (alt ? ' weak' : '') + '" x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '"/>'; });
    nodes.forEach((nd, i) => { const [x, y] = P(i); g += '<circle class="nd fam-' + nd.f + '" cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + (i % 7 ? 7.5 : 10) + '"/>'; });
    return '<svg class="rx-svg" viewBox="20 20 304 280" role="img" aria-label="' + (alt ? 'Sous psilocybine : réseaux moins cohérents, davantage de liens entre eux' : 'État ordinaire : quatre réseaux bien séparés') + '">' + g + '</svg>';
  };
  return '<div class="rx"><div class="rx-panels"><div class="rx-p">' + panel(false) + '<span class="eyebrow">État ordinaire</span></div><div class="rx-arrow" aria-hidden="true">' + arrow('r') + '</div><div class="rx-p">' + panel(true) + '<span class="eyebrow">Sous psilocybine</span></div></div>' +
    '<div class="px-leg">' + NET.map(([l, f]) => '<span><i class="sw fam-' + f + '"></i>' + esc(l) + '</span>').join('') + '</div></div>';
};


/* ═════════ 8. Kaléidoscope (diapositive de remerciement) ═════════
   Des formes du spectre du cours dans un secteur de 30°, reflétées en miroir douze fois ; elles dérivent lentement et
   la rosace tourne. Mouvement réduit : une image fixe. */
const KA_COLS = ['#FFE2EB', '#FFB3CD', '#FF8EC4', '#FE3C6F', '#E01C50', '#B3124A', '#7A0C35', '#FFFFFF'];
function kaShapes(n, seed) {
  let x = seed || 7; const rnd = () => (x = (x * 16807) % 2147483647) / 2147483647;
  return Array.from({ length: n }, (_, i) => ({ r: 0.08 + rnd() * 0.9, a: rnd() * Math.PI / 6, s: 0.03 + rnd() * 0.12, k: Math.floor(rnd() * 4), c: KA_COLS[Math.floor(rnd() * KA_COLS.length)], al: 0.35 + rnd() * 0.55, w: 0.25 + rnd() * 0.6, ph: rnd() * 6.28, rot: rnd() * 6.28 }));
}
VIZ.kaleido = {
  html(cfg) { return '<div class="ka' + (cfg.mode === 'deck' ? ' in-deck' : '') + '" role="img" aria-label="Un kaléidoscope aux couleurs du cours, qui tourne lentement"><canvas class="ka-cv"></canvas></div>'; },
  mount(el, cfg, mode) {
    const root = $('.ka', el), cv = $('.ka-cv', root), ctx = cv.getContext('2d'), deck = mode === 'deck';
    const SH = kaShapes(46, 11); let W = 600, dpr = 1, raf = 0, running = false, t0 = performance.now();
    const size = () => { W = Math.round(root.offsetWidth || (deck ? 760 : 480)); const sc = deck && root.offsetWidth ? root.getBoundingClientRect().width / root.offsetWidth : 1; dpr = clamp((window.devicePixelRatio || 1) * (sc || 1), 1, 2.5); cv.width = cv.height = Math.round(W * dpr); cv.style.width = cv.style.height = W + 'px'; };
    const wedge = (t) => {
      SH.forEach(z => {
        const rr = z.r * (0.94 + 0.06 * Math.sin(t * 0.35 + z.ph)), aa = z.a + 0.06 * Math.sin(t * 0.22 + z.ph * 1.3);
        const x = rr * Math.cos(aa), y = rr * Math.sin(aa), s = z.s * (0.85 + 0.15 * Math.sin(t * 0.5 + z.ph));
        ctx.save(); ctx.translate(x, y); ctx.rotate(z.rot + t * 0.1 * (z.k % 2 ? 1 : -1)); ctx.globalAlpha = z.al; ctx.fillStyle = z.c; ctx.strokeStyle = z.c; ctx.lineWidth = s * 0.28;
        ctx.beginPath();
        if (z.k === 0) { ctx.arc(0, 0, s, 0, 7); ctx.fill(); }
        else if (z.k === 1) { ctx.arc(0, 0, s, 0, 7); ctx.stroke(); }
        else if (z.k === 2) { ctx.moveTo(0, -s); ctx.lineTo(s * 0.87, s * 0.5); ctx.lineTo(-s * 0.87, s * 0.5); ctx.closePath(); ctx.fill(); }
        else { ctx.ellipse(0, 0, s * 1.4, s * z.w, 0, 0, 7); ctx.fill(); }
        ctx.restore();
      });
    };
    const draw = now => {
      const t = (now - t0) / 1000, R = W / 2;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, W);
      ctx.save(); ctx.translate(R, R); ctx.beginPath(); ctx.arc(0, 0, R - 1, 0, 7); ctx.clip();
      ctx.rotate(t * 0.05); ctx.scale(R, R);
      for (let i = 0; i < 12; i++) {
        ctx.save(); ctx.rotate(Math.floor(i / 2) * Math.PI / 3); if (i % 2) { ctx.scale(1, -1); }
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 1.02, -0.002, Math.PI / 6 + 0.002); ctx.closePath(); ctx.clip();
        wedge(t); ctx.restore();
      }
      ctx.restore();
      /* un liseré et une lueur au centre */
      ctx.save(); ctx.translate(R, R); const g = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 0.32); g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, R * 0.32, 0, 7); ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.beginPath(); ctx.arc(0, 0, R - 2, 0, 7); ctx.stroke(); ctx.restore();
    };
    const frame = now => { raf = requestAnimationFrame(frame); draw(now); };
    size(); draw(performance.now());
    if (deck) requestAnimationFrame(() => { size(); draw(performance.now()); });
    const stopW = deck ? null : watchW(root, () => { size(); draw(performance.now()); });
    return {
      start() { if (running) return; if (reduceMotion()) { draw(performance.now()); return; } running = true; raf = requestAnimationFrame(frame); },
      stop() { running = false; cancelAnimationFrame(raf); },
      destroy() { running = false; cancelAnimationFrame(raf); stopW && stopW(); }
    };
  }
};
})();
