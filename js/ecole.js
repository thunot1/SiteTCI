/* Interactions de la page « École de tennis ».
 *
 *  1) Repli de la photo du bandeau : si img/ecole-hero.jpg est absent, on retire
 *     l'image plutôt que d'afficher une image cassée — le dégradé rouge dessous
 *     prend le relais (le rouge reste le filet de sécurité du site).
 *  2) Compteurs animés des chiffres clés, au moment où la bande entre à l'écran.
 *     Respecte « réduire les animations » : les valeurs finales restent affichées.
 *
 * Servi depuis le même domaine : autorisé par la politique de sécurité du site.
 */
(function () {
  'use strict';

  // 1) Repli de la photo du bandeau ────────────────────────────────
  var img = document.querySelector('.hero-ecole-img');
  if (img) {
    var retirer = function () { if (img && img.parentNode) img.parentNode.removeChild(img); };
    img.addEventListener('error', retirer);
    if (img.complete && img.naturalWidth === 0) retirer();
  }

  // 2) Compteurs animés ────────────────────────────────────────────
  var nums = document.querySelectorAll('.chiffres-ecole .n[data-cible]');
  var reduit = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!nums.length || reduit || !('IntersectionObserver' in window)) {
    return;   // valeurs finales déjà dans le HTML : rien à faire
  }

  function animer(el) {
    var cible = parseInt(el.getAttribute('data-cible'), 10) || 0;
    var suffixe = el.getAttribute('data-suffixe') || '';
    var debut = null, duree = 1200;
    function pas(ts) {
      if (!debut) debut = ts;
      var p = Math.min((ts - debut) / duree, 1);
      var e = 1 - Math.pow(1 - p, 3);           // ease-out cubique
      el.textContent = Math.round(cible * e) + suffixe;
      if (p < 1) requestAnimationFrame(pas);
      else el.textContent = cible + suffixe;     // valeur exacte à la fin
    }
    requestAnimationFrame(pas);
  }

  // Remise à zéro juste avant d'observer : sans script, le HTML garde ses valeurs.
  nums.forEach(function (el) { el.textContent = '0' + (el.getAttribute('data-suffixe') || ''); });

  var obs = new IntersectionObserver(function (entrees) {
    entrees.forEach(function (e) {
      if (e.isIntersecting) { animer(e.target); obs.unobserve(e.target); }
    });
  }, { threshold: 0.4 });

  nums.forEach(function (el) { obs.observe(el); });
})();
