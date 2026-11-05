/* Moteur des cours (série Chimioarchitecture) — composants : aperçus emboîtés, panneaux, QRM, questions à la salle,
   prédictions, cartes d’archive. */
'use strict';

/* ───────── QRM (barème de l’EDN, pour l’entraînement) ───────── */
const LET = 'ABCDEFGH';
const scoreQRM = (sel, ans, n) => { let d = 0; for (let i = 0; i < n; i++) if (sel.has(i) !== ans.includes(i)) d++; return { d, s: d === 0 ? 1 : d === 1 ? 0.5 : d === 2 ? 0.2 : 0 }; };
function quizHTML(qid, ctx) {
  const q = QZ[qid]; if (!q) { console.warn('QRM inconnue :', qid); return ''; }
  const deck = ctx.mode === 'deck'; const rev = deck ? (++ctx.f) : 0;
  let h = '<div class="qcard qz" data-qid="' + qid + '"' + (deck ? ' data-frev="' + rev + '"' : '') + '>';
  h += '<div class="q-head"><span class="eyebrow">' + esc(q.tag || 'QRM · plusieurs réponses possibles') + '</span><span class="note">' + esc(q.src || '') + '</span></div>';
  h += '<p class="q-stem">' + md(q.stem) + '</p><ul class="q-opts">' + q.opts.map((o, i) => '<li><button class="q-opt" type="button" aria-pressed="false" data-i="' + i + '" data-c="' + (q.ans.includes(i) ? 1 : 0) + '"><span class="k">' + LET[i] + '</span><span>' + md(o) + '</span><span class="mk"></span></button></li>').join('') + '</ul>';
  if (deck) h += '<div class="q-res" data-f="' + rev + '"><b>Réponses : ' + q.ans.map(i => LET[i]).join(', ') + '.</b> ' + md(q.short || '') + '</div>';
  else h += '<div class="q-act"><button class="btn small" type="button" data-validate>Valider</button><button class="btn ghost small" type="button" data-retry hidden>Recommencer</button></div><div class="q-res" hidden></div>';
  return h + '</div>';
}
function validateQuiz(card) {
  const q = QZ[card.dataset.qid]; const opts = $$('.q-opt', card);
  const sel = new Set(opts.filter(o => o.getAttribute('aria-pressed') === 'true').map(o => +o.dataset.i));
  const r = scoreQRM(sel, q.ans, q.opts.length);
  opts.forEach(o => { const i = +o.dataset.i, c = q.ans.includes(i), s = sel.has(i);
    o.classList.toggle('ok', c && s); o.classList.toggle('bad', s && !c); o.classList.toggle('miss', c && !s);
    $('.mk', o).textContent = c && s ? 'juste' : s && !c ? 'à tort' : c ? 'oubliée' : ''; o.disabled = true; });
  const res = $('.q-res', card); res.hidden = false;
  res.innerHTML = '<span class="sc">' + fmt(r.s, r.s === 0.2 || r.s === 0.5 ? 1 : 0) + ' / 1</span> · ' + (r.d === 0 ? 'aucune discordance' : r.d + ' discordance' + (r.d > 1 ? 's' : '')) + ' (barème de l’EDN : 0 → 1 ; 1 → 0,5 ; 2 → 0,2 ; 3 et plus → 0). <b>Réponses attendues : ' + q.ans.map(i => LET[i]).join(', ') + '.</b>' +
    (q.why ? '<ul class="q-why">' + q.why.map((w, i) => '<li><b>' + LET[i] + '.</b> ' + md(w) + '</li>').join('') + '</ul>' : '');
  $('[data-validate]', card).hidden = true; $('[data-retry]', card).hidden = false;
  card.dataset.score = r.s; card.dispatchEvent(new CustomEvent('quizdone', { bubbles: true, detail: r }));
}
function resetQuiz(card) {
  $$('.q-opt', card).forEach(o => { o.classList.remove('ok', 'bad', 'miss'); o.setAttribute('aria-pressed', 'false'); o.disabled = false; $('.mk', o).textContent = ''; });
  const res = $('.q-res', card); if (res) { res.hidden = true; res.innerHTML = ''; }
  const v = $('[data-validate]', card); if (v) v.hidden = false; const rt = $('[data-retry]', card); if (rt) rt.hidden = true; delete card.dataset.score;
}

/* ───────── Questions à la salle ─────────
   Personne n’est obligé de répondre et l’on ne compte pas les voix : la question s’affiche, on laisse un temps,
   la réponse vient au clic suivant. Une préquestion n’est pas corrigée tout de suite : on y revient en fin de cours. */
function voteHTML(id, ctx, b) {
  const V = VOTES[id]; if (!V) { console.warn('Question inconnue :', id); return ''; }
  const kind = b.kind || V.kind || 'concept';
  return vizHTML({ viz: 'vote', vote: id, kind, steps: [{ ph: kind === 'pre' ? 'hold' : 'ans' }] }, ctx);
}
VIZ.vote = {
  html(cfg) {
    const V = VOTES[cfg.vote], deck = cfg.mode === 'deck';
    const lab = { concept: 'Question à la salle', quick: 'Question à la salle', pre: 'Question d’ouverture · réponse en fin de cours', post: 'Retour sur une question du début', fin: 'Question de fin de cours' }[cfg.kind] || 'Question à la salle';
    let h = '<div class="vote" data-kind="' + cfg.kind + '"><div class="v-top"><span class="eyebrow">' + lab + '</span></div>';
    h += '<p class="v-stem">' + md(V.stem) + '</p><ol class="v-opts">' + V.opts.map((o, i) => '<li class="v-opt" data-i="' + i + '"' + (i === V.ans ? ' data-c="1"' : '') + '><button class="v-pick" type="button" aria-pressed="false" data-i="' + i + '"><span class="k">' + LET[i] + '</span><span class="v-t">' + md(o) + '</span></button></li>').join('') + '</ol>';
    h += '<div class="v-ans" hidden><b>' + (cfg.kind === 'pre' ? '' : 'Réponse : ' + LET[V.ans] + '. ') + '</b>' + md(V.why || '') + (V.src ? ' <span class="src">' + esc(V.src) + '</span>' : '') + '</div>';
    if (deck && cfg.kind === 'pre') h += '<div class="v-hold" hidden>' + arrow('turnr', 'in') + ' ' + md('On y reviendra en fin de cours' + (V.at && SL[V.at] ? ', diapositive ' + (SL[V.at].i + 1) : '') + '.') + '</div>';
    return h + '</div>';
  },
  mount(el, cfg, mode) {
    const root = $('.vote', el);
    const show = on => { const pre = cfg.kind === 'pre'; root.classList.toggle('reveal', on && !pre); $('.v-ans', root).hidden = !on || pre; const hold = $('.v-hold', root); if (hold) hold.hidden = !(on && pre); };
    root.addEventListener('click', e => {
      const pk = e.target.closest('.v-pick'); if (!pk || mode === 'deck') return;
      $$('.v-pick', root).forEach(x => x.setAttribute('aria-pressed', x === pk ? 'true' : 'false'));
      $$('.v-opt', root).forEach(li => { li.classList.toggle('ok', li.dataset.c === '1'); li.classList.toggle('bad', li.dataset.i === pk.dataset.i && li.dataset.c !== '1'); });
      root.classList.add('reveal'); $('.v-ans', root).hidden = false;
    });
    if (mode === 'deck') show(false);
    return { step: s => { show(cfg.steps.some(st => st.f <= s)); } };
  }
};

/* ───────── Question ouverte ou cas à discuter avec la salle (sans minuterie) ───────── */
function pairHTML(b, ctx, F) {
  const P = b.pair;
  return '<div class="pair"' + F + '><div class="pair-h"><span class="eyebrow">' + esc(P.lab || 'Question à la salle') + '</span></div><p class="pair-q">' + md(P.q) + '</p>' + (P.hint ? '<p class="note">' + md(P.hint) + '</p>' : '') + '</div>';
}

/* ───────── Prédire, observer, expliquer ───────── */
function predictHTML(b, ctx) {
  const P = b.predict, deck = ctx.mode === 'deck';
  const f1 = deck ? ' data-f="' + (++ctx.f) + '"' : '', f2 = deck ? ' data-f="' + (++ctx.f) + '"' : '';
  return '<div class="poe"><div class="poe-row"><span class="poe-k">Prédire</span><p>' + md(P.q) + '</p></div>' + (P.opts ? '<div class="poe-opts">' + P.opts.map((o, i) => '<span class="chip">' + LET[i] + ' · ' + md(o) + '</span>').join('') + '</div>' : '') +
    '<div class="poe-row"' + f1 + (deck ? '' : ' data-poe hidden') + '><span class="poe-k">Observer</span><p>' + md(P.obs) + '</p></div><div class="poe-row"' + f2 + (deck ? '' : ' data-poe hidden') + '><span class="poe-k">Expliquer</span><p>' + md(P.exp) + '</p></div>' +
    (deck ? '' : '<button class="btn ghost small" type="button" data-poe-go>Voir l’observation et l’explication</button>') + '</div>';
}

/* ───────── Cartes d’archive (anecdotes historiques) ───────── */
/* en projection, la date, le lieu et le titre d’abord : le récit (et la molécule) vient au clic suivant, le temps de le raconter */
function histCardHTML(id, F, b, ctx) {
  const H = HI[id]; if (!H) { console.warn('Histoire inconnue :', id); return ''; }
  const fs = ctx && ctx.mode === 'deck' && !(b && b.whole) ? ' data-f="' + (++ctx.f) + '"' : '';
  return '<article class="archive' + (b && b.wide ? ' wide' : '') + (H.img ? ' has-por' : '') + '"' + (F || '') + '><div class="ar-top"><span class="ar-y">' + esc(H.y) + '</span><span class="ar-place">' + esc(H.place || '') + '</span></div><div class="ar-body"><div class="ar-txt"><h5>' + md(H.t) + '</h5><div class="ar-story"' + fs + '><p>' + md(b && b.dk !== undefined ? b.dk : H.body) + '</p>' + (H.src && !(b && b.dk !== undefined) ? '<span class="src">' + md(H.src) + '</span>' : '') + '</div></div>' +
    (H.img ? '<figure class="ar-por"><img src="' + esc(H.img) + '" alt="' + esc(H.imgAlt || '') + '" loading="lazy" decoding="async"></figure>' : '') + (H.mol ? '<figure class="ar-mol"' + fs + '>' + molSVG(H.mol, { w: 230, ink: 'var(--night-ink)', faint: 'var(--night-lead)' }) + '<figcaption>' + esc(H.molName || H.mol) + '</figcaption></figure>' : '') + '</div></article>';
}
/* Diapositive de molécule : nom (qui ouvre la fiche), famille, structure, repères ; l’histoire apparaît au clic ;
   une image (photographie) ou un portrait de l’histoire, posé sur un disque rose */
function molSlideHTML(b, ctx, F) {
  const M = MOLS[b.mol] || {}, deck = ctx.mode === 'deck';
  /* en projection, la 3e valeur d’une ligne la remplace (null : la ligne disparaît) */
  const pick = x => deck && x.length > 2 ? x[2] : x[1];
  const facts = '<dl class="ms-facts">' + (b.facts || []).filter(x => pick(x) !== null).map(x => '<div><dt>' + esc(x[0]) + '</dt><dd>' + md(pick(x)) + '</dd></div>').join('') + '</dl>';
  const hist = '<ol class="ms-tl">' + (b.hist || []).filter(x => pick(x) !== null).map(x => '<li' + (deck ? ' data-f="' + (++ctx.f) + '"' : '') + '><b>' + esc(x[0]) + '</b><span>' + md(pick(x)) + '</span></li>').join('') + '</ol>';
  const H = b.por ? HI['h-' + b.por] : null;
  const dm = !b.img && !(H && H.img) && typeof durMini === 'function' ? durMini(b.dur || [b.mol], deck ? 640 : 520, deck) : '';
  const art = b.img ? '<figure class="ms-img"><img src="' + esc(b.img.src) + '" alt="' + esc(b.img.alt || '') + '" loading="lazy" decoding="async">' + (b.img.credit ? '<figcaption>' + esc(b.img.credit) + '</figcaption>' : '') + '</figure>'
    : H && H.img ? '<figure class="ms-por"><img src="' + esc(H.img) + '" alt="' + esc(H.imgAlt || '') + '" loading="lazy" decoding="async"></figure>'
    /* sans image : le profil d’action de la molécule, le temps en heures */
    : dm ? '<figure class="ms-dur"><span class="eyebrow">Profil d’action · temps en heures</span>' + dm + '</figure>' : '';
  return '<div class="molsl' + (b.img ? ' has-img' : H && H.img ? ' has-por' : art ? ' has-dur' : '') + '"' + F + '><div class="ms-l"><div class="ms-id"><figure class="ms-struct">' + molSVG(b.mol, { w: deck ? 290 : 230 }) + '</figure>' +
    '<div class="ms-name"><span class="eyebrow">' + esc(b.cls || '') + '</span><button type="button" class="ms-pane" data-pane="' + esc(b.mol) + '">' + esc(M.dci || b.mol) + '</button></div></div>' + facts + '</div>' +
    '<div class="ms-r"><div class="ms-h"><span class="eyebrow">Histoire</span>' + hist + '</div>' + art + '</div></div>';
}
function molChip(id) {
  const M = MOLS[id]; if (!M) { console.warn('Molécule inconnue :', id); return ''; }
  return '<button class="molchip" type="button" data-pane="' + id + '"><b>' + esc(M.dci) + '</b>' + (M.brand ? '<span>' + esc(M.brand) + '</span>' : '') + '</button>';
}

/* ───────── Aperçus emboîtés (glossaire) ───────── */
const pops = [];
function closeFrom(level) { while (pops.length >= level) { const p = pops.pop(); p.el.remove(); p.anchor.setAttribute('aria-expanded', 'false'); } }
function closeAllPops() { closeFrom(1); }
function placePop(el, anchor) {
  const r = anchor.getBoundingClientRect(), w = el.offsetWidth, h = el.offsetHeight, vw = document.documentElement.clientWidth, vh = window.innerHeight;
  let left = Math.min(Math.max(12, r.left), vw - 12 - w), top = r.bottom + 8;
  if (r.bottom + 8 + h > vh - 8 && r.top - 8 - h > 8) top = r.top - 8 - h;
  if (top + h > vh - 8 && h < vh - 16) top = Math.max(8, vh - 8 - h);
  const host = el.parentElement === document.body ? { x: window.scrollX, y: window.scrollY } : { x: 0, y: 0 };
  el.style.left = (left + host.x) + 'px'; el.style.top = (top + host.y) + 'px';
}
const TK = { rec: 'récepteur', tr: 'transporteur', enz: 'enzyme', can: 'canal ionique', cpt: 'notion', cli: 'clinique', pk: 'pharmacocinétique', hist: 'histoire', voie: 'voie neuronale', mol: 'molécule', reg: 'réglementation', mod: 'modèle', ech: 'échelle', exp: 'expérience', meth: 'méthode', neuro: 'neurobiologie' };
function openPop(key, anchor) {
  const parentPop = anchor.closest('.pop'); const level = (parentPop ? +parentPop.dataset.level : 0) + 1;
  if (pops[level - 1] && pops[level - 1].key === key) { closeFrom(level); return; }
  closeFrom(level);
  const T = TERMS[key]; if (!T) return;
  const chain = pops.map(p => TERMS[p.key].t).concat(T.t);
  const el = document.createElement('div');
  el.className = 'pop'; el.dataset.level = level; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Définition : ' + plain(T.t));
  let h = '<div class="pop-h"><div><span class="pop-k">' + esc(TK[T.k] || T.k || 'notion') + '</span><h4 tabindex="-1">' + md(T.t) + '</h4>' + (T.en ? '<span class="pop-en">' + esc(T.en) + '</span>' : '') + '</div><button class="x" type="button" aria-label="Fermer">' + ICON.x + '</button></div>';
  h += '<p class="def-t">' + md(T.def) + '</p>';
  if (T.more) h += '<p>' + md(T.more) + '</p>';
  if (T.trap) h += '<p class="trap-line"><b>Piège.</b> ' + md(T.trap) + '</p>';
  if (T.vs && T.vs.length) h += '<p class="pop-rel">À distinguer : ' + T.vs.map(k => md('[[' + k + ']]')).join(', ') + '</p>';
  if (T.see && T.see.length) h += '<p class="pop-rel">Voir aussi : ' + T.see.map(k => md('[[' + k + ']]')).join(', ') + '</p>';
  if (T.panes && T.panes.length) h += '<div class="pop-panes">' + T.panes.map(id => '<button class="chip" type="button" data-pane="' + id + '">' + esc(paneTitle(id)) + ' ' + arrow('ne', 'in') + '</button>').join('') + '</div>';
  h += '<div class="pop-f"><span class="lvl">Niveau ' + level + ' · ' + chain.map(c => esc(plain(c))).join(' › ') + '</span>' + (T.src ? '<span class="src">' + esc(T.src) + '</span>' : '') + '<a class="slink" href="#/glossaire/' + key + '">Glossaire ' + arrow('r', 'in') + '</a></div>';
  el.innerHTML = h; (deck.open ? deck.el : document.body).appendChild(el);
  anchor.setAttribute('aria-expanded', 'true'); pops.push({ el, anchor, key }); placePop(el, anchor);
  $('.x', el).addEventListener('click', () => { closeFrom(level); anchor.focus(); });
  $('h4', el).focus({ preventScroll: true });
  pushTrail(plain(T.t));
}

/* ───────── Panneaux empilés : molécules, cibles, histoire ───────── */
let stackEl = null; const paneStack = [];
function ensureStack() {
  if (stackEl) return stackEl;
  stackEl = document.createElement('aside'); stackEl.className = 'stack'; stackEl.id = 'stack'; stackEl.setAttribute('aria-label', 'Panneaux');
  stackEl.innerHTML = '<button class="btn ghost small sheet-back" type="button">' + arrow('l', 'btn-arw') + ' Revenir au texte</button><div class="stack-empty"><span class="eyebrow">Panneaux</span><b>' + esc(D.site.paneHint || 'Molécules, cibles et archives s’ouvrent ici.') + '</b><span class="note">Un nom souligné ouvre sa fiche à côté du texte ; les fiches précédentes restent en tranche, un clic pour y revenir.</span></div><div class="spines"></div><div class="pane-host"></div>';
  $('.sheet-back', stackEl).addEventListener('click', closeSheet);
  return stackEl;
}
function openPane(id, from) {
  const x = PANE(id); if (!x) return;
  const inPop = from && from.closest('.pop'), inPane = from && from.closest('.pane');
  const src = inPop ? plain(TERMS[pops[+inPop.dataset.level - 1].key].t) : (inPane && paneStack.length ? paneTitle(paneStack[paneStack.length - 1].id) : (deck.open ? 'la diapositive ' + (deck.i + 1) : currentView === 'cours' ? 'le cours' : 'cette page'));
  closeAllPops();
  const st = ensureStack(); if (!st.isConnected) { (deck.open ? deck.el : ($('#stackSlot') || document.body)).appendChild(st); }
  if (deck.open && st.parentElement !== deck.el) deck.el.appendChild(st);
  const i = paneStack.findIndex(p => p.id === id); if (i >= 0) paneStack.splice(i, 1);
  paneStack.push({ id, src }); if (paneStack.length > 5) paneStack.shift();
  renderPanes(); pushTrail(paneTitle(id));
  if (deck.open || matchMedia('(max-width:1180px)').matches || !$('#stackSlot') && !st.closest('.reader')) { st.classList.add('open'); $('.sheet-back', st).focus(); }
  else { const h = $('.pane h4', st); if (h) h.focus({ preventScroll: true }); }
}
function renderPanes() {
  const st = ensureStack(), host = $('.pane-host', st), sp = $('.spines', st);
  $('.stack-empty', st).hidden = paneStack.length > 0;
  sp.innerHTML = paneStack.slice(0, -1).map(p => { const x = PANE(p.id); return '<button class="spine k-' + x.type + '" type="button" data-back="' + p.id + '"><span class="mono">' + esc({ mol: D.site.molWord1 || 'molécule', target: 'cible', hist: 'archive', note: 'note' }[x.type] || x.type) + '</span><span>' + esc(paneTitle(p.id)) + '</span></button>'; }).join('');
  if (!paneStack.length) { unmountViz(host); host.innerHTML = ''; return; }
  const top = paneStack[paneStack.length - 1], x = PANE(top.id);
  unmountViz(host);
  let h = '<div class="pane k-' + x.type + '"><div class="pane-top"><span class="note">Panneau ' + paneStack.length + ' · ouvert depuis ' + esc(top.src) + '</span><button class="x" type="button" data-pclose aria-label="Fermer le panneau">' + ICON.x + '</button></div>';
  h += x.type === 'mol' ? molPaneHTML(top.id) : x.type === 'hist' ? histPaneHTML(top.id) : targetPaneHTML(top.id);
  host.innerHTML = h + '</div>';
  mountViz(host, 'read');
  $('[data-pclose]', host).addEventListener('click', () => { paneStack.pop(); renderPanes(); if (!paneStack.length) closeSheet(); });
  $$('.spine', sp).forEach(b => b.addEventListener('click', () => { const k = b.dataset.back, j = paneStack.findIndex(p => p.id === k); paneStack.splice(j + 1); renderPanes(); }));
}
function closeSheet() { if (stackEl) stackEl.classList.remove('open'); }
const trail = [];
function pushTrail(x) { if (trail[trail.length - 1] === x) return; trail.push(x); if (trail.length > 8) trail.shift(); const t = $('#trail'); if (t) t.innerHTML = trail.map(v => '<li>' + esc(v) + '</li>').join(''); }

/* Fiche cible (récepteur, transporteur, enzyme, canal, voie) */
function targetPaneHTML(id) {
  const P = PANES[id];
  let h = '<div class="pane-h"><span class="eyebrow">' + esc(TK[P.k] || P.k || 'cible') + (P.fam ? ' · ' + esc(P.fam) : '') + '</span><h4 tabindex="-1">' + md(P.t) + '</h4>' + (P.sub ? '<span class="note">' + md(P.sub) + '</span>' : '') + '</div>';
  if (P.lead) h += '<p class="pane-lead">' + md(P.lead) + '</p>';
  if (P.where) h += '<div class="kv"><span>Où</span><p>' + md(P.where) + '</p></div>';
  if (P.does) h += '<div class="kv"><span>Rôle</span><p>' + md(P.does) + '</p></div>';
  if (P.block) h += '<div class="kv"><span>Si on le bloque</span><p>' + md(P.block) + '</p></div>';
  if (P.stim) h += '<div class="kv"><span>Si on le stimule</span><p>' + md(P.stim) + '</p></div>';
  if (P.mols && P.mols.length) h += '<div class="kv"><span>' + esc(D.site.molWordCaps || 'Molécules') + '</span><div class="molchips">' + P.mols.map(molChip).join('') + '</div></div>';
  if (P.body) h += blocks(P.body, { mode: 'read', f: 0 });
  if (P.links && P.links.length) h += paneLinks(P.links);
  if (P.src) h += '<p class="src">' + esc(P.src) + '</p>';
  return h;
}
function histPaneHTML(id) {
  const H = HI[id];
  return '<div class="pane-h"><span class="eyebrow">Archive · ' + esc(H.y) + '</span><h4 tabindex="-1">' + md(H.t) + '</h4><span class="note">' + esc(H.place || '') + '</span></div>' + histCardHTML(id, '', { wide: false }) + (H.more ? '<p>' + md(H.more) + '</p>' : '') + (H.sid ? paneLinks([['slide', H.sid, 'Dans le cours']]) : '') + '<p><a class="slink" href="#/histoire">Toute la frise ' + arrow('r', 'in') + '</a></p>';
}
function paneLinks(links) {
  return '<div class="pane-links">' + links.map(l => l[0] === 'pane' ? '<button class="chip" type="button" data-pane="' + l[1] + '">' + esc(l[2]) + ' ' + arrow('ne', 'in') + '</button>'
    : l[0] === 'term' ? '<span class="term" role="button" tabindex="0" data-term="' + l[1] + '" aria-expanded="false">' + esc(l[2]) + '</span>'
    : l[0] === 'href' ? '<a class="chip" href="' + esc(l[1]) + '">' + esc(l[2]) + ' ' + arrow('r', 'in') + '</a>'
    : '<a class="chip" href="#/cours/' + l[1] + '" data-sid="' + l[1] + '">' + esc(l[2]) + ' ' + arrow('r', 'in') + '</a>').join('') + '</div>';
}
