/* Fiche d'inscription en ligne.
 *
 * Le site est statique : la fiche remplie est transmise à MyTCI (l'application
 * du club) par fetch(), en JSON. MyTCI la stocke pour traitement par le bureau
 * (écran « Inscriptions à traiter »). Rien n'est conservé sur ce site.
 *
 * Trois responsabilités ici :
 *   1. le pad de signature (souris + tactile) ;
 *   2. les petites logiques d'affichage (champ « classement » conditionnel) ;
 *   3. la validation minimale + l'envoi (le serveur revérifie tout).
 *
 * Le total est calculé par calculerInscription() (tarifs.js) — la même
 * fonction que le simulateur affiché juste au-dessus.
 */
(function () {
  var form = document.getElementById('form-inscription');
  if (!form) return;

  var retour = document.getElementById('i-retour');
  var bouton = document.getElementById('i-envoyer');
  var API = 'https://app.tennisclubissois.fr/api/site/inscription';

  function dire(msg, ok) {
    retour.textContent = msg;
    retour.className = 'form-retour ' + (ok ? 'ok' : 'ko');
  }

  /* ── Date du jour par défaut dans le champ de signature ───────── */
  var champDate = document.getElementById('i-datesign');
  if (champDate && !champDate.value) {
    var t = new Date();
    champDate.value = t.getFullYear() + '-'
      + String(t.getMonth() + 1).padStart(2, '0') + '-'
      + String(t.getDate()).padStart(2, '0');
  }

  /* ── Champ « classement » révélé seulement si « Classé » ──────── */
  var champClassement = document.getElementById('i-classement-champ');
  form.querySelectorAll('input[name="niveau"]').forEach(function (r) {
    r.addEventListener('change', function () {
      var classe = form.querySelector('input[name="niveau"]:checked');
      champClassement.hidden = !(classe && classe.value === 'Classé');
    });
  });

  /* ── Pad de signature ─────────────────────────────────────────
     Coordonnées ramenées dans l'espace du canvas (600×200) même si le CSS
     l'affiche plus petit, via le rapport taille réelle / taille affichée. */
  var canvas = document.getElementById('i-signature');
  var ctx = canvas.getContext('2d');
  var dessine = false, aSigne = false, dernier = null;

  function fond() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  function styleTrait() {
    ctx.strokeStyle = '#12305f';
    ctx.lineWidth = 2.2;
    ctx.lineJoin = ctx.lineCap = 'round';
  }
  fond(); styleTrait();

  function point(e) {
    var r = canvas.getBoundingClientRect();
    var src = (e.touches && e.touches[0]) ? e.touches[0] : e;
    return {
      x: (src.clientX - r.left) * (canvas.width / r.width),
      y: (src.clientY - r.top) * (canvas.height / r.height)
    };
  }
  function debut(e) { e.preventDefault(); dessine = true; dernier = point(e); }
  function trace(e) {
    if (!dessine) return;
    e.preventDefault();
    var p = point(e);
    ctx.beginPath(); ctx.moveTo(dernier.x, dernier.y); ctx.lineTo(p.x, p.y); ctx.stroke();
    dernier = p; aSigne = true;
  }
  function fin() { dessine = false; }

  canvas.addEventListener('mousedown', debut);
  canvas.addEventListener('mousemove', trace);
  window.addEventListener('mouseup', fin);
  canvas.addEventListener('touchstart', debut, { passive: false });
  canvas.addEventListener('touchmove', trace, { passive: false });
  canvas.addEventListener('touchend', fin);

  document.getElementById('i-signature-effacer').addEventListener('click', function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fond(); styleTrait();
    aSigne = false;
  });

  /* ── Envoi ────────────────────────────────────────────────────── */
  function coche(nom) {
    var el = form.querySelector('input[name="' + nom + '"]:checked');
    return el ? el.value : '';
  }
  function cochesMultiples(nom) {
    return Array.prototype.map.call(
      form.querySelectorAll('input[name="' + nom + '"]:checked'),
      function (el) { return el.value; }
    );
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var nom     = form.nom.value.trim();
    var prenom  = form.prenom.value.trim();
    var email   = form.email.value.trim();
    if (!nom)    { dire('Merci d’indiquer le nom.', false);    form.nom.focus();    return; }
    if (!prenom) { dire('Merci d’indiquer le prénom.', false); form.prenom.focus(); return; }
    if (!form.naissance.value) { dire('Merci d’indiquer la date de naissance.', false); form.naissance.focus(); return; }
    if (!coche('sexe'))        { dire('Merci d’indiquer le sexe.', false); return; }
    if (!form.tel1.value.trim()) { dire('Merci d’indiquer un téléphone.', false); form.tel1.focus(); return; }
    if (!email || email.indexOf('@') < 1) { dire('Merci d’indiquer un e-mail valide.', false); form.email.focus(); return; }
    if (!form.adresse.value.trim()) { dire('Merci d’indiquer l’adresse.', false); form.adresse.focus(); return; }
    if (!form.signataire.value.trim()) { dire('Merci d’indiquer le nom du signataire.', false); form.signataire.focus(); return; }
    if (!aSigne) { dire('Merci de signer dans le cadre prévu.', false); canvas.scrollIntoView({ block: 'center' }); return; }
    if (!form.consent.checked) { dire('Merci de cocher la case d’accord.', false); form.consent.focus(); return; }

    // Total : même calcul que le simulateur affiché.
    var total = 0;
    try {
      total = calculerInscription(form.profil.value, form.cours.value, {
        badgeCouvert: form.badge.checked, cleExterieur: form.cle.checked
      }).total;
    } catch (err) { total = 0; }

    var donnees = {
      site:    form.site.value,           // piège à robots
      consent: true,
      nom: nom, prenom: prenom,
      naissance: form.naissance.value,
      sexe: coche('sexe'),
      tel1: form.tel1.value.trim(),
      tel2: form.tel2.value.trim(),
      email: email,
      adresse: form.adresse.value.trim(),
      profil: form.profil.value,
      cours: form.cours.value,
      badge: form.badge.checked,
      cle: form.cle.checked,
      creneauJours: form.creneauJours.value.trim(),
      creneauHeure: form.creneauHeure.value.trim(),
      niveau: coche('niveau'),
      classement: form.classement.value.trim(),
      paiementFois: coche('paiementFois'),
      paiementModes: cochesMultiples('paiementModes'),
      imageCaptation: coche('imageCaptation'),
      imageDiffusion: coche('imageDiffusion'),
      commentaires: form.commentaires.value.trim(),
      total: total,
      signataire: form.signataire.value.trim(),
      dateSignature: form.dateSignature.value,
      signature: canvas.toDataURL('image/png')
    };

    bouton.disabled = true;
    dire('Envoi en cours…', true);

    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donnees)
    })
      .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
      .then(function (j) {
        if (j && j.ok) {
          form.reset();
          ctx.clearRect(0, 0, canvas.width, canvas.height); fond(); styleTrait(); aSigne = false;
          champClassement.hidden = true;
          dire('Merci ! Votre fiche d’inscription a bien été transmise au club. '
             + 'Le bureau vous recontacte.', true);
        } else {
          dire((j && j.error) || 'L’envoi a échoué. Vous pouvez déposer la fiche papier ou nous écrire.', false);
          bouton.disabled = false;
        }
      })
      .catch(function () {
        dire('Connexion impossible. Vous pouvez déposer la fiche papier ou nous écrire par e-mail.', false);
        bouton.disabled = false;
      });
  });
})();
