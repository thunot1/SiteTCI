/* Visionneuse (lightbox) des albums de la galerie.
 *
 * Chaque album ayant des photos porte un bouton .album-ouvrir avec l'attribut
 * data-photos (identifiants séparés par des espaces) et data-titre. Au clic, on
 * ouvre une visionneuse plein écran ; la première photo est la couverture.
 * Les fichiers sont dans img/galerie/<id>.jpg. Servi depuis le même domaine :
 * autorisé par la politique de sécurité du site.
 */
(function () {
  var ouvrables = Array.prototype.slice.call(document.querySelectorAll('.album-ouvrir'));
  if (!ouvrables.length) return;

  // Visionneuse construite une seule fois, ajoutée en fin de page.
  var lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.hidden = true;
  lb.innerHTML =
    '<button class="lightbox-fermer" type="button" aria-label="Fermer">×</button>' +
    '<div class="lightbox-scene">' +
      '<button class="lightbox-btn lightbox-prev" type="button" aria-label="Photo précédente">‹</button>' +
      '<img class="lightbox-img" alt="">' +
      '<button class="lightbox-btn lightbox-next" type="button" aria-label="Photo suivante">›</button>' +
      '<p class="lightbox-legende"></p>' +
      '<p class="lightbox-compteur"></p>' +
    '</div>';
  document.body.appendChild(lb);

  var img      = lb.querySelector('.lightbox-img');
  var legende  = lb.querySelector('.lightbox-legende');
  var compteur = lb.querySelector('.lightbox-compteur');
  var btnPrev  = lb.querySelector('.lightbox-prev');
  var btnNext  = lb.querySelector('.lightbox-next');
  var btnClose = lb.querySelector('.lightbox-fermer');

  var photos = [], index = 0, titre = '', declencheur = null;

  function chemin(id) { return 'img/galerie/' + id + '.jpg'; }

  function montrer() {
    img.src = chemin(photos[index]);
    img.alt = titre + ' — photo ' + (index + 1);
    legende.textContent = titre;
    var multi = photos.length > 1;
    compteur.textContent = multi ? (index + 1) + ' / ' + photos.length : '';
    btnPrev.style.display = multi ? '' : 'none';
    btnNext.style.display = multi ? '' : 'none';
  }
  function ouvrir(a) {
    var data = (a.getAttribute('data-photos') || '').split(/\s+/).filter(Boolean);
    if (!data.length) return;
    photos = data; index = 0;
    titre = a.getAttribute('data-titre') || '';
    declencheur = a;
    montrer();
    lb.hidden = false;
    lb.classList.add('ouvert');
    document.body.style.overflow = 'hidden';
    btnClose.focus();
  }
  function fermer() {
    lb.classList.remove('ouvert');
    lb.hidden = true;
    img.src = '';
    document.body.style.overflow = '';
    if (declencheur) declencheur.focus();
  }
  function bouger(d) {
    if (photos.length < 2) return;
    index = (index + d + photos.length) % photos.length;
    montrer();
  }

  ouvrables.forEach(function (a) {
    a.addEventListener('click', function () { ouvrir(a); });
  });
  btnPrev.addEventListener('click', function () { bouger(-1); });
  btnNext.addEventListener('click', function () { bouger(1); });
  btnClose.addEventListener('click', fermer);
  lb.addEventListener('click', function (e) { if (e.target === lb) fermer(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') fermer();
    else if (e.key === 'ArrowLeft') bouger(-1);
    else if (e.key === 'ArrowRight') bouger(1);
  });
})();
