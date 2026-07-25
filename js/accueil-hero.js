/* Photo du bandeau d'accueil.
 *
 * La photo peut ne pas encore être en place. Plutôt que d'afficher une image
 * cassée, on la retire au premier échec de chargement : le dégradé rouge sous
 * la photo (et le panneau rouge) prennent le relais, dans l'esprit du reste du
 * site où le rouge est toujours le filet de sécurité.
 *
 * Servi depuis le même domaine : autorisé par la politique de sécurité du site.
 */
(function () {
  var img = document.querySelector('.hero-a-img');
  if (!img) return;

  function retirer() { if (img && img.parentNode) img.parentNode.removeChild(img); }

  img.addEventListener('error', retirer);
  // Image déjà tentée depuis le cache et en échec (avant l'attache de l'écouteur).
  if (img.complete && img.naturalWidth === 0) retirer();
})();
