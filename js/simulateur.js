/* Simulateur d'inscription : lit les choix, calcule le total via tarifs.js.
 *
 * Ce code vivait dans un <script> en ligne de la page. La politique de sécurité
 * du site (script-src 'self') interdit les scripts en ligne : sur le site
 * déployé, le simulateur restait donc caché, faute de voir son code s'exécuter.
 * Un fichier externe, servi depuis le même domaine, est autorisé.
 */
(function () {
  // Le simulateur n'est révélé que si le script tourne : sans JavaScript,
  // un formulaire inerte serait pire qu'absent. Les tableaux de tarifs,
  // eux, restent visibles en toutes circonstances.
  var bloc = document.getElementById('simulateur');
  if (!bloc || typeof calculerInscription !== 'function') return;
  bloc.classList.add('actif');

  var profil = document.getElementById('simu-profil');
  var cours = document.getElementById('simu-cours');
  var badge = document.getElementById('simu-badge');
  var cle = document.getElementById('simu-cle');
  var sLignes = document.getElementById('simu-lignes');
  var sTotal = document.getElementById('simu-total');
  var sFrac = document.getElementById('simu-fractionnement');
  var sCaut = document.getElementById('simu-cautions');

  function euros(n) {
    return (Math.round(n * 100) / 100).toFixed(2).replace('.00', '').replace('.', ',') + ' €';
  }

  function rendre() {
    var r = calculerInscription(profil.value, cours.value, {
      badgeCouvert: badge.checked,
      cleExterieur: cle.checked
    });

    sLignes.innerHTML = r.lignes.map(function (l) {
      return '<li><span>' + l.libelle + '</span><span>' + euros(l.prix) + '</span></li>';
    }).join('');

    sTotal.textContent = euros(r.total);

    // « par mois » affirmerait une mensualisation que le club n'annonce
    // nulle part : il propose 1, 3 ou 4 fois, sans préciser l'échéancier.
    // « environ » parce que la dernière échéance absorbe les centimes.
    sFrac.textContent = 'Soit environ ' + euros(echeances(r.total, 3)[0])
      + ' en 3 fois, ou ' + euros(echeances(r.total, 4)[0]) + ' en 4 fois.';

    if (r.cautions.length) {
      sCaut.hidden = false;
      sCaut.innerHTML = '<b>+ ' + euros(r.totalCautions) + ' de caution</b> ('
        + r.cautions.map(function (c) { return c.libelle.toLowerCase(); }).join(', ')
        + ') — restituée au retour, ce n\'est pas une dépense.';
    } else {
      sCaut.hidden = true;
    }
  }

  [profil, cours, badge, cle].forEach(function (el) {
    el.addEventListener('change', rendre);
  });
  rendre();
})();
