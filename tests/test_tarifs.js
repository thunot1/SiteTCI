/**
 * Tarifs et simulateur d'inscription (js/tarifs.js).
 *
 * Ce sont des PRIX affiches a un futur adherent. Un total faux n'est pas un
 * defaut d'affichage : c'est une promesse que le club ne pourra pas tenir au
 * guichet. Les montants sont donc verifies un a un contre la fiche
 * d'inscription 2026-2027, et les totaux recalcules a la main.
 *
 * Lancer :  node tests/test_tarifs.js
 */
const { TARIFS, calculerInscription, echeances } = require("../js/tarifs.js");

const fails = [];
function check(label, got, exp) {
  const ok = JSON.stringify(got) === JSON.stringify(exp);
  console.log((ok ? "  OK   " : "  FAIL ") + label +
    (ok ? "" : `  (got=${JSON.stringify(got)} exp=${JSON.stringify(exp)})`));
  if (!ok) fails.push(label);
}

// ═══════════════════════════════════════════════════════════════
console.log("\n[Tarifs] conformes a la fiche d'inscription 2026-2027");
check("saison", TARIFS.saison, "2026-2027");

console.log("  -- licence FFT");
check("ne en 2020 ou apres", TARIFS.licence.mini.prix, 13);
check("ne entre 2009 et 2019", TARIFS.licence.jeune.prix, 23);
check("ne en 2008 ou avant", TARIFS.licence.adulte.prix, 33);

console.log("  -- adhesion au club");
check("jeune", TARIFS.adhesion.jeune.prix, 40);
check("adulte", TARIFS.adhesion.adulte.prix, 65);
check("demandeur d'emploi", TARIFS.adhesion.demandeur.prix, 40);
check("famille (3 personnes et plus)", TARIFS.adhesion.famille.prix, 125);

console.log("  -- cours collectifs");
check("mini-tennis", TARIFS.cours.mini.prix, 120);
check("1 cours", TARIFS.cours.un.prix, 200);
check("2 cours", TARIFS.cours.deux.prix, 300);
check("2 cours dont 1 competition", TARIFS.cours.deuxCompet.prix, 400);
check("3 cours", TARIFS.cours.trois.prix, 400);
check("3 cours coute autant que 2 dont 1 competition", TARIFS.cours.trois.prix, TARIFS.cours.deuxCompet.prix);

console.log("  -- cautions et formules ponctuelles");
check("badge du court couvert", TARIFS.cautions.badgeCouvert.prix, 20);
check("cle des courts exterieurs", TARIFS.cautions.cleExterieur.prix, 10);
check("carte vacances semaine", TARIFS.ponctuel.semaine.prix, 15);
check("carte vacances estivale", TARIFS.ponctuel.estivale.prix, 45);
check("ticket horaire", TARIFS.ponctuel.heure.prix, 10);
check("jeton d'eclairage", TARIFS.ponctuel.eclairage.prix, 2);

// ═══════════════════════════════════════════════════════════════
console.log("\n[Simulateur] totaux recalcules a la main");

let r = calculerInscription("mini", "mini");
check("enfant de 5 ans, mini-tennis : 13 + 40 + 120", r.total, 173);
check("  -> trois lignes detaillees", r.lignes.length, 3);

r = calculerInscription("jeune", "un");
check("enfant de 10 ans, 1 cours : 23 + 40 + 200", r.total, 263);

r = calculerInscription("jeune", "trois");
check("jeune tres assidu, 3 cours : 23 + 40 + 400", r.total, 463);

r = calculerInscription("adulte", "aucun");
check("adulte sans cours : 33 + 65", r.total, 98);
check("  -> deux lignes seulement, pas de ligne cours a 0", r.lignes.length, 2);

r = calculerInscription("adulte", "un");
check("adulte avec 1 cours : 33 + 65 + 200", r.total, 298);

r = calculerInscription("demandeur", "aucun");
check("demandeur d'emploi sans cours : 33 + 40", r.total, 73);
check("  -> licence au tarif adulte", r.lignes[0].prix, 33);
check("  -> adhesion au tarif reduit", r.lignes[1].prix, 40);

r = calculerInscription("adulte", "deuxCompet");
check("adulte competition : 33 + 65 + 400", r.total, 498);

console.log("\n[Simulateur] les cautions ne gonflent pas le total");
// Une caution est restituee : la compter comme une depense afficherait un
// cout superieur a la realite, exactement ce qu'un futur adherent reproche.
r = calculerInscription("adulte", "aucun", { badgeCouvert: true, cleExterieur: true });
check("total inchange malgre les deux cautions", r.total, 98);
check("cautions listees a part", r.totalCautions, 30);
check("  -> deux cautions", r.cautions.length, 2);
r = calculerInscription("adulte", "aucun", { badgeCouvert: true });
check("une seule caution demandee", r.totalCautions, 20);
r = calculerInscription("adulte", "aucun");
check("aucune option -> aucune caution", r.totalCautions, 0);

console.log("\n[Simulateur] robustesse");
check("profil inconnu -> traite comme adulte", calculerInscription("martien", "aucun").total, 98);
check("formule de cours inconnue -> ignoree", calculerInscription("adulte", "zzz").total, 98);
check("sans options -> ne plante pas", calculerInscription("adulte", "aucun").cautions.length, 0);

// ═══════════════════════════════════════════════════════════════
console.log("\n[Paiement fractionne] la somme des echeances doit faire le total");
// Le club accepte 1, 3 ou 4 fois. Un arrondi qui ne retombe pas juste ferait
// payer un centime de trop ou de moins — visible sur un chequier.
[[263, 3], [263, 4], [98, 3], [173, 4], [498, 3], [463, 4], [100, 1]].forEach(([t, n]) => {
  const e = echeances(t, n);
  const somme = Math.round(e.reduce((s, x) => s + x, 0) * 100) / 100;
  check(`${t} € en ${n} fois -> somme = ${somme}`, somme, t);
  check(`  -> ${n} echeance(s)`, e.length, n);
});
check("263 € en 3 fois", echeances(263, 3), [87.66, 87.66, 87.68]);
check("nombre absent -> une seule echeance", echeances(263), [263]);
check("nombre nul -> une seule echeance", echeances(263, 0), [263]);

console.log("\n" + (fails.length ? "ECHECS : " + fails.join(", ") : "TOUS LES TESTS PASSENT"));
process.exit(fails.length ? 1 : 0);
