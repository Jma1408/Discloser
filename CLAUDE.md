# DisCloser — brief pour Claude Code

Répondre en français, clair et concis.

## Règle d'or
Le code existant est fonctionnel : **modifier, jamais tout réécrire**.
- Ne créer AUCUN nouveau fichier sans demander d'abord.
- Ne toucher à AUCUNE mécanique hors de la tâche demandée.
- Garder exactement le même design, noms de classes/IDs, structure.
- Les incohérences du code sont voulues (liens avec d'autres sites de l'ARG) : ne pas les corriger sauf demande.
- Avant chaque modification : annoncer fichiers + lignes touchés. Après : résumer ce qui a changé.
- Une tâche à la fois, modification minimale, vérifier que rien d'existant n'est cassé. Si ambigu : demander.

## Le projet
ARG où le joueur incarne un journaliste indépendant enquêtant sur **PICKAXE** (multinationale pétrolière) qui prépare un virus pour réguler la population mondiale.

**Partie 1 (hors de ce dépôt)** : mail anonyme → vidéo YouTube 2010 de SEB (employé licencié, « toutes les réponses sont sur mon profil ») + document Word (infos entreprise, avertissement sur un langage codé) → LinkedIn de SEB → site PICKAXE → R&D / « pharmacie » : texte codé à traduire → code de login du site secret.

**Partie 2 (ce dépôt)** : site caché au design Windows XP, 5 onglets :
- **Informations** : nom du projet, enjeu (demande de pétrole vs croissance démographique), lien vers documents administratifs censurés.
- **Planning** : tableau type Excel (nom, prénom, rôle…), incomplet, « à compléter ».
- **Laboratoire** : défilement de photos d'une pièce blanche type hôpital ; un code couleur indique Cmd/Ctrl+Shift+D → ouvre le terminal.
- **Données** : verrouillé par mot de passe.
- **Messagerie**.

### Terminal et caméras
Terminal noir, texte vert. `/help` propose :
1. rushes des caméras de surveillance (chemin `/camera00X`, 001 → 007) ;
2. métadonnées (easter egg) ;
3. raccourcis clavier, dont un qui retire la censure de tous les documents (le terminal annonce que les documents d'Informations sont décryptés ; un document « caméras de surveillance et chemin d'accès » apparaît alors dans Informations).

Une vidéo montre une réunion de hauts gradés : le mot de passe de « Données » est sur le planning, à côté du responsable du personnel ; le planning étant incomplet, ils donnent la caméra qui l'a photographié. Sur cette caméra : noms cachés, statuts et mots de passe visibles → code de « Données ».

### Données
3 sous-onglets (Documents, Vidéo, Son). Vidéo verrouillée ; énigme sonore : 4 lettres de l'alphabet phonétique en boucle → chiffres (A=1, B=2…) = mot de passe. La vidéo montre un médecin, un patient et les effets du virus.

### Fin
Messagerie : notification d'IP non reconnue pistée → page listant les IP ; suppression avec les coordonnées GPS exactes du poste (Google Maps, studio M Lacassagne) → courte animation : le journaliste a évité une épidémie.

## État
- Site XP, 5 onglets et terminal existent et fonctionnent.
- Vidéos des caméras pas encore tournées.
- Énigmes des onglets à finaliser une par une, sur demande.

## Tâches
- **A — Terminal, CSS uniquement** : plus anxiogène sans changer le design (dimensions, polices, couleurs, layout) : léger scintillement, glow vert, scanlines discrètes, glitch occasionnel, curseur avec halo. Lisibilité intacte, rien d'autre ne change.
- **B — Caméras (priorité)** : `/camera001` … `/camera007` affiche dans le terminal un cadre « CAMÉRA 00X » + lecteur. Sans fichier vidéo : « [PLACEHOLDER] Caméra 00X opérationnelle, vidéo attendue : videos/camera00X.mp4 », sans erreur console. Config unique en haut du JS du terminal (caméra → chemin). Commande invalide → erreur style terminal. Commandes existantes inchangées.
- **Suivantes** (après validation) : énigmes Informations, Planning, Laboratoire, Données, Messagerie.

## Méthode
1. Analyse complète du projet → résumé (fichiers, rôles, onglets, fenêtres XP, terminal : HTML/CSS/JS, raccourci, commandes ; état de `/help`, caméras, décryptage, contenu de Planning/Données/Messagerie) → **attendre validation**.
2. Puis tâche A, puis B, etc.
