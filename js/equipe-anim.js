/* Apparition en cascade des portraits (bureau ET conseil), page « Le club ».
 *
 * Fondu + léger déplacement vers le haut + zoom de 97 % à 100 %, 350 ms, courbe
 * cubic-bezier(0.22, 1, 0.36, 1), avec 70 ms de décalage d'un portrait à l'autre.
 * Toute la mise en forme est dans le CSS (.anim-portraits …) : ce script ne fait
 * que déclencher l'animation quand les cartes entrent dans le champ de vision.
 *
 * Le décalage est porté par une variable CSS --i (l'indice de la carte). Chaque
 * grille repart de zéro : le conseil ne doit pas hériter du décalage cumulé du
 * bureau, sinon ses premiers portraits attendraient trop longtemps.
 *
 * Si le script ne s'exécute pas, la classe n'est jamais posée et les cartes
 * restent visibles : l'animation est un plus, jamais une condition d'affichage.
 */
(function () {
  'use strict';

  // Respecter le réglage « réduire les animations » : on n'anime pas, et les
  // cartes gardent leur état visible par défaut.
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  var grilles = document.querySelectorAll('.bureau, .conseil-membres, .equipe');
  if (!grilles.length) {
    return;
  }

  // À partir d'ici, le CSS peut masquer les cartes pour préparer l'animation.
  document.documentElement.classList.add('anim-portraits');

  var supporteIO = 'IntersectionObserver' in window;
  var observateur = supporteIO
    ? new IntersectionObserver(function (entrees) {
        entrees.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('apparu');
            observateur.unobserve(e.target);   // une seule fois par carte
          }
        });
      }, { threshold: 0.15 })
    : null;

  for (var g = 0; g < grilles.length; g++) {
    var cartes = grilles[g].querySelectorAll('.membre, .moniteur');
    for (var i = 0; i < cartes.length; i++) {
      // Cascade propre à chaque grille (transition-delay: --i × 70 ms).
      cartes[i].style.setProperty('--i', i);
      if (observateur) {
        observateur.observe(cartes[i]);
      } else {
        // Sans IntersectionObserver (très anciens navigateurs), on montre tout
        // de suite : mieux vaut des cartes visibles sans cascade qu'invisibles.
        cartes[i].classList.add('apparu');
      }
    }
  }
})();
