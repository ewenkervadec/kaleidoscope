/* Moteur des cours (série Chimioarchitecture) — vues : en-tête, routeur, accueil, lecture, projection, présentateur, laboratoires,
   pharmacopée, fiches molécules, histoire, arbres, entraînement, révision, glossaire. */
'use strict';
const VIEWS = [['', 'Accueil'], ['cours', 'Le cours'], ['labos', 'Laboratoires'], ['pharmacopee', D.site.pharmaNav || 'Pharmacopée'], ['histoire', 'Histoire'], ['entrainement', 'S’entraîner'], ['glossaire', 'Glossaire']];
function header() {
  const top = $('#top');
  top.innerHTML = '<div class="wrap top-in"><a class="brand" href="#/" aria-label="Accueil">' + LOGO + '<span class="bw"><b>' + esc(D.site.title1) + '</b><span>' + esc(D.site.title2) + '</span></span></a><nav class="nav" aria-label="Sections">' + VIEWS.slice(1).map(v => '<a href="#/' + v[0] + '" data-v="' + v[0] + '">' + v[1] + '</a>').join('') + '</nav><div class="top-act"><a class="btn small" href="#/diapo/' + SLIDES[0].id + '" title="Projeter le cours (touche P en lecture)">' + ICON.play.replace('<svg', '<svg width="13" height="13"') + '<span class="lbl">Projeter</span></a><button class="icon-btn" id="themeBtn" type="button"></button></div></div>';
  themeButton();
  $('#themeBtn').addEventListener('click', () => { theme = theme === 'auto' ? 'light' : theme === 'light' ? 'dark' : 'auto'; gstore.set('theme', theme); applyTheme(theme); themeButton(); redraw(); });
}
function setNav(v) { $$('.nav a').forEach(a => a.setAttribute('aria-current', a.dataset.v === v ? 'page' : 'false')); }
let currentView = null;
function viewSet(html) { unmountViz($('#view')); $('#view').innerHTML = html; mountViz($('#view'), 'read'); }
function route() {
  if (location.hash && !location.hash.startsWith('#/') && currentView !== null) { const el = document.getElementById(location.hash.slice(1)); if (el) el.focus({ preventScroll: false }); return; }
  const h = decodeURIComponent(location.hash.replace(/^#\/?/, '')); const parts = h.split('/'); const v = parts[0] || '';
  closeAllPops();
  if (v === 'presenter') { renderPresenter(); return; }
  if (v === 'diapo') { if (currentView !== 'cours') { renderReader(); currentView = 'cours'; setNav('cours'); } openDeck(parts[1] || SLIDES[0].id, +(parts[2] || 0)); return; }
  if (deck.open) closeDeck(false);
  setNav(v === 'molecule' ? 'pharmacopee' : v === 'raisonner' || v === 'reviser' ? 'entrainement' : v);
  if (v === 'cours') { if (currentView !== 'cours') renderReader(); currentView = 'cours'; if (parts[1] && SL[parts[1]]) scrollToSlide(parts[1]); else if (!parts[1]) window.scrollTo(0, 0); return; }
  currentView = v; window.scrollTo(0, 0);
  if (v === 'labos') renderLabs(parts[1]);
  else if (v === 'pharmacopee') renderPharma();
  else if (v === 'molecule') renderMolPage(parts[1]);
  else if (v === 'histoire') renderHistory(parts[1]);
  else if (v === 'raisonner') renderTrees(parts[1]);
  else if (v === 'entrainement') renderTraining(parts[1]);
  else if (v === 'reviser') renderReview();
  else if (v === 'glossaire') renderGlossary(parts[1]);
  else renderHome();
  const nm = { molecule: MOLS[parts[1]] ? MOLS[parts[1]].dci : (D.site.molWordCap || 'Molécule'), raisonner: 'Raisonner', reviser: 'Réviser' }[v] || (VIEWS.find(x => x[0] === v) || VIEWS[0])[1];
  document.title = (v ? nm + ' · ' : '') + D.site.title1 + ' ' + D.site.title2;
}
function redraw() { if (deck.open) { renderDeckSlide(); applyStep(); return; } const y = window.scrollY; if (currentView === 'cours') { unmountViz($('#view')); renderReader(); } else route(); window.scrollTo(0, y); }

/* ───────── Accueil ───────── */
function coverHTML(big) {
  const S = D.site, CV = S.cover || {};
  return '<div class="cover' + (big ? ' big' : '') + '"><img class="cv-ph" src="' + esc(CV.img || 'assets/img/couverture-cercle.jpg') + '" alt="' + esc(CV.alt || '') + '" width="1200" height="1500" decoding="async"><div class="cv-scrim" aria-hidden="true"></div>' +
    '<div class="cv-top"><span>' + esc(S.authorShort || S.author) + '</span><span>' + esc(S.year || '') + '</span></div><div class="cv-txt"><h1 class="cv-title"><span class="t1">' + esc(S.title1) + '</span><br><span class="t2">' + esc(S.title2) + '</span></h1></div>' + (CV.credit ? '<span class="cv-cr">' + esc(CV.credit) + '</span>' : '') + '</div>';
}
function coverSlideHTML(s, ctx) {
  const S = D.site, CV = S.cover || {};
  return '<div class="cover-full"><i class="cv-glow" aria-hidden="true"></i><i class="cv-ring r1" aria-hidden="true"></i><i class="cv-ring r2" aria-hidden="true"></i>' +
    '<figure class="cv-frame"><img class="cv-ph" src="' + esc(CV.slide || CV.img || 'assets/img/couverture-cercle.jpg') + '" alt="' + esc(CV.alt || '') + '" width="1200" height="1500"></figure>' +
    '<div class="cv-top"><span>' + esc(S.author) + ' · ' + esc(S.roleShort || '') + '</span><span>' + esc(S.place) + '</span></div><div class="cv-txt"><span class="cv-eb">' + esc(S.kicker) + '</span><h1 class="cv-title"><span class="t1">' + esc(S.title1) + '</span><br><span class="t2">' + esc(S.title2) + '</span></h1><p class="cv-sub">' + md(s.sub || S.short) + '</p>' + (s.b ? blocks(s.b, ctx) : '') + '</div>' + (CV.credit ? '<span class="cv-cr">' + esc(CV.credit) + '</span>' : '') + '</div>';
}
function renderHome() {
  const S = D.site;
  let h = '<section class="home-hero">' + coverHTML(true) + '<div class="hero-txt"><span class="eyebrow">' + esc(S.kicker) + '</span>' + (S.heroTitle ? '<h1 class="hero-title"><span class="t1">' + esc(S.title1) + '</span><br><span class="t2">' + esc(S.title2) + '</span></h1>' : '') + '<p class="lede">' + md(S.lede) + '</p><div class="cta"><a class="btn" href="#/cours">Lire le cours ' + arrow('r', 'btn-arw') + '</a><a class="btn ghost" href="#/diapo/' + SLIDES[0].id + '">' + ICON.play.replace('<svg', '<svg width="13" height="13"') + ' Projeter le cours</a><a class="btn ghost" href="#/labos">Les laboratoires</a></div><p class="who">' + esc(S.author) + ' · ' + esc(S.role) + '</p></div></section>';
  /* déroulé du cours : les chapitres dans l’ordre, la largeur de chaque carte suit le temps prévu */
  const plan = D.plan || [];
  h += '<section class="session"><div class="sec-h"><span class="eyebrow">Le déroulé</span><h2>' + esc(S.sessionTitle || 'Un cours interactif') + '</h2><p>' + md(S.session || '') + '</p></div><ol class="plan">' + plan.map(p => '<li style="--w:' + (p.to - p.from) + '"' + (p.sid && SL[p.sid] ? ' data-ch="' + SL[p.sid].ch + '"' : '') + '><b>' + md(p.t) + '</b><span class="pl-m">' + md(p.m) + '</span>' + (p.sid ? '<a class="slink" href="#/cours/' + p.sid + '">Diapositive ' + (SL[p.sid].i + 1) + ' ' + arrow('r', 'in') + '</a>' : '') + '</li>').join('') + '</ol></section>';
  h += '<section class="doors">' + (D.doors || []).map(t => '<a class="door" href="' + t[0] + '">' + emblemSVG(t[1], { size: 92 }) + '<b>' + t[2] + '</b><span>' + t[3] + '</span><span class="go">' + arrow('r', 'in') + '</span></a>').join('') + '</section>';
  h += '<section class="toc-home"><div class="sec-h"><span class="eyebrow">Sommaire · ' + SLIDES.length + ' diapositives</span><h2>Le cours, chapitre par chapitre</h2></div><div class="toc-grid">' + D.chapters.map(c => '<div class="toc-ch" data-ch="' + c.id + '">' + emblemSVG(c.emblem || 'loop', { size: 54 }) + '<span class="eyebrow">' + esc(c.n) + ' · ' + (c.mins ? c.mins + NB + 'min' : '') + '</span><h3>' + esc(c.t) + '</h3><ol>' + SLIDES.filter(s => s.ch === c.id && s.kind !== 'section').map(s => '<li><a href="#/cours/' + s.id + '"><span class="ch">' + (s.i + 1) + '</span><span>' + esc(plain(s.short || s.t)) + '</span></a></li>').join('') + '</ol></div>').join('') + '</div></section>';
  h += '<section class="srcs"><span class="eyebrow">Sources principales</span><ol class="refs">' + (S.sources || []).map(r => '<li>' + md(r) + '</li>').join('') + '</ol>' + (D.sisters && D.sisters.length ? '<p class="note">' + D.sisters.map(s => (s.status === 'en ligne' ? '<a href="' + esc(s.url) + '">' + esc(s.title) + '</a>' : esc(s.title) + ' (' + esc(s.status) + ')')).join(' · ') + '</p>' : '') + '</section>';
  viewSet(h);
}

/* ───────── Lecture ───────── */
let tocObserver = null;
function slideSection(s) {
  const ctx = { mode: 'read', f: 0 };
  let h = '<section class="sl k-' + (s.kind || 'content') + '" id="s-' + s.id + '" data-sid="' + s.id + '"' + (s.ch ? ' data-ch="' + s.ch + '"' : '') + (s.lvl ? ' data-lvl="' + s.lvl + '"' : '') + '>';
  h += '<div class="sl-head"><div class="left"><span class="sl-num">' + String(s.i + 1).padStart(2, '0') + '</span>' + (s.obj ? s.obj.map(o => '<span class="obj-chip" title="' + esc(OBJ[o] ? OBJ[o].t : '') + '">objectif ' + esc(o.replace(/^O/, '')) + '</span>').join('') : '') + (s.lvl === 'plus' ? '<span class="lvl-chip">pour aller plus loin</span>' : '') + (s.mins ? '<span class="min-chip mono">' + s.mins + NB + 'min</span>' : '') + '</div><div class="sl-act"><button class="icon-btn" type="button" data-present="' + s.id + '" title="Projeter à partir d’ici" aria-label="Projeter à partir de cette diapositive">' + ICON.play + '</button><button class="icon-btn" type="button" data-copy="' + s.id + '" title="Copier le lien" aria-label="Copier le lien de cette diapositive">' + ICON.link + '</button></div></div>';
  if (s.kind === 'cover') h += '<h3 class="sl-t">' + md(s.t) + '</h3>' + (s.sub ? '<p class="sl-sub">' + md(s.sub) + '</p>' : '');
  else h += '<h3 class="sl-t">' + md(s.t) + '</h3>' + (s.kind === 'section' && s.sub ? '<p class="sl-sub">' + md(s.sub) + '</p>' : '');
  h += blocks(s.b, ctx);
  if (s.more) h += '<div class="sl-more"><span class="eyebrow">Pour aller plus loin</span>' + blocks(s.more, ctx) + '</div>';
  if (s.notes) h += '<div class="sl-notes" data-notes hidden><b>Note de l’enseignant · </b>' + md(s.notes) + '</div>';
  if (s.src) h += '<p class="src sl-src">' + esc(s.src) + '</p>';
  return h + '</section>';
}
function renderReader() {
  let toc = '<div class="rtools"><input class="search" id="rsearch" type="search" placeholder="Chercher dans le cours" aria-label="Chercher dans le cours"><label class="switch" for="essT"><input type="checkbox" id="essT"><span>L’essentiel seulement</span></label><label class="switch" for="notesT"><input type="checkbox" id="notesT"><span>Notes de l’enseignant</span></label><div id="nlockSlot"></div>' + (window.APERCU ? '' : '<button class="btn ghost small" type="button" id="printBtn">Imprimer le polycopié</button>') + '<span class="note" id="rcount"></span></div>';
  toc += '<details' + (matchMedia('(min-width: 861px)').matches ? ' open' : '') + '><summary class="eyebrow">Sommaire · ' + SLIDES.length + ' diapositives</summary><ol>' + D.chapters.map(c => '<li><span class="chh">' + esc(c.n) + ' · ' + esc(c.t) + '</span><ol>' + SLIDES.filter(s => s.ch === c.id).map(s => '<li><a href="#/cours/' + s.id + '" data-toc="' + s.id + '">' + esc(plain(s.short || s.t)) + '</a></li>').join('') + '</ol></li>').join('') + '</ol></details>';
  let main = '';
  D.chapters.forEach(c => {
    main += '<div class="chapter-h" id="ch-' + c.id + '" data-ch="' + c.id + '">' + emblemSVG(c.emblem || 'loop', { size: 70 }) + '<div><span class="n">' + esc(c.n) + (c.mins ? ' · ' + c.mins + NB + 'min' : '') + '</span><h2>' + esc(c.t) + '</h2>' + (c.sub ? '<p>' + md(c.sub) + '</p>' : '') + '</div></div>';
    SLIDES.filter(s => s.ch === c.id).forEach(s => { main += slideSection(s); });
  });
  main += '<div class="trail" aria-live="polite"><span>Fil de lecture</span><ol id="trail"></ol></div>';
  unmountViz($('#view'));
  $('#view').innerHTML = '<div class="reader" id="reader"><nav class="rtoc" aria-label="Sommaire du cours">' + toc + '</nav><article class="rmain" id="rmain">' + main + '</article><div id="stackSlot"></div></div>';
  const st = ensureStack(); $('#stackSlot').replaceWith(st); st.id = 'stack';
  renderPanes(); mountViz($('#rmain'), 'read');
  const eT = $('#essT'); eT.checked = store.get('ess', false); $('#rmain').classList.toggle('ess-only', eT.checked);
  eT.addEventListener('change', () => { $('#rmain').classList.toggle('ess-only', eT.checked); store.set('ess', eT.checked); });
  const nT = $('#notesT'), slot = $('#nlockSlot'); nT.checked = NOTES.open && store.get('notes', false); const showNotes = () => $$('[data-notes]').forEach(n => { n.hidden = !nT.checked; }); showNotes();
  slot.innerHTML = NOTES.open ? (nT.checked ? lockAgainHTML() : '') : '';
  nT.addEventListener('change', () => {
    /* notes encore chiffrées : le mot de passe d’abord */
    if (nT.checked && !NOTES.open) { nT.checked = false; slot.innerHTML = lockFormHTML(); const i = $('input', slot); if (i) i.focus(); return; }
    store.set('notes', nT.checked); showNotes(); slot.innerHTML = NOTES.open && nT.checked ? lockAgainHTML() : '';
  });
  const pb = $('#printBtn'); if (pb) pb.addEventListener('click', () => { showNotes(); window.print(); });
  const idx = SLIDES.map(s => ({ id: s.id, txt: ($('#s-' + s.id) || {}).textContent.replace(/\u2060/g, '').toLowerCase() }));
  $('#rsearch').addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase(); let n = 0;
    idx.forEach(o => { const hit = !q || o.txt.includes(q); const el = $('#s-' + o.id); el.hidden = !hit; if (hit) n++; const a = $('[data-toc="' + o.id + '"]'); if (a) a.style.opacity = hit ? '' : '.35'; });
    $$('.chapter-h').forEach(ch => { ch.hidden = !!q; });
    $('#rcount').textContent = q ? n + ' diapositive' + (n > 1 ? 's' : '') + ' trouvée' + (n > 1 ? 's' : '') : '';
  });
  if (tocObserver) tocObserver.disconnect();
  tocObserver = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) $$('[data-toc]').forEach(a => a.setAttribute('aria-current', a.dataset.toc === e.target.dataset.sid ? 'true' : 'false')); }); }, { rootMargin: '-30% 0px -60% 0px' });
  $$('.sl').forEach(s => tocObserver.observe(s));
  document.title = 'Le cours · ' + D.site.title1 + ' ' + D.site.title2;
}
function scrollToSlide(sid) {
  const el = document.getElementById('s-' + sid); if (!el) return;
  if (el.hidden) { const s = $('#rsearch'); if (s) { s.value = ''; s.dispatchEvent(new Event('input')); } }
  if (el.dataset.lvl === 'plus' && $('#essT') && $('#essT').checked) { $('#essT').checked = false; $('#rmain').classList.remove('ess-only'); store.set('ess', false); }
  const go = b => el.scrollIntoView({ behavior: b, block: 'start' });
  requestAnimationFrame(() => go(reduceMotion() ? 'auto' : 'smooth'));
  /* les figures situées au-dessus se dessinent pendant le défilement et changent de hauteur :
     réajuster tant que le lecteur n’a pas repris la main */
  let user = false; const mine = () => { user = true; };
  ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(t => window.addEventListener(t, mine, { once: true, passive: true }));
  [750, 1500].forEach(ms => setTimeout(() => { if (!user && el.isConnected && Math.abs(el.getBoundingClientRect().top - 80) > 8) go('auto'); }, ms));
}

/* ───────── Notes de l’enseignant ─────────
   Elles sont chiffrées dans cours.js (C.notesLock : AES-GCM, clé tirée du mot de passe par PBKDF2) et n’existent en clair
   qu’après le mot de passe. La clé reste dans ce navigateur (stockage local) jusqu’à « Verrouiller les notes ». */
const NOTES = { open: !D.notesLock };
const pwNorm = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();
const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
const canCrypt = () => !!(window.crypto && crypto.subtle);
async function notesDecrypt(key) {
  const L = D.notesLock, buf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(L.iv) }, key, unb64(L.ct));
  const map = JSON.parse(new TextDecoder().decode(buf)); SLIDES.forEach(s => { if (map[s.id]) s.notes = map[s.id]; }); NOTES.open = true;
}
async function notesUnlock(pw) {
  const L = D.notesLock; if (!L) return true; if (!canCrypt()) throw new Error('crypto');
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pwNorm(pw)), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: unb64(L.salt), iterations: L.it, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, true, ['decrypt']);
  try { await notesDecrypt(key); } catch (e) { return false; }
  try { store.set('notes.cle', btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.exportKey('raw', key))))); } catch (e) { }
  return true;
}
async function notesRestore() {
  const k = store.get('notes.cle', ''); if (NOTES.open || !k || !canCrypt()) return NOTES.open;
  try { await notesDecrypt(await crypto.subtle.importKey('raw', unb64(k), 'AES-GCM', false, ['decrypt'])); } catch (e) { store.del('notes.cle'); }
  return NOTES.open;
}
function notesClose() { SLIDES.forEach(s => { delete s.notes; }); NOTES.open = false; }
function notesLockAgain() { if (!D.notesLock) return; store.del('notes.cle'); notesClose(); notesRefresh(false); }
const lockFormHTML = () => '<form class="nlock"><b>Notes de l’enseignant · protégées</b><div class="nlock-row"><input type="password" name="pw" placeholder="Mot de passe" aria-label="Mot de passe des notes" autocomplete="current-password"><button class="btn small" type="submit">Déverrouiller</button></div><p class="nlock-msg" aria-live="polite"></p></form>';
const lockAgainHTML = () => D.notesLock ? '<p class="nlock-off"><button type="button" data-nlock>Verrouiller les notes</button></p>' : '';
/* après un déverrouillage (ou un verrouillage) : on redessine ce qui montre des notes */
function notesRefresh(opened) {
  if (window.pvDraw) { window.pvDraw(); return; }
  if (deck.open) { if (deck.notes) showDeckNotes(); if (opened) deck.el.focus({ preventScroll: true }); return; }
  if (currentView === 'cours' && (opened || store.get('notes', false) || !NOTES.open)) { if (opened) store.set('notes', true); redraw(); }
}
document.addEventListener('submit', async e => {
  const f = e.target.closest && e.target.closest('form.nlock'); if (!f) return; e.preventDefault();
  const msg = $('.nlock-msg', f), inp = $('input', f); msg.textContent = 'Vérification…';
  let ok = false; try { ok = await notesUnlock(inp.value); } catch (err) { msg.textContent = 'Le déchiffrement demande une page en https ou un serveur local.'; return; }
  if (!ok) { msg.textContent = 'Mot de passe incorrect.'; inp.select(); return; }
  notesRefresh(true);
});
document.addEventListener('click', e => { if (e.target.closest && e.target.closest('[data-nlock]')) { e.preventDefault(); notesLockAgain(); } });
/* une autre fenêtre (vue présentateur) déverrouille ou verrouille : on suit */
window.addEventListener('storage', e => {
  if (e.key !== NS + 'notes.cle') return;
  if (e.newValue && !NOTES.open) notesRestore().then(ok => { if (ok) notesRefresh(false); });
  else if (!e.newValue && NOTES.open) { notesClose(); notesRefresh(false); }
});

/* ───────── Projection ───────── */
/* aperçu en une page : si aucune source d’une vidéo ne se charge, on se rabat sur la copie intégrée à la page */
document.addEventListener('error', e => {
  const s = e.target; if (!window.VIDEO_FALLBACK || !(s instanceof HTMLSourceElement)) return;
  const v = s.parentElement; if (!v || v.dataset.fb || s !== v.querySelector('source:last-of-type')) return;
  v.dataset.fb = '1'; v.src = window.VIDEO_FALLBACK; v.load(); if (deck.open && deck.el.contains(v)) { const pr = v.play(); if (pr && pr.catch) pr.catch(() => { }); }
}, true);
const deck = { open: false, el: null, i: 0, step: 0, max: 0, notes: false, ov: false, black: false, t0: Date.now(), typed: '' };
const chan = (() => { try { return new BroadcastChannel('chimie-' + D.site.id); } catch (e) { return null; } })();
function deckSlideHTML(s) {
  const ctx = { mode: 'deck', f: 0 }; const ch = CH[s.ch]; const k = s.kind || 'content';
  let h = '<div class="slide k-' + k + '" data-sid="' + s.id + '"' + (s.ch ? ' data-ch="' + s.ch + '"' : '') + '>';
  if (k === 'cover') h += coverSlideHTML(s, ctx);
  /* chapitre : le texte à gauche ; à droite, des disques du dégradé et l’emblème blanc */
  /* remerciements : le titre en Compu à gauche, un kaléidoscope à droite */
  else if (k === 'thanks') h += '<div class="thx"><div class="thx-txt"><h2 class="s-t">' + md(s.t) + '</h2>' + (s.sub ? '<div class="sub">' + md(s.sub) + '</div>' : '') + '<span class="thx-who mono">' + esc(D.site.author) + ' · ' + esc(D.site.roleShort || '') + '</span></div><div class="thx-art">' + (s.b ? blocks(s.b, ctx) : '') + '</div></div>';
  else if (k === 'section') h += '<div class="night" aria-hidden="true"></div><div class="sec-in"><div class="sec-txt"><span class="s-sec-n mono">' + esc(ch ? 'Chapitre ' + ch.n : '') + (ch && ch.mins ? ' · ' + ch.mins + NB + 'min' : '') + '</span><h2 class="s-t">' + md(s.t) + '</h2>' + (s.sub ? '<div class="sub">' + md(s.sub) + '</div>' : '') + (s.b ? blocks(s.b, ctx) : '') + '</div><div class="sec-art" aria-hidden="true"><i class="disc d1"></i><i class="disc d2"></i><i class="disc d3"></i>' + emblemSVG(ch && ch.emblem || 'loop', { size: 150 }) + '</div></div>';
  else {
    h += '<div class="s-head"><span class="mono">' + esc(ch ? ch.n + ' — ' + ch.t : '') + '</span><span class="mono">' + String(s.i + 1).padStart(2, '0') + ' / ' + String(SLIDES.length).padStart(2, '0') + '</span></div>';
    if (s.t && !s.notitle) h += '<h2 class="s-t">' + md(s.t) + '</h2>';
    h += '<div class="s-body"' + (s.fs ? ' style="--fs:' + s.fs + 'px"' : '') + '>' + blocks(s.b, ctx) + '</div>';
  }
  h += '<div class="s-foot"><span>' + esc(D.site.title1 + ' ' + D.site.title2) + '</span><span>' + esc(s.src || '') + '</span><span>' + esc(D.site.authorShort || '') + '</span></div>';
  return { html: h + '</div>', max: ctx.f };
}
/* les sous-titres des diapositives de chapitre et de couverture tiennent sur une seule ligne : on réduit le corps si besoin */
function fitLines(sl) {
  $$('.sub, .cv-sub', sl).forEach(el => { let fs = parseFloat(getComputedStyle(el).fontSize) || 30, g = 0; while (el.scrollWidth > el.clientWidth + 1 && fs > 16 && g++ < 40) { fs -= 0.5; el.style.fontSize = fs + 'px'; } });
}
function fitSlide(sl) {
  const body = $('.s-body', sl); if (!body) return;
  /* on mesure avec tout ce qui apparaîtra plus tard (réponse d’une question, contenu révélé…) pour éviter un débordement à la dernière étape */
  sl.classList.add('fit-measure');
  /* le corps, mais aussi les colonnes d’un partage, qui peuvent déborder sous l’encadré qui suit */
  const over = () => body.scrollHeight > body.clientHeight + 2 || $$('.split', body).some(x => x.scrollHeight > x.clientHeight + 6);
  /* le texte projeté est court : on prend le plus grand corps qui tient (42 px au plus, ou le corps imposé par la diapositive) */
  const own = parseFloat(body.dataset.fs || body.style.getPropertyValue('--fs')); if (own) body.dataset.fs = own;
  let lo = 15, hi = own || 42;
  body.style.setProperty('--fs', hi + 'px');
  if (over()) {
    for (let k = 0; k < 9; k++) { const mid = (lo + hi) / 2; body.style.setProperty('--fs', mid + 'px'); if (over()) hi = mid; else lo = mid; }
    body.style.setProperty('--fs', Math.floor(lo * 4) / 4 + 'px');
  }
  sl.classList.remove('fit-measure');
}
function openDeck(sid, step) {
  const s = SL[sid] || SLIDES[0];
  if (!deck.open) {
    deck.el = document.createElement('div'); deck.el.className = 'deck'; deck.el.setAttribute('role', 'dialog'); deck.el.setAttribute('aria-label', 'Projection du cours'); deck.el.tabIndex = -1;
    deck.el.innerHTML = '<div class="deck-prog"></div><div class="stage"></div><div class="deck-bar"><div class="grp"><button type="button" data-d="exit">Quitter</button><button type="button" data-d="ov">Vue d’ensemble</button><button type="button" data-d="notes">Notes</button>' + (window.APERCU ? '' : '<button type="button" data-d="pres">Présentateur</button>') + '<button type="button" data-d="fs">Plein écran</button></div><div class="grp"><button type="button" data-d="prev" aria-label="Précédent">' + arrow('l', 'in') + '</button><span class="cnt"></span><button type="button" data-d="next" aria-label="Suivant">' + arrow('r', 'in') + '</button></div></div>';
    document.body.appendChild(deck.el); document.body.style.overflow = 'hidden';
    if (matchMedia('(pointer:coarse)').matches) deck.el.classList.add('touch');
    deck.open = true; deck.t0 = Date.now();
    deck.el.addEventListener('click', deckClick);
    /* après un réglage (curseur, liste), rendre le clavier à la projection : les flèches font avancer les diapositives */
    deck.el.addEventListener('change', e => { if (e.target.matches('input[type=range], select, input[type=checkbox]')) setTimeout(() => deck.el && deck.el.focus({ preventScroll: true }), 0); });
    let idle = null; const wake = () => { deck.el.classList.add('show-bar'); clearTimeout(idle); idle = setTimeout(() => { if (deck.el && !deck.el.querySelector('.deck-bar:hover, .deck-bar:focus-within')) deck.el.classList.remove('show-bar'); }, 2500); };
    deck.el.addEventListener('mousemove', wake); wake();
    let tx = null; deck.el.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    deck.el.addEventListener('touchend', e => { if (tx === null || e.target.closest('.viz')) { tx = null; return; } const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 60) { dx < 0 ? deckNext() : deckPrev(); } tx = null; });
    window.addEventListener('resize', fitStage);
    if (stackEl && stackEl.isConnected) { deck.el.appendChild(stackEl); stackEl.classList.remove('open'); }
    unmountViz($('#view'));
    deck.el.focus();
  }
  deck.i = s.i; renderDeckSlide(); deck.step = Math.min(step || 0, deck.max); applyStep();
}
function renderDeckSlide() {
  const s = SLIDES[deck.i]; const { html, max } = deckSlideHTML(s);
  const stage = $('.stage', deck.el); unmountViz(stage);
  /* pas de transition pendant la mise en place : les éléments révélés plus tard ne doivent pas apparaître puis s’effacer */
  stage.classList.add('no-tr'); stage.innerHTML = html; deck.max = max; deck.step = 0;
  fitStage(); fitSlide($('.slide', stage)); fitLines($('.slide', stage)); mountViz(stage, 'deck');
  /* une vidéo démarre seule, muette et en boucle, dès que sa diapositive s’affiche */
  $$('video', stage).forEach(v => { v.muted = true; v.preload = 'auto'; try { const pr = v.play(); if (pr && pr.catch) pr.catch(() => { }); } catch (e) { } });
  requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.remove('no-tr')));
  $('.deck-prog', deck.el).style.width = ((deck.i + 1) / SLIDES.length * 100) + '%';
  $('.cnt', deck.el).textContent = (deck.i + 1) + ' / ' + SLIDES.length;
  try { history.replaceState(null, '', '#/diapo/' + s.id); } catch (e) { }
  document.title = plain(s.t) + ' · Projection';
  closeAllPops(); if (deck.notes) showDeckNotes();
}
function applyStep() {
  const sl = $('.stage .slide', deck.el); if (!sl) return;
  $$('[data-f]', sl).forEach(e => e.classList.toggle('on', +e.dataset.f <= deck.step));
  $$('[data-frev]', sl).forEach(e => { const on = +e.dataset.frev <= deck.step; e.classList.toggle('rev', on); $$('.q-opt', e).forEach(o => { const c = o.dataset.c === '1'; o.classList.toggle('ok', on && c); $('.mk', o).textContent = on && c ? 'vrai' : ''; }); });
  stepViz(sl, deck.step); broadcast();
}
function fitStage() { if (!deck.open) return; const vw = window.innerWidth, vh = window.innerHeight, k = Math.min(vw / 1600, vh / 900); const st = $('.stage', deck.el); st.style.transform = 'translate(' + ((vw - 1600 * k) / 2) + 'px,' + ((vh - 900 * k) / 2) + 'px) scale(' + k + ')'; }
function deckNext() { if (deck.step < deck.max) { deck.step++; applyStep(); } else if (deck.i < SLIDES.length - 1) { deck.i++; renderDeckSlide(); applyStep(); } }
function deckPrev() { if (deck.step > 0) { deck.step--; applyStep(); } else if (deck.i > 0) { deck.i--; renderDeckSlide(); deck.step = deck.max; applyStep(); } }
function deckGo(i, step) { deck.i = clamp(i, 0, SLIDES.length - 1); renderDeckSlide(); deck.step = Math.min(step || 0, deck.max); applyStep(); }
function closeDeck(nav = true) {
  if (!deck.open) return; const sid = SLIDES[deck.i].id;
  if (stackEl) { stackEl.classList.remove('open'); const slot = $('#reader'); if (slot) slot.appendChild(stackEl); }
  unmountViz(deck.el); deck.el.remove(); deck.open = false; document.body.style.overflow = ''; window.removeEventListener('resize', fitStage);
  if (document.fullscreenElement) { try { document.exitFullscreen(); } catch (e) { } }
  mountViz($('#view'), 'read');
  if (nav) location.hash = '#/cours/' + sid;
}
function showDeckNotes() {
  let n = $('.deck-notes', deck.el); const s = SLIDES[deck.i];
  if (!deck.notes) { if (n) n.remove(); return; }
  if (!n) { n = document.createElement('div'); n.className = 'deck-notes'; deck.el.appendChild(n); }
  if (!NOTES.open) { n.innerHTML = lockFormHTML(); const i = $('input', n); if (i) setTimeout(() => i.focus(), 0); return; }
  const ex = readExtraHTML(s);
  n.innerHTML = '<b>Notes · diapositive ' + (deck.i + 1) + (s.mins ? ' · ' + s.mins + NB + 'min' : '') + '</b><div>' + (s.notes ? md(s.notes) : (ex ? '' : '<span class="dim">Pas de note pour cette diapositive.</span>')) + '</div>' + ex + lockAgainHTML();
}
function toggleOverview() {
  deck.ov = !deck.ov; let ov = $('.overview', deck.el);
  if (!deck.ov) { if (ov) ov.remove(); return; }
  ov = document.createElement('div'); ov.className = 'overview';
  ov.innerHTML = '<div class="overview-grid">' + SLIDES.map(s => '<div class="ov-item' + (s.i === deck.i ? ' cur' : '') + '" role="button" tabindex="0" data-go="' + s.i + '" aria-label="Aller à la diapositive ' + (s.i + 1) + '"><div class="ov-in" inert>' + deckSlideHTML(s).html + '</div><span class="ov-n">' + (s.i + 1) + '</span></div>').join('') + '</div>';
  deck.el.appendChild(ov);
  requestAnimationFrame(() => { $$('.ov-item', ov).forEach(b => { const k = b.clientWidth / 1600; const inn = $('.ov-in', b); inn.style.transform = 'scale(' + k + ')'; $$('[data-f]', inn).forEach(e => e.classList.add('on')); }); const c = $('.ov-item.cur', ov); if (c) c.scrollIntoView({ block: 'center' }); });
}
function deckClick(e) {
  const b = e.target.closest('[data-d]');
  if (b) { const d = b.dataset.d; if (d === 'exit') closeDeck(); else if (d === 'prev') deckPrev(); else if (d === 'next') deckNext(); else if (d === 'notes') { deck.notes = !deck.notes; showDeckNotes(); } else if (d === 'ov') toggleOverview(); else if (d === 'pres') openPresenter(); else if (d === 'fs') toggleFS(); return; }
  const g = e.target.closest('[data-go]'); if (g) { toggleOverview(); deckGo(+g.dataset.go); return; }
  const o = e.target.closest('.q-opt'); if (o && deck.el.contains(o)) { o.setAttribute('aria-pressed', o.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); }
}
function toggleFS() { try { if (document.fullscreenElement) document.exitFullscreen(); else deck.el.requestFullscreen().catch(() => { }); } catch (e) { } }
function openPresenter() { if (window.APERCU) return; try { window.open(location.pathname + location.search + '#/presenter', 'chimie-presenter', 'width=1280,height=800'); } catch (e) { } broadcast(); }
function broadcast() { if (chan && deck.open) chan.postMessage({ type: 'state', i: deck.i, step: deck.step, t0: deck.t0 }); }
if (chan) chan.onmessage = ev => { const m = ev.data || {}; if (m.type === 'cmd' && deck.open) { if (m.op === 'next') deckNext(); else if (m.op === 'prev') deckPrev(); else if (m.op === 'goto') deckGo(m.i, m.step); else if (m.op === 'hello') broadcast(); } };
document.addEventListener('keydown', e => {
  if (e.target.closest && e.target.closest('input,textarea,select')) return;
  if (deck.open) {
    const k = e.key;
    if (k === 'Escape') { if (pops.length) { const p = pops[pops.length - 1]; closeFrom(pops.length); p.anchor.focus(); } else if (stackEl && stackEl.classList.contains('open')) closeSheet(); else if (deck.ov) toggleOverview(); else if (deck.notes) { deck.notes = false; showDeckNotes(); } else closeDeck(); e.preventDefault(); return; }
    if (['ArrowRight', 'PageDown', ' ', 'ArrowDown'].includes(k)) { e.preventDefault(); deckNext(); return; }
    if (['ArrowLeft', 'PageUp', 'Backspace', 'ArrowUp'].includes(k)) { e.preventDefault(); deckPrev(); return; }
    if (k === 'Home') { deckGo(0); return; } if (k === 'End') { deckGo(SLIDES.length - 1); return; }
    if (/^[0-9]$/.test(k)) { deck.typed += k; return; }
    if (k === 'Enter' && deck.typed) { deckGo(+deck.typed - 1); deck.typed = ''; e.preventDefault(); return; }
    if (k === 'Enter' && e.target.matches && e.target.matches('[data-go]')) { e.preventDefault(); e.target.click(); return; }
    const l = k.toLowerCase();
    if (l === 'f') toggleFS(); else if (l === 'n') { deck.notes = !deck.notes; showDeckNotes(); } else if (l === 'o' || l === 'g') toggleOverview(); else if (l === 'p') openPresenter();
    else if (l === 'b' || k === '.') { deck.black = !deck.black; let bl = $('.deck-black', deck.el); if (deck.black && !bl) { bl = document.createElement('div'); bl.className = 'deck-black'; deck.el.appendChild(bl); } else if (!deck.black && bl) bl.remove(); }
    return;
  }
  if (e.key === 'Escape') { if (pops.length) { const p = pops[pops.length - 1]; closeFrom(pops.length); p.anchor.focus(); } else if (stackEl && stackEl.classList.contains('open')) closeSheet(); return; }
  if (currentView === 'cours' && e.key.toLowerCase() === 'p' && !e.metaKey && !e.ctrlKey && !e.altKey) { const cur = $('[data-toc][aria-current="true"]'); location.hash = '#/diapo/' + (cur ? cur.dataset.toc : SLIDES[0].id); }
});
/* Vue présentateur : seconde fenêtre synchronisée par BroadcastChannel ; minutage du cours */
function renderPresenter() {
  document.body.innerHTML = '<div class="presenter"><div class="pv-top"><span>Vue présentateur · <span id="pvCount"></span></span><span class="pv-plan" id="pvPlan"></span><span class="clock" id="pvTimer">00:00</span><span class="clock" id="pvClock"></span></div><div class="pv-cur" id="pvCur"><div class="pv-frame"></div></div><div class="pv-side"><div><div class="pv-label">Suivante</div><div class="pv-next" id="pvNext"><div class="pv-frame"></div></div></div><div class="pv-notes" id="pvNotes"></div><div class="pv-ctrl"><button type="button" data-c="prev">' + arrow('l', 'in') + ' Précédent</button><button type="button" data-c="next">Suivant ' + arrow('r', 'in') + '</button><button type="button" data-c="reset">Chrono à zéro</button></div></div></div>';
  let st = { i: 0, step: 0, t0: Date.now() };
  const draw = () => {
    const cur = $('#pvCur .pv-frame'), nxt = $('#pvNext .pv-frame');
    unmountViz(cur); unmountViz(nxt);
    cur.innerHTML = deckSlideHTML(SLIDES[st.i]).html; const sl = $('.slide', cur);
    $$('[data-f]', sl).forEach(e => e.classList.toggle('on', +e.dataset.f <= st.step));
    if (SLIDES[st.i + 1]) { nxt.innerHTML = deckSlideHTML(SLIDES[st.i + 1]).html; $$('[data-f]', nxt).forEach(e => e.classList.add('on')); } else nxt.innerHTML = '<div class="pv-end">Fin</div>';
    [['#pvCur', cur], ['#pvNext', nxt]].forEach(([b, f]) => { const box = $(b); const k = Math.min(box.clientWidth / 1600, box.clientHeight / 900); f.style.transform = 'scale(' + k + ')'; const s2 = $('.slide', f); if (s2) fitSlide(s2); });
    mountViz(cur, 'deck'); stepViz(cur, st.step);
    const s = SLIDES[st.i]; const ex = readExtraHTML(s);
    if (!NOTES.open) { const pv = $('#pvNotes'); if (!$('form.nlock', pv)) { pv.innerHTML = lockFormHTML(); } }
    else $('#pvNotes').innerHTML = '<b>Notes' + (s.mins ? ' · ' + s.mins + NB + 'min prévues' : '') + '</b><div>' + (s.notes ? md(s.notes) : (ex ? '' : '<span class="dim">Pas de note.</span>')) + '</div>' + ex + '<p class="dim">Étape ' + st.step + ' · ' + esc(s.src || '') + '</p>' + lockAgainHTML();
    $('#pvCount').textContent = (st.i + 1) + ' / ' + SLIDES.length;
    /* minutage prévu : cumul des minutes des diapositives précédentes */
    const planned = SLIDES.slice(0, st.i).reduce((a, x) => a + (x.mins || 0), 0); $('#pvPlan').textContent = 'prévu : ' + planned + NB + 'min';
  };
  const tick = () => { const s = Math.floor((Date.now() - st.t0) / 1000); $('#pvTimer').textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); $('#pvClock').textContent = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }); };
  setInterval(tick, 1000); tick(); draw(); window.pvDraw = draw; notesRestore().then(ok => { if (ok) draw(); });
  if (chan) { chan.onmessage = ev => { const m = ev.data || {}; if (m.type === 'state') { st = { i: m.i, step: m.step, t0: st.t0 || m.t0 }; draw(); } }; chan.postMessage({ type: 'cmd', op: 'hello' }); }
  document.addEventListener('click', e => { const b = e.target.closest('[data-c]'); if (!b) return; if (b.dataset.c === 'reset') { st.t0 = Date.now(); tick(); return; } if (chan) chan.postMessage({ type: 'cmd', op: b.dataset.c }); });
  document.addEventListener('keydown', e => { if (!chan) return; if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); chan.postMessage({ type: 'cmd', op: 'next' }); } if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); chan.postMessage({ type: 'cmd', op: 'prev' }); } });
  window.addEventListener('resize', draw);
  document.title = 'Présentateur · ' + D.site.title1;
}

/* ───────── Laboratoires ───────── */
const LABS = D.labList || [];
function renderLabs(id) {
  const L = LABS.find(l => l[0] === id);
  if (!L) { viewSet('<div class="view-h"><span class="eyebrow">Laboratoires</span><h1>Manipuler pour comprendre</h1><p>Chaque laboratoire est aussi projeté pendant le cours : on prédit, on regarde, on explique.</p></div><div class="labs">' + LABS.map(l => '<a class="lab" href="#/labos/' + l[0] + '">' + emblemSVG(l[1], { size: 76 }) + '<b>' + esc(l[2]) + '</b><span>' + md(l[3]) + '</span><span class="go">' + arrow('r', 'in') + '</span></a>').join('') + '</div>'); return; }
  const intro = (D.labs || {})[id] || {};
  viewSet('<div class="view-h"><a class="back" href="#/labos">' + arrow('l', 'in') + ' Laboratoires</a><h1>' + esc(L[2]) + '</h1><p>' + md(intro.p || L[3]) + '</p></div><div class="labpage">' + blocks([].concat(L[4]), { mode: 'read', f: 0 }) + '</div>' + (intro.more ? '<div class="lab-more blk">' + blocks(intro.more, { mode: 'read', f: 0 }) + '</div>' : '') + (intro.sids ? '<p class="note">Dans le cours : ' + intro.sids.map(s => '<a class="slink" href="#/cours/' + s + '">' + esc(plain(SL[s].short || SL[s].t)) + '</a>').join(' · ') + '</p>' : ''));
}

/* ───────── Pharmacopée et fiches molécules ───────── */
function renderPharma() {
  const rows = Object.entries(MOLS), S = D.site, cols = D.pharmaCols || [];
  viewSet('<div class="view-h"><span class="eyebrow">' + rows.length + ' ' + esc(S.molWord || 'molécules') + ' · ' + esc(S.asof || '') + '</span><h1>' + esc(S.pharmaTitle || 'Pharmacopée') + '</h1><p>' + md(S.pharmaIntro || '') + '</p></div>' + blocks([{ viz: 'tiles' }], { mode: 'read', f: 0 }) +
    (cols.length ? '<details class="tbl-alt"><summary class="eyebrow">Vue en tableau</summary><div class="tbl-box"><table class="tbl"><thead><tr><th scope="col">' + esc(S.molWordCap || 'Molécule') + '</th>' + cols.map(c => '<th scope="col">' + esc(c.l) + '</th>').join('') + '</tr></thead><tbody>' +
    rows.map(([id, M]) => '<tr><th scope="row"><a class="slink" href="#/molecule/' + id + '">' + esc(M.dci) + '</a>' + (M.brand ? ' <span class="note">' + esc(M.brand) + '</span>' : '') + '</th>' + cols.map(c => '<td>' + md(String((c.k === 'cls' ? (CLS[M.cls] || {}).t : M[c.k]) || '—')) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div></details>' : ''));
}
function bindRow(id, compact) {
  const B = D.binding; if (!B || !B.data[id]) return '';
  const cells = B.cols.map(c => ({ c, k: parseKi(B.data[id][c.id]) }));
  return '<div class="fp' + (compact ? ' compact' : '') + '" role="img" aria-label="Empreinte réceptorielle">' + cells.map(({ c, k }) => { const p = k ? pKi(k.v) : 0, s = k ? clamp((p - 5) / 4.5, 0.06, 1) : 0; return '<span class="fp-c' + (k && p < 6 ? ' weak' : '') + '" title="' + esc(plain(c.t)) + (k ? ' · Ki ' + esc(k.raw) + ' nM' : ' · non mesuré') + '"><i style="--s:' + s.toFixed(2) + '"></i><em>' + typo(esc(c.t)) + '</em></span>'; }).join('') + '</div>';
}
const MOLF = D.molFields || [];
function molBody(id, full) {
  const M = MOLS[id], C = CLS[M.cls] || {};
  let h = '<div class="mol-h"><span class="eyebrow">' + esc(C.t || '') + (M.nbn ? ' · ' + esc(M.nbn) : '') + '</span><h4 tabindex="-1" class="mol-name">' + esc(M.dci) + '</h4><span class="mol-br">' + esc(M.brand || '') + (M.status ? ' · <span class="status">' + esc(M.status) + '</span>' : '') + '</span></div>';
  if (M.lead) h += '<p class="pane-lead">' + md(M.lead) + '</p>';
  if (M.mech) h += '<div class="kv"><span>Mécanisme</span><p>' + md(M.mech) + '</p></div>';
  h += bindRow(id, !full);
  h += '<dl class="mol-facts">' + MOLF.filter(([k]) => M[k]).map(([k, l]) => '<div class="mf mf-' + k + '"><dt>' + l + '</dt><dd>' + (Array.isArray(M[k]) ? ul(M[k], { mode: 'read', f: 0 }) : md(M[k])) + '</dd></div>').join('') + '</dl>';
  if (M.pearls && M.pearls.length) h += '<div class="pearls"><span class="eyebrow">En pratique</span>' + ul(M.pearls, { mode: 'read', f: 0 }) + '</div>';
  if (M.hist) h += '<p class="mol-hist"><b>Histoire.</b> ' + md(M.hist) + '</p>';
  if ((D.structures || {})[M.struct || id]) h += '<figure class="mol-fig">' + molSVG(M.struct || id, { w: full ? 320 : 230, label: M.dci }) + '<figcaption class="note">' + esc((D.structures[M.struct || id] || {}).f || '') + '</figcaption></figure>';
  if (M.sids && M.sids.length) h += paneLinks(M.sids.map(s => ['slide', s, plain(SL[s] ? (SL[s].short || SL[s].t) : s)]));
  if (M.src) h += '<p class="src">' + md(M.src) + '</p>';
  return h;
}
function molPaneHTML(id) { return molBody(id, false) + '<p><a class="slink" href="#/molecule/' + id + '">Fiche complète ' + arrow('r', 'in') + '</a></p>'; }
function renderMolPage(id) {
  if (!MOLS[id]) { renderPharma(); return; }
  const M = MOLS[id], same = Object.entries(MOLS).filter(([k, x]) => x.cls === M.cls && k !== id);
  viewSet('<div class="molpage"><a class="back" href="#/pharmacopee">' + arrow('l', 'in') + ' ' + esc(D.site.pharmaNav || 'Pharmacopée') + '</a><article class="mol-full">' + molBody(id, true) + '</article><aside class="mol-aside">' + (same.length ? '<span class="eyebrow">Même classe</span><div class="molchips">' + same.map(([k]) => '<a class="molchip" href="#/molecule/' + k + '"><b>' + esc(MOLS[k].dci) + '</b><span>' + esc(MOLS[k].brand || '') + '</span></a>').join('') + '</div>' : '') + '<div id="stackSlot"></div></aside></div>');
  const st = ensureStack(); $('#stackSlot').replaceWith(st); renderPanes();
}

/* ───────── Histoire ───────── */
function renderHistory(id) {
  const items = HIST.slice().sort((a, b) => String(a.y).localeCompare(String(b.y)));
  viewSet('<div class="view-h"><span class="eyebrow">' + items.length + ' archives</span><h1>' + esc(D.site.histTitle || 'Histoire') + '</h1><p>' + md(D.site.histIntro || '') + '</p></div><ol class="frise">' + items.map(H => '<li id="h-' + H.id + '"><span class="fr-y mono">' + esc(H.y) + '</span>' + histCardHTML(H.id, '', { wide: true }) + (H.sid ? '<a class="slink" href="#/cours/' + H.sid + '">Dans le cours ' + arrow('r', 'in') + '</a>' : '') + '</li>').join('') + '</ol>');
  if (id) { const el = document.getElementById('h-' + id); if (el) requestAnimationFrame(() => el.scrollIntoView({ block: 'center' })); }
}

/* ───────── Arbres de décision ───────── */
let treeKey = null, caseId = null, tpath = [];
function treeLayout(T) {
  const pos = {}; let leaf = 0, depth = 0;
  (function walk(id, d) { const nd = T.n[id]; depth = Math.max(depth, d); if (nd.leaf) { pos[id] = { x: leaf++, y: d }; return pos[id].x; } const xs = nd.opts.map(o => walk(o.to, d + 1)); pos[id] = { x: xs.reduce((a, b) => a + b, 0) / xs.length, y: d }; return pos[id].x; })(T.root, 0);
  return { pos, leaves: leaf, depth };
}
function treeState(T, C) {
  const visited = new Set(), excl = new Set(); let cur = T.root;
  tpath.forEach(s => { visited.add(s.id); const nd = T.n[s.id], exp = C.path[s.id].ans; nd.opts.forEach((o, j) => { if (j !== exp) excl.add(o.to); }); cur = nd.opts[exp].to; });
  visited.add(cur); return { visited, excl, cur, done: !!T.n[cur].leaf };
}
function treeSVG(key) {
  const T = D.trees[key]; if (!T) return ''; const L = treeLayout(T); const C = T.cases.find(c => c.id === caseId);
  const W = 440, padX = 34, padY = 26, rowH = 56, H = padY * 2 + L.depth * rowH + 40;
  const sx = x => padX + (L.leaves <= 1 ? (W - 2 * padX) / 2 : x * (W - 2 * padX) / (L.leaves - 1)), sy = y => padY + y * rowH;
  const st = treeState(T, C); const shown = id => st.done || st.visited.has(id) || st.excl.has(id);
  let g = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(T.t) + '">';
  (function edges(id) { const nd = T.n[id]; if (nd.leaf) return; nd.opts.forEach(o => { const c = o.to;
    if (shown(id) && shown(c)) { const a = L.pos[id], b = L.pos[c]; const onPath = st.visited.has(id) && st.visited.has(c), off = st.visited.has(id) && st.excl.has(c);
      const col = onPath ? 'var(--ink)' : off ? 'var(--faint)' : 'var(--rule)'; const x1 = sx(a.x), y1 = sy(a.y), x2 = sx(b.x), y2 = sy(b.y), ym = (y1 + y2) / 2;
      g += '<path d="M' + x1 + ' ' + (y1 + 9) + ' V' + ym + ' H' + x2 + ' V' + (y2 - 9) + '" fill="none" stroke="' + col + '" stroke-width="' + (onPath ? 2 : 1.4) + '"' + (onPath ? '' : ' stroke-dasharray="0.1 5" stroke-linecap="round"') + '/>';
      if (st.visited.has(id)) g += '<text x="' + ((x1 + x2) / 2 + (x2 === x1 ? 8 : 0)) + '" y="' + (ym - 6) + '" font-size="10.5" text-anchor="' + (x2 === x1 ? 'start' : 'middle') + '" fill="var(--lead)" ' + F_SANS + '>' + esc(o.s || o.l) + '</text>';
    } edges(c); }); })(T.root);
  for (const id in L.pos) { if (!shown(id)) continue; const nd = T.n[id], p = L.pos[id], x = sx(p.x), y = sy(p.y);
    const on = st.visited.has(id), ex = st.excl.has(id), isCur = id === st.cur && !st.done;
    const col = on ? (nd.leaf ? 'var(--acc)' : 'var(--ink)') : ex ? 'var(--faint)' : 'var(--rule)';
    let s = nd.leaf ? '<circle cx="' + x + '" cy="' + y + '" r="7" fill="' + (on ? 'var(--acc-fill)' : 'var(--paper-2)') + '" stroke="' + col + '" stroke-width="1.6"/>' : '<rect x="' + (x - 9) + '" y="' + (y - 9) + '" width="18" height="18" rx="6" fill="' + (on && !isCur ? 'var(--ink)' : 'var(--paper-2)') + '" stroke="' + col + '" stroke-width="1.6"/>';
    if (isCur) s += '<circle cx="' + x + '" cy="' + y + '" r="14" fill="none" stroke="var(--acc)" stroke-width="1.5"/>';
    if (tpath.some(t => t.id === id && !t.ok)) s += '<circle cx="' + (x + 11) + '" cy="' + (y - 11) + '" r="4" fill="var(--warn)"/>';
    const lab = nd.leaf ? '<text x="' + x + '" y="' + (y + (Math.round(p.x) % 2 ? 33 : 21)) + '" font-size="10.5" text-anchor="middle" fill="' + (on ? 'var(--acc)' : 'var(--lead)') + '" ' + F_SANS + (on ? ' font-weight="600"' : '') + '>' + esc(nd.tag || nd.leaf) + '</text>' : '';
    g += '<g><title>' + esc(plain(nd.q || nd.leaf)) + '</title>' + s + lab + '</g>'; }
  return g + '</svg>';
}
function renderTrees(key) {
  const keys = Object.keys(D.trees || {}); if (!keys.length) { renderTraining(); return; }
  treeKey = keys.includes(key) ? key : (treeKey || keys[0]);
  const T = D.trees[treeKey]; if (!T.cases.find(c => c.id === caseId)) { caseId = T.cases[0].id; tpath = []; }
  viewSet(trainTabs('arbres') + '<div class="view-h"><span class="eyebrow">Raisonner · on choisit avant de voir la suite</span><h1>' + esc(T.t) + '</h1><p>' + md(T.intro) + '</p></div>' +
    '<div class="ctrl"><div class="seg" role="group" aria-label="Choisir l’arbre">' + keys.map(k => '<button type="button" aria-pressed="' + (k === treeKey) + '" data-tree="' + k + '">' + esc(D.trees[k].label) + '</button>').join('') + '</div>' +
    '<div class="seg" role="group" aria-label="Choisir le cas">' + T.cases.map(c => '<button type="button" aria-pressed="' + (c.id === caseId) + '" data-case="' + c.id + '">' + esc(c.label) + '</button>').join('') + '</div><button class="btn ghost small" type="button" id="treeReset">Recommencer</button></div>' +
    '<div class="work"><div class="min0"><div class="case"><span class="eyebrow">Le cas</span><p id="caseText"></p></div><ol class="steps" id="steps" aria-live="polite"></ol></div>' +
    '<aside class="side" aria-label="Carte de l’arbre"><div class="mapbox"><div class="mapbox-h"><span class="eyebrow">Carte de l’arbre</span><span class="mono" id="treeProgress"></span></div><div id="treeMap"></div></div><div class="mapbox" id="scoreBox" hidden><div class="score"><b id="scoreNum"></b><span>décisions conformes aux recommandations</span></div><p class="note" id="scoreNote"></p></div><p class="note">' + md(T.src) + '</p></aside></div>');
  $$('[data-tree]').forEach(b => b.addEventListener('click', () => { location.hash = '#/raisonner/' + b.dataset.tree; }));
  $$('[data-case]').forEach(b => b.addEventListener('click', () => { caseId = b.dataset.case; tpath = []; renderTrees(treeKey); }));
  $('#treeReset').addEventListener('click', () => { tpath = []; drawTree(); });
  drawTree();
}
function drawTree() {
  const T = D.trees[treeKey], C = T.cases.find(c => c.id === caseId); $('#caseText').innerHTML = md(C.text);
  const st = treeState(T, C); let html = '';
  tpath.forEach(s => { const nd = T.n[s.id], P = C.path[s.id];
    html += '<li class="step ' + (s.ok ? 'done' : 'miss') + '"><span class="dot" aria-hidden="true"></span><div class="step-h"><h3>' + md(nd.q) + '</h3><span class="mono">' + esc(nd.ref || '') + '</span></div>' + (P.data ? '<div class="data"><b>Données</b>' + md(P.data) + '</div>' : '') +
      '<div class="answer"><span class="chip picked">retenu : ' + esc(nd.opts[P.ans].l) + '</span>' + nd.opts.map((o, j) => j === P.ans ? '' : '<span class="chip discard">écarté : ' + esc(o.l) + '</span>').join('') + '</div>' +
      (s.ok ? '<p class="fb">' + md(P.why) + '</p>' : '<p class="fb miss"><b>Tu as choisi « ' + esc(nd.opts[s.pick].l) + ' ».</b> ' + md(P.why) + '</p>') + '</li>'; });
  const nd = T.n[st.cur];
  if (nd.leaf) html += '<li class="step leaf"><span class="dot" aria-hidden="true"></span><div class="leafcard"><div class="step-h"><h3>' + md(nd.leaf) + '</h3><span class="mono">' + esc(nd.ref || '') + '</span></div><p>' + md(nd.sub || '') + '</p>' + (C.end ? '<p>' + md(C.end) + '</p>' : '') + '</div></li>';
  else { const P = C.path[st.cur] || {};
    html += '<li class="step"><span class="dot" aria-hidden="true"></span><div class="step-h"><h3>' + md(nd.q) + '</h3><span class="mono">' + esc(nd.ref || '') + '</span></div>' + (nd.hint ? '<p class="hint">' + md(nd.hint) + '</p>' : '') + (P.data ? '<div class="data"><b>Données</b>' + md(P.data) + '</div>' : '') +
      '<div class="choices">' + nd.opts.map((o, j) => '<button class="btn' + (j ? ' ghost' : '') + '" type="button" data-pick="' + j + '">' + esc(o.l) + '</button>').join('') + '</div></li>';
    html += '<li class="step future" aria-hidden="true"><span class="dot"></span><div class="skel"><i style="width:52%"></i><i style="width:84%"></i><i style="width:68%"></i></div></li>'; }
  $('#steps').innerHTML = html;
  $$('[data-pick]', $('#steps')).forEach(b => b.addEventListener('click', () => { const j = +b.dataset.pick; tpath.push({ id: st.cur, pick: j, ok: j === C.path[st.cur].ans }); drawTree();
    const last = $$('#steps .step:not(.future)').pop(); if (last) last.scrollIntoView({ block: 'nearest', behavior: reduceMotion() ? 'auto' : 'smooth' }); }));
  const n = tpath.length, ok = tpath.filter(s => s.ok).length;
  $('#treeProgress').textContent = nd.leaf ? 'terminé · ' + n + ' décisions' : 'étape ' + (n + 1);
  $('#scoreBox').hidden = !nd.leaf; if (nd.leaf) { $('#scoreNum').textContent = ok + '/' + n; $('#scoreNote').textContent = ok === n ? 'Chemin sans écart. Change de cas, ou relis les branches écartées.' : 'Les étapes marquées sont celles où ton choix s’écartait des recommandations : relis leur justification.'; }
  $('#treeMap').innerHTML = treeSVG(treeKey);
}

/* ───────── S’entraîner : cas progressifs, QRM, arbres, cartes ───────── */
function trainTabs(cur) { return '<div class="seg tabs-in" role="tablist">' + [['cas', 'Cas cliniques', '#/entrainement/cas'], ['qcm', 'QRM', '#/entrainement/qcm'], ['arbres', 'Arbres de décision', '#/raisonner'], ['cartes', 'Cartes de révision', '#/reviser']].map(t => '<a href="' + t[2] + '" role="tab" aria-selected="' + (t[0] === cur) + '">' + esc(t[1]) + '</a>').join('') + '</div>'; }
function renderTraining(tab) {
  tab = tab === 'qcm' ? 'qcm' : 'cas';
  let h = trainTabs(tab);
  if (tab === 'qcm') h += '<div class="view-h"><span class="eyebrow">QRM · barème de l’EDN</span><h1>Questions à réponses multiples</h1><p>Cinq propositions ; la note suit les discordances : aucune → 1 point, une → 0,5, deux → 0,2, trois ou plus → 0.</p></div><div class="qbox" id="qcmBox">' + (D.qcm || []).map(id => quizHTML(id, { mode: 'train', f: 0 })).join('') + '<div class="q-res" id="qcmTotal">Valide chaque question pour voir ta note.</div></div>';
  else h += '<div class="view-h"><span class="eyebrow">Cas cliniques progressifs</span><h1>Raisonner pas à pas</h1><p>Chaque étape apporte de nouvelles données ; la suivante s’ouvre quand tu as répondu.</p></div>' + (D.cases || []).map(C => '<section class="dp" data-case="' + C.id + '"><h2>' + md(C.t) + '</h2>' + C.steps.map((s, i) => '<div class="dp-step' + (i ? ' locked' : '') + '" data-step="' + i + '"><span class="eyebrow">Étape ' + (i + 1) + ' sur ' + C.steps.length + '</span><p class="dp-vig">' + md(s.vig) + '</p>' + (s.q ? quizHTML(s.q, { mode: 'train', f: 0 }) : '') + (s.after ? '<div class="call c-note" data-after hidden><i>Suite</i><span>' + md(s.after) + '</span></div>' : '') + '</div>').join('') + '</section>').join('');
  viewSet(h);
  if (tab === 'qcm') { const upd = () => { const cs = $$('.qz[data-score]'); const sum = cs.reduce((a, c) => a + +c.dataset.score, 0); $('#qcmTotal').innerHTML = cs.length ? '<b>' + fmt(sum, 1) + ' / ' + cs.length + '</b> sur ' + cs.length + ' question' + (cs.length > 1 ? 's' : '') + ' validée' + (cs.length > 1 ? 's' : '') + ' (sur ' + D.qcm.length + ').' : 'Valide chaque question pour voir ta note.'; }; const box = $('#qcmBox'); box.addEventListener('quizdone', upd); box.addEventListener('click', e => { if (e.target.closest('[data-retry]')) setTimeout(upd); }); }
  else $$('.dp').forEach(box => box.addEventListener('quizdone', e => { const st = e.target.closest('.dp-step'); const a = $('[data-after]', st); if (a) a.hidden = false; const nx = $('.dp-step[data-step="' + (+st.dataset.step + 1) + '"]', box); if (nx) nx.classList.remove('locked'); }));
}

/* ───────── Cartes de révision (FSRS-6, portage de py-fsrs 6.3.2) ───────── */
const W6 = [0.212, 1.2931, 2.3065, 8.2956, 6.4133, 0.8334, 3.0194, 0.001, 1.8722, 0.1666, 0.796, 1.4835, 0.0614, 0.2629, 1.6483, 0.6014, 1.8729, 0.5425, 0.0912, 0.0658, 0.1542];
const DECAY = -W6[20], FACTOR = Math.pow(0.9, 1 / DECAY) - 1, RET = 0.9, LEARN = [1, 10], RELEARN = [10], DAY = 86400000, MIN = 60000;
const Rt = (t, S) => Math.pow(1 + FACTOR * t / S, DECAY);
const clampD = d => Math.min(Math.max(d, 1), 10), clampS = s => Math.max(s, 0.001);
const D0 = g => W6[4] - Math.exp(W6[5] * (g - 1)) + 1;
const nextD = (d, g) => clampD(W6[7] * D0(4) + (1 - W6[7]) * (d + (10 - d) * (-(W6[6] * (g - 3))) / 9));
const recallS = (d, s, r, g) => s * (1 + Math.exp(W6[8]) * (11 - d) * Math.pow(s, -W6[9]) * (Math.exp((1 - r) * W6[10]) - 1) * (g === 2 ? W6[15] : 1) * (g === 4 ? W6[16] : 1));
const forgetS = (d, s, r) => Math.min(W6[11] * Math.pow(d, -W6[12]) * (Math.pow(s + 1, W6[13]) - 1) * Math.exp((1 - r) * W6[14]), s / Math.exp(W6[17] * W6[18]));
const shortS = (s, g) => { let inc = Math.exp(W6[17] * (g - 3 + W6[18])) * Math.pow(s, -W6[19]); if (g > 1) inc = Math.max(inc, 1); return clampS(s * inc); };
const ivl = s => Math.min(Math.max(Math.round(s / FACTOR * (Math.pow(RET, 1 / DECAY) - 1)), 1), 36500);
function fsrs(c, g, now) {
  const n = c ? { ...c } : { state: 'learning', step: 0, S: null, D: null, last: null };
  const days = n.last ? Math.floor((now - n.last) / DAY) : null; let next;
  const upd = () => { if (n.S === null) { n.S = clampS(W6[g - 1]); n.D = clampD(D0(g)); } else if (days !== null && days < 1) { n.S = shortS(n.S, g); n.D = nextD(n.D, g); } else { n.S = clampS(g === 1 ? forgetS(n.D, n.S, Rt(days, n.S)) : recallS(n.D, n.S, Rt(days, n.S), g)); n.D = nextD(n.D, g); } };
  const steps = n.state === 'relearning' ? RELEARN : LEARN;
  if (n.state === 'review') {
    if (days !== null && days < 1) n.S = shortS(n.S, g); else n.S = clampS(g === 1 ? forgetS(n.D, n.S, Rt(days, n.S)) : recallS(n.D, n.S, Rt(days, n.S), g));
    n.D = nextD(n.D, g);
    if (g === 1) { n.state = 'relearning'; n.step = 0; next = { min: RELEARN[0] }; } else next = { days: ivl(n.S) };
  } else {
    upd();
    if (n.step >= steps.length && g > 1) { n.state = 'review'; n.step = null; next = { days: ivl(n.S) }; }
    else if (g === 1) { n.step = 0; next = { min: steps[0] }; }
    else if (g === 2) { next = { min: n.step === 0 && steps.length === 1 ? steps[0] * 1.5 : n.step === 0 && steps.length >= 2 ? (steps[0] + steps[1]) / 2 : steps[n.step] }; }
    else if (g === 3) { if (n.step + 1 === steps.length) { n.state = 'review'; n.step = null; next = { days: ivl(n.S) }; } else { n.step += 1; next = { min: steps[n.step] }; } }
    else { n.state = 'review'; n.step = null; next = { days: ivl(n.S) }; }
  }
  n.last = now; n.due = now + (next.min ? next.min * MIN : next.days * DAY);
  return { card: n, next };
}
window.__chimieFSRS = fsrs;
const NEW_PER_SESSION = 12;
let rv = { cur: null, newSeen: 0, ch: '' };
const cardState = () => store.get('cards', {});
const cardR = (c, at) => (!c || c.S === null || !c.last) ? null : Rt(Math.max(0, (at - c.last) / DAY), c.S);
const nextTxt = n => n.min ? (Math.round(n.min * 10) / 10).toString().replace('.', ',') + NB + 'min' : n.days + NB + 'j';
function pickCard() {
  const st = cardState(), now = Date.now(); const pool = D.cards.filter(c => !rv.ch || c.ch === rv.ch);
  const due = pool.filter(c => st[c.id] && st[c.id].due <= now).sort((a, b) => st[a.id].due - st[b.id].due);
  if (due.length) return due[0];
  if (rv.newSeen < NEW_PER_SESSION) { const nw = pool.filter(c => !st[c.id]); if (nw.length) return nw[0]; }
  return null;
}
function renderReview() {
  viewSet(trainTabs('cartes') + '<div class="view-h"><span class="eyebrow">Révision espacée · FSRS-6</span><h1>Tes cartes</h1><p>Retrouver la réponse avant de la voir, puis dire si c’était facile : le planificateur en déduit la prochaine date. Tester sa mémoire à intervalles croissants retient mieux que relire (Larsen et al., 2009, chez des internes). Ta progression reste dans ce navigateur.</p></div><div class="ctrl"><div class="seg" role="group" aria-label="Chapitre">' + [['', 'Tout']].concat(D.chapters.filter(c => D.cards.some(x => x.ch === c.id)).map(c => [c.id, c.t])).map(([k, l]) => '<button type="button" data-rch="' + k + '" aria-pressed="' + (k === rv.ch) + '">' + esc(l) + '</button>').join('') + '</div></div><div class="rev-grid"><div id="cardBox" class="min0"></div><aside class="rev-side"><div class="statline" id="revStats"></div><div class="formula-box"><span class="eyebrow">La mémoire en une formule</span><span class="big"><i>R</i>(<i>t</i>) = (1 + <i>F</i>·<i>t</i>/<i>S</i>)<sup>−<i>w</i><sub>20</sub></sup></span><span class="note">Probabilité de rappel après <i>t</i> jours pour une stabilité <i>S</i> : une carte revient quand tu as une chance sur dix de l’avoir oubliée.</span></div><button class="btn ghost small" type="button" id="revReset">Effacer ma progression</button></aside></div>');
  rv.newSeen = 0; nextCard();
  $$('[data-rch]').forEach(b => b.addEventListener('click', () => { rv.ch = b.dataset.rch; $$('[data-rch]').forEach(x => x.setAttribute('aria-pressed', x === b)); nextCard(); }));
  $('#revReset').addEventListener('click', () => { const b = $('#revReset'); if (b.dataset.armed) { store.del('cards'); rv.newSeen = 0; nextCard(); b.textContent = 'Effacer ma progression'; delete b.dataset.armed; } else { b.dataset.armed = '1'; b.textContent = 'Confirmer l’effacement'; } });
}
function revStats() {
  const st = cardState(), now = Date.now(); const seen = D.cards.filter(c => st[c.id]); const due = seen.filter(c => st[c.id].due <= now).length; const fresh = D.cards.length - seen.length;
  const rs = seen.map(c => cardR(st[c.id], now)).filter(r => r !== null); const mean = rs.length ? rs.reduce((a, b) => a + b, 0) / rs.length : null;
  $('#revStats').innerHTML = '<span>À revoir <b>' + due + '</b></span><span>Neuves <b>' + fresh + '</b></span><span>Rappel moyen <b>' + (mean === null ? '—' : Math.round(mean * 100) + NB + '%') + '</b></span>';
}
function nextCard() {
  const c = pickCard(); rv.cur = c; revStats(); const box = $('#cardBox');
  if (!c) { const st = cardState(); const fut = D.cards.filter(x => st[x.id]).map(x => st[x.id].due).sort((a, b) => a - b)[0];
    box.innerHTML = '<div class="done-card"><span class="eyebrow">File terminée</span><b>Rien d’autre à revoir pour l’instant.</b><span class="note">' + (fut ? 'Prochaine carte : ' + new Date(fut).toLocaleString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) + '.' : '') + '</span>' + (D.cards.some(x => !st[x.id]) ? '<button class="btn ghost small" type="button" id="moreNew">Encore ' + NEW_PER_SESSION + ' nouvelles</button>' : '') + '</div>';
    const m = $('#moreNew'); if (m) m.addEventListener('click', () => { rv.newSeen = 0; nextCard(); }); return; }
  const st = cardState()[c.id]; const ch = CH[c.ch];
  box.innerHTML = '<div class="card"><div class="card-meta"><span class="chip">' + esc(ch ? ch.t : '') + '</span><span class="chip">' + (st ? (st.state === 'review' ? 'en révision' : 'en apprentissage') : 'nouvelle') + '</span></div><h3>' + md(c.q) + '</h3><button class="btn" type="button" id="reveal">Afficher la réponse</button><div id="ans" hidden><p class="ans">' + md(c.a) + '</p><span class="note">' + esc(c.src || '') + (c.sid ? ' · <a href="#/cours/' + c.sid + '">relire la diapositive</a>' : '') + '</span><div class="grades" role="group" aria-label="Évaluer ta réponse"></div></div></div>';
  $('#reveal').addEventListener('click', () => { $('#ans').hidden = false; $('#reveal').hidden = true; const now = Date.now(); const cs = cardState()[c.id];
    $('.grades', box).innerHTML = [[1, 'Encore'], [2, 'Difficile'], [3, 'Bien'], [4, 'Facile']].map(([g, l]) => '<button class="grade' + (g === 3 ? ' main' : '') + '" type="button" data-g="' + g + '"><b>' + l + '</b><span>' + nextTxt(fsrs(cs, g, now).next) + '</span></button>').join('');
    $$('.grade', box).forEach(b => b.addEventListener('click', () => { const all = cardState(); const wasNew = !all[c.id]; all[c.id] = fsrs(all[c.id], +b.dataset.g, Date.now()).card; store.set('cards', all); if (wasNew) rv.newSeen++; nextCard(); }));
    const m = $('.grade.main', box); if (m) m.focus(); });
}

/* ───────── Glossaire ───────── */
function renderGlossary(key) {
  const keys = Object.keys(TERMS).sort((a, b) => plain(TERMS[a].t).localeCompare(plain(TERMS[b].t), 'fr', { sensitivity: 'base' }));
  const first = t => plain(t).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/^[^A-Za-z0-9]+/, '').charAt(0).toUpperCase();
  const letters = [...new Set(keys.map(k => first(TERMS[k].t)))];
  let h = '<div class="view-h"><span class="eyebrow">' + keys.length + ' termes</span><h1>Glossaire</h1><p>Récepteurs, transporteurs, enzymes, notions de pharmacologie et de clinique ; les termes liés s’ouvrent sur place.</p></div><input class="search" id="gsearch" type="search" placeholder="Filtrer les termes" aria-label="Filtrer les termes"><nav class="letters" aria-label="Lettres">' + letters.map(l => '<a href="#/glossaire/@' + l + '">' + l + '</a>').join('') + '</nav><div class="gloss">';
  let cur = '';
  keys.forEach(k => { const T = TERMS[k]; const l = first(T.t); const anchor = l !== cur ? ' data-letter="' + l + '"' : ''; cur = l;
    h += '<article class="gl" id="g-' + k + '"' + anchor + '><span class="pop-k">' + esc(TK[T.k] || T.k || '') + '</span><h3>' + md(T.t) + '</h3>' + (T.en ? '<span class="pop-en">' + esc(T.en) + '</span>' : '') + '<p>' + md(T.def) + '</p>' + (T.more ? '<p class="note">' + md(T.more) + '</p>' : '') + ((T.vs || []).length ? '<p class="note">À distinguer : ' + T.vs.map(x => md('[[' + x + ']]')).join(', ') + '</p>' : '') + (T.src ? '<span class="src">' + esc(T.src) + '</span>' : '') + '</article>'; });
  viewSet(h + '</div>');
  $('#gsearch').addEventListener('input', e => { const q = e.target.value.trim().toLowerCase(); $$('.gl').forEach(g => { g.hidden = q && !g.textContent.replace(/\u2060/g, '').toLowerCase().includes(q); }); });
  if (key) { const el = key.startsWith('@') ? $('[data-letter="' + key.slice(1) + '"]') : document.getElementById('g-' + key); if (el) requestAnimationFrame(() => { el.scrollIntoView({ block: 'start' }); if (!key.startsWith('@')) el.classList.add('flash'); }); }
}

/* ───────── Délégation des clics ───────── */
document.addEventListener('click', e => {
  const t = e.target.closest('.term'); if (t) { e.preventDefault(); openPop(t.dataset.term, t); return; }
  const p = e.target.closest('[data-pane]'); if (p) { e.preventDefault(); openPane(p.dataset.pane, p); return; }
  const pr = e.target.closest('[data-present]'); if (pr) { location.hash = '#/diapo/' + pr.dataset.present; return; }
  const cp = e.target.closest('[data-copy]'); if (cp) { const url = location.href.split('#')[0] + '#/cours/' + cp.dataset.copy; try { navigator.clipboard.writeText(url).then(() => { cp.title = 'Lien copié'; cp.classList.add('ok'); }, () => copyFallback(url)); } catch (er) { copyFallback(url); } return; }
  const pg = e.target.closest('[data-poe-go]'); if (pg) { $$('[data-poe]', pg.closest('.poe')).forEach(x => { x.hidden = false; }); pg.remove(); return; }
  if (!deck.open) { const o = e.target.closest('.q-opt'); if (o && !o.disabled) { o.setAttribute('aria-pressed', o.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); return; } }
  const v = e.target.closest('[data-validate]'); if (v) { validateQuiz(v.closest('.qz')); return; }
  const rt = e.target.closest('[data-retry]'); if (rt) { resetQuiz(rt.closest('.qz')); return; }
  const sl = e.target.closest('a.slink[data-sid], a.chip[data-sid]'); if (sl && deck.open && SL[sl.dataset.sid]) { e.preventDefault(); closeSheet(); deckGo(SL[sl.dataset.sid].i); return; }
  if (!e.target.closest('.pop')) closeAllPops();
});
function copyFallback(url) { const i = document.createElement('input'); i.value = url; document.body.appendChild(i); i.select(); try { document.execCommand('copy'); } catch (e) { } i.remove(); }
document.addEventListener('keydown', e => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('.term[role="button"], .ilink[role="button"], [data-pane][role="button"]')) { e.preventDefault(); e.stopPropagation(); const t = e.target; if (t.click) t.click(); else t.dispatchEvent(new MouseEvent('click', { bubbles: true })); }
}, true);
let rz; window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { closeAllPops(); }, 120); });
try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (theme === 'auto') redraw(); }); } catch (e) { }
