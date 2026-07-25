/* Photo du bandeau de la page « Le club ».
 *
 * Comme pour l'accueil, la photo peut ne pas encore être en place. Plutôt que
 * d'afficher une image cassée, on la retire au premier échec de chargement : le
 * dégradé rouge sous la photo (et le panneau) prennent le relais.
 *
 * Servi depuis le même domaine : autorisé par la politique de sécurité du site.
 */
(function () {
  var img = document.querySelector('.hero-club-img');
  if (!img) return;

  function retirer() { if (img && img.parentNode) img.parentNode.removeChild(img); }

  img.addEventListener('error', retirer);
  if (img.complete && img.naturalWidth === 0) retirer();
})();
