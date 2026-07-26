# Zones éditables depuis MyTCI

Le site est statique, mais certaines zones sont modifiables depuis MyTCI, qui
réécrit la page et la republie sur GitHub (Coolify reconstruit ensuite). Ce
fichier décrit **le contrat** entre les deux applications. Le code de
publication de MyTCI s'y réfère : ne pas changer la syntaxe sans le mettre à
jour des deux côtés.

## Syntaxe des repères

Des commentaires HTML entourent chaque zone. Ils sont invisibles pour le
visiteur et neutres pour la mise en page : ils n'introduisent aucune balise.

**Zone simple** — un fragment de contenu remplaçable :

```html
<h1><!--z:hero.titre-->Le tennis pour tous…<!--/z--></h1>
```

MyTCI remplace tout ce qui se trouve entre `<!--z:CLÉ-->` et `<!--/z-->`. La
balise porteuse (`<h1>`, `<p>`…) et ses classes restent hors de la zone : elles
ne sont jamais modifiées, la charte graphique est donc préservée.

**Liste** — un ensemble d'éléments répétés (actualités, chiffres) :

```html
<div class="actus"><!--zl:actus-->
  <article class="actu">…</article>
  …
<!--/zl--></div>
```

MyTCI régénère l'intérieur à partir d'un gabarit d'élément et des données de la
base. Le nombre d'éléments peut varier.

## Règles

- **Une clé est unique dans une page.** Forme `section.champ`.
- **Le contenu d'une zone reste du HTML valide** et se limite à de l'enrichissement
  en ligne (`<strong>`, `<sup>`, `<a>`…) : jamais de `<script>`, jamais de
  balise de structure. MyTCI échappe et contrôle ce qu'il écrit.
- **Ne jamais imbriquer** une zone dans une autre.
- **Ne pas déplacer** un repère sans mettre à jour la clé correspondante dans
  MyTCI : une clé absente à la publication doit être signalée, pas ignorée.

## Inventaire

### `index.html` (Accueil)

| Clé | Type | Contenu | Source dans MyTCI |
|-----|------|---------|-------------------|
| `hero.accroche` | simple | Bandeau — ligne d'accroche | saisie libre |
| `hero.titre` | simple | Bandeau — titre principal | saisie libre |
| `hero.texte` | simple | Bandeau — paragraphe | saisie libre |
| `chiffres` | liste | Les 4 chiffres clés | 3 dérivables de la base, à confirmer |
| `actus.intro` | simple | Actualités — phrase d'introduction | saisie libre |
| `actus` | liste | Les cartes d'actualité | module Actualités existant |
| `mot.citation` | simple | Mot du président — citation | saisie libre |
| `mot.nom` | simple | Mot du président — nom | saisie libre |
| `mot.fonction` | simple | Mot du président — fonction | saisie libre |
| `appel.titre` | simple | Appel final — titre | saisie libre |
| `appel.texte` | simple | Appel final — paragraphe | saisie libre |

### `le-club.html` (Le club)

| Clé | Type | Contenu |
|-----|------|---------|
| `hero.titre` | simple | Bandeau — titre de la page |
| `hero.texte` | simple | Bandeau — paragraphe |
| `installations.intro` | simple | Installations — phrase d'introduction |
| `clubhouse.permanence` | simple | Horaires de permanence du club-house |
| `organisation.intro` | simple | Organisation — phrase d'introduction |
| `bureau` | liste | Membres du bureau (photo facultative + fonction + nom) |
| `conseil` | liste | Conseil d'administration (photo facultative + nom) |
| `commissions` | liste | Commissions (nom + responsable) |
| `mot.saison` | simple | Mot du président — surtitre de saison |
| `mot.lettre` | simple | Mot du président — corps de la lettre (HTML) |
| `mot.nom` · `mot.fonction` | simple | Signature |
| `appel.titre` · `appel.texte` | simple | Appel final |

### `galerie.html` (Galerie)

| Clé | Type | Contenu |
|-----|------|---------|
| `hero.titre` · `hero.texte` | simple | Bandeau |
| `galerie.avertissement` | simple | Bandeau « en construction » — **à vider** au lancement |
| `albums.intro` | simple | Introduction des albums |
| `albums` | liste | Albums (titre, description, fichier de couverture) |
| `contribuer.titre` · `contribuer.texte` | simple | « Vous avez des photos ? » |
| `droitimage.titre` · `droitimage.texte` | simple | Encadré droit à l'image |
| `appel.titre` · `appel.texte` | simple | Appel final |

> **Photo de couverture d'un album** : c'est un fichier de `img/galerie/` du
> dépôt, référencé par son nom (comme les logos partenaires). Sans photo,
> l'album garde son vignette d'attente et la pastille « photos à fournir ».
> L'**envoi** de photos depuis MyTCI n'est pas encore en place pour la galerie.
>
> ⚠️ **Droit à l'image** : ne publier une photo montrant une personne
> reconnaissable qu'avec son accord — et celui des représentants légaux pour un
> mineur. L'avertissement est rappelé dans l'écran d'édition.

### `inscription.html` (Inscription)

| Clé | Type | Contenu |
|-----|------|---------|
| `hero.titre` · `hero.texte` | simple | Bandeau |
| `etapes` | liste | S'inscrire en trois étapes |
| `demande.intro` | simple | Formulaire de demande — introduction |
| `combien.intro` | simple | Simulateur — introduction |
| `famille.note` | simple | Note « tarif famille » |
| `sante.titre` · `sante.texte` | simple | Encadré santé |
| `pieces` | liste | Pièces du dossier |
| `depots` | liste | Où déposer son dossier |
| `appel.titre` · `appel.texte` | simple | Appel final |

> **Les tarifs et le simulateur ne sont pas éditables** : les montants vivent
> dans `js/tarifs.js`, qui alimente le calcul. Les modifier ici les
> désynchroniserait. C'est un chantier distinct.

## Le formulaire de demande

La page Inscription porte un **formulaire** (`js/demande.js`) qui envoie la
demande à MyTCI (`https://app.tennisclubissois.fr/api/site/contact`), lequel la
relaie par e-mail au bureau. **Rien n'est stocké sur ce site.** Conséquences :

- **CSP** : `nginx.conf` autorise `connect-src` vers `app.tennisclubissois.fr`,
  seule entorse au « tout provient du même serveur ».
- **RGPD** : la page `donnees-personnelles.html` décrit ce traitement. Toute
  modification du formulaire doit y être répercutée.
- **Anti-abus** (côté MyTCI) : piège à robots, plafonds de longueur, quota par
  IP, et destinataire **toujours** l'adresse du club — jamais une adresse
  fournie dans la requête. Le champ e-mail du visiteur sert de `Reply-To`.
- **Configuration MyTCI** : la messagerie doit être configurée (`emailFrom` /
  `emailPassword` dans les paramètres). Destinataire = `siteContactTo` si
  défini, sinon `emailFrom`.

### `competitions.html` (Compétitions)

| Clé | Type | Contenu |
|-----|------|---------|
| `hero.titre` · `hero.texte` | simple | Bandeau |
| `commencer.intro` · `regles` | simple / liste | La compétition, c'est pour qui |
| `debut.titre` · `debut.texte` | simple | Encadré « jamais joué de match officiel » |
| `equipes.intro` | simple | Championnats par équipes — introduction |
| `equipes.avertissement` | simple | Bandeau orange — **à vider** quand la saison est arrêtée |
| `epreuves-equipes` | liste | Fiches des championnats |
| `tournois.intro` · `epreuves-tournois` | simple / liste | Tournois du club |
| `palmares.saison` · `palmares.intro` · `palmares` | simple / liste | Résultats |
| `rg.titre` · `rg.texte` | simple | Encadré Roland-Garros |
| `sinscrire.intro` · `etapes` | simple / liste | Rejoindre une équipe |
| `encadrement.intro` · `commissions` · `documents` | simple / liste | Encadrement |
| `appel.titre` · `appel.texte` | simple | Appel final |

> **Les détails d'une épreuve se saisissent en texte**, une ligne
> `Libellé : valeur` par entrée, plutôt qu'en champs fixes : leur nombre et
> leurs intitulés varient d'une épreuve à l'autre.
>
> ⚠️ **Palmarès** : ne publier le nom d'un mineur qu'avec l'accord de ses
> représentants légaux. L'avertissement est rappelé dans l'écran d'édition.

### `partenaires.html` (Partenaires)

| Clé | Type | Contenu |
|-----|------|---------|
| `hero.titre` · `hero.texte` | simple | Bandeau |
| `partenaires.intro` | simple | Nos partenaires — introduction |
| `publics.titre` · `publics` | simple / liste | Collectivités publiques |
| `prives.titre` · `prives` | simple / liste | Entreprises partenaires |
| `logos.note` | simple | Note sur les logos manquants — **à vider** quand ils sont fournis |
| `pourquoi.intro` · `arguments` | simple / liste | Arguments chiffrés |
| `regle.titre` · `regle.texte` | simple | Encadré « jeunes du territoire » |
| `visibilite.intro` | simple | Ce que nous proposons |
| `devenir.intro` · `etapes` | simple / liste | La démarche |
| `appel.titre` · `appel.texte` | simple | Appel final |

> **Une carte partenaire prend quatre formes** selon ce qui est saisi : avec ou
> sans logo, cliquable ou non. Le fichier logo doit exister dans
> `img/partenaires/` du dépôt avant d'être référencé. Le champ « secteur »
> accepte de la mise en forme en ligne (la pastille « à préciser ») : il est
> assaini, pas échappé.

### `ecole-de-tennis.html` (École de tennis)

| Clé | Type | Contenu |
|-----|------|---------|
| `hero.titre` · `hero.texte` | simple | Bandeau |
| `chiffres-ecole` | liste | Capsules de chiffres clés (icône + nombre + libellé) sous le bandeau |
| `planning.saison` | simple | Saison affichée dans le premier bloc |
| `planning.intro` | simple | Groupes et planning — introduction (lien mailto possible) |
| `fonctionnement.texte1` · `.texte2` | simple | Descriptif — paragraphes pédagogiques (dans le premier bloc) |
| `planning.lien` | simple | Bouton vers le fichier de planning (à déposer dans `documents/`) |
| `equipe.intro` | simple | Moniteurs — introduction |
| `moniteurs` | liste | Moniteurs (photo facultative + nom + rôle) — initiales si pas de photo |
| `courtcouvert.texte` | simple | Encadré « Qui dispose du court couvert ? » (HTML, lien possible) |
| `informe.texte` | simple | Encadré « Rester informé » |
| `appel.titre` · `appel.texte` | simple | Appel final |

> **Le planning n'est plus saisi à plat sur le site.** Le club joint désormais
> un fichier (PDF, dossier `documents/`) et `planning.lien` pointe dessus. Le
> générateur `planning` reste en place côté serveur mais n'est plus utilisé par
> la page ; l'ancien bandeau d'avertissement et le planning d'exemple ont été
> retirés.
>
> **Le contenu du court couvert est éditable** (`courtcouvert.texte`) et accepte
> un lien. Le bloc « Comment l'école fonctionne » a été fusionné dans le premier
> bloc, et le pavé « Suivre son assiduité » est devenu la section « Rester
> informé » (sans bouton).

### `contact.html` (Contact)

| Clé | Type | Contenu |
|-----|------|---------|
| `hero.titre` · `hero.texte` | simple | Bandeau |
| `joindre.email` · `joindre.tel` | simple | Descriptions des deux premières cartes |
| `joindre.permanence` | simple | Carte club-house — horaires et services |
| `qui.intro` | simple | Qui contacter — introduction |
| `aiguillage` | liste | Besoin → responsable (besoin, précision, qui, complément, lien) |
| `courrier.intro` | simple | Note sur l'adresse postale |
| `courrier.adresse` | liste | Adresse postale, une ligne par entrée |
| `liens.intro` | simple | Liens utiles — introduction |
| `liens` | liste | Liens utiles (icône, nom, description, adresse) |
| `appel.titre` · `appel.texte` | simple | Appel final |

> **Ce qui n'est volontairement PAS éditable ici** : l'adresse e-mail et le
> numéro de téléphone eux-mêmes. Ils figurent aussi dans le pied de page des
> 12 pages du site : les modifier depuis la seule page Contact produirait une
> incohérence pire que l'absence d'édition. Ils demandent un mécanisme de zone
> partagée, appliquée à toutes les pages — non réalisé à ce jour.

Les autres pages seront ajoutées ici au fur et à mesure.

> **Trois endroits déclarent une zone** : le repère dans le HTML, la liste
> blanche `_SITE_ZONES` de `server.py`, et la description `SITE_PAGES` de
> `app-site.js`. Une divergence est silencieuse — la zone disparaît de l'écran,
> ou son contenu n'est jamais publié. `MyTCI/tests/test_zones_coherence.py`
> compare les trois et échoue si l'un dérive.

## Publication depuis MyTCI

MyTCI relit le fichier sur GitHub, remplace le contenu entre les repères, et
réécrit le fichier. Coolify reconstruit ensuite le site. Conséquences :

- **Ne jamais supprimer un repère** d'une page : MyTCI signalerait la clé comme
  introuvable et le contenu correspondant ne serait pas publié.
- **La mise en page reste maîtrisée ici.** MyTCI n'écrit que dans les zones ;
  les balises, les classes et le CSS appartiennent au dépôt. Modifier l'allure
  d'une carte d'actualité se fait dans `css/style.css`, pas dans MyTCI.
- **Les photos d'actualités** sont poussées par MyTCI dans `img/actus/`, une
  image par actualité, nommée d'après son identifiant. Ne pas les modifier à la
  main : elles sont réécrites à chaque publication.
- **Les portraits** (bureau et conseil sur « Le club », moniteurs sur « École de
  tennis ») suivent le même principe dans `img/equipe/`, une image carrée par
  personne nommée d'après son identifiant. Envoyées depuis MyTCI, copiées ici à
  la publication. Sans photo, la page affiche les initiales. Ces portraits
  occupent l'essentiel de leur carte et apparaissent **en cascade** (fondu +
  montée de 8 px + zoom léger, 350 ms), pilotés par `js/equipe-anim.js` sur les
  grilles `.bureau`, `.conseil-membres` et `.equipe` ; l'animation est désactivée
  si le visiteur a demandé de réduire les animations, et les cartes restent
  visibles si le script ne tourne pas.
- Modifier une page directement dans le dépôt reste possible ; MyTCI relit le
  fichier à chaque publication, il ne travaille jamais sur une copie périmée.

Variables d'environnement attendues côté MyTCI : `GITHUB_TOKEN` (jeton avec
droit d'écriture sur ce dépôt), et si besoin `SITE_REPO` (défaut
`thunot1/SiteTCI`) et `SITE_BRANCH` (défaut `main`).
