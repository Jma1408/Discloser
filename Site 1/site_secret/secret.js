/* =====================================================================
   CONSTANTES DE NAVIGATION (modifiables facilement)
   ===================================================================== */
// Chemin RELATIF vers la page d'accueil du site principal.
// Si le fichier principal change de nom, modifie uniquement cette ligne.
const PAGE_ACCUEIL = "../index.html";

// Nom d'utilisateur affiché dans le menu Démarrer
// (même nom que celui de l'écran de connexion de l'intro)
const NOM_UTILISATEUR = "Lab_Admin";

/* =====================================================================
   GARDE-FOU (anti-triche léger)
   Passer GARDE_FOU_ACTIF à false pendant tes tests pour accéder
   directement à ce site sans passer par la connexion.
   ===================================================================== */
const GARDE_FOU_ACTIF = true;

/** Vérifie l'accès : renvoie vers l'accueil si "acces_secret" est absent */
function verifierAcces() {
  if (GARDE_FOU_ACTIF && sessionStorage.getItem('acces_secret') !== 'ok') {
    // replace() : la page secrète ne reste pas dans l'historique
    window.location.replace(PAGE_ACCUEIL);
  }
}

// Vérification au chargement normal
verifierAcces();

// Vérification quand la page est restaurée depuis le cache du navigateur
// (bouton Retour / Précédent, bfcache) : le script ne se ré-exécute pas
// dans ce cas, d'où la revérification explicite.
window.addEventListener('pageshow', function (event) {
  if (event.persisted) {
    verifierAcces();
  }
});

/* ==========================================================
   secret.js — Logique de la coquille Windows XP
   ========================================================== */
(function () {
  'use strict';

  /* ---------- 0. Raccourcis ---------- */
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const fenetre  = $('#fenetre');
  const desktop  = $('#desktop');
  const titlebar = $('#titlebar');
  const statusL  = $('#status-left');

  /* ==========================================================
     1. INTRO DE CHARGEMENT
     ========================================================== */
  const intro = $('#intro');
  let introAnnulee = false;
  let timers = [];

  /** Planifie une action et mémorise le timer pour pouvoir l'annuler */
  function plan(fn, delai) {
    const t = setTimeout(() => { if (!introAnnulee) fn(); }, delai);
    timers.push(t);
  }

  /** Effet machine à écrire sur une ligne de log */
  function ecrireLigne(conteneur, texte, vitesse, done) {
    const ligne = document.createElement('div');
    ligne.className = 'cursor';
    conteneur.appendChild(ligne);
    let i = 0;
    (function frappe() {
      if (introAnnulee) return;
      if (i < texte.length) {
        ligne.textContent = texte.slice(0, ++i);
        setTimeout(frappe, vitesse + Math.random() * 25);
      } else {
        ligne.classList.remove('cursor');
        if (done) done();
      }
    })();
  }

  /** Termine l'intro et affiche le bureau */
  function finIntro() {
    introAnnulee = true;
    timers.forEach(clearTimeout);
    try { sessionStorage.setItem('introVue', '1'); } catch (e) {}
    intro.classList.add('fade-out');
    desktop.classList.add('visible');
    setTimeout(() => { intro.style.display = 'none'; }, 1000);
    demarrerAmbiance();
    majScrollbar();
  }

  function lancerIntro() {
    const boot  = $('#intro-boot');
    const login = $('#intro-login');
    const logs  = $('#boot-logs');

    // Étape 1 : écran noir pur (1 s)
    // Étape 2 : écran de démarrage XP
    plan(() => {
      boot.classList.remove('hidden');

      // Étape 3 : logs en machine à écrire
      const lignes = [
        'Chargement des modules…',
        'Connexion à l\'intranet…',
        'Accès restreint détecté.'
      ];
      let idx = 0;
      (function suivante() {
        if (idx >= lignes.length || introAnnulee) return;
        ecrireLigne(logs, lignes[idx++], 35, () => plan(suivante, 380));
      })();
    }, 1000);

    // Étape 4 : écran de connexion
    plan(() => {
      boot.classList.add('hidden');
      login.classList.remove('hidden');
      plan(() => {
        $('#login-state').textContent = 'Chargement de vos paramètres personnels…';
      }, 1300);
    }, 5000);

    // Étape 5 : fondu vers la fenêtre
    plan(finIntro, 7200);
  }

  // Échap = passer l'intro
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !introAnnulee && intro.style.display !== 'none') {
      finIntro();
    }
  });

  /* ==========================================================
     2. NAVIGATION PAR ONGLETS
     ========================================================== */
  const NOMS_ONGLETS = {
    informations: 'Informations',
    planning:     'Planning',
    laboratoire:  'Laboratoire',
    donnees:      'Données',
    messagerie:   'Messagerie'
  };
  const TITRE_APP = 'Système de gestion interne';
  let ongletActif = 'informations';

  function ouvrirOnglet(nom) {
    ongletActif = nom;
    $$('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === nom));
    $$('.tab-panel').forEach(p => p.classList.toggle('active', p.id === 'tab-' + nom));
    const titre = TITRE_APP + ' - ' + NOMS_ONGLETS[nom];
    $('#titlebar-text').textContent = titre;
    $('#task-text').textContent = titre;
    $('#content').scrollTop = 0;
    majScrollbar();
    messageStatut('Chargement : ' + NOMS_ONGLETS[nom] + '…', 450);
  }

  $$('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => ouvrirOnglet(btn.dataset.tab));
  });

  /* ==========================================================
     2b. CONTENU DES ONGLETS
     ========================================================== */

  // ONGLET INFORMATIONS
  $('#contenu-informations').innerHTML = `
    <div class="info-header">
      <h2>Projet PICKAXE - Division Pharmaceutique</h2>
      <p class="info-subtitle">Classification : TRÈS CONFIDENTIEL</p>
    </div>
    
    <div class="info-description">
      <p><strong>Objet du projet :</strong> Développement d'une solution pharmaceutique innovante destinée à résoudre les problèmes de surpopulation mondiale. Le projet PICKAXE vise à créer un produit hautement efficace, déployable à grande échelle via les chaînes de distribution existantes.</p>
      
      <p><strong>Statut :</strong> Phase 4 - Tests avancés en cours. Déploiement prévu dans les 18 mois.</p>
      
      <p><strong>Budget alloué :</strong> 4,2 milliards USD. Personnel : 340 chercheurs et techniciens répartis sur 7 sites.</p>
    </div>

    <div class="documents-section">
      <h3>Documents de Référence</h3>
      <p class="doc-notice">[Documents supplémentaires disponibles après décryptage]</p>
      
      <div class="document-list">
        <div class="document-item" data-id="doc-1">
          <div class="doc-header">
    <h2 class="doc-title">BILAN ADMINISTRATIF</h2>
    <span class="doc-date">2026-09-15</span>
          </div>
          <div class="doc-content admin-report">

  <div class="report-section">
    <h3 class="section-title">DIVISION PHARMACEUTIQUE - RAPPORT TRIMESTRIEL Q3 2026</h3>
    
    <div class="report-block">
      <h4 class="block-title">Synthèse des opérations</h4>
      <p class="report-text">
        L'installation principale de la Division Pharmaceutique a connu une 
        activité nominale durant le trimestre. Les protocoles de conformité 
        ont été respectés selon les standards établis.
      </p>
    </div>

    <div class="report-block">
      <h4 class="block-title">Remarques opérationnelles</h4>
      
      <div class="operational-item">
        <span class="op-label">Maintenance des systèmes de surveillance :</span>
        <span class="op-status complete">COMPLÈTE</span>
      </div>
      
      <div class="operational-details">
        <div class="detail-line">
          <span class="detail-label">Points d'observation :</span>
          <span class="detail-value camera-paths">/camera001, /camera003, /camera004</span>
        </div>
        <div class="detail-line">
          <span class="detail-label">Dernière vérification :</span>
          <span class="detail-value">2026-08-10 14:32:17</span>
        </div>
        <div class="detail-line">
          <span class="detail-label">État :</span>
          <span class="detail-value nominal">Nominal</span>
        </div>
      </div>

      <div class="operational-item">
        <span class="op-label">Gestion du personnel :</span>
        <span class="op-value">47 individus affectés</span>
      </div>

      <div class="operational-item">
        <span class="op-label">Consommation énergétique :</span>
        <span class="op-value">+3.2% vs Q2</span>
      </div>

      <div class="operational-item">
        <span class="op-label">Incidents rapportés :</span>
        <span class="op-value zero">1</span>
      </div>
    </div>

    <div class="report-footer">
      <div class="footer-line">
        <span class="footer-label">Responsable :</span>
        <span class="footer-value">Mr. Mac Kinney</span>
      </div>
      <div class="footer-line">
        <span class="footer-label">Validé par :</span>
        <span class="footer-value">Direction Générale PICKAXE</span>
      </div>
    </div>
  </div>
</div>
        </div>

        <div class="document-item" data-id="doc-2">
          <div class="doc-header">
            <span class="doc-title">Protocole du Site</span>
            <span class="doc-date">2003-08-22</span>
          </div>
          <div class="doc-content redacted">
  <div class="doc-section">
    <h3 class="doc-title">PROTOCOLE D'ACCÈS - INFRASTRUCTURE SÉCURISÉE</h3>
    
    <div class="doc-paragraph">
      <span class="doc-label">1. ZONES DE RESTRICTION</span>
      <ul class="doc-list">
        <li>Zone A (Laboratoire Principal) : Accès niveau 4+</li>
        <li>Zone B (Serveurs) : Accès niveau 5 uniquement</li>
        <li>Zone C (Bureau de Direction) : Accès autorisé personnel identifié</li>
      </ul>
    </div>

    <div class="doc-paragraph">
      <span class="doc-label">2. SURVEILLANCE CONTINUE</span>
      <p>Les installations de surveillance fonctionnent en continu.<br>
         Tous les points critiques sont couverts :</p>
      
      <div class="surveillance-table">
        <div class="surveillance-row">
          <span class="surveillance-location">Étage 1 - Couloir d'entrée</span>
        </div>
        <div class="surveillance-row">
          <span class="surveillance-location">Étage 2 - Salle de réunion</span>
        </div>
        <div class="surveillance-row">
          <span class="surveillance-location">Étage 3 - Bureau de direction</span>
        </div>
        <div class="surveillance-row">
          <span class="surveillance-location">Laboratoire - Zone stérile</span>
        </div>
        <div class="surveillance-row">
          <span class="surveillance-location">Sous-sol - Zone de stockage</span>
        </div>
      </div>

      <p class="doc-note">Accès aux flux : Via terminal d'administration uniquement<br></p>
    </div>

    <div class="doc-paragraph">
      <span class="doc-label">3. PROTOCOLE D'URGENCE</span>
      <p>En cas de détection d'anomalie, alerter le service de sécurité.<br>
         Les enregistrements sont conservés pendant XX jours.</p>
    </div>

    <div class="doc-paragraph doc-critical">
      <span class="doc-label">4. RESTRICTION D'ACCÈS</span>
      <p>Certains flux vidéo sont classifiés <span class="classification">NIVEAU 3</span>.<br>
         Accès limité au personnel autorisé uniquement.</p>
    </div>
  </div>
</div>

        <div class="document-item" data-id="doc-3">
          <div class="doc-header">
            <span class="doc-title">Caméras de Surveillance</span>
            <span class="doc-date">2015-09-28</span>
          </div>
<div class="doc-content cameras-doc">
  <div class="doc-intro">
    <p><strong>SYSTÈME DE SURVEILLANCE - DOCUMENTATION TECHNIQUE</strong></p>
    <p>Infrastructure générale :<br>
    La Division Pharmaceutique est équipée d'un système de surveillance 
    intégré. Les points d'observation stratégiques assurent une couverture 
    complète des zones d'intérêt.</p>
  </div>

  <div class="cameras-list">
    <h3 class="cameras-title">LISTE DES POINTS D'OBSERVATION</h3>

    <!-- CAM-001 -->
    <div class="camera-entry accessible">
      <div class="camera-header">
        <span class="camera-id">CAM-001</span>
        <span class="camera-status">✓ ACCESSIBLE</span>
      </div>
      <div class="camera-details">
        <div class="detail-row">
          <span class="label">Localisation :</span>
          <span class="value">Couloir d'accès principal (Étage 1) - Entrée laboratoire</span>
        </div>
        <div class="detail-row">
          <span class="label">Type :</span>
          <span class="value">Caméra fixe HD</span>
        </div>
        <div class="detail-row">
          <span class="label">Couverture :</span>
          <span class="value">Passage général</span>
        </div>
        <div class="detail-row">
          <span class="label">Dernier enregistrement :</span>
          <span class="value">2026-09-28 09:15:42</span>
        </div>
      </div>
    </div>

    <!-- CAM-002 -->
    <div class="camera-entry restricted">
      <div class="camera-header">
        <span class="camera-id">CAM-002</span>
        <span class="camera-status restricted-badge">⚠ VERROUILLÉ</span>
      </div>
      <div class="camera-details">
        <div class="detail-row">
          <span class="label">Localisation :</span>
          <span class="value">Salle de réunion (Étage 2) - Bureau de direction</span>
        </div>
        <div class="detail-row">
          <span class="label">Type :</span>
          <span class="value">Caméra HD + audio</span>
        </div>
        <div class="detail-row">
          <span class="label">Couverture :</span>
          <span class="value">Réunions confidentielles</span>
        </div>
        <div class="detail-row warning">
          <span class="label">Accessible :</span>
          <span class="value">[CLASSIFICATION NIVEAU 5 - ACCÈS RESTREINT]</span>
        </div>
        <div class="detail-row">
          <span class="label">Dernier enregistrement :</span>
          <span class="value">2026-09-27 15:12:04</span>
        </div>
        <div class="alert-box">⚠ CONTENU SENSIBLE - DÉVERROUILLAGE NÉCESSAIRE</div>
      </div>
    </div>

    <!-- CAM-003 -->
    <div class="camera-entry accessible">
      <div class="camera-header">
        <span class="camera-id">CAM-003</span>
        <span class="camera-status">✓ ACCESSIBLE</span>
      </div>
      <div class="camera-details">
        <div class="detail-row">
          <span class="label">Localisation :</span>
          <span class="value">Bureau administratif (Étage 2) - Secteur administratif</span>
        </div>
        <div class="detail-row">
          <span class="label">Type :</span>
          <span class="value">Caméra fixe</span>
        </div>
        <div class="detail-row">
          <span class="label">Couverture :</span>
          <span class="value">Zone administrative générale</span>
        </div>
        <div class="detail-row">
          <span class="label">Dernier enregistrement :</span>
          <span class="value">2026-09-28 08:47:33</span>
        </div>
      </div>
    </div>

    <!-- CAM-004 -->
    <div class="camera-entry accessible">
      <div class="camera-header">
        <span class="camera-id">CAM-004</span>
        <span class="camera-status">✓ ACCESSIBLE</span>
      </div>
      <div class="camera-details">
        <div class="detail-row">
          <span class="label">Localisation :</span>
          <span class="value">Laboratoire - Salle stérile (Étage 1) - Zone de recherche principale</span>
        </div>
        <div class="detail-row">
          <span class="label">Type :</span>
          <span class="value">Caméra stérile (sans audio)</span>
        </div>
        <div class="detail-row">
          <span class="label">Couverture :</span>
          <span class="value">Espace de travail principal</span>
        </div>
        <div class="detail-row">
          <span class="label">Dernier enregistrement :</span>
          <span class="value">2026-09-28 11:02:19</span>
        </div>
      </div>
    </div>

    <!-- CAM-005 -->
    <div class="camera-entry accessible">
      <div class="camera-header">
        <span class="camera-id">CAM-005</span>
        <span class="camera-status">✓ ACCESSIBLE</span>
      </div>
      <div class="camera-details">
        <div class="detail-row">
          <span class="label">Localisation :</span>
          <span class="value">Zone de stockage (Sous-sol) - Entreposage de matériel</span>
        </div>
        <div class="detail-row">
          <span class="label">Type :</span>
          <span class="value">Caméra infrarouge</span>
        </div>
        <div class="detail-row">
          <span class="label">Couverture :</span>
          <span class="value">Inventaire pharmaceutique</span>
        </div>
        <div class="detail-row">
          <span class="label">Dernier enregistrement :</span>
          <span class="value">2026-09-28 07:33:51</span>
        </div>
      </div>
    </div>

    <!-- CAM-006 -->
    <div class="camera-entry restricted">
      <div class="camera-header">
        <span class="camera-id">CAM-006</span>
        <span class="camera-status restricted-badge">⚠ VERROUILLÉ</span>
      </div>
      <div class="camera-details">
        <div class="detail-row">
          <span class="label">Localisation :</span>
          <span class="value">Bureau de direction (Étage 3) - Secteur privé</span>
        </div>
        <div class="detail-row">
          <span class="label">Type :</span>
          <span class="value">Caméra discrète</span>
        </div>
        <div class="detail-row">
          <span class="label">Couverture :</span>
          <span class="value">Bureau directeur</span>
        </div>
        <div class="detail-row warning">
          <span class="label">Accessible :</span>
          <span class="value">[CLASSIFICATION NIVEAU 5 - ACCÈS RESTREINT]</span>
        </div>
        <div class="detail-row">
          <span class="label">Dernier enregistrement :</span>
          <span class="value">2026-09-28 10:05:33</span>
        </div>
        <div class="alert-box">⚠ DONNÉES COMPLÈTES - DÉVERROUILLAGE NÉCESSAIRE</div>
      </div>
    </div>
  </div>

  <div class="doc-notes">
    <h4>NOTES TECHNIQUES :</h4>
    <ul>
      <li>Tous les flux sont enregistrés en continu</li>
      <li>Accès aux données via terminal sécurisé uniquement</li>
      <li class="tech-command">Format : <code>/cameras /cameraXXX</code></li>
      <li>Certains contenus ont nécessité classement de sécurité renforcée</li>
      <li>Vérification d'accès automatique selon profil utilisateur</li>
    </ul>
  </div>
</div>
        </div>
      </div>
    </div>
  `;

  // ONGLET PLANNING
  $('#contenu-planning').innerHTML = `
    <div class="planning-header">
      <h2>Organigramme du Projet - Personnel</h2>
      <p class="planning-notice">[À compléter]</p>
    </div>
    
    <table class="xp-table personnel-table">
      <thead>
        <tr>
          <th>Nom Prénom</th>
          <th>Accès</th>
          <th>Rôle</th>
          <th>Statut</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="redacted-cell">Mac Kinney</td>
          <td class="redacted-cell">███</td>
          <td>Directeur Général</td>
          <td><span class="status-badge ">Indéfini</span></td>
        </tr>
        <tr>
          <td class="redacted-cell">████ Jeanne</td>
          <td class="redacted-cell">████</td>
          <td>Chercheur Senior</td>
          <td><span class="status-badge active">Actif</span></td>
        </tr>
        <tr>
          <td class="redacted-cell">Ochare █████</td>
          <td class="redacted-cell">6767</td>
          <td>Ingénieur Biochimie</td>
          <td><span class="status-badge active">Actif</span></td>
        </tr>
        <tr>
          <td class="redacted-cell">███████</td>
          <td class="redacted-cell">█████</td>
          <td>Technicien Labo</td>
          <td><span class="status-badge warning">Congé</span></td>
        </tr>
        <tr>
          <td class="redacted-cell">Paul Ho</td>
          <td class="redacted-cell">gèmemoncha</td>
          <td>Coordinateur ███</td>
          <td><span class="status-badge active">Actif</span></td>
        </tr>
        <tr>
          <td class="redacted-cell">███████</td>
          <td class="redacted-cell">████</td>
          <td>Analyste Données</td>
          <td><span class="status-badge active">Actif</span></td>
        </tr>
      </tbody>
    </table>
  `;

  // ONGLET LABORATOIRE
  // Ajouter une photo : déposer site_secret/labo/photo0XX.jpg,
  // puis ajouter son numéro (ex. 12) dans « disponibles ». Sinon : placeholder, aucune requête.
  const GALERIE = {
    total: 100,
    chemin: n => `labo/photo${String(n).padStart(3, '0')}.jpg`,
    disponibles: []
  };
  let currentPhotoIndex = 0;
  const totalPhotos = GALERIE.total;
  const photoDispo = i => GALERIE.disponibles.includes(i + 1);

  function updateGallery() {
    const thumbs = $$('.thumbnail');
    thumbs.forEach((t, idx) => {
      t.classList.toggle('active', idx === currentPhotoIndex);
    });

    const photoNum = String(currentPhotoIndex + 1).padStart(3, '0');
    const infoEl = $('#gallery-image-info');
    if (infoEl) infoEl.textContent = `Photo ${photoNum}`;
    const placeholderEl = $('#gallery-placeholder');
    if (placeholderEl) placeholderEl.textContent = `Photo ${photoNum} — en attente`;
    // Photo réelle seulement si déclarée disponible (pas de requête sinon)
    const photoEl = $('#gallery-photo');
    const dispo = photoDispo(currentPhotoIndex);
    if (photoEl) {
      if (dispo) photoEl.src = GALERIE.chemin(currentPhotoIndex + 1);
      else photoEl.removeAttribute('src');
      photoEl.hidden = !dispo;
      photoEl.previousElementSibling.style.display = dispo ? 'none' : ''; // .image-placeholder est en display:flex
    }
    const counterEl = $('#gallery-counter');
    if (counterEl) counterEl.textContent = currentPhotoIndex + 1;
    // Centre la vignette active dans la bande, sans faire défiler la page
    const bande = $('#gallery-thumbs');
    const active = thumbs[currentPhotoIndex];
    if (bande && active) {
      const b = bande.getBoundingClientRect();
      const a = active.getBoundingClientRect();
      bande.scrollLeft += (a.left + a.width / 2) - (b.left + b.width / 2);
    }
  }

  $('#contenu-laboratoire').innerHTML = `
    <div class="gallery-header">
      <h2>Galerie - Installations de Recherche</h2>
      <p class="gallery-notice">Photographies des installations de recherche - Accès restreint</p>
    </div>
    
    <div class="gallery-container">
      <div class="gallery-viewer">
        <div class="gallery-image-frame">
          <div class="image-placeholder">
            <div class="placeholder-text" id="gallery-placeholder">Photo 001 — en attente</div>
          </div>
          <img id="gallery-photo" alt="" hidden style="width:100%;height:100%;object-fit:cover">
        </div>
        
        <div class="gallery-image-info" id="gallery-image-info">Photo 001</div>
      </div>

      <div class="gallery-controls">
        <button id="gallery-prev" class="gallery-btn">← Précédent</button>
        <div class="gallery-counter"><span id="gallery-counter">1</span> / ${totalPhotos}</div>
        <button id="gallery-next" class="gallery-btn">Suivant →</button>
      </div>

      <div class="gallery-thumbnails" id="gallery-thumbs">
        ${Array.from({length: totalPhotos}, (_, i) => 
          `<div class="thumbnail ${i === 0 ? 'active' : ''}" data-index="${i}">${photoDispo(i)
            ? `<img src="${GALERIE.chemin(i + 1)}" loading="lazy" alt="" style="width:100%;height:100%;object-fit:cover;display:block">`
            : ''}</div>`
        ).join('')}
      </div>

      <div class="gallery-legend">
        <p>Information</p>
        <ul>
          <li>Chaque image représente une section du laboratoire principal</li>
          <li>Les métadonnées détaillées sont disponibles via le terminal (/metadata)</li>
          <li>Navigation : flèches ou clics sur les vignettes</li>
        </ul>
      </div>
    </div>
  `;

  // Événements galerie
  // (délai de 10 ms non nécessaire : le HTML ci-dessus existe déjà ; conservé tel quel)
  setTimeout(() => {
    const prevBtn = $('#gallery-prev');
    const nextBtn = $('#gallery-next');

    if (prevBtn) {
      // Boucle : Précédent à 1 → 100
      prevBtn.addEventListener('click', () => {
        currentPhotoIndex = (currentPhotoIndex - 1 + totalPhotos) % totalPhotos;
        updateGallery();
      });
    }

    if (nextBtn) {
      // Boucle : Suivant à 100 → 1
      nextBtn.addEventListener('click', () => {
        currentPhotoIndex = (currentPhotoIndex + 1) % totalPhotos;
        updateGallery();
      });
    }

    const thumbs = $$('.thumbnail');
    thumbs.forEach(thumb => {
      thumb.addEventListener('click', (e) => {
        // currentTarget : le clic peut tomber sur l'<img> de la vignette
        currentPhotoIndex = parseInt(e.currentTarget.dataset.index);
        updateGallery();
      });
    });
  }, 10);

  // ONGLET DONNÉES
  $('#contenu-donnees').innerHTML = `
    <div class="secure-header">
      <h2>Données Sécurisées</h2>
      <p class="secure-warning">Accès restreint - Authentification requise</p>
    </div>

    <div class="secure-auth-box">
      <form class="auth-form" id="secure-auth-form">
        <label for="secure-password">Mot de passe administrateur :</label>
        <div class="password-input-group">
          <input type="password" id="secure-password" class="secure-input" placeholder="Entrez le mot de passe" />
          <button type="button" class="xp-button auth-button" id="secure-submit">Valider</button>
        </div>
        <div class="auth-message" id="auth-message"></div>
      </form>
    </div>

    <div class="secure-tabs" id="secure-tabs" style="display: none;">
      <div class="secure-tab-nav">
        <button class="secure-tab-btn active" data-tab="documents">Documents</button>
        <button class="secure-tab-btn" data-tab="video">Vidéo</button>
        <button class="secure-tab-btn" data-tab="audio">Audio</button>
      </div>

      <div class="secure-tab-content active" id="tab-documents">
        <h3>Documents Confidentiels</h3>
        <div class="secure-doc-list">
          <div class="secure-document">
            <span class="doc-icon">📄</span>
            <span class="doc-name">RAPPORT_FINAL_PHASE_4.pdf</span>
            <span class="doc-size">2.3 MB</span>
          </div>
          <div class="secure-document">
            <span class="doc-icon">📄</span>
            <span class="doc-name">RESULTATS_TESTS_CLINIQUES.xlsx</span>
            <span class="doc-size">1.8 MB</span>
          </div>
          <div class="secure-document">
            <span class="doc-icon">📄</span>
            <span class="doc-name">CHRONOLOGIE_DEPLOIEMENT.docx</span>
            <span class="doc-size">956 KB</span>
          </div>
        </div>
      </div>

      <div class="secure-tab-content" id="tab-video">
        <h3>Vidéos Sécurisées</h3>
        <div class="secure-video-list">
          <div class="secure-video-item locked">
            <div class="video-thumbnail"></div>
            <div class="video-info">
              <div class="video-title">Documentation Projet PICKAXE</div>
              <div class="video-duration">14:32</div>
              <div class="lock-badge">🔒 Accès restreint</div>
            </div>
          </div>
          <div class="secure-video-item locked">
            <div class="video-thumbnail"></div>
            <div class="video-info">
              <div class="video-title">Présentation Résultats Phase 4</div>
              <div class="video-duration">28:15</div>
              <div class="lock-badge">🔒 Accès restreint</div>
            </div>
          </div>
        </div>
      </div>

      <div class="secure-tab-content" id="tab-audio">
        <h3>Enregistrements Audio</h3>
        <div class="secure-audio-list">
          <div class="secure-audio-item">
            <span class="audio-icon">🔊</span>
            <span class="audio-name">Réunion_Directeurs_09-28.mp3</span>
            <span class="audio-duration">47:23</span>
          </div>
          <div class="secure-audio-item">
            <span class="audio-icon">🔊</span>
            <span class="audio-name">Alerte_Sécurité_Système.wav</span>
            <span class="audio-duration">2:41</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // Gestion authentification données
  let secureUnlocked = false;

  // (délai de 10 ms non nécessaire : le HTML ci-dessus existe déjà ; conservé tel quel)
  setTimeout(() => {
    const submitBtn = $('#secure-submit');
    const passwordInput = $('#secure-password');
    const authMsg = $('#auth-message');
    const authForm = $('#secure-auth-form');
    const secureTabs = $('#secure-tabs');

    // Entrée dans le champ = même contrôle que le bouton Valider (sans rechargement)
    if (authForm && submitBtn) {
      authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitBtn.click();
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const pwd = passwordInput ? passwordInput.value : '';
        if (pwd === '') {
          if (authMsg) {
            authMsg.textContent = 'Veuillez entrer un mot de passe.';
            authMsg.className = 'auth-message error';
          }
        } else if (pwd === 'ADMIN1234') {
          if (authMsg) {
            authMsg.textContent = '✓ Authentification réussie';
            authMsg.className = 'auth-message success';
          }
          secureUnlocked = true;
          if (authForm) authForm.style.display = 'none';
          if (secureTabs) secureTabs.style.display = 'block';
        } else {
          if (authMsg) {
            authMsg.textContent = '✗ Mot de passe incorrect';
            authMsg.className = 'auth-message error';
          }
        }
      });
    }

    $$('.secure-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.secure-tab-btn').forEach(b => b.classList.remove('active'));
        $$('.secure-tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        const tabContent = $('#tab-' + btn.dataset.tab);
        if (tabContent) tabContent.classList.add('active');
      });
    });
  }, 10);

  // ONGLET MESSAGERIE
  let emailDetailActif = null;

  const emails = [
    {
      id: 'email-1',
      de: 'Direction Générale',
      sujet: 'Rapport de synthèse - Phase 4',
      date: '2026-10-05 14:32',
      unread: true,
      corps: `Bonjour,

Les résultats de la Phase 4 sont conformes aux attentes. 
Le déploiement peut être accéléré selon le calendrier révisé.

Merci de confirmer les ressources nécessaires pour Q4.

Cordialement,
Direction PICKAXE`
    },
    {
      id: 'email-2',
      de: 'IT Support',
      sujet: 'Mise à jour système - Accès sécurisé',
      date: '2026-09-27 09:15',
      unread: true,
      corps: `Lab_Admin,

La mise à jour de sécurité du système a été appliquée avec succès.
Tous les accès ont été réauthentifiés.

Les identifiants d'accès d'urgence ont été réinitialisés.
Consultez le terminal (/help) pour plus d'informations.

Support IT`
    },
    {
      id: 'email-3',
      de: 'Département Logistique',
      sujet: 'Coordination transport - Livraison Q1 2027',
      date: '2026-09-02 16:48',
      unread: false,
      corps: `Équipe PICKAXE,

Les arrangements pour la livraison massive de Q1 2027 sont finalisés.
Trois sites de distribution ont été confirmés.

Plus d'informations lors de la prochaine réunion de coordination.`
    }
  ];

  $('#contenu-messagerie').innerHTML = `
    <div class="messagerie-header">
      <h2>Système de Messagerie Interne</h2>
      <button class="xp-button refresh-btn" id="refresh-emails">Actualiser</button>
    </div>

    <div class="messagerie-container">
      <table class="xp-table messagerie-table">
        <thead>
          <tr>
            <th style="width: 30px;"></th>
            <th>De</th>
            <th>Sujet</th>
            <th style="width: 140px;">Date</th>
          </tr>
        </thead>
        <tbody id="emails-tbody">
          ${emails.map(e => `
            <tr class="email-row ${e.unread ? 'unread' : ''}" data-email-id="${e.id}">
              <td class="unread-badge">${e.unread ? '●' : ' '}</td>
              <td>${e.de}</td>
              <td class="email-subject">${e.sujet}</td>
              <td>${e.date}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div id="email-detail-container"></div>
  `;

  function afficherEmailDetail(emailId) {
    const email = emails.find(e => e.id === emailId);
    if (!email) return;

    const container = $('#email-detail-container');
    container.innerHTML = `
      <div class="email-detail visible">
        <button class="close-detail xp-button" id="close-detail">← Retour à la liste</button>
        <div class="email-detail-content">
          <div class="email-from"><strong>De :</strong> ${email.de}</div>
          <div class="email-subject-line"><strong>Sujet :</strong> ${email.sujet}</div>
          <div class="email-date"><strong>Date :</strong> ${email.date}</div>
          <div class="email-body">${email.corps.replace(/\n/g, '<br>')}</div>
        </div>
      </div>
    `;

    const closeBtn = $('#close-detail');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        container.innerHTML = '';
        emailDetailActif = null;
      });
    }

    emailDetailActif = emailId;
  }

  document.addEventListener('click', (e) => {
    const row = e.target.closest('.email-row');
    if (row) {
      afficherEmailDetail(row.dataset.emailId);
    }
  });

  // (délai de 10 ms non nécessaire : le HTML ci-dessus existe déjà ; conservé tel quel)
  setTimeout(() => {
    const refreshBtn = $('#refresh-emails');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        messageStatut('Synchronisation avec le serveur…', 1500);
      });
    }
  }, 10);

  /* ==========================================================
     3. BARRE D'ÉTAT (message temporaire + horloge)
     ========================================================== */
  let statutTimer = null;

  /** Affiche un message dans la barre d'état puis revient à "Prêt" */
  function messageStatut(texte, duree) {
    clearTimeout(statutTimer);
    statusL.textContent = texte;
    statutTimer = setTimeout(() => { statusL.textContent = 'Prêt'; }, duree || 1500);
  }

  /** Horloge système réelle */
  function majHorloge() {
    const d = new Date();
    const p = n => String(n).padStart(2, '0');
    const clockEl = $('#clock');
    const trayClockEl = $('#tray-clock');
    if (clockEl) clockEl.textContent = p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
    if (trayClockEl) trayClockEl.textContent = p(d.getHours()) + ':' + p(d.getMinutes());
  }
  majHorloge();
  setInterval(majHorloge, 1000);

  /* ==========================================================
     4. BARRE DE MENU
     ========================================================== */
  let menuOuvert = null;

  function fermerMenus() {
    $$('.dropdown').forEach(d => d.classList.add('hidden'));
    $$('.menu-item').forEach(m => m.classList.remove('open'));
    menuOuvert = null;
  }

  function ouvrirMenu(item) {
    const nom = item.dataset.menu;
    fermerMenus();
    const dd = $('#menu-' + nom);
    if (!dd) return;
    const rItem = item.getBoundingClientRect();
    const rWin  = fenetre.getBoundingClientRect();
    dd.style.left = (rItem.left - rWin.left - 1) + 'px';
    dd.style.top  = (rItem.bottom - rWin.top) + 'px';
    dd.classList.remove('hidden');
    item.classList.add('open');
    menuOuvert = nom;
  }

  $$('.menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      if (menuOuvert === item.dataset.menu) fermerMenus();
      else ouvrirMenu(item);
    });
    // Survol : si un menu est déjà ouvert, bascule sur celui-ci
    item.addEventListener('mouseenter', () => {
      if (menuOuvert && menuOuvert !== item.dataset.menu) ouvrirMenu(item);
    });
  });

  // Entrées actives des menus
  $$('.dd-entry:not(.disabled)').forEach(entry => {
    entry.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = entry.dataset.action;
      fermerMenus();
      if (action === 'quitter') {
        ouvrirDialogue('Erreur', 'Impossible de fermer cette application. Une session est en cours.');
      } else if (action === 'actualiser') {
        messageStatut('Actualisation…', 800);
      } else if (action === 'apropos') {
        ouvrirDialogue('À propos de', 'Système de gestion interne\nVersion 2.1.4 (build 0312)', 'info');
      }
    });
  });

  // Clic ailleurs : fermeture
  document.addEventListener('click', fermerMenus);

  /* ==========================================================
     5. BOÎTE DE DIALOGUE
     ========================================================== */
  const overlay = $('#dialog-overlay');

  function ouvrirDialogue(titre, texte, type) {
    $('#dialog-title').textContent = titre;
    $('#dialog-text').innerHTML = texte.replace(/\n/g, '<br>');
    const icone = $('.dialog-icon');
    if (type === 'info') {
      icone.innerHTML =
        '<circle cx="16" cy="16" r="14" fill="#3a7bd5" stroke="#1d3f8f" stroke-width="1.5"/>' +
        '<rect x="14" y="14" width="4" height="9" fill="#fff"/><rect x="14" y="8" width="4" height="4" fill="#fff"/>';
    } else {
      icone.innerHTML =
        '<circle cx="16" cy="16" r="14" fill="#e03a2b" stroke="#8a1a10" stroke-width="1.5"/>' +
        '<path d="M10 10l12 12M22 10L10 22" stroke="#fff" stroke-width="3.5"/>';
    }
    overlay.classList.remove('hidden');
    $('#dialog-ok').focus();
  }
  function fermerDialogue() { overlay.classList.add('hidden'); }

  $('#dialog-ok').addEventListener('click', fermerDialogue);
  $('#dialog-x').addEventListener('click', fermerDialogue);
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('hidden') && (e.key === 'Enter' || e.key === 'Escape')) {
      fermerDialogue();
    }
  });

  /* ==========================================================
     6. BOUTONS DE LA BARRE DE TITRE
     ========================================================== */
  // --- Fermer ---
  $('#btn-close').addEventListener('click', (e) => {
    e.stopPropagation();
    ouvrirDialogue('Erreur', 'Impossible de fermer cette application. Une session est en cours.');
  });

  // --- Agrandir / restaurer ---
  let maximisee = false;
  let geoSauvee = null;

  function basculerAgrandir() {
    if (!maximisee) {
      geoSauvee = {
        left: fenetre.style.left, top: fenetre.style.top,
        width: fenetre.style.width, height: fenetre.style.height
      };
      fenetre.classList.add('maximized');
    } else {
      fenetre.classList.remove('maximized');
      if (geoSauvee) {
        fenetre.style.left = geoSauvee.left;
        fenetre.style.top = geoSauvee.top;
        fenetre.style.width = geoSauvee.width;
        fenetre.style.height = geoSauvee.height;
      }
    }
    maximisee = !maximisee;
    setTimeout(majScrollbar, 50);
  }
  $('#btn-max').addEventListener('click', (e) => { e.stopPropagation(); basculerAgrandir(); });
  titlebar.addEventListener('dblclick', (e) => {
    if (e.target.closest('.titlebar-buttons')) return;
    basculerAgrandir();
  });

  // --- Réduire / restaurer via la barre des tâches ---
  const taskBtn = $('#task-btn');
  let timerMasquage = null; // annulé si la fenêtre est restaurée avant 300 ms

  $('#btn-min').addEventListener('click', (e) => {
    e.stopPropagation();
    fenetre.classList.add('minimizing');
    taskBtn.classList.remove('hidden');
    timerMasquage = setTimeout(() => { fenetre.style.visibility = 'hidden'; }, 300);
  });

  taskBtn.addEventListener('click', () => {
    clearTimeout(timerMasquage);
    fenetre.style.visibility = 'visible';
    // Force le recalcul pour que la transition s'applique
    void fenetre.offsetWidth;
    fenetre.classList.remove('minimizing');
    taskBtn.classList.add('hidden');
    majScrollbar();
  });

  /* ==========================================================
     7. FENÊTRE DÉPLAÇABLE (drag par la barre de titre)
     ========================================================== */
  let drag = null;

  titlebar.addEventListener('mousedown', (e) => {
    if (e.target.closest('.titlebar-buttons') || maximisee) return;
    const r = fenetre.getBoundingClientRect();
    drag = { dx: e.clientX - r.left, dy: e.clientY - r.top };
    e.preventDefault();
  });
  document.addEventListener('mousemove', (e) => {
    if (!drag) return;
    let x = e.clientX - drag.dx;
    let y = e.clientY - drag.dy;
    // On garde la barre de titre accessible
    x = Math.max(-fenetre.offsetWidth + 80, Math.min(window.innerWidth - 80, x));
    y = Math.max(0, Math.min(window.innerHeight - 60, y));
    fenetre.style.left = x + 'px';
    fenetre.style.top  = y + 'px';
  });
  document.addEventListener('mouseup', () => { drag = null; });

  /* ==========================================================
     8. SCROLLBAR XP PERSONNALISÉE
     ========================================================== */
  const content = $('#content');
  const track   = $('#scroll-track');
  const thumb   = $('#scroll-thumb');
  const MIN_THUMB = 24;

  function majScrollbar() {
    const visible = content.clientHeight;
    const total   = content.scrollHeight;
    const trackH  = track.clientHeight;
    if (total <= visible + 1) {
      thumb.style.display = 'none';
      return;
    }
    thumb.style.display = 'flex';
    const h = Math.max(MIN_THUMB, trackH * visible / total);
    const maxTop = trackH - h;
    const ratio = content.scrollTop / (total - visible);
    thumb.style.height = h + 'px';
    thumb.style.top = (maxTop * ratio) + 'px';
  }

  content.addEventListener('scroll', majScrollbar);
  window.addEventListener('resize', majScrollbar);
  if (window.ResizeObserver) new ResizeObserver(majScrollbar).observe(content);

  // Boutons flèches (avec répétition au maintien)
  function lierFleche(btn, delta) {
    let rep = null, attente = null;
    const pas = () => { content.scrollTop += delta; };
    btn.addEventListener('mousedown', (e) => {
      e.preventDefault();
      pas();
      attente = setTimeout(() => { rep = setInterval(pas, 40); }, 350);
    });
    const stop = () => { clearTimeout(attente); clearInterval(rep); };
    document.addEventListener('mouseup', stop);
    btn.addEventListener('mouseleave', stop);
  }
  lierFleche($('#scroll-up'), -30);
  lierFleche($('#scroll-down'), 30);

  // Glisser le curseur
  let dragThumb = null;
  thumb.addEventListener('mousedown', (e) => {
    dragThumb = { y: e.clientY, top: content.scrollTop };
    e.preventDefault();
    e.stopPropagation();
  });
  document.addEventListener('mousemove', (e) => {
    if (!dragThumb) return;
    const visible = content.clientHeight;
    const total   = content.scrollHeight;
    const trackH  = track.clientHeight;
    const h = parseFloat(thumb.style.height) || MIN_THUMB;
    const ratio = (total - visible) / (trackH - h);
    content.scrollTop = dragThumb.top + (e.clientY - dragThumb.y) * ratio;
  });
  document.addEventListener('mouseup', () => { dragThumb = null; });

  // Clic sur le rail : saut d'une page
  track.addEventListener('mousedown', (e) => {
    if (e.target !== track) return;
    const r = thumb.getBoundingClientRect();
    content.scrollTop += (e.clientY < r.top ? -1 : 1) * content.clientHeight * 0.9;
  });

  /* ==========================================================
     9. AMBIANCE (flicker, tremblement, messages d'état)
     ========================================================== */
  let ambianceActive = false;

  function aleatoire(min, max) { return min + Math.random() * (max - min); }

  function demarrerAmbiance() {
    if (ambianceActive) return;
    ambianceActive = true;
    majScrollbar();
    planifierFlicker();
    planifierTremblement();
    planifierMessageStatut();
  }

  // Flicker : le contenu clignote ~100 ms toutes les 20 à 40 s
  function planifierFlicker() {
    setTimeout(() => {
      const flash = $('#crt-flash');
      flash.classList.add('on');
      desktop.style.opacity = '0.86';
      setTimeout(() => {
        flash.classList.remove('on');
        desktop.style.opacity = '';
      }, 100);
      planifierFlicker();
    }, aleatoire(20000, 40000));
  }

  // Tremblement : décalage de 1 px, rare et bref
  function planifierTremblement() {
    setTimeout(() => {
      if (!maximisee && !drag) {
        fenetre.classList.add('shake');
        setTimeout(() => fenetre.classList.remove('shake'), 90);
      }
      planifierTremblement();
    }, aleatoire(25000, 70000));
  }

  // Message d'état occasionnel
  function planifierMessageStatut() {
    setTimeout(() => {
      messageStatut('Connexion au serveur interne…', 2200);
      planifierMessageStatut();
    }, aleatoire(30000, 60000));
  }

  /* ==========================================================
     9b. MENU DÉMARRER + FERMETURE DE SESSION
     ========================================================== */
  const startBtn       = $('#start-btn');
  const startMenu      = $('#start-menu');
  const logoffOverlay  = $('#logoff-overlay');
  const shutdownScreen = $('#shutdown-screen');
  const fadeBlack      = $('#fade-black');

  // Nom d'utilisateur dans le menu (même nom que l'intro)
  $('#start-username').textContent = NOM_UTILISATEUR;

  /** Ouvre / ferme le menu Démarrer (et enfonce le bouton) */
  function basculerMenuDemarrer(forcer) {
    const ouvrir = (typeof forcer === 'boolean')
      ? forcer
      : startMenu.classList.contains('hidden');
    startMenu.classList.toggle('hidden', !ouvrir);
    startBtn.classList.toggle('pressed', ouvrir);
  }

  startBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fermerMenus();               // ferme d'abord les menus de la fenêtre
    basculerMenuDemarrer();
  });

  // Un clic dans le menu ne le ferme pas (sauf action explicite)
  startMenu.addEventListener('click', (e) => e.stopPropagation());

  // Clic ailleurs : fermeture du menu Démarrer
  document.addEventListener('click', () => basculerMenuDemarrer(false));

  // Entrées décoratives : aucune action
  $$('.start-item').forEach(item => {
    item.addEventListener('click', (e) => e.stopPropagation());
  });

  // Bouton "Arrêter" : décoratif, petit message d'erreur XP
  $('#start-shutdown').addEventListener('click', (e) => {
    e.stopPropagation();
    basculerMenuDemarrer(false);
    ouvrirDialogue('Arrêter Windows', 'Vous n\'avez pas les autorisations nécessaires pour arrêter cet ordinateur.');
  });

  // Bouton "Fermer la session" : ouvre la boîte de confirmation
  $('#start-logoff').addEventListener('click', (e) => {
    e.stopPropagation();
    basculerMenuDemarrer(false);
    logoffOverlay.classList.remove('hidden');
  });

  // Boîte de dialogue : Annuler / croix
  $('#logoff-cancel').addEventListener('click', () => logoffOverlay.classList.add('hidden'));
  $('#logoff-x').addEventListener('click', () => logoffOverlay.classList.add('hidden'));

  // Boîte de dialogue : Changer d'utilisateur (décoratif)
  $('#logoff-switch').addEventListener('click', () => {
    logoffOverlay.classList.add('hidden');
    ouvrirDialogue('Changer d\'utilisateur', 'Le changement rapide d\'utilisateur est désactivé sur cet ordinateur.');
  });

  // Boîte de dialogue : Fermer la session (fonctionnel)
  $('#logoff-confirm').addEventListener('click', () => {
    logoffOverlay.classList.add('hidden');
    lancerDeconnexion();
  });

  /** Séquence : écran bleu -> suppression du garde-fou -> fondu noir -> redirection */
  let deconnexionEnCours = false;
  function lancerDeconnexion() {
    if (deconnexionEnCours) return;
    deconnexionEnCours = true;

    // Écran de fermeture XP plein écran
    shutdownScreen.classList.remove('hidden');

    // Suppression du garde-fou pendant l'écran
    try { sessionStorage.removeItem('acces_secret'); } catch (err) {}

    // Après ~2 s : fondu au noir (600 ms), puis redirection relative
    setTimeout(() => {
      fadeBlack.classList.add('on');
      setTimeout(() => {
        window.location.href = PAGE_ACCUEIL;
      }, 650);
    }, 2000);
  }

  // Échap ferme le menu Démarrer et la boîte "Fermer la session"
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      basculerMenuDemarrer(false);
      if (!logoffOverlay.classList.contains('hidden')) {
        logoffOverlay.classList.add('hidden');
      }
    }
  });

  /* ==========================================================
     10. TERMINAL HACKER (Cmd+Shift+D)
     ========================================================== */

  /* ---- CONFIG CAMÉRAS (seul endroit à modifier) ----
     Déposer les vidéos (format .mp4) dans site_secret/videos/ avec ces noms,
     puis passer "disponible" à true pour la caméra concernée.
     Tant que "disponible" vaut false, un placeholder s'affiche (aucune
     requête, donc aucune erreur dans la console).
     locked: true = flux verrouillé (ACCESS DENIED), comme dans le document Caméras. */
  const CAMERAS = {
    '001': { video: 'videos/camera001.mp4', disponible: false },
    '002': { video: 'videos/camera002.mp4', disponible: false, locked: true },
    '003': { video: 'videos/camera003.mp4', disponible: false },
    '004': { video: 'videos/camera004.mp4', disponible: false },
    '005': { video: 'videos/camera005.mp4', disponible: false },
    '006': { video: 'videos/camera006.mp4', disponible: false, locked: true },
    '007': { video: 'videos/camera007.mp4', disponible: false }
  };

  // Animations passées d'office si l'utilisateur préfère un mouvement réduit
  const MOUVEMENT_REDUIT = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /** Documents d'Informations : censure levée (état gardé pour la session) */
  function appliquerDecryptage() {
    const infos = $('#contenu-informations');
    if (infos) infos.classList.add('decrypte');
    majScrollbar();
  }
  try {
    if (sessionStorage.getItem('docs_decryptes') === '1') appliquerDecryptage();
  } catch (e) {}

  const terminal = {
    history: [],
    historyIndex: 0,
    logs: [],
    unlocked: false,
    
    init: function() {
      // Créer la structure du terminal
      const overlay = document.createElement('div');
      overlay.id = 'terminal-overlay';
      overlay.className = 'terminal-overlay';
      overlay.innerHTML = `
        <div class="terminal-window">
          <div class="terminal-titlebar">
            <span>Terminal Système - Accès Root</span>
            <button class="terminal-close" id="terminal-close">✕</button>
          </div>
          <div class="terminal-body" id="terminal-body">
            <div class="terminal-log">Bienvenue dans le terminal système PICKAXE</div>
            <div class="terminal-log">Tapez /help pour obtenir de l'aide</div>
            <div class="terminal-log"></div>
          </div>
          <div style="padding: 8px; background: #000; border-top: 1px solid #0f0;">
            <div class="terminal-input-line">
              <span class="terminal-prompt">C:\\></span>
              <input type="text" class="terminal-input" id="terminal-input" placeholder="Commande..." autocomplete="off" spellcheck="false" />
              <span class="terminal-cursor" id="terminal-cursor" aria-hidden="true"></span>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);
      this.setupEvents();
    },
    
    setupEvents: function() {
      const input = $('#terminal-input');
      const closeBtn = $('#terminal-close');
      const overlay = $('#terminal-overlay');

      if (!input) return;

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          // Animation en cours : Entrée l'affiche en entier, sans lancer de commande
          if (this.anim.actif) {
            this.passer();
            return;
          }
          const cmd = input.value.trim();
          this.executeCommand(cmd);
          this.history.push(cmd);
          this.historyIndex = this.history.length;
          input.value = '';
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (this.history.length > 0) {
            this.historyIndex = Math.max(0, this.historyIndex - 1);
            input.value = this.history[this.historyIndex];
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            input.value = this.history[this.historyIndex];
          } else {
            this.historyIndex = this.history.length;
            input.value = '';
          }
        }
      });

      closeBtn.addEventListener('click', () => {
        overlay.classList.remove('visible');
        input.value = '';
        input.blur();
      });

      // Curseur bloc : repositionné à chaque saisie / déplacement
      ['input', 'keyup', 'click', 'focus'].forEach((ev) => input.addEventListener(ev, () => this.majCurseur()));

      // Garde le focus seulement quand le terminal est ouvert
      input.addEventListener('blur', () => {
        setTimeout(() => {
          if (overlay.classList.contains('visible')) input.focus();
        }, 10);
      });
    },
    
    log: function(text, type = 'default') {
      const body = $('#terminal-body');
      if (!body) return;
      const line = document.createElement('div');
      line.className = `terminal-log ${type}`;
      line.textContent = text;
      body.appendChild(line);
      body.scrollTop = body.scrollHeight;
      return line;
    },

    /* ---------- Moteur d'animation (Entrée = tout afficher) ---------- */
    anim: { actif: false, skip: false, attentes: [] },

    /** Pause annulable : se résout tout de suite si l'animation est passée */
    wait: function(ms) {
      if (this.anim.skip) return Promise.resolve();
      return new Promise((resolve) => {
        const t = setTimeout(resolve, ms);
        this.anim.attentes.push({ t, resolve });
      });
    },

    /** Passe l'animation en cours : toutes les pauses se terminent */
    passer: function() {
      this.anim.skip = true;
      this.anim.attentes.forEach(({ t, resolve }) => { clearTimeout(t); resolve(); });
      this.anim.attentes = [];
    },

    /** Lance une séquence animée (une seule à la fois) */
    run: function(sequence) {
      if (this.anim.actif) return;
      this.anim.actif = true;
      this.anim.skip = MOUVEMENT_REDUIT;
      return sequence().catch(() => {}).then(() => {
        this.anim.actif = false;
        this.anim.attentes = [];
        this.majCurseur();
      });
    },

    /** Ligne tapée caractère par caractère */
    type: async function(text, type = 'default', vitesse = 12) {
      const line = this.log('', type);
      for (let i = 0; i <= text.length; i += 2) {
        if (this.anim.skip) break;
        line.textContent = text.slice(0, i);
        await this.wait(vitesse);
      }
      line.textContent = text;
      return line;
    },

    /** Barre de progression ASCII ([██████░░░░] 62 %) */
    barre: async function(label, cible = 100, duree = 700) {
      const line = this.log('');
      const dessiner = (p) => {
        const plein = Math.round(p / 10);
        line.textContent = `${label} [${'█'.repeat(plein)}${'░'.repeat(10 - plein)}] ${p} %`;
      };
      for (let p = 0; p < cible; p += 10) {
        if (this.anim.skip) break;
        dessiner(p);
        await this.wait(duree / 10);
      }
      dessiner(cible);
      return line;
    },

    /** Faux déchiffrement : caractères aléatoires qui se stabilisent */
    dechiffrer: async function(prefixe, valeur, type = 'default', duree = 500) {
      const line = this.log('', type);
      const signes = '█▓▒░#%&@$*+=?';
      const etapes = 10;
      for (let e = 0; e < etapes; e++) {
        if (this.anim.skip) break;
        const fixes = Math.floor(valeur.length * e / etapes);
        let brouille = valeur.slice(0, fixes);
        for (let i = fixes; i < valeur.length; i++) {
          brouille += valeur[i] === ' ' ? ' ' : signes[Math.floor(Math.random() * signes.length)];
        }
        line.textContent = prefixe + brouille;
        await this.wait(duree / etapes);
      }
      line.textContent = prefixe + valeur;
      return line;
    },

    /** Ligne d'erreur stylisée (ACCESS DENIED) avec tremblement */
    refuser: function(texte) {
      const line = this.log(texte, 'error');
      if (line && !MOUVEMENT_REDUIT) line.classList.add('tremble');
      return line;
    },

    /** Message système inquiétant : ~1 commande sur 6, jamais deux de suite */
    dernierSys: false,
    messageSysteme: function() {
      if (!this.dernierSys && Math.random() < 1 / 6) {
        const messages = ['[sys] activité enregistrée', '[sys] tentative de traçage IP…', '[sys] session surveillée'];
        this.log(messages[Math.floor(Math.random() * messages.length)], 'warning');
        this.dernierSys = true;
      } else {
        this.dernierSys = false;
      }
    },

    /** Curseur bloc : suit la position de saisie dans le champ */
    majCurseur: function() {
      const input = $('#terminal-input');
      const curseur = $('#terminal-cursor');
      if (!input || !curseur) return;
      const ctx = (this._mesure = this._mesure || document.createElement('canvas').getContext('2d'));
      const style = getComputedStyle(input);
      ctx.font = `${style.fontSize} ${style.fontFamily}`;
      const pos = input.selectionStart == null ? input.value.length : input.selectionStart;
      const x = input.offsetLeft + ctx.measureText(input.value.slice(0, pos)).width - input.scrollLeft;
      curseur.style.left = Math.min(x, input.offsetLeft + input.clientWidth - 7) + 'px';
      curseur.style.visibility = this.anim.actif ? 'hidden' : 'visible';
    },

    /* ---------- Ouverture du terminal ---------- */
    bootFait: false,
    ouverture: function() {
      if (this.bootFait) {
        this.run(async () => { await this.type('Reprise de session…', 'default', 15); });
        return;
      }
      this.bootFait = true;
      const body = $('#terminal-body');
      if (body) body.innerHTML = '';
      this.run(async () => {
        await this.type('Initialisation du noyau…');
        await this.barre('Chargement', 100, 600);
        await this.type('Connexion au nœud interne… OK');
        await this.wait(250);
        await this.type('⚠ Session non répertoriée : connexion tracée.', 'warning', 18);
        this.log('');
        this.log('Bienvenue dans le terminal système PICKAXE');
        this.log('Tapez /help pour obtenir de l\'aide');
        this.log('');
      });
    },

    /* ---------- Caméras (tâche B) ---------- */
    cmdCamera: async function(id) {
      const camera = CAMERAS[id];
      if (!camera) {
        this.refuser(`ACCESS DENIED – flux introuvable : /camera${id}`);
        this.log('');
        return;
      }

      await this.type(`Établissement du flux CAM-${id}…`);
      if (camera.locked) {
        await this.barre('Liaison', 40, 400);
        this.refuser(`ACCESS DENIED – flux verrouillé : /camera${id}`);
        this.log('');
        return;
      }
      await this.barre('Liaison', 100, 700);

      const cadre = document.createElement('div');
      cadre.className = 'terminal-camera';
      cadre.innerHTML = `
        <div class="terminal-camera__titre"><span>CAMÉRA ${id}</span><span class="terminal-camera__rec">● REC</span></div>
        <div class="terminal-camera__ecran"><span class="terminal-camera__horloge"></span></div>`;
      const ecran = cadre.querySelector('.terminal-camera__ecran');
      const placeholder = () => {
        const p = document.createElement('div');
        p.className = 'terminal-camera__placeholder';
        p.textContent = `[PLACEHOLDER] Caméra ${id} opérationnelle, vidéo attendue : ${camera.video}`;
        return p;
      };

      if (camera.disponible) {
        const video = document.createElement('video');
        video.className = 'terminal-video';
        video.src = camera.video;
        video.controls = true;
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.onerror = () => video.replaceWith(placeholder());
        ecran.prepend(video);
      } else {
        ecran.prepend(placeholder());
      }

      // Horodatage qui défile tant que le cadre est affiché
      const horloge = cadre.querySelector('.terminal-camera__horloge');
      const p2 = (n) => String(n).padStart(2, '0');
      const tic = () => {
        if (!cadre.isConnected) { clearInterval(minuteur); return; }
        const d = new Date();
        horloge.textContent = `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())} ${p2(d.getHours())}:${p2(d.getMinutes())}:${p2(d.getSeconds())}`;
      };
      const minuteur = setInterval(tic, 1000);

      const body = $('#terminal-body');
      body.appendChild(cadre);
      tic();
      body.scrollTop = body.scrollHeight;
      this.log('');
    },

    /* ---------- Décryptage des documents (Cmd/Ctrl+Shift+X) ---------- */
    decrypter: function() {
      this.run(async () => {
        if (sessionStorage.getItem('docs_decryptes') === '1') {
          await this.type('Documents d\'Informations déjà décryptés.', 'success');
        } else {
          await this.type('Décryptage des documents d\'Informations…');
          await this.dechiffrer('  Protocole du Site ........ ', 'OK', 'default', 600);
          await this.dechiffrer('  Caméras de Surveillance .. ', 'OK', 'default', 600);
          await this.barre('Déchiffrement', 100, 700);
          try { sessionStorage.setItem('docs_decryptes', '1'); } catch (e) {}
          appliquerDecryptage();
          await this.type('Documents d\'Informations décryptés', 'success', 15);
        }
        this.log('');
        this.log('C:\\>');
      });
    },

    executeCommand: function(cmd) {
      this.log(cmd);
      this.log('');

      if (cmd === '') {
        return;
      }

      const args = cmd.split(' ');
      const command = args[0].toLowerCase();
      const camera = /^\/camera(\d+)$/.exec(command);

      // /clear : effet CRT puis écran vidé (pas de message système)
      if (command === '/clear') {
        this.run(async () => {
          const bodyEl = $('#terminal-body');
          if (!MOUVEMENT_REDUIT) bodyEl.classList.add('efface');
          await this.wait(200);
          bodyEl.classList.remove('efface');
          bodyEl.innerHTML = '<div class="terminal-log">Terminal effacé</div><div class="terminal-log"></div>';
          this.log('C:\\>');
        });
        return;
      }

      this.run(async () => {
        if (camera) {
          await this.cmdCamera(camera[1].padStart(3, '0'));
        } else {
          switch (command) {
            case '/help':
              await this.type('═══════════════════════════════════════', 'success', 4);
              await this.type('Commandes disponibles:', 'success', 8);
              await this.type('═══════════════════════════════════════', 'success', 4);
              await this.type('  /camera      - Afficher une archive caméra', 'default', 6);
              await this.type('  /metadata    - Consulter les métadonnées système', 'default', 6);
              await this.type('  /shortcuts   - Afficher les raccourcis clavier', 'default', 6);
              await this.type('  /status      - État du système', 'default', 6);
              await this.type('  /clear       - Effacer le terminal', 'default', 6);
              this.log('');
              break;

            case '/metadata':
              this.log('');
              await this.type('=== Métadonnées Système ===', 'success', 8);
              await this.dechiffrer('Utilisateur: ', NOM_UTILISATEUR, 'default', 150);
              await this.dechiffrer('Domaine: ', 'PICKAXE.CORP', 'default', 150);
              await this.dechiffrer('Ordinateur: ', 'LAB-ADMIN-001', 'default', 150);
              await this.dechiffrer('OS: ', 'Microsoft Windows XP Professional', 'default', 150);
              await this.dechiffrer('Version: ', 'Build 2600', 'default', 150);
              await this.dechiffrer('Niveau d\'accès: ', '4 (Administrateur)', 'default', 150);
              await this.dechiffrer('Authentification: ', 'Biométrique + Mot de passe', 'default', 150);
              await this.dechiffrer('Chiffrement: ', 'AES-256', 'default', 150);
              await this.dechiffrer('Synchronisation: ', '2026-10-09 10:39:00', 'default', 150);
              this.log('');
              break;

            case '/shortcuts':
              this.log('');
              await this.type('Raccourcis clavier disponibles:', 'success', 8);
              await this.type('  Cmd+Shift+D  - Ouvrir/Fermer le terminal', 'default', 6);
              await this.type('  Cmd+Shift+X  - Lever la censure des documents', 'default', 6);
              await this.type('  Échap        - Fermer le terminal', 'default', 6);
              await this.type('  ↑/↓          - Parcourir l\'historique', 'default', 6);
              await this.type('  Tab          - Autocomplétion (à venir)', 'default', 6);
              this.log('');
              break;

            case '/status': {
              this.log('');
              await this.type('État du système:', 'success', 8);
              await this.barre('  CPU:', 34, 300);
              await this.barre('  Mémoire: 2.4 GB / 4 GB', 60, 300);
              await this.barre('  Disque: 847 GB / 1 TB', 85, 300);
              await this.type('  Réseau: Connecté (PICKAXE.CORP)', 'default', 6);
              const securite = this.log('  Sécurité: ✓ Saine');
              if (!this.anim.skip) {
                await this.wait(400);
                securite.textContent = '  Sécurité: ✗ COMPROMISE';
                securite.className = 'terminal-log error';
                await this.wait(250);
              }
              securite.textContent = '  Sécurité: ✓ Saine';
              securite.className = 'terminal-log default';
              await this.type('  Dernière mise à jour: 2026-09-28', 'default', 6);
              this.log('');
              break;
            }

            default:
              this.log(`Commande non reconnue: ${cmd}`, 'error');
              this.log('Tapez /help pour obtenir de l\'aide.');
              this.log('');
          }
        }

        this.messageSysteme();
        this.log('C:\\>');
      });
    }
  };

  terminal.init();

  // Raccourci Cmd+Shift+D pour le terminal
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
      e.preventDefault();
      const overlay = $('#terminal-overlay');
      if (overlay) {
        overlay.classList.toggle('visible');
        if (overlay.classList.contains('visible')) {
          setTimeout(() => {
            const input = $('#terminal-input');
            if (input) input.focus();
          }, 10);
          terminal.ouverture();
        } else {
          $('#terminal-input').blur();
        }
      }
    }
  });

  // Raccourci Cmd/Ctrl+Shift+X : lever la censure (terminal ouvert uniquement)
  document.addEventListener('keydown', (e) => {
    if (!((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'KeyX')) return;
    const overlay = $('#terminal-overlay');
    if (!overlay || !overlay.classList.contains('visible')) return;
    e.preventDefault();
    terminal.decrypter();
  });

  // Échap pour fermer le terminal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const overlay = $('#terminal-overlay');
      if (overlay && overlay.classList.contains('visible')) {
        overlay.classList.remove('visible');
        $('#terminal-input').blur();
      }
    }
  });

  /* ==========================================================
     11. DÉMARRAGE
     ========================================================== */
  let dejaVue = false;
  try { dejaVue = sessionStorage.getItem('introVue') === '1'; } catch (e) {}

  if (dejaVue) {
    // Intro déjà jouée dans cette session : affichage direct
    intro.style.display = 'none';
    setTimeout(() => {
      desktop.classList.add('visible');
      demarrerAmbiance();
      majScrollbar();
    }, 50);
  } else {
    lancerIntro();
  }

  majScrollbar();
})();