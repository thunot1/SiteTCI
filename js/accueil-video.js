/* Vidéo d'ambiance du bandeau d'accueil.
 *
 * Le fichier peut ne pas encore exister : l'emplacement est en place, la vidéo
 * sera déposée plus tard. Ce script n'attache donc la vidéo que si le fichier
 * répond — sinon il ne fait rien, et le bandeau garde son fond rouge, sans
 * aucune requête en erreur ni message dans la console.
 *
 * Servi depuis le même domaine : autorisé par la politique de sécurité du site.
 */
(function () {
  var FICHIER = 'img/accueil-fond.mp4';

  var video = document.querySelector('.hero-video');
  var voile = document.querySelector('.hero-voile');
  if (!video) return;

  // Respecter le réglage « réduire les animations » : pas de vidéo qui bouge.
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // On vérifie d'abord que le fichier existe (requête légère, sans le corps).
  // S'il n'est pas là, on s'arrête sans rien afficher de cassé.
  fetch(FICHIER, { method: 'HEAD' })
    .then(function (r) {
      if (!r.ok) return;
      video.src = FICHIER;
      if (voile) voile.hidden = false;
      var p = video.play();
      // Certains navigateurs refusent la lecture auto : sans le son, c'est
      // rare, mais on ignore proprement l'échec — le fond rouge reste dessous.
      if (p && typeof p.catch === 'function') p.catch(function () {});
    })
    .catch(function () { /* hors ligne ou fichier absent : on ne fait rien */ });
})();
