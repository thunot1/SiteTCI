/* ═══════════════════════════════════════════════════════════════
   Tarifs de la saison 2026-2027 et calcul du coût d'une inscription.
   ═══════════════════════════════════════════════════════════════

   Les tarifs sont ici, en un seul endroit : le simulateur et les tableaux
   de la page doivent afficher les mêmes chiffres, et un prix corrigé à un
   seul des deux endroits serait une promesse fausse faite au visiteur.

   Les CAUTIONS ne sont pas des dépenses : elles sont restituées au retour
   du badge ou de la clé. Elles sont donc renvoyées à part, jamais ajoutées
   au total — les mélanger gonflerait artificiellement le coût affiché.
   ─────────────────────────────────────────────────────────────── */

var TARIFS = {
  saison: '2026-2027',

  licence: {
    mini:   { prix: 13, libelle: 'Licence FFT — né en 2020 ou après' },
    jeune:  { prix: 23, libelle: 'Licence FFT — né entre 2009 et 2019' },
    adulte: { prix: 33, libelle: 'Licence FFT — né en 2008 ou avant' }
  },

  adhesion: {
    jeune:     { prix: 40,  libelle: 'Adhésion jeune (né en 2009 ou après)' },
    adulte:    { prix: 65,  libelle: 'Adhésion adulte' },
    demandeur: { prix: 40,  libelle: 'Adhésion demandeur d\'emploi' },
    famille:   { prix: 125, libelle: 'Adhésion famille (3 personnes et plus, dont 1 adulte)' }
  },

  cours: {
    aucun:       { prix: 0,   libelle: 'Sans cours' },
    mini:        { prix: 120, libelle: 'Mini-tennis, 1 cours par semaine' },
    un:          { prix: 200, libelle: '1 cours par semaine' },
    deux:        { prix: 300, libelle: '2 cours par semaine' },
    deuxCompet:  { prix: 400, libelle: '2 cours par semaine dont 1 compétition' },
    trois:       { prix: 400, libelle: '3 cours par semaine' }
  },

  cautions: {
    badgeCouvert: { prix: 20, libelle: 'Badge du court couvert' },
    cleExterieur: { prix: 10, libelle: 'Clé des courts extérieurs' }
  },

  ponctuel: {
    semaine:  { prix: 15, libelle: 'Carte vacances — 1 semaine' },
    estivale: { prix: 45, libelle: 'Carte vacances — du 1ᵉʳ juillet au 31 août' },
    heure:    { prix: 10, libelle: 'Ticket horaire — 1 heure de court' },
    eclairage:{ prix: 2,  libelle: 'Jeton d\'éclairage — 1 heure' }
  }
};

/* Calcule le coût d'une inscription annuelle.
   Renvoie le détail ligne à ligne, le total, et les cautions à part.
   Une clé inconnue est ignorée plutôt que de faire échouer le calcul :
   sur une page publique, un total absent vaut mieux qu'une page cassée. */
function calculerInscription(profil, formuleCours, options) {
  options = options || {};
  var lignes = [];
  var total = 0;

  var cleLicence = profil === 'mini' ? 'mini'
                 : profil === 'jeune' ? 'jeune'
                 : 'adulte';
  var licence = TARIFS.licence[cleLicence];
  if (licence) { lignes.push(licence); total += licence.prix; }

  var cleAdhesion = profil === 'mini' || profil === 'jeune' ? 'jeune'
                  : profil === 'demandeur' ? 'demandeur'
                  : 'adulte';
  var adhesion = TARIFS.adhesion[cleAdhesion];
  if (adhesion) { lignes.push(adhesion); total += adhesion.prix; }

  var cours = TARIFS.cours[formuleCours];
  if (cours && cours.prix > 0) { lignes.push(cours); total += cours.prix; }

  var cautions = [];
  if (options.badgeCouvert) cautions.push(TARIFS.cautions.badgeCouvert);
  if (options.cleExterieur) cautions.push(TARIFS.cautions.cleExterieur);

  return {
    lignes: lignes,
    total: total,
    cautions: cautions,
    totalCautions: cautions.reduce(function (s, c) { return s + c.prix; }, 0)
  };
}

/* Montant de chaque échéance en cas de paiement fractionné.
   Le club accepte 1, 3 ou 4 fois. Les centimes ne tombant pas toujours
   juste, la dernière échéance absorbe l'écart : la somme des échéances
   est ainsi toujours exactement égale au total. */
function echeances(total, nombre) {
  if (!nombre || nombre < 1) nombre = 1;
  if (nombre === 1) return [total];
  var base = Math.floor(total / nombre * 100) / 100;
  var liste = [];
  for (var i = 0; i < nombre - 1; i++) liste.push(base);
  var reste = Math.round((total - base * (nombre - 1)) * 100) / 100;
  liste.push(reste);
  return liste;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TARIFS: TARIFS, calculerInscription: calculerInscription, echeances: echeances };
}
