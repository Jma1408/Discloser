/* ==========================================================
   progression.js - Progression du joueur dans l'ARG DisCloser
   Partagé par toutes les pages (même origine : GitHub Pages).
   - marquer(etape) : enregistre l'heure où une étape est franchie
   - etat()         : renvoie { debut, etapes, indices }
   Stockage : localStorage, une seule clé, toujours dans un try/catch.
   ========================================================== */
(function () {
  var CLE = 'discloser_progression';

  function lire() {
    var e = null;
    try { e = JSON.parse(localStorage.getItem(CLE)); } catch (err) { e = null; }
    if (!e || typeof e !== 'object') e = {};
    e.debut = e.debut || null;        // début de l'ARG = première ouverture de la boîte mail
    e.etapes = e.etapes || {};        // { "1": horodatage, ... }
    e.indices = e.indices || {};      // indices déjà envoyés { "1": horodatage, ... }
    return e;
  }

  function ecrire(e) {
    try { localStorage.setItem(CLE, JSON.stringify(e)); } catch (err) { /* stockage indisponible */ }
  }

  /** Renvoie l'état complet de la progression */
  window.etat = function () { return lire(); };

  /** Marque une étape comme franchie (une seule fois) */
  window.marquer = function (etape) {
    var e = lire();
    if (!e.etapes[etape]) {
      e.etapes[etape] = Date.now();
      ecrire(e);
    }
    return e;
  };

  /* Outils réservés à la boîte mail */
  window.ProgressionARG = {
    cle: CLE,
    // Début de l'ARG : première ouverture de la boîte mail
    demarrer: function () {
      var e = lire();
      if (!e.debut) { e.debut = Date.now(); ecrire(e); }
      return e;
    },
    // Mémorise qu'un indice a été envoyé
    noterIndice: function (etape) {
      var e = lire();
      if (!e.indices[etape]) { e.indices[etape] = Date.now(); ecrire(e); }
      return e;
    },
    // Remise à zéro complète (bouton reset caché)
    reinitialiser: function () {
      try { localStorage.removeItem(CLE); } catch (err) { /* ignoré */ }
    }
  };
})();
