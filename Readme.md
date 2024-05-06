Cookies List
===

Cookies List est une extension pour Mozilla Firefox et Chrome/Chromium permettant de lister les cookies déposés dans le navigateur.

Le même code source est utilisé pour générer les extensions à destination de Mozilla Firefox et Google Chrome.

# Mozilla Firefox

En exécutant `make firefox` depuis la racine du dépôt, un répertoire `build/firefox` est créé contenant les fichiers sources et une archive de ce répertoire est créée dans `release/`. Cette archive **ne peut pas** être chargée directement dans le navigateur a défaut d'avoir été préalablement signée.

Pour installer l'extension :

1. télécharger le fichier XPI publié dans les *Releases*
2. depuis Firefox, aller sur la page `about:addons`
3. cliquer sur l'icône « Roue crantée » et choisir « Installer un module depuis un fichier… »
4. sélectionner le fichier XPI que vous venez de télécharger

Pour tester une version de travail de l'extension :

1. créer le répertoire des sources en exécutant `make firefox`
2. depuis Firefox, aller sur la page `about:debugging#/runtime/this-firefox`
3. cliquer sur le bouton « Charger un module complémentaire temporaire… »
4. sélectionner le fichier `build/firefox/manifest.json`

*Attention, il est possible que l'extension ne dispose pas alors de certaines permissions nécessaires à son fonctionnement. Il vous faut alors les ajouter manuellement, en particulier dans l'onglet « Permissions » de l'écran de gestion de l'extension, il faut que l'option « Accéder à vos données pour tous les sites web » soient cochée.*

# Chromium

En exécutant `make chrome` depuis la racine du dépôt, un répertoire `build/chrome` est créé contenant les fichiers sources et un fichier d'extension au format CRX, ainsi qu'une clef privée au format PEM, sont créées dans `release/`. Ce fichier CRX **ne peut pas** être chargé directement dans la version Windows de Chromium a défaut d'avoir été publié sur le Chrome Web Store.

Pour installer l'extension **dans Chromium pour Linux uniquement** :

1. télécharger le fichier CRX publiée dans les *Releases* ou généré à partir des sources dans le répertoire `releases/`
2. depuis Chromium, aller sur la page `chrome://extensions`
3. glisser-déposer le fichier CRX sur la page

Pour tester une version de travail de l'extension :

1. créer le répertoire des sources en exécutant `make chrome`
2. depuis Chromium, aller sur la page `chrome://extensions`
3. activer le « Mode développeur » en cochant l'option en haut à droite de la page
4. cliquer sur le bouton « Charger l'extension non empaquetée
3. sélectionner le dossier `build/chrome`

# Utilisation

Une fois installée, une icône apparaît dans la barre du navigateur, en cliquant sur celle ci, un nouvel onglet s'ouvre et liste les cookies présents dans la navigateur.

Le bouton « Exporter (PDF) » permet de télécharger une copie au format PDF de la page, le bouton « Exporter (CSV) » permet de télécharger la liste des cookies présents dans un fichier au format CSV.

Le bouton « Tout effacer » efface l'ensemble des cookies du navigateur. Il est possible d'effacer chaque cookie individuellement au moyen des icônes « Poubelle » présentes sur chaque ligne.

# Licence

Cookies List est disponible sous license GPLv3.

Pour de plus amples informations, voir le fichier ``LICENSE`` inclus.
