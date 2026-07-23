/* Envoi du formulaire de demande d'inscription.
 *
 * Le site est statique : il n'a pas de serveur à lui. Le formulaire est donc
 * transmis à MyTCI (l'application du club), qui le relaie par e-mail au bureau.
 * Rien n'est stocké sur ce site.
 *
 * On envoie par fetch() plutôt que par soumission classique : le visiteur
 * reste sur la page et voit la confirmation sur place. Si JavaScript est
 * absent, le formulaire ne part pas — un texte de repli affiche l'adresse et
 * le numéro du club, toujours visibles.
 */
(function () {
  var API = 'https://app.tennisclubissois.fr/api/site/contact';
  var form = document.getElementById('form-demande');
  if (!form) return;

  var retour  = document.getElementById('f-retour');
  var bouton  = document.getElementById('f-envoyer');

  function dire(msg, ok) {
    retour.textContent = msg;
    retour.className = 'form-retour ' + (ok ? 'ok' : 'ko');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Contrôles minimaux côté navigateur — le serveur revérifie tout.
    var nom     = form.nom.value.trim();
    var email   = form.email.value.trim();
    var consent = form.consent.checked;
    if (!nom)     { dire('Merci d’indiquer votre nom.', false); form.nom.focus(); return; }
    if (!email || email.indexOf('@') < 1) { dire('Merci d’indiquer un e-mail valide.', false); form.email.focus(); return; }
    if (!consent) { dire('Merci de cocher la case d’accord.', false); form.consent.focus(); return; }

    var donnees = {
      profil:  form.profil.value,
      nom:     nom,
      email:   email,
      tel:     form.tel.value.trim(),
      message: form.message.value.trim(),
      consent: true,
      site:    form.site.value   // piège à robots : le serveur rejette si rempli
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
          dire('Merci ! Votre demande a été transmise au club. Vous serez recontacté.', true);
        } else {
          dire((j && j.error) || 'L’envoi a échoué. Écrivez-nous directement par e-mail.', false);
          bouton.disabled = false;
        }
      })
      .catch(function () {
        dire('Connexion impossible. Écrivez-nous directement par e-mail ou par téléphone.', false);
        bouton.disabled = false;
      });
  });
})();
