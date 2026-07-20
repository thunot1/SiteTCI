/* Menu de navigation en petite largeur.
 *
 * Ce script était recopié dans chaque page, et il avait DÉJÀ divergé : trois
 * versions différentes sur cinq pages. Un correctif appliqué à l'une n'aurait
 * pas atteint les autres. Un seul fichier, inclus partout, rend la dérive
 * impossible.
 *
 * L'état `aria-expanded` est tenu à jour dans tous les cas : c'est lui que
 * lisent les lecteurs d'écran, pas la présence du menu à l'image.
 */
(function () {
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  if (!burger || !nav) return;

  function fermer() {
    nav.classList.remove('ouvert');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Ouvrir le menu');
  }

  burger.addEventListener('click', function () {
    var ouvert = nav.classList.toggle('ouvert');
    burger.setAttribute('aria-expanded', ouvert ? 'true' : 'false');
    burger.setAttribute('aria-label', ouvert ? 'Fermer le menu' : 'Ouvrir le menu');
  });

  // Refermer après un choix : sans cela, le menu masque la page d'arrivée
  // quand le lien pointe vers une ancre de la page courante.
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A' && nav.classList.contains('ouvert')) fermer();
  });

  // Échap referme, comme tout élément qui recouvre la page.
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('ouvert')) {
      fermer();
      burger.focus();
    }
  });
})();
