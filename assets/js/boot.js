/* Chimioarchitecture (série de cours) — démarrage : en-tête, pied de page, routeur. */
'use strict';
document.documentElement.lang = 'fr';
if (!/^#\/?presenter/.test(location.hash)) {
  header();
  const S = D.site;
  $('#foot').innerHTML = '<div class="wrap"><div class="f-row"><span>' + esc(S.title1 + ' ' + S.title2) + '</span><span>' + esc(S.version || '') + '</span></div><p>' + md(S.foot || '') + '</p><p>Polices auto-hébergées : Compu (titres, d’après OS COMPU BOLD d’Osamu Sato), Newsreader, Jost, DM Mono · aucune donnée ne quitte ton navigateur.</p></div>';
}
window.addEventListener('hashchange', route);
route();
/* notes de l’enseignant déjà déverrouillées dans ce navigateur : on les rouvre */
if (!/^#\/?presenter/.test(location.hash)) notesRestore().then(ok => { if (ok) notesRefresh(false); });
