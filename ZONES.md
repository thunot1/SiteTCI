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

Les autres pages seront ajoutées ici au fur et à mesure.

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
- Modifier une page directement dans le dépôt reste possible ; MyTCI relit le
  fichier à chaque publication, il ne travaille jamais sur une copie périmée.

Variables d'environnement attendues côté MyTCI : `GITHUB_TOKEN` (jeton avec
droit d'écriture sur ce dépôt), et si besoin `SITE_REPO` (défaut
`thunot1/SiteTCI`) et `SITE_BRANCH` (défaut `main`).
