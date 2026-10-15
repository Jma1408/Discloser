/* =====================================================================
   SCRIPT.JS : PICKAXE
   ---------------------------------------------------------------------
   1. CODES SECRETS (à modifier ici uniquement)
   2. Header / Footer partagés (injectés dans toutes les pages)
   3. Logique du formulaire de connexion + transition CRT
   4. Logique du champ "Accès partenaires" (pharmaceutique)
   5. Interrupteurs de cookies
   ===================================================================== */

/* =====================================================================
   1. CODES SECRETS : MODIFIEZ LES VALEURS ICI
   ---------------------------------------------------------------------
   MOT_DE_PASSE_CONNEXION : mot de passe attendu sur connexion.html.
     -> S'il est correct, une pop-up de succès s'affiche, puis la
        transition "télé qui s'éteint" (CRT) se lance toute seule et
        redirige vers PAGE_APRES_CONNEXION (le site secret, interface rétro).
   CODE_PHARMA : code attendu sur pharmaceutique.html (champ "Accès
     partenaires"). Si correct -> redirection vers PAGE_SECRETE.
   La comparaison ignore les majuscules/minuscules et les espaces autour.
   ===================================================================== */
/* ---------- INDICES : widget « Assistance client » (config unique) ----------
   étape | action attendue | délai (min) | expéditeur | texte | actif
   apres : l'étape démarre quand celle-ci est franchie (sinon : dès l'arrivée
   sur le site). ?test=1 dans l'URL divise les délais par 60. */
const CLE_INDICES_PICKAXE = "discloser_indices_pickaxe";
const INDICES_PICKAXE = [
  {
    id: "pharma",
    action: "atteindre la page pharmaceutique (via Innovations)",
    delaiMin: 5,
    expediteur: "Assistance client Pickaxe",
    texte: "Bonjour et bienvenue chez Pickaxe ! Vous souhaitez en savoir plus sur nos activités ? Nos dernières avancées sont présentées dans la rubrique Innovations, où la santé occupe désormais une place de choix.",
    actif: true
  },
  {
    id: "connexion",
    apres: "pharma",
    action: "connexion réussie avec le code binaire",
    delaiMin: 5,
    expediteur: "Assistance client Pickaxe",
    texte: "Merci pour votre intérêt pour notre recherche ! Nos fiches de lot contiennent plus d'informations qu'il n'y paraît, même si toutes ne sont pas destinées à l'œil humain. Nos collaborateurs, eux, savent où se connecter.",
    actif: true
  }
];

const CODE_PHARMA = "0000";
const PAGE_SECRETE = "secret.html";
// Valeur à modifier : mot de passe requis pour la connexion.
const MOT_DE_PASSE_CONNEXION = "total";
// URL à modifier : page ouverte après la transition CRT.
// Chemin relatif (sans "/" au début) : marche en local et dans un sous-dossier.
const PAGE_APRES_CONNEXION = "site_secret/secret.html";

// Durées de la séquence (en millisecondes)
const DELAI_POPUP_AVANT_CRT = 1300;        // popup de succès visible avant l'extinction
const DUREE_ANIMATION_CRT = 1400;          // doit correspondre à la durée (1.4s) dans style.css
const DELAI_NOIR_AVANT_REDIRECTION = 500;  // noir complet avant le changement de page

// Son "power off" OPTIONNEL : laisser vide pour désactiver.
// Exemple : "audio/power-off.mp3"
const SON_EXTINCTION = "";

/* =====================================================================
   2. HEADER & FOOTER PARTAGÉS
   ---------------------------------------------------------------------
   Pour modifier un lien du menu, un texte du footer, etc. :
   changez-le UNE FOIS ici, il sera mis à jour sur toutes les pages
   (index.html garde son propre header en dur, mais utilise ce footer).
   L'onglet actif est déterminé par <body data-page="...">.
   ===================================================================== */
function construireHeader(pageActive) {
  const actif = (cle) => (pageActive === cle ? ' class="actif"' : '');
  return `
  <header class="header">
    <div class="container header__inner">
      <a href="index.html" class="header__logo">
        <!-- REMPLACER ICI : chemin de votre logo -->
        <img src="LOGOPICKAXE.png" alt="Pickaxe logo">
      </a>

      <nav class="nav" aria-label="Navigation principale">
        <ul class="nav__l1">
          <li><a href="informations.html"${actif('informations')}>Informations</a></li>
          <li><a href="nous-rejoindre.html"${actif('nous-rejoindre')}>Nous Rejoindre</a></li>
          <li><a href="autres-services.html"${actif('autres-services')}>Autres Services</a></li>
          <li class="nav__small">Tous droits réservés</li>
        </ul>
        <ul class="nav__l2">
          <li><a href="plateforme-petroliere.html"${actif('plateforme-petroliere')}>Plateforme Pétrolière</a></li>
          <li><a href="station-essence.html"${actif('station-essence')}>Station Essence</a></li>
          <li><a href="innovations.html"${actif('innovations')}>Innovations</a></li>
          <li><a href="abonnements.html"${actif('abonnements')}>Abonnements</a></li>
        </ul>
      </nav>

      <a href="connexion.html" class="btn-connexion">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#000" stroke-width="1.3" aria-hidden="true">
          <circle cx="12" cy="7" r="4"/>
          <path d="M4 21v-3a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v3z" stroke-linejoin="round"/>
        </svg>
        <span>Connexion</span>
      </a>
    </div>
  </header>

  <!-- Bandeau jaune (identique sur toutes les pages) -->
  <section class="banner">
    <div class="banner__inner">
      <div class="banner__left">
        <svg viewBox="0 0 64 64" width="38" height="42" fill="none" stroke="#fff" stroke-width="2.5" aria-hidden="true">
          <rect x="8" y="6" width="30" height="52" rx="4"/>
          <rect x="14" y="12" width="18" height="14" rx="2"/>
          <path d="M4 58h38M38 20h6a6 6 0 0 1 6 6v22a4 4 0 0 0 8 0V24l-6-8"/>
        </svg>
        <span>Avantage Carburant</span>
      </div>
      <div class="banner__center">Bénéficiez d’un prix faible plafonné à 10€/L</div>
      <a href="avantage-carburant.html" class="banner__right">
        <span>J’en profite</span>
        <svg viewBox="0 0 24 40" width="14" height="24" fill="none" stroke="#fff" stroke-width="3" aria-hidden="true">
          <path d="M4 4l16 16L4 36"/>
        </svg>
      </a>
    </div>
  </section>`;
}

function construireFooter() {
  return `
  <footer class="footer footer--interne">
    <div class="container">
      <div class="footer__links">
        <a href="mentions-legales.html">Mentions Légales</a>
        <i class="dot"></i>
        <a href="politique-cookies.html">Politique de cookies</a>
        <i class="dot"></i>
        <a href="parametrer-cookies.html">Paramétrer mes cookies</a>
      </div>
      <div class="footer__copy">
        <span>© 2026 Pickaxe</span>
        <span>Tous droits réservés</span>
      </div>
      <div class="footer__line"></div>
      <strong class="footer__company">La Compagnie Pickaxe :</strong>
    </div>
  </footer>`;
}

/* =====================================================================
   3. FORMULAIRE DE CONNEXION (connexion.html) + TRANSITION CRT
   ---------------------------------------------------------------------
   Un seul champ : le mot de passe (comparé à MOT_DE_PASSE_CONNEXION).
   - Correct   -> pop-up "Connexion réussie" (~1,3 s), puis extinction
                  de la "télé" (CRT), noir, et redirection automatique
                  vers PAGE_APRES_CONNEXION.
   - Incorrect -> "Mot de passe incorrect" en rouge, champ vidé, secousse.
   Pour changer le mot de passe, la page ou les durées : modifier les
   constantes en haut du fichier.
   ===================================================================== */

/* ---------------------------------------------------------------------
   TRANSITION "TÉLÉVISION QUI S'ÉTEINT" (CRT)
   Déroulé :
     1. le garde-fou est enregistré (sessionStorage)
     2. l'overlay noir apparaît, la page se compresse en ligne puis en point
     3. noir complet quelques instants
     4. redirection vers le site secret
   --------------------------------------------------------------------- */
const CLE_TRANSITION_VUE = 'pkx_transition_vue'; // effacée par le reset du menu debug

function lancerTransitionCRT() {
  // Garde-fou : le site secret vérifiera cette valeur à son arrivée
  sessionStorage.setItem('acces_secret', 'ok');
  // Nouvelle connexion : l'intro du site caché doit se rejouer
  // (un simple rechargement de secret.html continue de la passer)
  try { sessionStorage.removeItem('introVue'); } catch (e) { /* ignoré */ }

  // Son optionnel (ignoré si la constante est vide ou si le navigateur bloque l'audio)
  if (SON_EXTINCTION) {
    try {
      const audio = new Audio(SON_EXTINCTION);
      audio.play().catch(() => {});
    } catch (e) { /* on ignore : le son est un bonus */ }
  }

  // Overlay noir plein écran (z-index maximal)
  const overlay = document.createElement('div');
  overlay.className = 'crt-overlay';
  overlay.innerHTML = '<div class="crt-ligne"></div><div class="crt-point"></div>';
  document.body.appendChild(overlay);

  // Le contenu de la page se compresse en ligne (classes définies dans style.css)
  document.body.classList.add('crt-extinction');
  document.documentElement.classList.add('crt-actif'); // fond noir sur <html> aussi

  // Après l'animation + un temps de noir complet -> redirection
  setTimeout(() => {
    window.location.href = PAGE_APRES_CONNEXION;
  }, DUREE_ANIMATION_CRT + DELAI_NOIR_AVANT_REDIRECTION);
}

function initialiserConnexion() {
  const formulaire = document.getElementById('form-connexion');
  const champ = document.getElementById('champ-mdp');
  const message = document.getElementById('msg-connexion');
  const modale = document.getElementById('modale-succes');
  const boutonContinuer = document.getElementById('modale-continuer');
  if (!formulaire || !champ || !message || !modale || !boutonContinuer) return;

  let sequenceLancee = false; // empêche de lancer la transition deux fois
  let timerCRT = null;        // minuteur auto, annulé si "Continuer" est cliqué

  // Affiche la pop-up de succès, puis enchaîne tout seul sur la transition CRT
  const reussirConnexion = () => {
    if (sequenceLancee) return;
    sequenceLancee = true;
    if (indicesPickaxe) indicesPickaxe.fait('connexion'); // action attendue faite
    // Transition (pop-up + CRT + intro du site caché) : seulement à la toute première connexion
    let transitionVue = false;
    try { transitionVue = localStorage.getItem(CLE_TRANSITION_VUE) === '1'; } catch (e) { /* ignoré */ }
    if (transitionVue) {
      sessionStorage.setItem('acces_secret', 'ok');
      try { sessionStorage.setItem('introVue', '1'); } catch (e) { /* ignoré */ }
      window.location.href = PAGE_APRES_CONNEXION; // accès direct
      return;
    }
    try { localStorage.setItem(CLE_TRANSITION_VUE, '1'); } catch (e) { /* ignoré */ }
    message.textContent = '';
    modale.hidden = false;
    boutonContinuer.focus();
    timerCRT = setTimeout(lancerTransitionCRT, DELAI_POPUP_AVANT_CRT);
  };

  // "submit" couvre le bouton ET la touche Entrée
  formulaire.addEventListener('submit', (e) => {
    e.preventDefault();
    if (sequenceLancee) return;

    // trim() + toLowerCase() : " Detournement " est accepté
    const saisie = champ.value.trim().toLowerCase();

    if (saisie === MOT_DE_PASSE_CONNEXION.trim().toLowerCase()) {
      reussirConnexion();
      return;
    }

    // Mauvais mot de passe : comportement inchangé
    message.textContent = 'Mot de passe incorrect';
    champ.value = '';
    formulaire.classList.remove('secousse');
    void formulaire.offsetWidth; // relance l'animation à chaque erreur
    formulaire.classList.add('secousse');
    champ.focus();
  });

  formulaire.addEventListener('animationend', () => formulaire.classList.remove('secousse'));

  // Le bouton "Continuer" reste utilisable : il lance la transition sans attendre
  boutonContinuer.addEventListener('click', () => {
    if (document.querySelector('.crt-overlay')) return; // déjà en cours
    clearTimeout(timerCRT); // évite une 2e transition / redirection
    sequenceLancee = true;
    lancerTransitionCRT();
  });
}

/* =====================================================================
   4. CHAMP "ACCÈS PARTENAIRES" (pharmaceutique.html)
   ---------------------------------------------------------------------
   !! Adaptez les ids ci-dessous à ceux de votre pharmaceutique.html
   (formulaire, champ de saisie, zone de message d'erreur).
   Code correct (CODE_PHARMA) -> redirection vers PAGE_SECRETE.
   Incorrect -> message d'erreur discret.
   ===================================================================== */
function initialiserAccesPharma() {
  const formulaire = document.getElementById('form-pharma');
  const champ = document.getElementById('champ-pharma');
  const message = document.getElementById('msg-pharma');
  if (!formulaire || !champ) return;

  formulaire.addEventListener('submit', (e) => {
    e.preventDefault();
    const saisie = champ.value.trim().toLowerCase();

    if (saisie === CODE_PHARMA.trim().toLowerCase()) {
      window.location.href = PAGE_SECRETE;
      return;
    }
    if (message) message.textContent = 'Code invalide.';
    champ.value = '';
  });
}

/* =====================================================================
   5. INTERRUPTEURS DE COOKIES (parametrer-cookies.html)
   Purement visuels : aucun cookie n'est réellement géré.
   ===================================================================== */
function initialiserCookies() {
  document.querySelectorAll('.switch input').forEach((cb) => {
    cb.addEventListener('change', () => {
      const etat = cb.closest('.cookie-row').querySelector('.cookie-etat');
      if (etat) etat.textContent = cb.checked ? 'Activé' : 'Désactivé';
    });
  });
}

/* =====================================================================
   DÉMARRAGE : un seul DOMContentLoaded pour tout le site
   ===================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page || '';
  const h = document.getElementById('site-header');
  const f = document.getElementById('site-footer');
  if (h) h.innerHTML = construireHeader(page);
  if (f) f.innerHTML = construireFooter();

  initialiserConnexion();
  initialiserAccesPharma();
  initialiserCookies();
  initialiserAssistance();
});

/* =====================================================================
   6. ASSISTANCE CLIENT (indices de l'ARG, propres au site public)
   ===================================================================== */
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

let indicesPickaxe = null;

function initialiserAssistance() {
  // Pas sur secret.html (page de l'ARG à la racine, à ne pas modifier)
  if (/(^|\/)secret\.html$/.test(location.pathname)) return;

  const widget = document.createElement('div');
  widget.className = 'assistance';
  widget.innerHTML = `
    <div class="assistance__panneau" hidden>
      <div class="assistance__tete">
        <span>Assistance client</span>
        <button type="button" class="assistance__fermer" aria-label="Fermer">✕</button>
      </div>
      <div class="assistance__liste">
        <p class="assistance__msg assistance__msg--accueil">Bonjour ! Un conseiller Pickaxe vous répondra ici dans les plus brefs délais.</p>
      </div>
    </div>
    <button type="button" class="assistance__bouton">
      <span>Assistance client</span>
      <span class="assistance__badge" hidden>0</span>
    </button>
    <div class="assistance__toast" role="status"></div>`;
  document.body.appendChild(widget);

  const panneau = widget.querySelector('.assistance__panneau');
  const liste = widget.querySelector('.assistance__liste');
  const badge = widget.querySelector('.assistance__badge');
  const toast = widget.querySelector('.assistance__toast');
  let nonLus = 0;
  let timerToast = null;

  widget.querySelector('.assistance__bouton').addEventListener('click', () => {
    panneau.hidden = !panneau.hidden;
    if (!panneau.hidden) { nonLus = 0; badge.hidden = true; }
  });
  widget.querySelector('.assistance__fermer').addEventListener('click', () => { panneau.hidden = true; });

  indicesPickaxe = moteurIndices(CLE_INDICES_PICKAXE, INDICES_PICKAXE, (ind, date, nouveau) => {
    const msg = document.createElement('div');
    msg.className = 'assistance__msg';
    msg.innerHTML = '<strong></strong><p></p>';
    msg.querySelector('strong').textContent = ind.expediteur;
    msg.querySelector('p').textContent = ind.texte;
    liste.appendChild(msg);
    if (!nouveau) return;
    nonLus++;
    badge.textContent = nonLus;
    badge.hidden = false;
    toast.textContent = 'Nouveau message';
    toast.classList.add('visible');
    clearTimeout(timerToast);
    timerToast = setTimeout(() => toast.classList.remove('visible'), 2500);
  });

  indicesPickaxe.restaurer();
  indicesPickaxe.demarrer('pharma');                 // arrivée sur le site
  if (document.getElementById('message-code')) {     // page pharmaceutique atteinte
    indicesPickaxe.fait('pharma');
  }
}
/* =====================================================================
   7. EFFETS VISUELS (classe "fx" sur <body>)
   Désactivés sur connexion et secret (pages de l'ARG).
   - Header réduit au défilement (classe header--reduit)
   - Apparition au défilement (classes reveal / reveal--visible),
     une seule fois ; tout reste visible sans IntersectionObserver
     ou si l'utilisateur préfère un mouvement réduit.
   ===================================================================== */
function initialiserEffets() {
  if (pageExclueDesEffets()) return;
  document.body.classList.add('fx');
  // Numéros de section (01, 02…) seulement s'il y a au moins 2 blocs titrés
  const blocsTitres = [...document.querySelectorAll('.bloc')].filter((b) => b.querySelector(':scope > h2'));
  if (blocsTitres.length >= 2) document.body.classList.add('fx-numeros');
  initialiserCompteurs();

  // Header : réduit + ombre dès qu'on a défilé
  const header = document.querySelector('.header');
  if (header) {
    const majHeader = () => header.classList.toggle('header--reduit', window.scrollY > 40);
    window.addEventListener('scroll', majHeader, { passive: true });
    majHeader();
  }

  // Apparitions au défilement
  const mouvementReduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (mouvementReduit || !('IntersectionObserver' in window)) return;

  // Un bloc qui contient des cartes/chiffres/étapes : on anime ses enfants, pas le bloc
  const cibles = [];
  document.querySelectorAll('.bloc').forEach((bloc) => {
    const enfants = bloc.querySelectorAll('.carte, .chiffre, .frise__item');
    if (enfants.length) cibles.push(...enfants);
    else cibles.push(bloc);
  });
  document.querySelectorAll('.main__img, .info-row, .cta__btn').forEach((el) => cibles.push(el));

  const observateur = new IntersectionObserver((entrees) => {
    entrees.forEach((entree) => {
      if (!entree.isIntersecting) return;
      const el = entree.target;
      observateur.unobserve(el);
      el.classList.add('reveal--visible');
      // Une fois apparu, on rend l'élément à ses styles d'origine (survols compris)
      el.addEventListener('transitionend', function fin(e) {
        if (e.propertyName !== 'opacity') return;
        el.removeEventListener('transitionend', fin);
        el.classList.remove('reveal', 'reveal--visible');
        el.style.transitionDelay = '';
      });
    });
  }, { threshold: 0.12 });

  cibles.forEach((el) => {
    // Léger décalage entre éléments voisins (70 ms, plafonné à 350 ms)
    const rang = Array.prototype.indexOf.call(el.parentElement.children, el);
    el.style.transitionDelay = Math.min(rang * 70, 350) + 'ms';
    el.classList.add('reveal');
    observateur.observe(el);
  });
}
// Après le DOMContentLoaded principal (header / footer déjà injectés)
document.addEventListener('DOMContentLoaded', initialiserEffets);

/* =====================================================================
   8. CHARGEMENT, TRANSITIONS ENTRE PAGES, COMPTEURS
   Pas sur connexion.html ni secret.html (la transition CRT et
   l'intro du site caché restent intactes).
   ===================================================================== */
function pageExclueDesEffets() {
  return !!document.getElementById('form-connexion')
    || /(^|\/)secret\.html$/.test(location.pathname);
}

(function initialiserChargementEtTransitions() {
  if (pageExclueDesEffets()) return;
  const racine = document.documentElement;
  const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduit) return;

  // Fondu d'entrée de la page (classe posée avant le premier affichage)
  racine.classList.add('pkx-entree');

  // Écran de chargement : une seule fois par session (≤ 0,8 s)
  let dejaVu = false;
  try { dejaVu = sessionStorage.getItem('pkx_chargement_vu') === '1'; } catch (e) { dejaVu = true; }
  if (!dejaVu) {
    try { sessionStorage.setItem('pkx_chargement_vu', '1'); } catch (e) { /* ignoré */ }
    const ecran = document.createElement('div');
    ecran.className = 'pkx-chargement';
    ecran.setAttribute('aria-hidden', 'true');
    ecran.innerHTML = '<img src="LOGOPICKAXE.png" alt=""><span class="pkx-chargement__barre"><i></i></span>';
    racine.appendChild(ecran);
    setTimeout(() => ecran.classList.add('pkx-chargement--fin'), 550);
    setTimeout(() => ecran.remove(), 800);
  }

  // Fondu de sortie au clic sur un lien interne
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const lien = e.target.closest('a[href]');
    if (!lien || lien.target === '_blank' || lien.hasAttribute('download')) return;
    const href = lien.getAttribute('href');
    if (!href || href.startsWith('#') || /^(mailto|tel|javascript):/i.test(href)) return;
    const cible = new URL(lien.href, location.href);
    if (cible.origin !== location.origin) return;
    if (cible.pathname === location.pathname && cible.hash) return;
    e.preventDefault();
    racine.classList.add('pkx-sortie');
    setTimeout(() => { window.location.href = cible.href; }, 250);
  });
  // Retour arrière depuis le cache du navigateur : page de nouveau visible
  window.addEventListener('pageshow', () => racine.classList.remove('pkx-sortie'));
})();

/** Chiffres clés animés (attribut data-compteur), au premier affichage */
function initialiserCompteurs() {
  const compteurs = document.querySelectorAll('[data-compteur]');
  if (!compteurs.length) return;
  const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduit || !('IntersectionObserver' in window)) return; // valeurs finales déjà écrites
  const animer = (el) => {
    const fin = parseInt(el.dataset.compteur, 10);
    const debut = performance.now();
    const duree = 1200;
    const pas = (t) => {
      const k = Math.min((t - debut) / duree, 1);
      el.textContent = Math.round(fin * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(pas);
    };
    requestAnimationFrame(pas);
  };
  const obs = new IntersectionObserver((entrees) => {
    entrees.forEach((en) => {
      if (!en.isIntersecting) return;
      obs.unobserve(en.target);
      animer(en.target);
    });
  }, { threshold: 0.4 });
  compteurs.forEach((el) => { el.textContent = '0'; obs.observe(el); });
}

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
