-- ═══════════════════════════════════════════════════════════════════════════
--  EXTRAIRE LE PLANNING DES COURS DEPUIS MyTCI
--  Pour alimenter la page « École de tennis » du site public.
-- ═══════════════════════════════════════════════════════════════════════════
--
--  Le planning n'existait jusqu'ici que sous forme d'images sur l'ancien site :
--  illisible sur téléphone, introuvable par un moteur de recherche, invisible
--  pour un lecteur d'écran. Or MyTCI détient déjà la donnée.
--
--  Lancez cette requête, envoyez-moi le résultat, et je génère le tableau HTML.
--  À refaire quand le planning change — il n'y a aucun lien automatique entre
--  MyTCI et le site, c'est délibéré : pas d'API publique à exposer.
--
--  Adaptez la saison si besoin.
-- ═══════════════════════════════════════════════════════════════════════════

SELECT
    c.jour                                        AS jour_num,
    CASE c.jour
        WHEN 1 THEN 'Lundi'    WHEN 2 THEN 'Mardi'
        WHEN 3 THEN 'Mercredi' WHEN 4 THEN 'Jeudi'
        WHEN 5 THEN 'Vendredi' WHEN 6 THEN 'Samedi'
        WHEN 7 THEN 'Dimanche' ELSE '?'
    END                                           AS jour,
    LPAD(c.heure, 2, '0') || 'h'
      || LPAD(COALESCE(c.heure_min, 0)::text, 2, '0')  AS debut,
    c.duree                                       AS duree_min,
    c.nom                                         AS groupe,
    tc.nom                                        AS type_de_cours,
    COALESCE(c.moniteur, '')                      AS moniteur,
    c.max_places                                  AS places,
    CASE WHEN c.piste = 0 THEN 'Non précisé'
         ELSE 'Court ' || c.piste::text END       AS court
FROM cours c
LEFT JOIN types_cours tc ON tc.id = c.type_cours_id
WHERE c.saison = '2026-2027'
ORDER BY c.jour, c.heure, c.heure_min;


-- Contrôle rapide : combien de cours, sur combien de jours ?
SELECT COUNT(*) AS nb_cours,
       COUNT(DISTINCT c.jour) AS nb_jours,
       COUNT(DISTINCT NULLIF(c.moniteur, '')) AS nb_moniteurs
FROM cours c
WHERE c.saison = '2026-2027';
