/* ==========================================================
   mail.js - Logique de la boîte mail (ARG)
   Vanilla JS, aucun framework.
   ========================================================== */

/* ---------- CONSTANTES FACILES À MODIFIER ---------- */

// Texte affiché dans le bloc de fin du mail principal (#script-fin-mail)
const TEXTE_FIN_MAIL = "[SCRIPT / CODE À INSÉRER ICI]";

// Liens des pièces jointes du mail principal
const LIEN_PIECE_JOINTE_PDF = "in-progress.html";
const LIEN_PIECE_JOINTE_VIDEO = "in-progress.html";

// Lien des menus (engrenage, avatar)
const LIEN_MENUS = "in-progress.html";

// Clé de sauvegarde dans le localStorage
const CLE_STOCKAGE = "arg_mail_etat_lu_v1";

// Identité du joueur
const JOUEUR = {
  nom: "Alex Morel",
  adresse: "alex.morel.reportages@gmail.com"
};

/* ---------- OUTIL : DATES RELATIVES ----------
   Génère une date à partir de "maintenant" moins un nombre d'heures.
   Ainsi les mails restent crédibles quel que soit le jour d'ouverture. */
function ilYaHeures(h) {
  return new Date(Date.now() - h * 3600 * 1000);
}

/* ---------- TABLEAU DES MAILS ----------
   Du plus récent au plus ancien.
   Champs : id, expediteur, adresse, objet, apercu, corps, date, lu, pieces_jointes
   - date : objet Date (utiliser ilYaHeures(n) ou new Date(...))
   - lu : état initial (écrasé par le localStorage si présent)
   - pieces_jointes : tableau { nom, type ("pdf" | "video"), lien } */
const MAILS = [
  {
    id: 1,
    expediteur: "Anonyme",
    adresse: "contact.anonyme@protonmail.com",
    objet: "Une enquête qui mérite votre attention",
    apercu: "Bonjour, Je vous contacte car j'aurais besoin de vos services pour enquêter sur une entreprise…",
    corps:
`Bonjour,

Je vous contacte car j'aurais besoin de vos services pour enquêter sur une entreprise qui a récemment attiré mon attention : Pickaxe Corporation.

Il y a quelques jours, une vidéo assez étrange est apparue dans mes recommandations YouTube. Elle a été publiée par un certain Seb, un ancien employé de Pickaxe, et ne compte que quelques vues. Je serais probablement passé à côté si certains éléments de son discours ne m'avaient pas interpellé.

Dans cette vidéo, il évoque des choses assez inquiétantes sur son ancienne entreprise. Le problème, c'est qu'il est difficile de savoir ce qui relève d'informations réelles ou d'un ancien employé qui aurait mal vécu son licenciement. Malgré tout, certains détails m'ont poussé à faire quelques recherches de mon côté.

J'ai rassemblé les premières informations que j'ai pu trouver dans un document joint à ce mail. Je vous transmets également la vidéo originale. Pour l'instant, je n'ai rien de suffisamment concret pour tirer des conclusions, mais l'entreprise a commencé à se spécialiser dans les recherches pharmaceutiques, je pense que le sujet mérite qu'on s'y attarde.

Je préfère ne pas vous orienter vers une conclusion particulière. Je souhaite simplement comprendre ce qui se passe réellement. Si cette vidéo est aussi anodine qu'elle en a l'air, nous le saurons rapidement. Mais si certains éléments sont fondés, je préfère ne pas laisser passer ça.

Vous trouverez les deux pièces jointes nécessaires pour commencer. Tenez-moi au courant de vos premières découvertes dès que possible.

Cordialement,`,
    date: ilYaHeures(0.4), // aujourd'hui, quelques minutes avant 9h22
    lu: false,
    principal: true, // active l'affichage du bloc #script-fin-mail
    pieces_jointes: [
      { nom: "Documents_recherches.pdf", type: "pdf", lien: LIEN_PIECE_JOINTE_PDF },
      { nom: "Video_Seb_YouTube", type: "video", lien: LIEN_PIECE_JOINTE_VIDEO }
    ]
  },
  {
    id: 2,
    expediteur: "EDF Particuliers",
    adresse: "ne-pas-repondre@contact.edf-particuliers.fr",
    objet: "Dernier rappel : facture impayée",
    apercu: "Sans règlement sous 7 jours, une coupure d'électricité pourra être programmée…",
    corps:
`Bonjour Alex Morel,

Malgré nos précédents courriers, nous n'avons pas reçu le règlement de votre facture n° 4471-089 d'un montant de 186,52 €, échue le 28 septembre.

Sans règlement sous 7 jours, une coupure d'électricité pourra être programmée à votre domicile. Des frais d'intervention de 34,00 € vous seront alors facturés.

Vous pouvez régler en ligne depuis votre espace client ou contacter notre service de médiation si vous rencontrez des difficultés.

Cordialement,
Le service recouvrement EDF`,
    date: ilYaHeures(2.5),
    lu: false,
    pieces_jointes: []
  },
  {
    id: 3,
    expediteur: "Banque Crédit Lyonnais",
    adresse: "alertes@creditlyonnais-notifications.fr",
    objet: "Avis de découvert sur votre compte",
    apercu: "Votre compte présente un solde débiteur de -312,40 €…",
    corps:
`Madame, Monsieur,

Votre compte courant n° ••••4829 présente à ce jour un solde débiteur de -312,40 €, au-delà de votre découvert autorisé de 150,00 €.

Des frais d'incident de 8,00 € par opération rejetée s'appliquent dès aujourd'hui. Nous vous invitons à approvisionner votre compte avant le 12 octobre afin d'éviter un rejet de vos prochains prélèvements.

Votre conseiller reste à votre disposition pour étudier votre situation.

Crédit Lyonnais, service clientèle`,
    date: ilYaHeures(20),
    lu: false,
    pieces_jointes: []
  },
  {
    id: 4,
    expediteur: "Mme Fabre (Propriétaire)",
    adresse: "c.fabre.immo@orange.fr",
    objet: "Loyer d'octobre",
    apercu: "Bonjour Alex, je n'ai toujours pas reçu votre loyer, pouvez-vous régulariser rapidement ?…",
    corps:
`Bonjour Alex,

Je n'ai toujours pas reçu votre loyer d'octobre (620,00 € charges comprises), qui était dû le 5. C'est la deuxième fois en trois mois.

Pouvez-vous régulariser rapidement ? Sans paiement avant le 15, je serai obligée de transmettre le dossier à mon agence, et je préférerais vraiment éviter d'en arriver là.

Merci de me répondre rapidement.

Mme Fabre`,
    date: ilYaHeures(30),
    lu: false,
    pieces_jointes: []
  },
  {
    id: 5,
    expediteur: "Rédaction Le Courrier Indépendant",
    adresse: "redaction@lecourrier-independant.fr",
    objet: "Re : Proposition d'article",
    apercu: "Merci pour votre pitch, malheureusement nous n'avons pas de budget pigiste ce mois-ci…",
    corps:
`Bonjour Alex,

Merci pour votre pitch sur les marchés de gros de Rungis, le sujet est intéressant.

Malheureusement, nous n'avons pas de budget pigiste ce mois-ci, et probablement pas avant janvier. Votre dernier article (350 €) n'a d'ailleurs été validé en comptabilité que la semaine dernière.

Nous gardons votre proposition de côté et reviendrons vers vous si la situation évolue.

Bien cordialement,
La rédaction`,
    date: ilYaHeures(72),
    lu: true,
    pieces_jointes: []
  },
  {
    id: 6,
    expediteur: "Pôle Emploi",
    adresse: "ne-pas-repondre@pole-emploi.fr",
    objet: "Actualisation mensuelle de votre situation",
    apercu: "N'oubliez pas de vous actualiser avant le 15 pour maintenir vos droits…",
    corps:
`Bonjour Alex Morel,

N'oubliez pas de vous actualiser avant le 15 octobre pour maintenir vos droits.

À défaut d'actualisation dans les délais, le versement de votre allocation mensuelle de 487,20 € sera suspendu. Vous disposez de 6 jours pour déclarer vos revenus d'activité et vos périodes de travail.

Connectez-vous à votre espace personnel pour effectuer cette démarche.

Pôle Emploi`,
    date: ilYaHeures(120),
    lu: true,
    pieces_jointes: []
  },
  {
    id: 7,
    expediteur: "Leclerc Drive",
    adresse: "commandes@drive.e-leclerc.com",
    objet: "Votre commande n'a pas pu être validée",
    apercu: "Le paiement a été refusé par votre banque…",
    corps:
`Bonjour Alex,

Le paiement de votre commande n° D-5582913 (montant : 47,86 €) a été refusé par votre banque.

Votre créneau de retrait a été annulé et vos produits ont été remis en rayon. Vous pouvez renouveler votre commande avec un autre moyen de paiement.

Nous vous remercions de votre compréhension.

Leclerc Drive`,
    date: new Date(2026, 9, 6, 18, 42), // 6 oct. (date fixe)
    lu: false,
    pieces_jointes: []
  },
  {
    id: 8,
    expediteur: "Free Mobile",
    adresse: "service-client@free-mobile.fr",
    objet: "Facture impayée : suspension de ligne",
    apercu: "Votre forfait sera suspendu sous 48h…",
    corps:
`Bonjour Alex Morel,

Votre facture du mois de septembre (19,99 €) reste impayée suite au rejet de votre prélèvement du 4 octobre.

Votre forfait sera suspendu sous 48h si le règlement n'est pas effectué. Des frais de rejet de 12,00 € ont été ajoutés, portant le total dû à 31,99 €.

Régularisez votre situation depuis votre espace abonné pour éviter la suspension de votre ligne.

Free Mobile`,
    date: new Date(2026, 9, 2, 9, 15), // 2 oct. (date fixe)
    lu: true,
    pieces_jointes: []
  }
];

/* ---------- COULEURS DES AVATARS ---------- */
const COULEURS_AVATAR = ["#e8710a", "#1a73e8", "#9334e6", "#d93025", "#188038", "#c5221f", "#00796b", "#5f6368"];

// Couleur stable selon l'expéditeur
function couleurAvatar(nom) {
  let somme = 0;
  for (let i = 0; i < nom.length; i++) somme += nom.charCodeAt(i);
  return COULEURS_AVATAR[somme % COULEURS_AVATAR.length];
}

/* ---------- RÉFÉRENCES DOM ---------- */
const $ = (id) => document.getElementById(id);
const elListe = $("mail-list");
const elCompteur = $("unread-count");
const elVide = $("reader-empty");
const elLecteur = $("reader-content");
const elRecherche = $("search-input");
const elSidebar = $("sidebar");

let mailSelectionne = null; // id du mail actuellement ouvert

/* ---------- PERSISTANCE (localStorage) ---------- */

// Charge l'état lu/non lu sauvegardé
function chargerEtat() {
  try {
    const sauvegarde = JSON.parse(localStorage.getItem(CLE_STOCKAGE));
    if (sauvegarde && typeof sauvegarde === "object") {
      MAILS.forEach((m) => {
        if (sauvegarde[m.id] !== undefined) m.lu = sauvegarde[m.id];
      });
    }
  } catch (e) { /* stockage indisponible : on garde l'état par défaut */ }
}

// Sauvegarde l'état lu/non lu
function sauvegarderEtat() {
  try {
    const etat = {};
    MAILS.forEach((m) => { etat[m.id] = m.lu; });
    localStorage.setItem(CLE_STOCKAGE, JSON.stringify(etat));
  } catch (e) { /* ignoré */ }
}

// Remet tout à zéro (utilisable depuis la console : resetMails())
function resetMails() {
  try { localStorage.removeItem(CLE_STOCKAGE); } catch (e) { /* ignoré */ }
  location.reload();
}
window.resetMails = resetMails;

/* ---------- FORMATAGE DES DATES ---------- */
const JOURS = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];
const MOIS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

function memeJour(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function heureFormat(d) {
  return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
}

// Nombre de jours calendaires entre une date et aujourd'hui
function joursEcoules(d) {
  const a = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const now = new Date();
  const b = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((b - a) / 86400000);
}

// Date courte pour la liste : heure / "Hier" / jour de semaine / date
function dateCourte(d) {
  const j = joursEcoules(d);
  if (j <= 0) return heureFormat(d);
  if (j === 1) return "Hier";
  if (j < 7) return JOURS[d.getDay()];
  return d.getDate() + " " + MOIS[d.getMonth()];
}

// Date longue pour l'en-tête du mail ouvert
function dateLongue(d) {
  const base = JOURS[d.getDay()] + " " + d.getDate() + " " + MOIS[d.getMonth()] + " " + d.getFullYear() + ", " + heureFormat(d);
  const j = joursEcoules(d);
  if (j <= 0) return base + " (aujourd'hui)";
  if (j === 1) return base + " (hier)";
  return base + " (il y a " + j + " jours)";
}

/* ---------- OUTILS ---------- */

// Échappe le HTML pour éviter toute injection
function echapper(txt) {
  const div = document.createElement("div");
  div.textContent = txt;
  return div.innerHTML;
}

// Icônes SVG des pièces jointes
function iconePieceJointe(type) {
  if (type === "pdf") {
    return `<svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true">
      <path d="M6 2h8l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="#d93025"/>
      <path d="M14 2l5 5h-4a1 1 0 0 1-1-1V2z" fill="#f28b82"/>
      <text x="12" y="17.5" text-anchor="middle" font-size="6.5" font-weight="700" fill="#fff" font-family="Arial">PDF</text>
    </svg>`;
  }
  return `<svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true">
    <rect x="2" y="5" width="20" height="14" rx="3" fill="#ea4335"/>
    <path d="M10 9l5 3-5 3V9z" fill="#fff"/>
  </svg>`;
}

/* ---------- COMPTEUR DE NON LUS ---------- */
function majCompteur() {
  const n = MAILS.filter((m) => !m.lu).length;
  elCompteur.textContent = n;
  elCompteur.classList.toggle("zero", n === 0);
}

/* ---------- AFFICHAGE DE LA LISTE ---------- */
function afficherListe() {
  const terme = elRecherche.value.trim().toLowerCase();

  // Filtre : expéditeur, objet ou contenu
  const filtres = MAILS.filter((m) => {
    if (!terme) return true;
    return (
      m.expediteur.toLowerCase().includes(terme) ||
      m.objet.toLowerCase().includes(terme) ||
      m.corps.toLowerCase().includes(terme)
    );
  });

  elListe.innerHTML = "";

  if (filtres.length === 0) {
    elListe.innerHTML = '<div class="no-result">Aucun mail ne correspond à votre recherche.</div>';
    return;
  }

  filtres.forEach((m, i) => {
    const carte = document.createElement("div");
    carte.className = "mail-card " + (m.lu ? "read" : "unread") + (m.id === mailSelectionne ? " selected" : "");
    carte.dataset.id = m.id;
    carte.setAttribute("role", "listitem");
    carte.style.animationDelay = Math.min(i * 40, 300) + "ms";
    carte.innerHTML = `
      <div class="avatar" style="background:${couleurAvatar(m.expediteur)}">${echapper(m.expediteur.charAt(0).toUpperCase())}</div>
      <div class="mail-info">
        <div class="mail-row">
          <span class="mail-sender">${echapper(m.expediteur)}</span>
          <span class="mail-date">${dateCourte(m.date)}</span>
        </div>
        <div class="mail-subject">${echapper(m.objet)}</div>
        <div class="mail-preview">${echapper(m.apercu)}</div>
      </div>`;
    carte.addEventListener("click", () => ouvrirMail(m.id));
    elListe.appendChild(carte);
  });
}

/* ---------- OUVERTURE D'UN MAIL ---------- */
function ouvrirMail(id) {
  const m = MAILS.find((x) => x.id === id);
  if (!m) return;

  mailSelectionne = id;

  // Marque comme lu + sauvegarde + compteur
  if (!m.lu) {
    m.lu = true;
    sauvegarderEtat();
  }
  majCompteur();

  // Construit le contenu du mail
  let html = `
    <h1 class="reader-subject">${echapper(m.objet)}</h1>
    <div class="reader-meta">
      <div class="avatar" style="background:${couleurAvatar(m.expediteur)}">${echapper(m.expediteur.charAt(0).toUpperCase())}</div>
      <div class="reader-from">
        <strong>${echapper(m.expediteur)}</strong><span class="addr"><${echapper(m.adresse)}></span>
        <span class="to">À : moi (${echapper(JOUEUR.adresse)})</span>
      </div>
      <div class="reader-date">${dateLongue(m.date)}</div>
    </div>
    <div class="reader-body">${echapper(m.corps)}</div>`;

  // Bloc réservé au script / code secret (mail principal uniquement)
  if (m.principal) {
    html += `<div id="script-fin-mail">${TEXTE_FIN_MAIL}</div>`;
  }

  // Pièces jointes
  if (m.pieces_jointes && m.pieces_jointes.length > 0) {
    html += `<div class="attachments">
      <div class="attachments-title">${m.pieces_jointes.length} pièces jointes</div>
      <div class="attachments-list">`;
    m.pieces_jointes.forEach((pj) => {
      html += `
        <a class="attachment" href="${echapper(pj.lien)}" target="_blank" rel="noopener">
          ${iconePieceJointe(pj.type)}
          <div>
            <div class="attachment-name">${echapper(pj.nom)}</div>
            <div class="attachment-type">${pj.type === "pdf" ? "Document PDF" : "Vidéo / lien"}</div>
          </div>
        </a>`;
    });
    html += `</div></div>`;
  }

  // Remplace le contenu (relance l'animation d'ouverture)
  elLecteur.hidden = true;
  elLecteur.innerHTML = html;
  void elLecteur.offsetWidth; // force le reflow pour relancer l'animation
  elLecteur.hidden = false;
  elVide.style.display = "none";

  afficherListe(); // met à jour les styles lu / sélectionné
}

/* ---------- RECHERCHE EN TEMPS RÉEL ---------- */
elRecherche.addEventListener("input", afficherListe);

/* ---------- MENU HAMBURGER : réduit / étend la colonne gauche ---------- */
$("btn-hamburger").addEventListener("click", () => {
  elSidebar.classList.toggle("collapsed");
});

/* ---------- MENUS DÉROULANTS (engrenage et avatar) ---------- */
const menuSettings = $("menu-settings");
const menuAvatar = $("menu-avatar");

// Les liens des menus pointent vers LIEN_MENUS
document.querySelectorAll(".dropdown a").forEach((a) => {
  a.setAttribute("href", LIEN_MENUS);
});

function basculerMenu(menu, autre) {
  autre.hidden = true;
  menu.hidden = !menu.hidden;
}

$("btn-settings").addEventListener("click", (e) => {
  e.stopPropagation();
  basculerMenu(menuSettings, menuAvatar);
});

$("btn-avatar").addEventListener("click", (e) => {
  e.stopPropagation();
  basculerMenu(menuAvatar, menuSettings);
});

// Fermer les menus au clic ailleurs
document.addEventListener("click", () => {
  menuSettings.hidden = true;
  menuAvatar.hidden = true;
});

/* ---------- FENÊTRE DE RÉDACTION (Compose) ---------- */
const fenetreCompose = $("compose-window");
const erreurCompose = $("compose-error");

$("btn-compose").addEventListener("click", () => {
  erreurCompose.hidden = true;
  fenetreCompose.hidden = false;
  $("compose-to").focus();
});

$("compose-close").addEventListener("click", () => {
  fenetreCompose.hidden = true;
});

// L'envoi échoue toujours : le joueur ne peut pas vraiment envoyer
$("compose-send").addEventListener("click", () => {
  erreurCompose.hidden = true;
  void erreurCompose.offsetWidth; // relance l'animation
  erreurCompose.hidden = false;
});

/* ---------- BOUTON CACHÉ DE RESET (tests) ---------- */
$("btn-reset").addEventListener("click", resetMails);

/* ---------- INITIALISATION ---------- */
chargerEtat();      // récupère l'état lu/non lu sauvegardé
majCompteur();      // compteur de non lus
afficherListe();    // affiche la liste (aucun mail n'est ouvert automatiquement)