# Site public du Tennis Club Issois — fichiers statiques servis par nginx.
#
# Aucune étape de compilation : le contenu du dépôt est servi tel quel.
# C'est délibéré. Modifier un horaire ne doit jamais supposer de faire tourner
# une chaîne d'outils sur un poste ; déposer le fichier sur GitHub suffit,
# Coolify reconstruit et publie.
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html

# Fichiers présents dans le dépôt mais qui n'ont rien à faire sur le web :
#  - `_source`  : le logo en pleine définition (700 Ko), qui sert à régénérer
#                 les déclinaisons, et le SQL d'extraction du planning ;
#  - `ressources`: les fichiers bruts déposés par le club (captures, logos
#                 d'origine) dont sont tirées les images du site ;
#  - `tests`    : n'existe que pour le développement.
# Aucune page n'y renvoie : les publier exposerait des fichiers sans usage
# public et alourdirait l'image pour rien.
RUN rm -rf /usr/share/nginx/html/_source \
           /usr/share/nginx/html/ressources \
           /usr/share/nginx/html/tests \
    && rm -f /usr/share/nginx/html/Dockerfile \
             /usr/share/nginx/html/nginx.conf \
             /usr/share/nginx/html/LISEZMOI.md

# Échoue la construction si la configuration nginx est invalide, plutôt que de
# publier un conteneur qui refusera de démarrer une fois déployé.
RUN nginx -t

EXPOSE 80
