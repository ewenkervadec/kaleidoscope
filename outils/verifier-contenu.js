// Vérifie la cohérence interne du contenu du cours.
// Usage, depuis la racine du site : node outils/verifier-contenu.js
// (ou : node outils/verifier-contenu.js chemin/vers/cours.js)
global.window = {};
require(require('path').resolve(process.argv[2] || 'content/cours.js'));
const D = window.COURS;
const errs = [], warns = [];
const dupe = a => a.filter((x, i) => a.indexOf(x) !== i);
const SL = new Set(D.slides.map(s => s.id)), CH = new Set(D.chapters.map(c => c.id));
const T = D.terms || {}, M = D.mols || {}, P = D.panes || {}, Q = D.quiz || {}, V = D.votes || {}, O = D.objectives || {};
const HI = new Set((D.history || []).map(h => h.id)), STR = D.structures || {};
const paneOk = id => M[id] || P[id] || HI.has(id);
if (dupe(D.slides.map(s => s.id)).length) errs.push('id de diapositive en double : ' + dupe(D.slides.map(s => s.id)));
if (dupe((D.cards || []).map(c => c.id)).length) errs.push('id de carte en double');

function scan(str, where) {
  if (typeof str !== 'string') return;
  for (const m of str.matchAll(/\[\[([a-z0-9-]+)(?:\|[^\]]+)?\]\]/g)) if (!T[m[1]]) errs.push(`terme inconnu [[${m[1]}]] dans ${where}`);
  for (const m of str.matchAll(/\{\{([0-9a-z-]+)(?:\|[^}]+)?\}\}/g)) if (!paneOk(m[1])) errs.push(`panneau inconnu {{${m[1]}}} dans ${where}`);
  for (const m of str.matchAll(/\(\(([a-z0-9-]+)\|([^)]+)\)\)/g)) if (!SL.has(m[1])) errs.push(`diapositive inconnue ((${m[1]})) dans ${where}`);
  if (/\w'\w/.test(str)) warns.push(`apostrophe droite dans ${where} : ${str.slice(0, 60)}`);
  if ((str.match(/\*\*/g) || []).length % 2) errs.push(`gras non fermé dans ${where}`);
  if (/\[\[[^\]]*$|\{\{[^}]*$/.test(str)) errs.push(`balise non fermée dans ${where}`);
}
function walk(v, where) {
  if (typeof v === 'string') return scan(v, where);
  if (Array.isArray(v)) return v.forEach((x, i) => walk(x, where + '[' + i + ']'));
  if (v && typeof v === 'object') for (const k in v) { if (k === 'structures' || k === 'binding') continue; walk(v[k], where + '.' + k); }
}
walk(D, 'D');

const VIZ = ['durees', 'recepteur', 'bayes', 'paysage', 'addiction', 'intensite', 'seance', 'tiles', 'vote', 'kaleido'];
const flat = arr => (arr || []).reduce((acc, x) => acc.concat(x && x.split ? [x].concat(flat([].concat(...x.split))) : [x]), []);
const blocksOf = s => flat((s.b || []).concat(s.more || []));
D.slides.forEach(s => {
  if (!CH.has(s.ch)) errs.push('chapitre inconnu ' + s.ch + ' pour ' + s.id);
  (s.obj || []).forEach(o => { if (!O[o]) errs.push('objectif inconnu ' + o + ' dans ' + s.id); });
  blocksOf(s).forEach(b => {
    if (typeof b === 'string') return;
    if (b.quiz && !Q[b.quiz]) errs.push('QRM inconnue ' + b.quiz + ' dans ' + s.id);
    if (b.vote && !V[b.vote]) errs.push('vote inconnu ' + b.vote + ' dans ' + s.id);
    if (b.hist && !b.mol && !HI.has(b.hist)) errs.push('archive inconnue ' + b.hist + ' dans ' + s.id);
    if (b.viz && !VIZ.includes(b.viz)) errs.push('visualisation inconnue ' + b.viz + ' dans ' + s.id);
    if (b.mols) b.mols.forEach(id => { if (!M[id]) errs.push('molécule inconnue ' + id + ' dans ' + s.id); });
    if (b.formula) b.formula.forEach(k => { if (!STR[k]) errs.push('structure inconnue ' + k + ' dans ' + s.id); });
    if (b.objs) b.objs.forEach(o => { if (!O[o]) errs.push('objectif inconnu dans objs ' + o); });
    if (b.viz === 'empreintes') { (b.rows || []).forEach(r => { if (!D.binding.data[r]) errs.push('ligne d’affinités inconnue ' + r); }); (b.cols || []).forEach(c => { if (!D.binding.cols.some(x => x.id === c)) errs.push('colonne d’affinités inconnue ' + c); }); }
    if (b.fig && !['reseaux', 'salle'].includes(b.fig)) errs.push('figure inconnue ' + b.fig);
    if (b.mol && !M[b.mol]) errs.push('molécule inconnue (diapositive de molécule) ' + b.mol + ' dans ' + s.id);
    if (b.mol && !STR[b.mol]) errs.push('structure manquante pour ' + b.mol);
    if (b.mol && b.por && !(D.history || []).some(h => h.id === 'h-' + b.por && h.img)) errs.push('portrait inconnu ' + b.por + ' dans ' + s.id);
    if (b.cols) b.cols.forEach(c => { if (c.ill && !['pramipexole', 'psilocybine', 'psychostimulants', 'dxmbupropion'].includes(c.ill)) errs.push('illustration inconnue ' + c.ill + ' dans ' + s.id); });
  });
  if (!s.src && !['cover', 'section', 'pause'].includes(s.kind) && s.id !== 'objectifs' && s.id !== 'a-retenir' && s.id !== 'references') warns.push('diapositive sans source : ' + s.id);
});
Object.entries(O).forEach(([o, x]) => { if (!SL.has(x.sid)) errs.push('sid inconnu pour l’objectif ' + o + ' : ' + x.sid); if (!D.slides.some(s => (s.obj || []).includes(o))) warns.push('objectif sans diapositive : ' + o); });
Object.entries(V).forEach(([id, v]) => { if (v.ans < 0 || v.ans >= v.opts.length) errs.push('réponse invalide pour le vote ' + id); if (v.at && !SL.has(v.at)) errs.push('diapositive de retour inconnue pour ' + id); });
Object.entries(Q).forEach(([id, q]) => {
  if (!q.opts || q.opts.length !== 5) warns.push('QRM ' + id + ' : ' + (q.opts || []).length + ' propositions');
  if (!q.ans.length || q.ans.some(i => i < 0 || i >= q.opts.length)) errs.push('réponses invalides pour ' + id);
  if (q.why && q.why.length !== q.opts.length) errs.push('explications incomplètes pour ' + id);
});
(D.qcm || []).forEach(id => { if (!Q[id]) errs.push('QRM inconnue dans qcm : ' + id); });
(D.cases || []).forEach(c => c.steps.forEach((s, i) => { if (s.q && !Q[s.q]) errs.push('QRM inconnue dans le cas ' + c.id + ', étape ' + (i + 1)); }));
(D.cards || []).forEach(c => { if (!CH.has(c.ch)) errs.push('chapitre inconnu pour la carte ' + c.id); if (c.sid && !SL.has(c.sid)) errs.push('diapositive inconnue pour la carte ' + c.id); });
(D.history || []).forEach(h => { if (h.sid && !SL.has(h.sid)) errs.push('diapositive inconnue pour l’archive ' + h.id); if (h.mol && !STR[h.mol]) warns.push('structure absente pour l’archive ' + h.id + ' : ' + h.mol); });
(D.tileGroups || []).forEach(g => g.mols.forEach(id => { if (!M[id]) errs.push('molécule inconnue dans la pharmacopée : ' + id); }));
Object.entries(M).forEach(([id, m]) => { if (!D.classes[m.cls]) errs.push('classe inconnue pour ' + id); if (!(D.tileGroups || []).some(g => g.mols.includes(id))) warns.push('molécule absente de la pharmacopée : ' + id); (m.sids || []).forEach(s => { if (!SL.has(s)) errs.push('diapositive inconnue dans la fiche ' + id); }); });
Object.entries(T).forEach(([k, t]) => { ['vs', 'see'].forEach(f => (t[f] || []).forEach(x => { if (!T[x]) errs.push('terme lié inconnu ' + x + ' dans ' + k); })); (t.panes || []).forEach(x => { if (!paneOk(x)) errs.push('panneau inconnu ' + x + ' dans le terme ' + k); }); });
Object.entries(P).forEach(([k, p]) => { (p.mols || []).forEach(x => { if (!M[x]) errs.push('molécule inconnue ' + x + ' dans le panneau ' + k); }); (p.links || []).forEach(l => { if (l[0] === 'term' && !T[l[1]]) errs.push('terme inconnu ' + l[1] + ' dans le panneau ' + k); if (l[0] === 'pane' && !paneOk(l[1])) errs.push('panneau inconnu ' + l[1] + ' dans le panneau ' + k); if (l[0] === 'slide' && !SL.has(l[1])) errs.push('diapositive inconnue ' + l[1] + ' dans le panneau ' + k); }); });
if (D.binding) D.binding.rows.forEach(r => { if (!M[r]) errs.push('molécule inconnue dans les affinités : ' + r); });
if (D.binding) D.binding.cols.forEach(c => { if (c.pane && !paneOk(c.pane)) errs.push('panneau inconnu pour la colonne ' + c.id); });
Object.entries(D.trees || {}).forEach(([k, t]) => {
  const n = t.n; if (!n[t.root]) errs.push('racine inconnue pour l’arbre ' + k);
  Object.entries(n).forEach(([id, x]) => (x.opts || []).forEach(o => { if (!n[o.to]) errs.push('nœud inconnu ' + o.to + ' dans l’arbre ' + k); }));
  t.cases.forEach(c => { let cur = t.root, g = 0; while (n[cur] && !n[cur].leaf && g++ < 20) { const p = c.path[cur]; if (!p) { errs.push('chemin incomplet pour le cas ' + c.id + ' (' + k + ') au nœud ' + cur); break; } cur = n[cur].opts[p.ans].to; } });
});
const mins = D.slides.reduce((a, s) => a + (s.mins || 0), 0);
console.log(D.slides.length + ' diapositives (' + mins + ' min prévues), ' + Object.keys(M).length + ' substances, ' + Object.keys(T).length + ' termes, ' + Object.keys(P).length + ' panneaux, ' + (D.history || []).length + ' archives, ' + Object.keys(V).length + ' votes, ' + Object.keys(Q).length + ' QRM, ' + (D.cards || []).length + ' cartes.');
warns.forEach(w => console.log('  attention : ' + w));
if (errs.length) { errs.forEach(e => console.log('  ERREUR : ' + e)); process.exit(1); }
console.log('Aucune erreur.');
