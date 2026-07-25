# Site public — Tennis Club Issois

`tennisclubissois.fr` · site statique, servi par Coolify sur le serveur OVH du club.

## Comment modifier le site

Déposez le fichier modifié sur GitHub. Coolify reconstruit et publie tout seul.
**Il n'y a aucune étape de compilation** : ce qui est dans le dépôt est ce qui
est servi. Vous n'avez rien à installer sur votre poste.

## Organisation des fichiers

```
index.html            Accueil
le-club.html          Le club, installations, accès, règlements
ecole-de-tennis.html  Groupes, créneaux, encadrement
inscription.html      Tarifs, simulateur, marche à suivre
competitions.html     Championnats, tournois, résultats
galerie.html          Albums photo (structure, sans photos)
partenaires.html      Collectivités et entreprises
contact.html          Écrire, appeler, trouver le club
mentions-legales.html · donnees-personnelles.html · cookies.html
404.html              Page affichée sur une adresse inexistante
css/style.css         Toute la mise en forme du site
js/                   menu.js (menu mobile) · tarifs.js (simulateur)
img/                  Déclinaisons du logo, optimisées pour le web
robots.txt            Autorise l'indexation, signale le sitemap
sitemap.xml           Liste des pages, pour les moteurs de recherche
nginx.conf            Serveur web : sécurité, cache, compression
Dockerfile            Dit à Coolify comment construire l'image
_source/ ressources/ tests/    NON publiés (retirés de l'image Docker)
```

## Le bandeau d'accueil (Hero)

La page d'accueil s'ouvre sur un bandeau en deux parties : un **panneau rouge**
à gauche (logo, accroche, titre, texte, boutons) et une **photo pleine hauteur**
à droite, séparés par une diagonale douce. La photo porte un voile rouge très
léger pour s'harmoniser avec l'identité du club.

La photo est le fichier **`img/accueil-hero.jpg`** :

- **Paysage**, large : **1600 px de côté ou plus**, cadrée pour garder les
  personnes/joueurs plutôt au centre-droit (la gauche passe sous le panneau).
- **JPEG optimisé** : viser **≤ 400 Ko** (l'image d'accueil est la première
  chargée). Une photo brute de 1–2 Mo se recompresse en qualité 85 sans perte
  visible — par exemple avec Pillow :
  `Image.open('src.jpg').convert('RGB').save('img/accueil-hero.jpg','JPEG',quality=85,optimize=True,progressive=True)`.

Si le fichier est absent, `js/accueil-hero.js` retire l'image et le dégradé
rouge occupe la place : jamais d'image cassée, le rouge reste le filet de
sécurité.

**Réglages fins** (dans `css/style.css`, bloc « Bandeau d'accueil, version
deux parties ») :

- La **pente de la diagonale** : le `5vw` de `clip-path` sur `.hero-a-panneau`.
- Le **cadrage** de la photo : `object-position` sur `.hero-a-img` (par défaut
  `60% 55%`, biais droite/bas).
- L'**intensité du voile** rouge : les opacités de `.hero-a-voile`.

Les animations d'entrée (fondu du panneau et montée du texte 350 ms, fondu +
glissé + léger zoom de la photo 450 ms, boutons en dernier) sont **désactivées**
pour les visiteurs qui ont demandé à réduire les animations : tout reste alors
visible, sans mouvement.

## Le logo

`_source/LogoTCI-HQ.png` est l'original. Les fichiers de `img/` en sont
dérivés et pèsent 94 Ko à eux tous, contre 700 Ko pour la source seule :

| Fichier | Usage |
|---|---|
| `logo-tci.png` (+`@2x`) | Logotype rouge — en-tête |
| `logo-tci-blanc.png` (+`@2x`) | Logotype blanc — sur les fonds rouges |
| `icone-tci.png` | La balle seule — icône d'écran d'accueil |
| `favicon.png` | La balle seule, 32 px — onglet du navigateur |

La balle est isolée du logotype pour l'icône : le texte
« Tennis club Issois » serait illisible à 32 pixels.

## Voir le site avant de publier

Depuis ce dossier :

```
python -m http.server 8899
```

puis ouvrez `http://127.0.0.1:8899` dans un navigateur. Ce que vous voyez là
est exactement ce qui sera publié.

## Choix techniques, et pourquoi

**Aucune police externe.** Ni Google Fonts, ni CDN. Charger une police depuis
un serveur tiers lui transmet l'adresse IP de chaque visiteur — ce qui
contredirait la phrase « aucun transfert hors de l'Union européenne » de notre
politique de confidentialité. Les polices du système sont utilisées, et la
page se charge d'autant plus vite.

**Aucun outil de mesure d'audience.** C'est ce qui permet de publier la
version courte de la page « Cookies », sans bandeau de consentement. Ajouter
un outil de statistiques classique ferait basculer le site dans le régime du
consentement, avec toutes ses contraintes.

**Aucune donnée personnelle publiée** pour l'instant. Le jour où le site
affichera des noms — résultats de championnat, compositions d'équipes — ce
sera un traitement distinct, à décider en connaissance de cause.

## Mise en ligne (à faire une fois)

### 1. Déposer le code sur GitHub

Créer un dépôt (par exemple `thunot1/SiteTCI`) et y déposer **tout le contenu
de ce dossier**, `Dockerfile` et `nginx.conf` compris. Ce sont eux qui disent
à Coolify quoi faire.

### 2. Créer l'application dans Coolify

Coolify → projet → environnement `production` → *+ New* → *Public Repository*
(ou *Private Repository* si le dépôt est privé).

| Réglage | Valeur |
|---|---|
| Build Pack | **Dockerfile** |
| Branch | `main` |
| Port | **80** |
| Base directory | `/` |

Lancer *Deploy*. Coolify fournit une URL temporaire (`…sslip.io`) : **tester
le site dessus avant de toucher au DNS.** Tant que le DNS n'est pas modifié,
rien n'est visible du public et l'ancien site continue de fonctionner.

### 3. Basculer le domaine

Une fois le test concluant, dans OVH → *Domaines* → `tennisclubissois.fr` →
*Zone DNS* :

- un enregistrement `A` pour `tennisclubissois.fr` vers l'IP du serveur ;
- un enregistrement `A` (ou `CNAME`) pour `www` vers la même destination.

> **Ne toucher à aucun enregistrement `MX` ni `TXT`.** Ce sont eux qui font
> fonctionner les adresses e-mail du domaine : les modifier couperait le
> courrier du club, et le SPF/DKIM avec.

Puis, dans Coolify, renseigner `https://tennisclubissois.fr` dans *Domains*.
Le certificat HTTPS est émis automatiquement (Let's Encrypt). La propagation
DNS prend de quelques minutes à quelques heures.

### 4. Après la bascule

- Vérifier que `https://tennisclubissois.fr` **et** `https://www.tennisclubissois.fr`
  répondent toutes les deux, et qu'elles mènent au même endroit.
- Déclarer le site dans la Google Search Console et y soumettre
  `sitemap.xml`.
- Mettre à jour l'adresse du site sur la page Facebook du club et sur la
  fiche FFT, qui pointent encore vers Holdsport.
- **Activer HSTS** (`Strict-Transport-Security`) une fois le certificat
  stable depuis quelques jours — voir le commentaire dans `nginx.conf`.
  Pas avant : l'en-tête est irréversible côté navigateur.

## Le planning de l'école

`ecole-de-tennis.html` ne détaille plus les créneaux dans la page : le premier
bloc « Groupes et planning » se termine par un **bouton vers un fichier de
planning** (zone `planning.lien`). Déposer ce fichier dans un dossier
`documents/` du dépôt (par ex. `documents/planning-ecole-de-tennis.pdf`) et,
si besoin, ajuster le lien depuis MyTCI (École de tennis → « Bouton vers le
planning des cours »). Tant que le fichier n'est pas là, le bouton mène à une
adresse encore vide.

Il n'y a **aucun lien automatique** entre MyTCI et le site : c'est délibéré,
cela évite d'exposer une API publique et de coupler davantage les deux
applications.

## Informations qu'il manque au club

Signalées dans les pages par une pastille orange **« à préciser »** ou
**« à compléter »**. Elles ne figuraient nulle part sur l'ancien site, alors
que ce sont des questions courantes d'un futur adhérent :

- **surface des courts extérieurs** (terre battue, résine, béton poreux…)
- **équipements du club-house** : vestiaires, douches, sanitaires
- **horaires d'ouverture** des installations
- **texte du règlement intérieur** du court couvert (il n'existe qu'en image)
- **texte de la charte des championnats** (idem)
- **adresse exacte de la page Facebook** du club
- **logos manquants** : TennisPro, Crédit Mutuel, Cordier, Département de la
  Côte-d'Or. (Rondot, BW Associés et RJ Recrutement sont en place ; les
  fichiers d'origine sont dans `ressources/logos-sources/`, non publié. Le
  fichier fourni pour Cordier était une photo de banderole, inexploitable
  comme logo — un vrai logo reste à obtenir.)

Rien de tout cela n'a été inventé : les pastilles marquent les trous plutôt
que de les combler avec du plausible.

## Le plan d'accès

Le fichier `ressources/Plan_acces_TCI satelitte.jpg` est une **capture d'Apple
Plans** annotée. Elle n'est pas publiée : republier l'imagerie cartographique
d'un tiers, sans son attribution, pose une question de licence que le club n'a
pas à porter.

À la place, `le-club.html` contient un **schéma redessiné** en SVG, tiré des
informations que cette capture donnait : route d'accès, court couvert, parking,
courts extérieurs et club-house. Il pèse 3 Ko au lieu de 154, reste net à toute
taille, et ne dépend d'aucun tiers. La localisation dans la commune est assurée
par le lien vers OpenStreetMap.

Si vous préférez malgré tout publier la photo satellite, dites-le : elle est
prête (`img/plan-acces.jpg`, 154 Ko).

## Au lancement — ce qu'il faudra retirer

Le site est en ligne sur `https://tennisclubissois.fr`. Le bandeau « en
construction » et son lien vers Holdsport ont été retirés de la page d'accueil ;
il reste que le site est volontairement tenu à l'écart des moteurs de recherche.

Ce qui reste provisoire porte la mention `CHANTIER` — un `grep -r CHANTIER` les
retrouve tous. À faire le jour du lancement :

1. ~~**Le bandeau de chantier** (`<aside class="chantier">` dans `index.html` et
   la section `.chantier` du CSS).~~ **Fait.**
2. **Les balises `noindex`** : la ligne
   `<meta name="robots" content="noindex, follow">` des 11 pages. Les trois
   pages légales retrouveront leur `content="index, follow"` d'origine.
3. **Le `robots.txt`** : rétablir la déclaration du `Sitemap:` et retirer le
   commentaire d'explication.

> L'exploration reste **autorisée** dans `robots.txt` pendant les travaux, et
> ce n'est pas un oubli : un robot doit pouvoir entrer pour lire la balise
> `noindex`. Un `Disallow: /` l'en empêcherait, et les adresses pourraient
> rester listées dans les résultats — l'inverse du but recherché.

Ce n'est qu'ensuite qu'il faudra déclarer le site dans la Google Search
Console et y soumettre le sitemap.

## Reste à faire

- **Déposer le fichier de planning de l'école** dans `documents/` et vérifier le
  bouton « Consulter le planning des cours » (voir « Le planning de l'école »)
- **Vérifier la date de mise en ligne** des pages légales : elles annoncent le
  1ᵉʳ septembre 2026, date fournie par le club. Si le site est publié avant,
  corriger la date dans `mentions-legales.html` (§ « Date de mise en ligne »)
  ainsi que la mention « Dernière mise à jour » des trois pages légales.
- **Photographies du club**, après vérification des autorisations de droit à
  l'image — mineurs en particulier
- Compléter les informations listées plus haut
- Alimenter les pages depuis MyTCI (étape suivante)
- **Retirer le mode chantier** une fois le site complet (voir ci-dessus)
