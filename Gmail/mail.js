/* ==========================================================
   mail.js - Logique de la boîte mail (ARG)
   Vanilla JS, aucun framework.
   ========================================================== */

/* ---------- INDICES (config unique) ----------
   étape | action attendue | délai (min) | expéditeur | texte | actif
   Le timer démarre au chargement de la page ; ?test=1 divise les délais par 60. */
const CLE_INDICES = "discloser_indices_mail";
const INDICES = [
  {
    id: "pieces-jointes",
    action: "ouvrir une pièce jointe du premier mail (vidéo ou document)",
    delaiMin: 5,
    expediteur: "Anonyme",
    adresse: "contact.anonyme@nuamail.ch",
    objet: "Ce qu'il a laissé",
    texte: "Vous n'avez toujours rien ouvert de ce que Seb a laissé. Tout part de là.\n\n— A.",
    actif: true
  }
];

/* ---------- CONSTANTES FACILES À MODIFIER ---------- */

// Texte affiché dans le bloc de fin du mail principal (#script-fin-mail)
const TEXTE_FIN_MAIL = ""; // vide : aucun bloc affiché

// Pièces jointes du mail principal
// Document : s'affiche dans la messagerie (fenêtre superposée #doc-seb).
// Vidéo : lien YouTube, ouvert dans un nouvel onglet.
const LIEN_PIECE_JOINTE_PDF = "#doc-seb";
const LIEN_PIECE_JOINTE_VIDEO = "https://youtu.be/dvpYCm5TqfE";

// Clés de sauvegarde dans le localStorage
const CLE_STOCKAGE = "arg_mail_etat_lu_v1";      // état lu / non lu
const CLE_ARCHIVES = "arg_mail_archives_v1";     // mails archivés
const CLE_REGLAGES = "arg_mail_reglages_v1";     // thème, densité, tri, colonne réduite

// Identité du joueur
const JOUEUR = {
  nom: "Enquêteur",
  adresse: "enqueteur@messagerie-web.net"
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
    adresse: "contact.anonyme@nuamail.ch",
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
    expediteur: "Élexia Particuliers",
    adresse: "ne-pas-repondre@contact.elexia-particuliers.fr",
    objet: "Dernier rappel : facture impayée",
    apercu: "Sans règlement sous 7 jours, une coupure d'électricité pourra être programmée…",
    corps:
`Bonjour,

Malgré nos précédents courriers, nous n'avons pas reçu le règlement de votre facture n° 4471-089 d'un montant de 186,52 €, échue le 28 septembre.

Sans règlement sous 7 jours, une coupure d'électricité pourra être programmée à votre domicile. Des frais d'intervention de 34,00 € vous seront alors facturés.

Vous pouvez régler en ligne depuis votre espace client ou contacter notre service de médiation si vous rencontrez des difficultés.

Cordialement,
Le service recouvrement Élexia`,
    date: ilYaHeures(2.5),
    lu: false,
    pieces_jointes: []
  },
  {
    id: 3,
    expediteur: "Banque Crédit Rhodanien",
    adresse: "alertes@creditrhodanien-notifications.fr",
    objet: "Avis de découvert sur votre compte",
    apercu: "Votre compte présente un solde débiteur de -312,40 €…",
    corps:
`Madame, Monsieur,

Votre compte courant n° ••••4829 présente à ce jour un solde débiteur de -312,40 €, au-delà de votre découvert autorisé de 150,00 €.

Des frais d'incident de 8,00 € par opération rejetée s'appliquent dès aujourd'hui. Nous vous invitons à approvisionner votre compte avant le 12 octobre afin d'éviter un rejet de vos prochains prélèvements.

Votre conseiller reste à votre disposition pour étudier votre situation.

Crédit Rhodanien, service clientèle`,
    date: ilYaHeures(20),
    lu: false,
    pieces_jointes: []
  },
  {
    id: 4,
    expediteur: "Mme Fabre (Propriétaire)",
    adresse: "c.fabre.immo@helionet.fr",
    objet: "Loyer d'octobre",
    apercu: "Bonjour Alex, je n'ai toujours pas reçu votre loyer, pouvez-vous régulariser rapidement ?…",
    corps:
`Bonjour,

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
`Bonjour,

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
    expediteur: "Agence Horizon Emploi",
    adresse: "ne-pas-repondre@horizon-emploi.fr",
    objet: "Actualisation mensuelle de votre situation",
    apercu: "N'oubliez pas de vous actualiser avant le 15 pour maintenir vos droits…",
    corps:
`Bonjour,

N'oubliez pas de vous actualiser avant le 15 octobre pour maintenir vos droits.

À défaut d'actualisation dans les délais, le versement de votre allocation mensuelle de 487,20 € sera suspendu. Vous disposez de 6 jours pour déclarer vos revenus d'activité et vos périodes de travail.

Connectez-vous à votre espace personnel pour effectuer cette démarche.

Agence Horizon Emploi`,
    date: ilYaHeures(120),
    lu: true,
    pieces_jointes: []
  },
  {
    id: 7,
    expediteur: "Marché Plus Drive",
    adresse: "commandes@drive.marcheplus.fr",
    objet: "Votre commande n'a pas pu être validée",
    apercu: "Le paiement a été refusé par votre banque…",
    corps:
`Bonjour,

Le paiement de votre commande n° D-5582913 (montant : 47,86 €) a été refusé par votre banque.

Votre créneau de retrait a été annulé et vos produits ont été remis en rayon. Vous pouvez renouveler votre commande avec un autre moyen de paiement.

Nous vous remercions de votre compréhension.

Marché Plus Drive`,
    date: new Date(2026, 9, 6, 18, 42), // 6 oct. (date fixe)
    lu: false,
    pieces_jointes: []
  },
  {
    id: 8,
    expediteur: "Libra Mobile",
    adresse: "service-client@libra-mobile.fr",
    objet: "Facture impayée : suspension de ligne",
    apercu: "Votre forfait sera suspendu sous 48h…",
    corps:
`Bonjour,

Votre facture du mois de septembre (19,99 €) reste impayée suite au rejet de votre prélèvement du 4 octobre.

Votre forfait sera suspendu sous 48h si le règlement n'est pas effectué. Des frais de rejet de 12,00 € ont été ajoutés, portant le total dû à 31,99 €.

Régularisez votre situation depuis votre espace abonné pour éviter la suspension de votre ligne.

Libra Mobile`,
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
let archives = new Set();   // ids des mails archivés
const reglages = { theme: "clair", densite: "confortable", tri: "recents", colonneReduite: false };

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

// Lecture / écriture JSON protégées (stockage parfois indisponible)
function lireStockage(cle) {
  try { return JSON.parse(localStorage.getItem(cle)); } catch (e) { return null; }
}
function ecrireStockage(cle, valeur) {
  try { localStorage.setItem(cle, JSON.stringify(valeur)); } catch (e) { /* ignoré */ }
}

function chargerArchives() {
  const liste = lireStockage(CLE_ARCHIVES);
  if (Array.isArray(liste)) archives = new Set(liste);
}
function sauvegarderArchives() { ecrireStockage(CLE_ARCHIVES, [...archives]); }

function chargerReglages() {
  const r = lireStockage(CLE_REGLAGES);
  if (r && typeof r === "object") Object.assign(reglages, r);
}
function sauvegarderReglages() { ecrireStockage(CLE_REGLAGES, reglages); }

// Remet tout à zéro (utilisable depuis la console : resetMails())
function resetMails() {
  try {
    [CLE_STOCKAGE, CLE_ARCHIVES, CLE_REGLAGES].forEach((cle) => localStorage.removeItem(cle));
  } catch (e) { /* ignoré */ }
  indices.effacer();
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
    <rect x="2" y="5" width="20" height="14" rx="3" fill="#d93025"/>
    <path d="M10 9l5 3-5 3V9z" fill="#fff"/>
  </svg>`;
}

/* ---------- COMPTEUR DE NON LUS ---------- */
function majCompteur() {
  const n = MAILS.filter((m) => !m.lu && !archives.has(m.id)).length;
  elCompteur.textContent = n;
  elCompteur.classList.toggle("zero", n === 0);
}

/* ---------- AFFICHAGE DE LA LISTE ---------- */
function afficherListe() {
  const terme = elRecherche.value.trim().toLowerCase();

  // Filtre : expéditeur, objet ou contenu
  const filtres = MAILS.filter((m) => {
    if (archives.has(m.id)) return false;
    if (!terme) return true;
    return (
      m.expediteur.toLowerCase().includes(terme) ||
      m.objet.toLowerCase().includes(terme) ||
      m.corps.toLowerCase().includes(terme)
    );
  });

  // Tri par date selon le réglage
  filtres.sort((a, b) => (reglages.tri === "anciens" ? a.date - b.date : b.date - a.date));

  elListe.innerHTML = "";

  if (filtres.length === 0) {
    elListe.innerHTML = terme
      ? '<div class="no-result">Aucun mail ne correspond à votre recherche.</div>'
      : '<div class="no-result">Aucun message. Cliquez sur « Boîte de réception » pour réafficher les messages archivés.</div>';
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
  document.body.classList.add("mail-ouvert"); // mobile : le mail passe en plein écran

  // Marque comme lu + sauvegarde + compteur
  if (!m.lu) {
    m.lu = true;
    sauvegarderEtat();
  }
  majCompteur();

  // Construit le contenu du mail
  let html = `
    <div class="reader-actions">
      <button type="button" data-action="retour" title="Retour à la liste" aria-label="Retour à la liste">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M20 11H7.8l5.6-5.6L12 4l-8 8 8 8 1.4-1.4L7.8 13H20z" fill="currentColor"/></svg>
      </button>
      <button type="button" data-action="non-lu" title="Marquer comme non lu" aria-label="Marquer comme non lu">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4l-8 5-8-5V6l8 5 8-5z" fill="currentColor"/></svg>
      </button>
      <button type="button" data-action="archiver" title="Archiver" aria-label="Archiver">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M20.5 5.2l-1.4-1.7A1.5 1.5 0 0 0 18 3H6a1.5 1.5 0 0 0-1.1.5L3.5 5.2A2 2 0 0 0 3 6.5V19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.5a2 2 0 0 0-.5-1.3zM12 17.5L6.5 12H10v-2h4v2h3.5zM5.1 5l.8-1h12l.9 1z" fill="currentColor"/></svg>
      </button>
    </div>
    <h1 class="reader-subject">${echapper(m.objet)}</h1>
    <div class="reader-meta">
      <div class="avatar" style="background:${couleurAvatar(m.expediteur)}">${echapper(m.expediteur.charAt(0).toUpperCase())}</div>
      <div class="reader-from">
        <strong>${echapper(m.expediteur)}</strong><span class="addr">&lt;${echapper(m.adresse)}&gt;</span>
        <span class="to">À : moi (${echapper(JOUEUR.adresse)})</span>
      </div>
      <div class="reader-date">${dateLongue(m.date)}</div>
    </div>
    <div class="reader-body">${echapper(m.corps)}</div>`;

  // Bloc réservé au script / code secret (mail principal uniquement)
  if (m.principal) {
    if (TEXTE_FIN_MAIL) html += `<div id="script-fin-mail">${TEXTE_FIN_MAIL}</div>`;
  }

  // Pièces jointes
  if (m.pieces_jointes && m.pieces_jointes.length > 0) {
    html += `<div class="attachments">
      <div class="attachments-title">${m.pieces_jointes.length} ${m.pieces_jointes.length > 1 ? "pièces jointes" : "pièce jointe"}</div>
      <div class="attachments-list">`;
    m.pieces_jointes.forEach((pj) => {
      html += `
        <a class="attachment" data-type="${pj.type}" href="${echapper(pj.lien)}"${/^https?:\/\//.test(pj.lien) ? ' target="_blank" rel="noopener"' : ""}>
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
  reglages.colonneReduite = !reglages.colonneReduite;
  sauvegarderReglages();
  appliquerReglages();
});

/* ---------- MENUS DÉROULANTS (engrenage et avatar) ---------- */
const menuSettings = $("menu-settings");
const menuAvatar = $("menu-avatar");

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

// Échap ferme les menus
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    menuSettings.hidden = true;
    menuAvatar.hidden = true;
  }
});

/* ---------- MESSAGE TEMPORAIRE ---------- */
const elToast = document.createElement("div");
elToast.className = "toast";
elToast.setAttribute("role", "status");
document.body.appendChild(elToast);
let timerToast = null;

function afficherToast(texte) {
  elToast.textContent = texte;
  elToast.classList.add("visible");
  clearTimeout(timerToast);
  timerToast = setTimeout(() => elToast.classList.remove("visible"), 2600);
}

/* ---------- RÉGLAGES (thème, densité, tri, colonne) ---------- */
function appliquerReglages() {
  const racine = document.documentElement;
  racine.classList.toggle("theme-sombre", reglages.theme === "sombre");
  racine.classList.toggle("densite-compacte", reglages.densite === "compacte");
  elSidebar.classList.toggle("collapsed", reglages.colonneReduite);
  menuSettings.querySelector('[data-action="theme"]').textContent =
    "Thème : " + (reglages.theme === "sombre" ? "sombre" : "clair");
  menuSettings.querySelector('[data-action="densite"]').textContent =
    "Densité : " + (reglages.densite === "compacte" ? "compacte" : "confortable");
  menuSettings.querySelector('[data-action="tri"]').textContent =
    "Tri : " + (reglages.tri === "anciens" ? "plus anciens d'abord" : "plus récents d'abord");
}

const ACTIONS_MENU = {
  theme() {
    reglages.theme = reglages.theme === "sombre" ? "clair" : "sombre";
    sauvegarderReglages(); appliquerReglages();
  },
  densite() {
    reglages.densite = reglages.densite === "compacte" ? "confortable" : "compacte";
    sauvegarderReglages(); appliquerReglages();
  },
  tri() {
    reglages.tri = reglages.tri === "anciens" ? "recents" : "anciens";
    sauvegarderReglages(); appliquerReglages(); afficherListe();
  },
  "tout-lu"() {
    MAILS.forEach((m) => { m.lu = true; });
    sauvegarderEtat(); majCompteur(); afficherListe();
    afficherToast("Tous les messages sont marqués comme lus");
  },
  compte() { afficherToast("Fonction indisponible pour ce compte"); },
  deconnexion() { afficherToast("Déconnexion impossible : session en cours"); }
};

document.querySelectorAll(".dropdown-item").forEach((bouton) => {
  bouton.addEventListener("click", () => ACTIONS_MENU[bouton.dataset.action]());
});

/* ---------- ACTIONS DU MAIL OUVERT ---------- */
function fermerMail() {
  mailSelectionne = null;
  document.body.classList.remove("mail-ouvert");
  elLecteur.hidden = true;
  elLecteur.innerHTML = "";
  elVide.style.display = "";
  afficherListe();
}

elLecteur.addEventListener("click", (e) => {
  // Pièce jointe sans lien réel : message au lieu d'une page introuvable
  const pj = e.target.closest(".attachment");
  if (pj) {
    indices.fait("pieces-jointes"); // action attendue faite : plus d'indice
    const lien = pj.getAttribute("href") || "";
    if (pj.dataset.type === "pdf") {          // document : fenêtre superposée
      e.preventDefault();
      ouvrirDocument();
    }
    return;
  }

  const bouton = e.target.closest("[data-action]");
  if (!bouton || mailSelectionne === null) return;
  const m = MAILS.find((x) => x.id === mailSelectionne);

  if (bouton.dataset.action === "retour") {
    fermerMail();
  } else if (bouton.dataset.action === "non-lu") {
    m.lu = false;
    sauvegarderEtat(); majCompteur(); fermerMail();
    afficherToast("Message marqué comme non lu");
  } else if (bouton.dataset.action === "archiver") {
    archives.add(m.id);
    sauvegarderArchives(); majCompteur(); fermerMail();
    afficherToast("Message archivé");
  }
});

/* ---------- ENTRÉE « BOÎTE DE RÉCEPTION » : tout réafficher ---------- */
const elBoite = document.querySelector(".inbox-entry");

function afficherTout() {
  elRecherche.value = "";
  const n = archives.size;
  if (n > 0) {
    archives.clear();
    sauvegarderArchives();
    afficherToast(n > 1 ? n + " messages restaurés" : "1 message restauré");
  }
  majCompteur();
  afficherListe();
}

elBoite.addEventListener("click", afficherTout);
elBoite.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); afficherTout(); }
});

/* Moteur d'indices (local à ce site) : un timer par étape.
   - demarrer(id) : l'étape devient l'étape en cours (heure mémorisée)
   - fait(id)     : action faite → timer annulé (et étapes précédentes aussi),
                    l'étape configurée avec apres: id démarre
   - restaurer()  : réaffiche les indices déjà reçus (après rechargement)
   ?test=1 dans l'URL : délais divisés par 60. Stockage : localStorage (try/catch). */
function moteurIndices(cle, config, envoyer) {
  var test = new URLSearchParams(location.search).get('test') === '1';
  function lire() {
    var e = null;
    try { e = JSON.parse(localStorage.getItem(cle)); } catch (err) { e = null; }
    if (!e || typeof e !== 'object') e = {};
    e.debuts = e.debuts || {}; e.faits = e.faits || {}; e.envoyes = e.envoyes || {};
    return e;
  }
  function ecrire(e) {
    try { localStorage.setItem(cle, JSON.stringify(e)); } catch (err) { /* stockage indisponible */ }
  }
  function verifier() {
    var e = lire(), maintenant = Date.now();
    config.forEach(function (ind) {
      if (ind.actif === false || e.faits[ind.id] || e.envoyes[ind.id] || !e.debuts[ind.id]) return;
      if (maintenant - e.debuts[ind.id] < ind.delaiMin * 60000 / (test ? 60 : 1)) return;
      e.envoyes[ind.id] = maintenant;
      ecrire(e);
      envoyer(ind, maintenant, true);
    });
  }
  setInterval(verifier, 1000);
  var api = {
    demarrer: function (id) {
      var e = lire();
      if (!e.debuts[id] && !e.faits[id]) { e.debuts[id] = Date.now(); ecrire(e); }
      verifier();
    },
    fait: function (id) {
      var e = lire(), rang = config.findIndex(function (c) { return c.id === id; });
      config.forEach(function (c, i) { if (i <= rang && !e.faits[c.id]) e.faits[c.id] = Date.now(); });
      ecrire(e);
      config.forEach(function (c) { if (c.apres === id) api.demarrer(c.id); });
    },
    restaurer: function () {
      var e = lire();
      config.forEach(function (ind) { if (e.envoyes[ind.id]) envoyer(ind, e.envoyes[ind.id], false); });
    },
    effacer: function () {
      try { localStorage.removeItem(cle); } catch (err) { /* ignoré */ }
    }
  };
  return api;
}

// Un indice = un nouveau mail en haut de la liste (non lu à l'arrivée)
const indices = moteurIndices(CLE_INDICES, INDICES, (ind, date, nouveau) => {
  const id = 900 + INDICES.indexOf(ind);
  if (MAILS.some((m) => m.id === id)) return;
  MAILS.push({
    id: id,
    expediteur: ind.expediteur,
    adresse: ind.adresse,
    objet: ind.objet,
    apercu: ind.texte.split("\n")[0],
    corps: ind.texte,
    date: new Date(date),
    lu: false,
    pieces_jointes: []
  });
  if (nouveau) {
    sauvegarderEtat();
    majCompteur();
    afficherListe();
    afficherToast("Nouveau message");
  }
});

/* ---------- DOCUMENT DE SEB (fenêtre superposée) ---------- */
const elDocument = $("doc-seb");
const elFeuille = elDocument.querySelector(".feuille");
let zoomDocument = 1;
let minuterieDocument = null;
function appliquerZoom(pas) {
  zoomDocument = Math.min(2, Math.max(0.5, Math.round((zoomDocument + pas) * 10) / 10));
  elFeuille.style.zoom = zoomDocument;
  $("doc-seb-zoom").textContent = Math.round(zoomDocument * 100) + " %";
}
function ouvrirDocument() {
  elDocument.hidden = false;
  elDocument.classList.add("chargement"); // fenêtre « Ouverture de … » (≈ 1 s)
  elDocument.scrollTop = 0;
  document.body.style.overflow = "hidden";
  clearTimeout(minuterieDocument);
  minuterieDocument = setTimeout(() => {
    elDocument.classList.remove("chargement");
    $("doc-seb-fermer").focus();
  }, 1000);
}
function fermerDocument() {
  clearTimeout(minuterieDocument);
  elDocument.hidden = true;
  elDocument.classList.remove("chargement");
  document.body.style.overflow = "";
}
$("doc-seb-fermer").addEventListener("click", fermerDocument);
$("doc-seb-moins").addEventListener("click", () => appliquerZoom(-0.1));
$("doc-seb-plus").addEventListener("click", () => appliquerZoom(0.1));
// Clic hors de la feuille (et hors de la barre) : fermeture
elDocument.addEventListener("click", (e) => {
  if (!e.target.closest(".feuille, .barre, .doc-seb-chargement")) fermerDocument();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !elDocument.hidden) fermerDocument();
});
$("doc-seb-imprimer").addEventListener("click", () => {
  document.body.classList.add("doc-seb-impression");
  window.print();
  document.body.classList.remove("doc-seb-impression");
});

/* ---------- BOUTON CACHÉ DE RESET (tests) ---------- */
$("btn-reset").addEventListener("click", resetMails);

/* ---------- INITIALISATION ---------- */
indices.restaurer(); // indices déjà reçus (avant chargerEtat : garde leur état lu)
chargerEtat();      // récupère l'état lu/non lu sauvegardé
chargerArchives();  // mails archivés
chargerReglages();  // thème, densité, tri, colonne
appliquerReglages();
majCompteur();      // compteur de non lus
afficherListe();    // affiche la liste (aucun mail n'est ouvert automatiquement)
indices.demarrer("pieces-jointes"); // timer de l'étape en cours
/* ---------- MENU DE DEBUG (Cmd/Ctrl+Shift+B, ou ?debug=1 dans l'URL) ----------
   Même bloc dans les 3 sites. « Tout réinitialiser » efface tout le stockage
   (localStorage + sessionStorage) de CE site, puis recharge la page. */
(function () {
  var panneau = null, armement = null;
  var BOUTON = 'font:inherit;cursor:pointer;background:#031;color:#9f9;border:1px solid #3a3;padding:4px 10px';
  function cles() {
    var liste = [];
    try { for (var i = 0; i < localStorage.length; i++) liste.push('local · ' + localStorage.key(i)); } catch (e) { /* indisponible */ }
    try { for (var k = 0; k < sessionStorage.length; k++) liste.push('session · ' + sessionStorage.key(k)); } catch (e) { /* indisponible */ }
    return liste.sort();
  }
  function majListe() {
    var ul = panneau.querySelector('.dbg-cles');
    ul.innerHTML = '';
    var l = cles();
    if (!l.length) l = ['(aucune clé)'];
    l.forEach(function (c) { var li = document.createElement('li'); li.textContent = c; ul.appendChild(li); });
  }
  function ouvrir() {
    if (!panneau) {
      panneau = document.createElement('div');
      panneau.setAttribute('role', 'dialog');
      panneau.setAttribute('aria-label', 'Debug');
      panneau.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:2147483000;width:min(340px,calc(100vw - 24px));max-height:70vh;overflow:auto;box-sizing:border-box;background:#000;color:#9f9;border:1px solid #3a3;padding:10px 12px;font:12px/1.45 Menlo,Consolas,"Courier New",monospace;text-align:left;box-shadow:0 4px 18px rgba(0,0,0,.6)';
      panneau.innerHTML =
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><strong>DEBUG</strong>' +
        '<button type="button" class="dbg-fermer" aria-label="Fermer" style="' + BOUTON + ';padding:0 6px">✕</button></div>' +
        '<button type="button" class="dbg-reset" style="' + BOUTON + '">Tout réinitialiser</button>' +
        '<div style="margin:10px 0 4px;color:#7a7">Clés stockées :</div>' +
        '<ul class="dbg-cles" style="margin:0;padding-left:16px;word-break:break-all"></ul>' +
        '<p style="margin:10px 0 0;color:#cc6">Le reset ne concerne que ce site : répéter sur les 2 autres.</p>';
      document.body.appendChild(panneau);
      panneau.querySelector('.dbg-fermer').addEventListener('click', fermer);
      var reset = panneau.querySelector('.dbg-reset');
      reset.addEventListener('click', function () {
        // Confirmation dans le panneau (confirm() peut être bloqué dans un artefact)
        if (!armement) {
          reset.textContent = 'Confirmer la réinitialisation ?';
          reset.style.background = '#400';
          reset.style.color = '#f99';
          armement = setTimeout(function () {
            armement = null;
            reset.textContent = 'Tout réinitialiser';
            reset.style.background = '#031';
            reset.style.color = '#9f9';
          }, 4000);
          return;
        }
        try { localStorage.clear(); } catch (e) { /* indisponible */ }
        try { sessionStorage.clear(); } catch (e) { /* indisponible */ }
        location.reload();
      });
    }
    panneau.hidden = false;
    majListe();
  }
  function fermer() { if (panneau) panneau.hidden = true; }
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.code === 'KeyB') {
      e.preventDefault();
      if (panneau && !panneau.hidden) fermer(); else ouvrir();
    } else if (e.key === 'Escape' && panneau && !panneau.hidden) {
      e.stopImmediatePropagation(); // Échap ferme seulement le panneau
      fermer();
    }
  }, true);
  if (new URLSearchParams(location.search).get('debug') === '1') {
    if (document.body) ouvrir(); else document.addEventListener('DOMContentLoaded', ouvrir);
  }
})();
