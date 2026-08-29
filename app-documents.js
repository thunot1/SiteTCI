// MODULE DOCUMENTS — modèles HTML avec champs de fusion
// ═══════════════════════════════════════════════════════════════

var DOC_FIELDS = [
  // Identité
  {key:'prenom',        label:'Prénom',             cat:'Adhérent'},
  {key:'nom',           label:'Nom',                cat:'Adhérent'},
  {key:'nom_maj',       label:'Nom en majuscules',  cat:'Adhérent'},
  {key:'prenom_nom',    label:'Prénom + Nom',        cat:'Adhérent'},
  {key:'sexe',          label:'Sexe (M/F)',          cat:'Adhérent'},
  {key:'civilite',      label:'Civilité (M. / Mme)',cat:'Adhérent'},
  {key:'age',           label:'Âge',                cat:'Adhérent'},
  {key:'ddn',           label:'Date de naissance',  cat:'Adhérent'},
  {key:'catage',        label:'Catégorie d\'âge',   cat:'Adhérent'},
  {key:'parent',        label:'Parent / Tuteur',    cat:'Adhérent'},
  {key:'urgence',       label:'Contact urgence',    cat:'Adhérent'},
  {key:'commentaire',   label:'Commentaire',        cat:'Adhérent'},
  // Contact
  {key:'email',         label:'Email',              cat:'Contact'},
  {key:'tel',           label:'Téléphone',          cat:'Contact'},
  {key:'adresse',       label:'Adresse complète',   cat:'Contact'},
  {key:'adresse_voie',  label:'Voie',               cat:'Contact'},
  {key:'adresse_cp',    label:'Code postal',        cat:'Contact'},
  {key:'adresse_ville', label:'Ville',              cat:'Contact'},
  // Inscription
  {key:'saison',        label:'Saison',             cat:'Inscription'},
  {key:'formule',       label:'Formule',            cat:'Inscription'},
  {key:'pratique',      label:'Type de pratique',   cat:'Inscription'},
  {key:'niveau',        label:'Niveau',             cat:'Inscription'},
  {key:'classement',    label:'Classement FFT',     cat:'Inscription'},
  {key:'groupe',        label:'Groupe',             cat:'Inscription'},
  {key:'typecours',     label:'Cours',              cat:'Inscription'},
  {key:'enseignant',    label:'Enseignant',         cat:'Inscription'},
  // Variables « liste » : un adhérent peut être inscrit à plusieurs cours.
  // Elles se substituent par une liste HTML (<ul>) de tous ses cours/groupes.
  {key:'cours_liste',   label:'Liste des cours (détail)', cat:'Inscription'},
  {key:'groupes_liste', label:'Liste des groupes',        cat:'Inscription'},
  {key:'licence',       label:'N° Licence FFT',     cat:'Inscription'},
  {key:'fft',           label:'N° FFT',             cat:'Inscription'},
  {key:'dateinscrit',   label:'Date d\'inscription',cat:'Inscription'},
  {key:'dossier',       label:'Statut dossier',     cat:'Inscription'},
  {key:'certif',        label:'Certificat médical', cat:'Inscription'},
  // Paiement
  {key:'montant',       label:'Montant total',      cat:'Paiement'},
  {key:'verse',         label:'Montant versé',      cat:'Paiement'},
  {key:'reste',         label:'Reste à payer',      cat:'Paiement'},
  {key:'statpay',       label:'Statut paiement',    cat:'Paiement'},
  {key:'modepay',       label:'Mode de paiement',   cat:'Paiement'},
  // Club
  {key:'club',          label:'Nom du club',        cat:'Club'},
  {key:'adresse_club',  label:'Adresse club',       cat:'Club'},
  {key:'email_club',    label:'Email club',         cat:'Club'},
  {key:'tel_club',      label:'Tél club',           cat:'Club'},
  // Date
  {key:'date_du_jour',  label:'Date du jour',       cat:'Date'},
  {key:'mois',          label:'Mois courant',       cat:'Date'},
  {key:'annee',         label:'Année courante',     cat:'Date'},
  // Championnat
  {key:'champ_nom',         label:'Nom du championnat',     cat:'Championnat'},
  {key:'champ_saison',      label:'Saison championnat',     cat:'Championnat'},
  {key:'champ_date_debut',  label:'Date début',             cat:'Championnat'},
  {key:'champ_date_fin',    label:'Date fin',               cat:'Championnat'},
  {key:'champ_nb_equipes',  label:'Nombre d\'équipes',      cat:'Championnat'},
  // Équipe
  {key:'equipe_nom',        label:'Nom de l\'équipe',       cat:'Équipe'},
  {key:'equipe_division',   label:'Division',               cat:'Équipe'},
  {key:'equipe_poule',      label:'Poule',                  cat:'Équipe'},
  {key:'equipe_sexe',       label:'Catégorie sexe',         cat:'Équipe'},
  {key:'equipe_nb_joueurs', label:'Nombre de joueurs',      cat:'Équipe'},
  {key:'equipe_victoires',  label:'Victoires',              cat:'Équipe'},
  {key:'equipe_defaites',   label:'Défaites',               cat:'Équipe'},
  {key:'equipe_nuls',       label:'Nuls',                   cat:'Équipe'},
  {key:'equipe_liste_joueurs', label:'Liste des joueurs',   cat:'Équipe'},
  // Rencontre
  {key:'rencontre_adversaire', label:'Adversaire',          cat:'Rencontre'},
  {key:'rencontre_date',       label:'Date de la rencontre',cat:'Rencontre'},
  {key:'rencontre_lieu',       label:'Lieu',                cat:'Rencontre'},
  {key:'rencontre_domicile',   label:'Domicile / Extérieur',cat:'Rencontre'},
  {key:'rencontre_score',      label:'Score',               cat:'Rencontre'},
  {key:'rencontre_resultat',   label:'Résultat (V/D/N)',    cat:'Rencontre'},
  // Journée de championnat — champs globaux
  {key:'journee_numero',           label:'Numéro de journée',          cat:'Journée'},
  {key:'journee_weekend',          label:'Week-end',                   cat:'Journée'},
  {key:'journee_nb_rencontres',    label:'Nombre de rencontres',       cat:'Journée'},
  {key:'journee_tableau_html',     label:'Tableau résumé (HTML auto)', cat:'Journée'},
  {key:'journee_liste_texte',      label:'Liste texte des rencontres', cat:'Journée'},
  // Journée — champs par rencontre (à utiliser dans {{#EACH rencontres_journee}}...{{/EACH}})
  {key:'equipe_nom',               label:'[Boucle] Nom équipe',        cat:'Journée — par rencontre'},
  {key:'equipe_division',          label:'[Boucle] Division',          cat:'Journée — par rencontre'},
  {key:'equipe_poule',             label:'[Boucle] Poule',             cat:'Journée — par rencontre'},
  {key:'equipe_sexe',              label:'[Boucle] Catégorie sexe',    cat:'Journée — par rencontre'},
  {key:'equipe_nb_joueurs',        label:'[Boucle] Nb joueurs',        cat:'Journée — par rencontre'},
  {key:'equipe_liste_joueurs',     label:'[Boucle] Liste joueurs',     cat:'Journée — par rencontre'},
  {key:'rencontre_journee',        label:'[Boucle] N° journée',        cat:'Journée — par rencontre'},
  {key:'rencontre_weekend',        label:'[Boucle] Week-end',          cat:'Journée — par rencontre'},
  {key:'rencontre_date',           label:'[Boucle] Date',              cat:'Journée — par rencontre'},
  {key:'rencontre_adversaire',     label:'[Boucle] Adversaire',        cat:'Journée — par rencontre'},
  {key:'rencontre_lieu',           label:'[Boucle] Lieu',              cat:'Journée — par rencontre'},
  {key:'rencontre_domicile',       label:'[Boucle] Domicile/Extérieur',cat:'Journée — par rencontre'},
  {key:'rencontre_score',          label:'[Boucle] Score',             cat:'Journée — par rencontre'},
  {key:'rencontre_resultat',       label:'[Boucle] Résultat (V/D/N)',  cat:'Journée — par rencontre'},
];

var MOCK_ADHERENT = {
  prenom:'Jean',nom:'DUPONT',nom_maj:'DUPONT',prenom_nom:'Jean DUPONT',
  sexe:'M',civilite:'M.',age:32,ddn:'01/03/1992',catage:'Senior',
  email:'jean.dupont@email.fr',tel:'06 12 34 56 78',
  adresse_voie:'12 rue des Acacias',adresse_cp:'91100',adresse_ville:'Corbeil-Essonnes',
  adresse:'12 rue des Acacias, 91100 Corbeil-Essonnes',
  saison:'2024-2025',formule:'Adulte loisir + Cours',pratique:'Loisir',
  niveau:'4ème série',classement:'15/1',groupe:'Adultes mer.',typecours:'Collectif adulte',
  enseignant:'Thomas',licence:'123456',fft:'987654',
  dateinscrit:'15/09/2024',dossier:'Complet',certif:'Oui',
  parent:'',urgence:'Marie Dupont — 06 11 22 33 44',commentaire:'',
  montant:'350,00 €',verse:'175,00 €',reste:'175,00 €',statpay:'Partiel',modepay:'Chèque'
};

// Résout tous les cours auxquels l'adhérent est inscrit (plusieurs possibles).
// Se rabat sur l'ancien champ `typecours` si `cours_inscrits` est absent.
function _mmCoursResolus(a) {
  if (!a) return [];
  var jours = ['','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];
  var entries = (Array.isArray(a.cours_inscrits) && a.cours_inscrits.length)
    ? a.cours_inscrits
    : (a.typecours ? [{coursId:a.typecours, attente:!!a.attenteCours}] : []);
  var res = [];
  entries.forEach(function(e){
    var c = (db.cours||[]).find(function(x){return x.id===e.coursId;});
    if (!c) return;
    res.push({
      nom: c.nom||'',
      jour: jours[c.jour]||'',
      heure: c.heure||'',
      moniteur: (typeof _moniteurLabel==='function') ? _moniteurLabel(c.moniteur_id) : '',
      attente: !!e.attente
    });
  });
  return res;
}
// Enveloppe une série d'éléments (déjà en HTML) dans une liste à puces.
function _mmListeHtml(items) {
  if (!items || !items.length) return '<em>Aucun cours</em>';
  return '<ul style="margin:6px 0;padding-left:22px">'
    + items.map(function(s){return '<li>'+s+'</li>';}).join('')
    + '</ul>';
}

function docGetFusionData(adherentId) {
  var a = adherentId ? db.adherents.find(function(x){return x.id===adherentId;}) : null;
  var params = db.params || {};
  var d = new Date();
  var moisNoms = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  var base = a ? {
    prenom: a.prenom||'',
    nom: a.nom||'',
    nom_maj: (a.nom||'').toUpperCase(),
    prenom_nom: (a.prenom||'')+' '+(a.nom||''),
    sexe: a.sexe||'',
    civilite: a.sexe==='F'?'Mme':a.sexe==='M'?'M.':'',
    age: calcAge(a.ddn)||'',
    ddn: a.ddn ? new Date(a.ddn).toLocaleDateString('fr-FR') : '',
    catage: a.catage||'',
    email: a.email||'',
    tel: a.tel||'',
    adresse_voie: a.adresse_voie||a.adresse||'',
    adresse_cp: a.adresse_cp||'',
    adresse_ville: a.adresse_ville||'',
    adresse: [(a.adresse_voie||a.adresse||''),(a.adresse_cp||'')+' '+(a.adresse_ville||'')].filter(Boolean).join(', '),
    parent: a.parent||'',
    urgence: a.urgence||'',
    commentaire: a.commentaire||'',
    saison: a.saison||'',
    formule: a.formule_label||'',
    pratique: a.pratique||'',
    niveau: a.niveau||'',
    classement: a.classement||'',
    groupe: a.groupe||'',
    typecours: a.typecours||'',
    enseignant: a.enseignant||'',
    licence: a.licence||'',
    fft: a.fft||'',
    dateinscrit: a.dateinscrit ? new Date(a.dateinscrit).toLocaleDateString('fr-FR') : (a.dateinscrit||''),
    dossier: a.dossier||'',
    certif: a.certif||'',
    montant: (parseFloat(a.montant)||0).toFixed(2)+' €',
    verse: (parseFloat(a.verse)||0).toFixed(2)+' €',
    reste: (Math.max(0,(parseFloat(a.montant)||0)-(parseFloat(a.verse)||0))).toFixed(2)+' €',
    statpay: a.statpay||'',
    modepay: a.modepay||''
  } : MOCK_ADHERENT;
  base.club = params.club || 'Tennis Club';
  base.adresse_club = params.adresse || '';
  base.email_club = params.email || '';
  base.tel_club = params.tel || '';
  base.date_du_jour = d.toLocaleDateString('fr-FR');
  base.mois = moisNoms[d.getMonth()];
  base.annee = String(d.getFullYear());

  // ── Variables « liste » cours / groupes (plusieurs cours possibles) ──
  if (a) {
    var coursRes = _mmCoursResolus(a);
    base.cours_liste = _mmListeHtml(coursRes.map(function(c){
      var sched = [c.jour, c.heure].filter(Boolean).join(' ');
      var right = [sched, c.moniteur].filter(Boolean).join(' · ');
      var txt = escHtml(c.nom);
      if (right) txt += ' — ' + escHtml(right);
      if (c.attente) txt += ' <em>(liste d\'attente)</em>';
      return txt;
    }));
    base.groupes_liste = _mmListeHtml(
      coursRes.map(function(c){return c.nom;})
        .filter(function(v,i,arr){return v && arr.indexOf(v)===i;})
        .map(function(n){return escHtml(n);})
    );
  } else {
    // Aperçu / fiche de démonstration.
    base.cours_liste = '<ul style="margin:6px 0;padding-left:22px">'
      + '<li>Collectif adulte — Mercredi 18:00 · Thomas</li>'
      + '<li>Cardio tennis — Samedi 10:00 · Julie</li></ul>';
    base.groupes_liste = '<ul style="margin:6px 0;padding-left:22px">'
      + '<li>Collectif adulte</li><li>Cardio tennis</li></ul>';
  }

  // ── Données Championnat (dernier sélectionné ou premier disponible) ──
  var champSel = window._docChampId
    ? (db.championnats||[]).find(function(c){return c.id===window._docChampId;})
    : ((db.championnats||[])[0] || null);
  if(champSel) {
    base.champ_nom        = champSel.nom || '';
    base.champ_saison     = champSel.saison || '';
    base.champ_date_debut = champSel.dateDebut ? new Date(champSel.dateDebut).toLocaleDateString('fr-FR') : '';
    base.champ_date_fin   = champSel.dateFin   ? new Date(champSel.dateFin).toLocaleDateString('fr-FR')   : '';
    base.champ_nb_equipes = String((champSel.equipes||[]).length);

    // Équipe sélectionnée
    var equSel = window._docEquipeId
      ? (champSel.equipes||[]).find(function(e){return e.id===window._docEquipeId;})
      : ((champSel.equipes||[])[0] || null);
    if(equSel) {
      var rens = equSel.rencontres || [];
      var victoires = rens.filter(function(r){
        if(!r.score) return false;
        var p=r.score.split('-').map(Number);
        return p.length===2&&p[0]>p[1];
      }).length;
      var defaites = rens.filter(function(r){
        if(!r.score) return false;
        var p=r.score.split('-').map(Number);
        return p.length===2&&p[0]<p[1];
      }).length;
      var nuls = rens.filter(function(r){
        if(!r.score) return false;
        var p=r.score.split('-').map(Number);
        return p.length===2&&p[0]===p[1];
      }).length;
      // Liste des joueurs inscrits
      var joueurs = (champSel.joueursInscrits||[])
        .filter(function(j){return j.equipeId===equSel.id || !j.equipeId;})
        .map(function(j){
          var adh=db.adherents.find(function(x){return x.id===j.adherentId;});
          return adh ? (adh.prenom+' '+adh.nom+(j.capitaine?' (cap.)':'')) : '';
        }).filter(Boolean).join(', ');
      base.equipe_nom         = equSel.nom || '';
      base.equipe_division    = equSel.division || '';
      base.equipe_poule       = equSel.poule || '';
      base.equipe_sexe        = equSel.sexe || '';
      base.equipe_nb_joueurs  = String((champSel.joueursInscrits||[]).length);
      base.equipe_victoires   = String(victoires);
      base.equipe_defaites    = String(defaites);
      base.equipe_nuls        = String(nuls);
      base.equipe_liste_joueurs = joueurs || '—';

      // Dernière rencontre
      var lastRen = rens.filter(function(r){return r.score;}).slice(-1)[0]
                 || rens.filter(function(r){return r.date;}).slice(-1)[0];
      if(lastRen) {
        base.rencontre_adversaire = lastRen.adversaire || '';
        base.rencontre_date       = lastRen.date ? new Date(lastRen.date).toLocaleDateString('fr-FR') : '';
        base.rencontre_lieu       = lastRen.lieu || '';
        base.rencontre_domicile   = lastRen.domicile ? 'Domicile' : 'Extérieur';
        base.rencontre_score      = lastRen.score || '—';
        var sp = (lastRen.score||'').split('-').map(Number);
        base.rencontre_resultat   = (sp.length===2) ? (sp[0]>sp[1]?'Victoire':sp[0]<sp[1]?'Défaite':'Nul') : '—';
      } else {
        base.rencontre_adversaire='—';base.rencontre_date='—';base.rencontre_lieu='—';
        base.rencontre_domicile='—';base.rencontre_score='—';base.rencontre_resultat='—';
      }
    } else {
      ['equipe_nom','equipe_division','equipe_poule','equipe_sexe','equipe_nb_joueurs',
       'equipe_victoires','equipe_defaites','equipe_nuls','equipe_liste_joueurs',
       'rencontre_adversaire','rencontre_date','rencontre_lieu','rencontre_domicile',
       'rencontre_score','rencontre_resultat'].forEach(function(k){base[k]='—';});
    }
  } else {
    ['champ_nom','champ_saison','champ_date_debut','champ_date_fin','champ_nb_equipes',
     'equipe_nom','equipe_division','equipe_poule','equipe_sexe','equipe_nb_joueurs',
     'equipe_victoires','equipe_defaites','equipe_nuls','equipe_liste_joueurs',
     'rencontre_adversaire','rencontre_date','rencontre_lieu','rencontre_domicile',
     'rencontre_score','rencontre_resultat'].forEach(function(k){base[k]='—';});
  }

  // ── Données Journée de championnat ──────────────────────────────────
  if(champSel && window._docJournee) {
    var journeeNum = window._docJournee;
    // Collecter toutes les rencontres de la journée, toutes équipes confondues
    var toutesRencontres = [];
    (champSel.equipes||[]).forEach(function(eq){
      (eq.rencontres||[]).filter(function(r){ return r.journee == journeeNum; })
        .forEach(function(r){ toutesRencontres.push({equipe: eq, rencontre: r}); });
    });
    // Tri : 1) Femmes avant Hommes  2) N° d'équipe croissant  3) Nom alphabétique
    function _equipeNumero(nom) {
      // Extrait le premier nombre trouvé dans le nom (ex: "Équipe II" → 2, "Équipe 3" → 3)
      // Supporte chiffres arabes ET romains
      var romains = {I:1,II:2,III:3,IV:4,V:5,VI:6,VII:7,VIII:8,IX:9,X:10};
      var mArab = (nom||'').match(/\b(\d+)\b/);
      if (mArab) return parseInt(mArab[1]);
      for (var r in romains) {
        if ((nom||'').toUpperCase().match(new RegExp('\\b'+r+'\\b'))) return romains[r];
      }
      return 999; // pas de numéro trouvé → en dernier
    }
    toutesRencontres.sort(function(a,b){
      // 1. Femmes avant Hommes (puis Mixte)
      var sexeOrder = function(s){ s = (s||'').toLowerCase(); return s.includes('femme') ? 0 : s.includes('homme') ? 1 : 2; };
      var sa = sexeOrder(a.equipe.sexe), sb = sexeOrder(b.equipe.sexe);
      if (sa !== sb) return sa - sb;
      // 2. Numéro d'équipe croissant
      var na = _equipeNumero(a.equipe.nom), nb = _equipeNumero(b.equipe.nom);
      if (na !== nb) return na - nb;
      // 3. Nom alphabétique en dernier recours
      return (a.equipe.nom||'').localeCompare(b.equipe.nom||'');
    });
    var weekendVal = toutesRencontres.length ? (toutesRencontres[0].rencontre.weekend||'') : '';
    base.journee_numero        = String(journeeNum);
    base.journee_weekend       = weekendVal;
    base.journee_nb_rencontres = String(toutesRencontres.length);

    // ── Collection pour la boucle {{#EACH rencontres_journee}}...{{/EACH}} ──
    base.rencontres_journee = toutesRencontres.map(function(item) {
      var r = item.rencontre, eq = item.equipe;
      var dateStr = r.date ? new Date(r.date).toLocaleDateString('fr-FR') : '—';
      var scoreVal = r.score || '—';
      var resultat = '—';
      var scoreStyle = '';
      if(r.score) {
        var sp = r.score.split('-').map(Number);
        if(sp.length === 2) {
          resultat   = sp[0]>sp[1] ? 'Victoire' : sp[0]<sp[1] ? 'Défaite' : 'Nul';
          scoreStyle = sp[0]>sp[1] ? 'color:#16A34A;font-weight:bold'
                     : sp[0]<sp[1] ? 'color:#DC2626;font-weight:bold'
                     : 'color:#D97706;font-weight:bold';
        }
      }
      // Joueurs de l'équipe pour cette journée
      var joueurs = (eq.joueurs||[]).map(function(j){
        var adh = db.adherents.find(function(x){return x.id===j.adherentId;});
        return adh ? (adh.prenom+' '+adh.nom+(j.capitaine?' (cap.)':'')) : '';
      }).filter(Boolean).join(', ');
      return {
        // Équipe
        equipe_nom:          eq.nom || '—',
        equipe_division:     eq.division || '—',
        equipe_poule:        eq.poule || '—',
        equipe_sexe:         eq.sexe || '—',
        equipe_nb_joueurs:   String((eq.joueurs||[]).length),
        equipe_liste_joueurs: joueurs || '—',
        // Rencontre
        rencontre_journee:   String(r.journee || journeeNum),
        rencontre_weekend:   r.weekend || weekendVal || '—',
        rencontre_date:      dateStr,
        rencontre_adversaire: r.adversaire || '—',
        rencontre_lieu:      r.lieu || '—',
        rencontre_domicile:  r.domicile ? 'Domicile' : 'Extérieur',
        rencontre_score:     scoreVal,
        rencontre_resultat:  resultat,
        rencontre_score_style: scoreStyle,
        // Championnat (rappel contextuel)
        champ_nom:    champSel.nom || '—',
        champ_saison: champSel.saison || '—',
      };
    });

    // Tableau HTML résumé (conservé pour compatibilité)
    if(toutesRencontres.length) {
      var rows = base.rencontres_journee.map(function(item){
        return '<tr style="border-bottom:1px solid #eee">'
          +'<td style="padding:8px 10px;font-weight:600">'+escHtml(item.equipe_nom)+'</td>'
          +'<td style="padding:8px 10px;font-size:12px;color:#666">'+escHtml(item.equipe_division)+(item.equipe_poule&&item.equipe_poule!='—'?' — Poule '+escHtml(item.equipe_poule):'')+'</td>'
          +'<td style="padding:8px 10px">'+escHtml(item.rencontre_adversaire)+'</td>'
          +'<td style="padding:8px 10px;font-size:12px">'+escHtml(item.rencontre_date)+'</td>'
          +'<td style="padding:8px 10px;font-size:12px">'+escHtml(item.rencontre_lieu)+'</td>'
          +'<td style="padding:8px 10px;font-size:12px;color:#666">'+escHtml(item.rencontre_domicile.substring(0,3)+'.')+'</td>'
          +'<td style="padding:8px 10px;text-align:center;'+item.rencontre_score_style+'">'+escHtml(item.rencontre_score)+'</td>'
          +'</tr>';
      }).join('');
      base.journee_tableau_html =
        '<table style="width:100%;border-collapse:collapse;font-size:13px;font-family:Arial,sans-serif">'
        +'<thead><tr style="background:#f5f5f5;border-bottom:2px solid #ddd">'
        +'<th style="padding:8px 10px;text-align:left">Équipe</th>'
        +'<th style="padding:8px 10px;text-align:left">Division</th>'
        +'<th style="padding:8px 10px;text-align:left">Adversaire</th>'
        +'<th style="padding:8px 10px;text-align:left">Date</th>'
        +'<th style="padding:8px 10px;text-align:left">Lieu</th>'
        +'<th style="padding:8px 10px;text-align:left">D/E</th>'
        +'<th style="padding:8px 10px;text-align:center">Score</th>'
        +'</tr></thead><tbody>'+rows+'</tbody></table>';
      base.journee_liste_texte = base.rencontres_journee.map(function(item){
        return '• '+item.equipe_nom+' vs '+item.rencontre_adversaire
          +' le '+item.rencontre_date+' à '+item.rencontre_lieu
          +' ('+item.rencontre_domicile+')'
          +(item.rencontre_score!=='—' ? ' → '+item.rencontre_score+' '+item.rencontre_resultat : '');
      }).join('\n');
    } else {
      base.journee_tableau_html = '<p style="color:#999">Aucune rencontre pour cette journée.</p>';
      base.journee_liste_texte  = 'Aucune rencontre pour cette journée.';
    }
  } else {
    base.journee_numero        = window._docJournee ? String(window._docJournee) : '—';
    base.journee_weekend       = '—';
    base.journee_nb_rencontres = '—';
    base.journee_tableau_html  = '<p style="color:#999;font-style:italic">Sélectionnez une journée dans l\'éditeur.</p>';
    base.journee_liste_texte   = '—';
    base.rencontres_journee    = [];
  }

  return base;
}

function _fuseTpl(tpl, item) {
  // Résout les conditions {{#IF clé == "val"}}...{{#ELSEIF ...}}...{{#ELSE}}...{{/IF}} dans un template
  tpl = tpl.replace(/\{\{#IF\s+(\w+)\s*==\s*"([^"]*)"\}\}([\s\S]*?)\{\{\/IF\}\}/g, function(_, key, val, body) {
    var itemVal = String(item[key] !== undefined ? item[key] : '');
    // Découper en branches IF / ELSEIF / ELSE
    var branches = [];
    var remaining = body;
    // Extraire les #ELSEIF
    var elseifRe = /^([\s\S]*?)\{\{#ELSEIF\s+(\w+)\s*==\s*"([^"]*)"\}\}/;
    var firstCond = {key: key, val: val};
    var m;
    var parts = [{condKey: key, condVal: val, content: ''}];
    // Splitter manuellement sur {{#ELSEIF et {{#ELSE}}
    var segments = body.split(/(\{\{#ELSEIF\s+\w+\s*==\s*"[^"]*"\}\}|\{\{#ELSE\}\})/);
    var currentKey = key, currentVal = val, isElse = false;
    branches = [];
    for (var i = 0; i < segments.length; i++) {
      var seg = segments[i];
      var eif = seg.match(/^\{\{#ELSEIF\s+(\w+)\s*==\s*"([^"]*)"\}\}$/);
      if (eif) { currentKey = eif[1]; currentVal = eif[2]; isElse = false; continue; }
      if (seg === '{{#ELSE}}') { currentKey = null; currentVal = null; isElse = true; continue; }
      branches.push({condKey: currentKey, condVal: currentVal, isElse: isElse, content: seg});
    }
    for (var b = 0; b < branches.length; b++) {
      var br = branches[b];
      if (br.isElse) return _fuseTpl(br.content, item);
      if (String(item[br.condKey] !== undefined ? item[br.condKey] : '') === br.condVal) return _fuseTpl(br.content, item);
    }
    return '';
  });
  // Remplacer les variables simples {{clé}}
  tpl = tpl.replace(/\{\{(\w+)\}\}/g, function(_, k) {
    return item[k] !== undefined ? item[k] : '';
  });
  return tpl;
}

function docFuse(html, data) {
  // 1. Blocs {{#EACH collection}}...{{/EACH}}
  //    Supporte à l'intérieur : {{#IF}}, {{#FIRST_IN_GROUP champ}}, {{#LAST_IN_GROUP champ}}
  html = html.replace(/\{\{#EACH\s+(\w+)\}\}([\s\S]*?)\{\{\/EACH\}\}/g, function(_, colKey, tpl) {
    var collection = data[colKey];
    if (!Array.isArray(collection) || !collection.length)
      return '<p style="color:#999;font-style:italic">Aucune rencontre pour cette journée.</p>';
    return collection.map(function(item, idx) {
      var prev = idx > 0 ? collection[idx - 1] : null;
      var next = idx < collection.length - 1 ? collection[idx + 1] : null;
      // Résoudre {{#FIRST_IN_GROUP champ}}...{{/FIRST_IN_GROUP}}
      // → affiché seulement si la valeur du champ diffère du précédent élément
      var t = tpl.replace(/\{\{#FIRST_IN_GROUP\s+(\w+)\}\}([\s\S]*?)\{\{\/FIRST_IN_GROUP\}\}/g, function(__, k, inner) {
        var curVal  = item[k] !== undefined ? item[k] : '';
        var prevVal = prev && prev[k] !== undefined ? prev[k] : '__NONE__';
        return curVal !== prevVal ? _fuseTpl(inner, item) : '';
      });
      // Résoudre {{#LAST_IN_GROUP champ}}...{{/LAST_IN_GROUP}}
      // → affiché seulement si la valeur du champ diffère du suivant élément
      t = t.replace(/\{\{#LAST_IN_GROUP\s+(\w+)\}\}([\s\S]*?)\{\{\/LAST_IN_GROUP\}\}/g, function(__, k, inner) {
        var curVal  = item[k] !== undefined ? item[k] : '';
        var nextVal = next && next[k] !== undefined ? next[k] : '__NONE__';
        return curVal !== nextVal ? _fuseTpl(inner, item) : '';
      });
      return _fuseTpl(t, item);
    }).join('');
  });
  // 2. Conditions globales {{#IF}}...{{/IF}}
  html = _fuseTpl(html, data);
  return html;
}

// ── Rendu de la liste des modèles ──────────────────────────────
function renderDocuments() {
  var el = document.getElementById('doc-list'); if(!el) return;
  var q = (document.getElementById('doc-search')||{value:''}).value.toLowerCase();
  var cat = (document.getElementById('doc-cat-filter')||{value:''}).value;
  var docs = (docDb).filter(function(d){
    return (!q || (d.name||'').toLowerCase().includes(q) || (d.desc||'').toLowerCase().includes(q))
        && (!cat || d.cat===cat);
  });
  // Aide champs
  var helpEl = document.getElementById('doc-fields-help');
  if(helpEl) {
    var cats = {}; DOC_FIELDS.forEach(function(f){cats[f.cat]=cats[f.cat]||[];cats[f.cat].push(f);});
    helpEl.innerHTML = Object.keys(cats).map(function(c){
      return '<div style="background:var(--bg);border-radius:8px;padding:10px">'
        +'<div style="font-weight:700;color:var(--gray);font-size:11px;text-transform:uppercase;margin-bottom:6px">'+c+'</div>'
        +cats[c].map(function(f){return '<div style="display:flex;justify-content:space-between;gap:8px;padding:3px 0;border-bottom:1px solid var(--bg3)">'
          +'<span style="color:#C8501A;font-family:monospace">{{'+f.key+'}}</span>'
          +'<span style="color:var(--gray)">'+f.label+'</span></div>';}).join('')
        +'</div>';
    }).join('');
  }
  if(!docs.length) {
    el.innerHTML = '<div style="text-align:center;padding:60px 20px;color:var(--gray)">'
      +'<div style="font-size:40px;margin-bottom:12px"><i class="ti ti-file-text" aria-hidden="true"></i></div>'
      +'<div style="font-weight:600;margin-bottom:6px">Aucun modèle</div>'
      +'<div style="font-size:13px">Cliquez sur "+ Nouveau modèle" pour commencer</div>'
      +'</div>';
    return;
  }
  var cats = getDocCategories();
  var CAT_COLORS = {};
  cats.forEach(function(c){ CAT_COLORS[c.libelle] = c.couleur; });
  // Mettre à jour les selects
  refreshDocCatSelects();
  el.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px">'
    +docs.map(function(doc){
      var col = CAT_COLORS[doc.cat]||'#636366';
      var updated = doc.updated ? new Date(doc.updated).toLocaleDateString('fr-FR') : '';
      return '<div style="background:var(--bg2);border-radius:10px;border:1px solid var(--bg3);overflow:hidden;border-top:3px solid '+col+';display:flex;flex-direction:column">'
        // Miniature preview
        +'<div style="height:120px;background:#f5f5f5;overflow:hidden;position:relative">'
        +'<iframe srcdoc="'+escHtml(docFuse(doc.html||'<p style=\"padding:20px;color:#888;font-family:sans-serif\">Aucun contenu</p>', MOCK_ADHERENT))+'" style="width:200%;height:200%;transform:scale(0.5);transform-origin:0 0;border:none;pointer-events:none"></iframe>'
        +'</div>'
        // Infos
        +'<div style="padding:12px 14px;flex:1">'
        +'<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px">'
        +'<div style="font-weight:700;font-size:14px;color:var(--dark)">'+escHtml(doc.name||'Sans nom')+'</div>'
        +'<span style="font-size:10px;font-weight:700;color:'+col+';white-space:nowrap;background:'+col+'18;padding:2px 7px;border-radius:99px">'+escHtml(doc.cat||'')+'</span>'
        +'</div>'
        +(doc.desc?'<div style="font-size:12px;color:var(--gray);margin-top:4px">'+escHtml(doc.desc)+'</div>':'')
        +(updated?'<div style="font-size:11px;color:var(--gray);margin-top:6px">Modifié le '+updated+'</div>':'')
        +'</div>'
        // Actions
        +'<div style="padding:10px 14px;border-top:1px solid var(--bg3);display:flex;gap:6px;justify-content:flex-end">'
        +'<button class="btn btn-sm btn-primary" onclick="openDocUse(&quot;'+doc.id+'&quot;)">Utiliser</button>'
        +'<button class="btn btn-sm btn-secondary" onclick="openDocModal(&quot;'+doc.id+'&quot;)">Modifier</button>'
        +'<button class="btn btn-sm btn-secondary" onclick="duplicateDoc(&quot;'+doc.id+'&quot;)">Dupliquer</button>'
        +'<button class="btn btn-sm btn-icon" onclick="deleteDoc(&quot;'+doc.id+'&quot;)" style="color:var(--danger)">&#x2715;</button>'
        +'</div>'
        +'</div>';
    }).join('')
    +'</div>';
}

function escHtml(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

// ── Ouvrir / Fermer le modal éditeur ──────────────────────────
var _docEditId = null;
function openDocModal(id) {
  _docEditId = id||null;
  var doc = id ? (docDb).find(function(d){return d.id===id;}) : null;
  document.getElementById('doc-modal-title').textContent = doc ? 'Modifier : '+doc.name : 'Nouveau modèle';
  document.getElementById('doc-name').value = doc ? (doc.name||'') : '';
  document.getElementById('doc-cat').value = doc ? (doc.cat||getDocCategories()[0]?.libelle||'Autre') : (getDocCategories()[0]?.libelle||'Autre');
  document.getElementById('doc-desc').value = doc ? (doc.desc||'') : '';
  document.getElementById('doc-editor').value = doc ? (doc.html||'') : docDefaultTemplate();
  // Remplir select adhérents
  var sel = document.getElementById('doc-preview-adherent');
  sel.innerHTML = '<option value="">— Valeurs fictives —</option>'
    +(db.adherents||[]).sort(function(a,b){return a.nom.localeCompare(b.nom);})
      .map(function(a){return '<option value="'+a.id+'">'+a.nom+' '+a.prenom+'</option>';}).join('');
  document.getElementById('doc-modal').style.display='block';
  docPopulateChampSelects();
  window._docJournee = null;
  var jSel = document.getElementById('doc-preview-journee');
  if(jSel) jSel.value = '';
  docUpdatePreview();
}
function closeDocModal(){document.getElementById('doc-modal').style.display='none';}

function docDefaultTemplate() {
  return '<!DOCTYPE html>\n<html lang="fr">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<style>\n  body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; }\n  .header { background: #005C34; color: white; padding: 24px; border-radius: 8px 8px 0 0; text-align: center; }\n  .header h1 { margin: 0; font-size: 22px; }\n  .content { background: #fff; border: 1px solid #ddd; border-top: none; padding: 24px; border-radius: 0 0 8px 8px; }\n  .field-row { display: flex; gap: 12px; margin-bottom: 10px; }\n  .label { font-weight: bold; color: #C8501A; min-width: 120px; font-size: 13px; }\n  .value { font-size: 13px; }\n  .footer { text-align: center; font-size: 11px; color: #999; margin-top: 16px; }\n  .badge { display: inline-block; background: #C8501A; color: white; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: bold; }\n</style>\n</head>\n<body>\n<div class="header">\n  <h1>{{club}}</h1>\n  <p style="margin:6px 0 0;opacity:0.85">Saison {{saison}}</p>\n</div>\n<div class="content">\n  <p>Bonjour <strong>{{prenom}} {{nom}}</strong>,</p>\n  <p>Nous avons le plaisir de vous accueillir pour la saison <strong>{{saison}}</strong>.</p>\n  <div class="field-row"><span class="label">Formule :</span><span class="value">{{formule}}</span></div>\n  <div class="field-row"><span class="label">Niveau :</span><span class="value">{{niveau}}</span></div>\n  <div class="field-row"><span class="label">Cours :</span><span class="value">{{typecours}}</span></div>\n  <div class="field-row"><span class="label">Cotisation :</span><span class="value"><strong>{{montant}}</strong></span></div>\n  <div class="field-row"><span class="label">Statut :</span><span class="value"><span class="badge">{{statpay}}</span></span></div>\n</div>\n<div class="footer">{{club}} &mdash; {{adresse_club}} &mdash; {{email_club}}</div>\n</body>\n</html>';
}

// ── Preview live ───────────────────────────────────────────────
function docPopulateChampSelects() {
  var cSel = document.getElementById('doc-preview-champ'); if(!cSel) return;
  cSel.innerHTML = '<option value="">— Aucun —</option>'
    +(db.championnats||[]).map(function(c){
      return '<option value="'+c.id+'"'+( window._docChampId===c.id?' selected':'')+'>'+c.nom+'</option>';
    }).join('');
  docUpdateChampSel();
}
function docUpdateChampSel() {
  var cSel = document.getElementById('doc-preview-champ'); if(!cSel) return;
  window._docChampId = cSel.value || null;
  var champ = window._docChampId ? (db.championnats||[]).find(function(c){return c.id===window._docChampId;}) : null;
  var eSel = document.getElementById('doc-preview-equipe'); if(!eSel) return;
  eSel.innerHTML = '<option value="">— Aucune —</option>'
    +((champ&&champ.equipes)||[]).map(function(e){
      return '<option value="'+e.id+'">'+e.nom+'</option>';
    }).join('');
  window._docEquipeId = null;
  // Peupler les journées disponibles dans ce championnat
  var jSel = document.getElementById('doc-preview-journee'); if(!jSel) return;
  var journees = [];
  ((champ&&champ.equipes)||[]).forEach(function(e){
    (e.rencontres||[]).forEach(function(r){
      if(r.journee && journees.indexOf(r.journee) === -1) journees.push(r.journee);
    });
  });
  journees.sort(function(a,b){return a-b;});
  jSel.innerHTML = '<option value="">— Toutes —</option>'
    +journees.map(function(j){return '<option value="'+j+'">Journée '+j+'</option>';}).join('');
  window._docJournee = null;
}
function docUpdateEquipeSel() {
  var eSel = document.getElementById('doc-preview-equipe'); if(!eSel) return;
  window._docEquipeId = eSel.value || null;
}
function docUpdateJourneeSel() {
  var jSel = document.getElementById('doc-preview-journee'); if(!jSel) return;
  window._docJournee = jSel.value ? parseInt(jSel.value) : null;
}
function docUpdatePreview() {
  var html = document.getElementById('doc-editor').value;
  var adherentId = document.getElementById('doc-preview-adherent').value;
  var data = docGetFusionData(adherentId||null);
  var fused = docFuse(html, data);
  var frame = document.getElementById('doc-preview-frame');
  frame.srcdoc = fused;
}

function docPreviewFull() {
  var html = document.getElementById('doc-editor').value;
  var adherentId = document.getElementById('doc-preview-adherent').value;
  var fused = docFuse(html, docGetFusionData(adherentId||null));
  var w = window.open('','_blank');
  w.document.write(fused);
  w.document.close();
}

// ── Sauvegarder ───────────────────────────────────────────────
function saveDocument(doc, msg) {
  return fetch(API + '/documents', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(doc)
  }).then(function(r){
    if(r.ok && msg) toast(msg,'success');
    return r.json();
  }).catch(function(){toast('Erreur sauvegarde modèle','error');});
}

function deleteDocumentServer(id) {
  return fetch(API + '/documents/' + id, {method:'DELETE'})
    .catch(function(){toast('Erreur suppression modèle','error');});
}

function saveDoc() {
  var name = document.getElementById('doc-name').value.trim();
  if(!name){toast('Donnez un nom au modèle','error');return;}
  if(!docDb) docDb=[];
  var html = document.getElementById('doc-editor').value;
  if(_docEditId) {
    var doc = docDb.find(function(d){return d.id===_docEditId;});
    if(doc){doc.name=name;doc.cat=document.getElementById('doc-cat').value;doc.desc=document.getElementById('doc-desc').value;doc.html=html;doc.updated=new Date().toISOString();}
  } else {
    docDb.push({id:'doc_'+Date.now(),name:name,cat:document.getElementById('doc-cat').value,desc:document.getElementById('doc-desc').value,html:html,created:new Date().toISOString(),updated:new Date().toISOString()});
  }
  var doc = docDb.find(function(d){return d.id===(_docEditId||'');}) || docDb[docDb.length-1];
  saveDocument(doc, 'Modèle enregistré !');
  closeDocModal();
  renderDocuments();
}

// ── Dupliquer / Supprimer ──────────────────────────────────────
function duplicateDoc(id) {
  var doc = (docDb).find(function(d){return d.id===id;});
  if(!doc) return;
  var copy = JSON.parse(JSON.stringify(doc));
  copy.id = 'doc_'+Date.now();
  copy.name = 'Copie — '+copy.name;
  copy.created = copy.updated = new Date().toISOString();
  docDb.push(copy);
  scheduleSave();
  renderDocuments();
  toast('Modèle dupliqué !','success');
}

function deleteDoc(id) {
  openConfirmModal('Supprimer ce modèle','Voulez-vous vraiment supprimer ce modèle ?',function(){
    docDb = (docDb).filter(function(d){return d.id!==id;});
    scheduleSave();
    renderDocuments();
    toast('Modèle supprimé','error');
  });
}

// ── Utiliser (fusion avec un adhérent) ────────────────────────
var _docUseId = null;
function openDocUse(id) {
  _docUseId = id;
  var doc = (docDb).find(function(d){return d.id===id;});
  if(!doc) return;
  document.getElementById('doc-use-title').textContent = 'Utiliser : '+doc.name;
  // Adhérents
  var selA = document.getElementById('doc-use-adherent');
  selA.innerHTML = '<option value="">— Aucun (valeurs club) —</option>'
    +(db.adherents||[]).sort(function(a,b){return a.nom.localeCompare(b.nom);})
      .map(function(a){return '<option value="'+a.id+'">'+a.nom+' '+a.prenom+'</option>';}).join('');
  // Championnats
  var selC = document.getElementById('doc-use-champ');
  selC.innerHTML = '<option value="">— Aucun —</option>'
    +(db.championnats||[]).map(function(c){
      return '<option value="'+c.id+'">'+c.nom+'</option>';
    }).join('');
  window._docUseChampId  = null;
  window._docUseJournee  = null;
  // Réinitialiser journées
  var selJ = document.getElementById('doc-use-journee');
  selJ.innerHTML = '<option value="">— Toutes —</option>';
  document.getElementById('doc-use-modal').style.display='block';
  docUseFusion();
}

function docUseUpdateChamp() {
  var selC = document.getElementById('doc-use-champ');
  window._docUseChampId  = selC.value || null;
  window._docUseJournee  = null;
  var champ = window._docUseChampId
    ? (db.championnats||[]).find(function(c){return c.id===window._docUseChampId;})
    : null;
  // Peupler les journées disponibles dans ce championnat
  var journees = [];
  ((champ&&champ.equipes)||[]).forEach(function(e){
    (e.rencontres||[]).forEach(function(r){
      if(r.journee && journees.indexOf(r.journee)===-1) journees.push(r.journee);
    });
  });
  journees.sort(function(a,b){return a-b;});
  var selJ = document.getElementById('doc-use-journee');
  selJ.innerHTML = '<option value="">— Sélectionner —</option>'
    +journees.map(function(j){return '<option value="'+j+'">Journée '+j+'</option>';}).join('');
  docUseFusion();
}

function docUseUpdateJournee() {
  var val = document.getElementById('doc-use-journee').value;
  window._docUseJournee = val ? parseInt(val) : null;
  docUseFusion();
}

function docUseFusion() {
  var doc = (docDb).find(function(d){return d.id===_docUseId;});
  if(!doc) return;
  var adherentId = document.getElementById('doc-use-adherent').value || null;
  // Sauvegarder l'état de l'éditeur, injecter les choix de la modale "Utiliser"
  var prevChamp   = window._docChampId;
  var prevEquipe  = window._docEquipeId;
  var prevJournee = window._docJournee;
  window._docChampId  = window._docUseChampId  || null;
  window._docEquipeId = null;
  window._docJournee  = window._docUseJournee  || null;
  var fused = docFuse(doc.html||'', docGetFusionData(adherentId));
  // Restaurer l'état de l'éditeur
  window._docChampId  = prevChamp;
  window._docEquipeId = prevEquipe;
  window._docJournee  = prevJournee;
  document.getElementById('doc-use-frame').srcdoc = fused;
  window._docFusedHtml = fused;
}

function docCopyResult() {
  if(!window._docFusedHtml){toast('Sélectionnez d\'abord un adhérent','error');return;}
  navigator.clipboard.writeText(window._docFusedHtml).then(function(){toast('HTML copié dans le presse-papier !','success');}).catch(function(){toast('Copie non supportée','error');});
}

function docOpenInTab() {
  if(!window._docFusedHtml){toast('Sélectionnez d\'abord un adhérent','error');return;}
  var w=window.open('','_blank');w.document.write(window._docFusedHtml);w.document.close();
}

// ── Insérer un champ de fusion dans l'éditeur ─────────────────
function docInsertField() {
  var cats = {}; DOC_FIELDS.forEach(function(f){cats[f.cat]=cats[f.cat]||[];cats[f.cat].push(f);});
  var optsHtml = Object.keys(cats).map(function(c){
    return '<optgroup label="'+c+'">'
      +cats[c].map(function(f){return '<option value="{{'+f.key+'}}">{{'+f.key+'}} — '+f.label+'</option>';}).join('')
      +'</optgroup>';
  }).join('');
  openModal('Insérer un champ de fusion',
    '<div class="field"><label>Champ à insérer</label><select id="insert-field-sel">'+optsHtml+'</select></div>',
    [{label:'Annuler',cls:'btn-secondary',action:'closeModal()'},
     {label:'Insérer',cls:'btn-primary',action:'docDoInsertField()'}]
  );
}

function docDoInsertField() {
  var val = document.getElementById('insert-field-sel').value;
  var ta = document.getElementById('doc-editor');
  var s = ta.selectionStart, e = ta.selectionEnd;
  ta.value = ta.value.substring(0,s)+val+ta.value.substring(e);
  ta.selectionStart = ta.selectionEnd = s+val.length;
  ta.focus();
  closeModal();
  docUpdatePreview();
}

function docInsertCondition() {
  var cats = {}; DOC_FIELDS.forEach(function(f){cats[f.cat]=cats[f.cat]||[];cats[f.cat].push(f);});
  var optsHtml = Object.keys(cats).map(function(c){
    return '<optgroup label="'+c+'">'
      +cats[c].map(function(f){return '<option value="'+f.key+'">{{'+f.key+'}} — '+f.label+'</option>';}).join('')
      +'</optgroup>';
  }).join('');
  openModal('Insérer une condition',
    '<div style="display:flex;flex-direction:column;gap:12px">'
    +'<div class="field"><label>Champ à tester</label><select id="cond-field">'+optsHtml+'</select></div>'
    +'<div class="field"><label>Valeur si VRAI (ex: Victoire)</label><input type="text" id="cond-val" placeholder="Victoire"></div>'
    +'<div class="field"><label>Contenu si VRAI</label><textarea id="cond-then" rows="3" style="font-family:monospace;font-size:12px" placeholder="🏆 Victoire !">🏆</textarea></div>'
    +'<div class="field"><label>Contenu si FAUX (optionnel)</label><textarea id="cond-else" rows="3" style="font-family:monospace;font-size:12px" placeholder="— (laissez vide pour ne rien afficher)"></textarea></div>'
    +'</div>',
    [{label:'Annuler',cls:'btn-secondary',action:'closeModal()'},
     {label:'Insérer',cls:'btn-primary',action:'docDoInsertCondition()'}]
  );
}

function docDoInsertCondition() {
  var field  = document.getElementById('cond-field').value;
  var val    = document.getElementById('cond-val').value;
  var thenPart = document.getElementById('cond-then').value;
  var elsePart = document.getElementById('cond-else').value;
  if (!field || !val) { toast('Choisissez un champ et une valeur', 'error'); return; }
  var bloc = '{{#IF '+field+' == "'+val+'"}}'+thenPart+'{{/IF}}';
  if (elsePart) bloc = '{{#IF '+field+' == "'+val+'"}}'+thenPart+'{{#ELSE}}'+elsePart+'{{/IF}}';
  var ta = document.getElementById('doc-editor');
  var s = ta.selectionStart;
  ta.value = ta.value.substring(0, s) + bloc + ta.value.substring(s);
  ta.selectionStart = ta.selectionEnd = s + bloc.length;
  ta.focus();
  closeModal();
  docUpdatePreview();
  toast('Condition insérée !', 'success');
}

function docInsertJourneeTemplate() {
  var bloc = [
    '',
    '{{#EACH rencontres_journee}}',
    '<div style="background:#f9f9f9;border:1px solid #ddd;border-radius:8px;padding:16px;margin-bottom:16px;font-family:Arial,sans-serif">',
    '  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">',
    '    <div style="font-size:16px;font-weight:700;color:#1a1a1a">{{equipe_nom}}</div>',
    '    <div style="font-size:12px;color:#666;background:#eee;padding:3px 8px;border-radius:4px">{{equipe_division}} — Poule {{equipe_poule}}</div>',
    '  </div>',
    '  <table style="width:100%;border-collapse:collapse;font-size:13px">',
    '    <tr><td style="padding:4px 0;color:#666;width:140px">Adversaire</td><td style="font-weight:600">{{rencontre_adversaire}}</td></tr>',
    '    <tr><td style="padding:4px 0;color:#666">Date</td><td>{{rencontre_date}}</td></tr>',
    '    <tr><td style="padding:4px 0;color:#666">Lieu</td><td>{{rencontre_lieu}}</td></tr>',
    '    <tr><td style="padding:4px 0;color:#666">Réception</td><td>{{rencontre_domicile}}</td></tr>',
    '    <tr><td style="padding:4px 0;color:#666">Week-end</td><td>{{rencontre_weekend}}</td></tr>',
    '    <tr><td style="padding:4px 0;color:#666">Score</td><td><strong>{{rencontre_score}}</strong> — {{rencontre_resultat}}</td></tr>',
    '    <tr><td style="padding:4px 0;color:#666">Joueurs</td><td style="font-size:12px">{{equipe_liste_joueurs}}</td></tr>',
    '  </table>',
    '</div>',
    '{{/EACH}}',
    ''
  ].join('\n');
  var ta = document.getElementById('doc-editor');
  var s = ta.selectionStart;
  ta.value = ta.value.substring(0, s) + bloc + ta.value.substring(s);
  ta.selectionStart = ta.selectionEnd = s + bloc.length;
  ta.focus();
  docUpdatePreview();
  toast('Bloc journée inséré ! Sélectionnez une journée dans la prévisualisation.', 'success');
}

// ── Import HTML depuis fichier ─────────────────────────────────
function docImportHTML() {
  var inp = document.createElement('input');
  inp.type='file'; inp.accept='.html,.htm';
  inp.onchange = function(e){
    var file = e.target.files[0]; if(!file) return;
    var r = new FileReader();
    r.onload = function(ev){
      document.getElementById('doc-editor').value = ev.target.result;
      docUpdatePreview();
      toast('Fichier importé !','success');
    };
    r.readAsText(file,'UTF-8');
  };
  inp.click();
}

// ── Restaurer documents depuis save ───────────────────────────
var _origLoadData = typeof loadData === 'function' ? loadData : null;


// ── Configuration Email SMTP ───────────────────────────────────
function saveEmailConfig() {
  if (!db.params) db.params = {};
  db.params.emailFrom      = (document.getElementById('email-from')||{value:''}).value.trim();
  db.params.emailSmtpLogin = (document.getElementById('email-smtp-login')||{value:''}).value.trim();
  db.params.emailFromName  = (document.getElementById('email-from-name')||{value:''}).value.trim();
  db.params.emailSmtpHost  = (document.getElementById('email-smtp-host')||{value:'smtp.gmail.com'}).value.trim() || 'smtp.gmail.com';
  db.params.emailSmtpPort  = (document.getElementById('email-smtp-port')||{value:'587'}).value.trim() || '587';
  var pwd = (document.getElementById('email-password')||{value:''}).value;
  if (pwd) db.params.emailPassword = pwd;
  scheduleSave();
  toast('Configuration email sauvegardée !', 'success');
}

function loadEmailConfigFields() {
  var p = db.params || {};
  var f;
  f = document.getElementById('email-from');       if(f) f.value = p.emailFrom||'';
  f = document.getElementById('email-smtp-login'); if(f) f.value = p.emailSmtpLogin||'';
  f = document.getElementById('email-from-name');  if(f) f.value = p.emailFromName||'';
  f = document.getElementById('email-smtp-host');  if(f) f.value = p.emailSmtpHost||'smtp.gmail.com';
  f = document.getElementById('email-smtp-port');  if(f) f.value = p.emailSmtpPort||'587';
  f = document.getElementById('email-password');
  if(f) f.placeholder = p.emailPassword ? '●●●●●●●● (configuré — laisser vide pour ne pas changer)' : 'Mot de passe d\'application (16 caractères)';
}

function testEmailConfig() {
  var st = document.getElementById('email-config-status');
  if(st) st.innerHTML = '<i class="ti ti-clock" aria-hidden="true"></i> Test en cours… (peut prendre jusqu\'à 20 s)';
  saveEmailConfig();
  var ctrl = new AbortController();
  var timer = setTimeout(function(){ ctrl.abort(); }, 22000);
  fetch(API + '/mail/test', {method:'POST', headers:{'Content-Type':'application/json'}, body:'{}', signal:ctrl.signal})
    .then(function(r){return r.json();})
    .then(function(resp){
      clearTimeout(timer);
      if(st) st.innerHTML = resp.ok
        ? '<span style="color:var(--success)"><i class="ti ti-circle-check" aria-hidden="true"></i> Connexion réussie — ' + escHtml(resp.email||'') + ' (' + escHtml(resp.method||'') + ')</span>'
        : '<span style="color:var(--danger)"><i class="ti ti-circle-x" aria-hidden="true"></i> ' + escHtml(resp.error||'Erreur') + '</span>';
    }).catch(function(e){
      clearTimeout(timer);
      var msg = e.name === 'AbortError' ? 'Délai dépassé — vérifiez hôte SMTP et port' : escHtml(e.message);
      if(st) st.innerHTML = '<span style="color:var(--danger)"><i class="ti ti-circle-x" aria-hidden="true"></i> ' + msg + '</span>';
    });
}


// ═══════════════════════════════════════════════════════════════