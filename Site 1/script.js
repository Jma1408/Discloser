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
        redirige vers PAGE_APRES_CONNEXION (le site secret Windows XP).
   CODE_PHARMA : code attendu sur pharmaceutique.html (champ "Accès
     partenaires"). Si correct -> redirection vers PAGE_SECRETE.
   La comparaison ignore les majuscules/minuscules et les espaces autour.
   ===================================================================== */
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
      <div class="footer__cols">
        <div>
          <h4>Le Groupe</h4>
          <a href="informations.html">Qui sommes-nous</a>
          <a href="informations.html">Gouvernance</a>
          <a href="informations.html">Engagements RSE</a>
          <a href="in-progress.html">Espace presse</a>
        </div>
        <div>
          <h4>Activités</h4>
          <a href="plateforme-petroliere.html">Exploration-Production</a>
          <a href="station-essence.html">Réseau de stations</a>
          <a href="innovations.html">Innovations</a>
          <a href="in-progress.html">Fournisseurs</a>
        </div>
        <div>
          <h4>Carrières</h4>
          <a href="nous-rejoindre.html">Nos offres</a>
          <a href="nous-rejoindre.html">Candidature spontanée</a>
        </div>
        <div>
          <h4>Investisseurs</h4>
          <a href="informations.html">Résultats &amp; calendrier</a>
          <p class="footer__bourse">PKX · Euronext Paris <strong id="bourse-pkx">63,42 € ▲ +0,84 %</strong></p>
          <form class="newsletter" id="form-newsletter" novalidate>
            <label for="champ-newsletter">Lettre d'information</label>
            <div class="acces__ligne">
              <input type="email" id="champ-newsletter" placeholder="Votre e-mail">
              <button type="submit" class="btn-petit">OK</button>
            </div>
            <small id="msg-newsletter" aria-live="polite"></small>
          </form>
        </div>
      </div>
      <div class="footer__social" aria-label="Réseaux sociaux">
        <span>LinkedIn</span><span>X</span><span>YouTube</span><span>Instagram</span>
      </div>
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
      <p class="footer__adresse">
        Pickaxe S.A. · 18 avenue de l'Arche, 92400 Courbevoie, France · +33 (0)1 47 44 58 00<br>
        RCS Nanterre 548 210 936 · Capital social de 6 512 500 000 €
      </p>
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
function lancerTransitionCRT() {
  // Garde-fou : le site secret vérifiera cette valeur à son arrivée
  sessionStorage.setItem('acces_secret', 'ok');

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
   6. MICRO-INTERACTIONS (crédibilité du site corporate)
   - Bandeau cookies : affiché tant que "Accepter" n'a pas été cliqué
     (mémorisé dans localStorage, ignoré si le navigateur le bloque).
   - Newsletter du footer : faux message de confirmation.
   - Cours PKX du footer : légère variation au chargement.
   - Localisateur (station-essence.html) : service "indisponible".
   ===================================================================== */
function initialiserBandeauCookies() {
  let accepte = false;
  try { accepte = localStorage.getItem('pk_cookies') === 'ok'; } catch (e) {}
  if (accepte) return;

  const bandeau = document.createElement('div');
  bandeau.className = 'bandeau-cookies';
  bandeau.innerHTML = `
    <p>Pickaxe utilise des cookies pour améliorer votre expérience et mesurer l'audience du site.
       <a href="politique-cookies.html">En savoir plus</a></p>
    <div class="bandeau-cookies__btns">
      <a href="parametrer-cookies.html" class="btn-petit btn-petit--gris">Paramétrer</a>
      <button type="button" class="btn-petit" id="cookies-accepter">Accepter</button>
    </div>`;
  document.body.appendChild(bandeau);
  bandeau.querySelector('#cookies-accepter').addEventListener('click', () => {
    try { localStorage.setItem('pk_cookies', 'ok'); } catch (e) {}
    bandeau.remove();
  });
}

function initialiserNewsletter() {
  const formulaire = document.getElementById('form-newsletter');
  const champ = document.getElementById('champ-newsletter');
  const message = document.getElementById('msg-newsletter');
  if (!formulaire || !champ || !message) return;

  formulaire.addEventListener('submit', (e) => {
    e.preventDefault();
    const valide = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(champ.value.trim());
    message.textContent = valide
      ? 'Merci, votre inscription a bien été prise en compte.'
      : 'Adresse e-mail invalide.';
    if (valide) champ.value = '';
  });
}

function initialiserCoursBourse() {
  const cours = document.getElementById('bourse-pkx');
  if (!cours) return;
  const variation = 0.84 + (Math.random() - 0.5) * 0.3;  // entre +0,69 % et +0,99 %
  const valeur = 62.89 * (1 + variation / 100);
  const fr = (n) => n.toFixed(2).replace('.', ',');
  cours.textContent = `${fr(valeur)} € ▲ +${fr(variation)} %`;
}

function initialiserLocalisateur() {
  const formulaire = document.getElementById('form-localisateur');
  const carte = document.getElementById('carte-localisateur');
  if (!formulaire || !carte) return;

  formulaire.addEventListener('submit', (e) => {
    e.preventDefault();
    carte.textContent = 'Recherche en cours…';
    setTimeout(() => {
      carte.textContent = 'Service de localisation momentanément indisponible. Veuillez réessayer ultérieurement.';
    }, 1200);
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
  initialiserBandeauCookies();
  initialiserNewsletter();
  initialiserCoursBourse();
  initialiserLocalisateur();
});