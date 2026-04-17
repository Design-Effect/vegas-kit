# Vegas Kit — Version PWA hébergée 👑

Version PWA (Progressive Web App) du Kit Marketing Vegas Cosmetics, prête à héberger sur GitHub Pages, Netlify, Vercel ou tout autre hébergeur statique compatible HTTPS.

---

## 📦 Contenu du dossier

```
vegas-kit-pwa/
├── index.html          → Application principale (kit complet, 640 prompts)
├── manifest.json       → Configuration PWA (nom, icônes, couleurs)
├── service-worker.js   → Cache offline (l'app fonctionne sans internet après 1ère visite)
├── icon-192.svg        → Icône 192×192 (écran d'accueil Android)
├── icon-512.svg        → Icône 512×512 (splash screen Android)
└── README.md           → Ce fichier
```

---

## 🚀 Déploiement sur GitHub Pages (5 minutes)

### 1. Créer le repo

```bash
cd /chemin/vers/vegas-kit-pwa
git init
git add .
git commit -m "Initial commit — Vegas Kit PWA v1.0"
git branch -M main
git remote add origin https://github.com/<TON-USERNAME>/vegas-kit.git
git push -u origin main
```

### 2. Activer GitHub Pages

1. Aller dans **Settings** du repo
2. Onglet **Pages** (menu gauche)
3. Source : **Deploy from a branch**
4. Branch : **main**, dossier **/ (root)**
5. Cliquer **Save**

GitHub te donnera une URL du type :
```
https://<TON-USERNAME>.github.io/vegas-kit/
```

### 3. Vérification PWA

Une fois en ligne, ouvrir l'URL dans Chrome Android :
- ✅ Un popup automatique propose **"Installer Vegas Kit"**
- ✅ L'app fonctionne offline après la 1ère visite
- ✅ Mises à jour automatiques quand tu push sur GitHub

---

## 🌐 Domaine personnalisé (optionnel)

Si tu veux une URL plus pro comme `kit.vegas.designeffect.studio` :

### Sur GitHub Pages :

1. Settings → Pages → Custom domain → Entrer `kit.vegas.designeffect.studio`
2. Cocher **Enforce HTTPS**

### Sur ton fournisseur DNS (OVH, Cloudflare...) :

Ajouter un enregistrement **CNAME** :
```
kit.vegas.designeffect.studio → <TON-USERNAME>.github.io
```

Attendre 5-30 minutes pour la propagation DNS.

---

## ✅ Vérifier la qualité PWA (Lighthouse)

1. Ouvrir l'URL dans **Chrome Desktop**
2. F12 → onglet **Lighthouse**
3. Cocher **Progressive Web App**
4. Cliquer **Analyze page load**

Score attendu : **90+/100** sur la catégorie PWA

---

## 🔄 Mises à jour

À chaque modification :

```bash
# Modifier les fichiers...
# Puis :
git add .
git commit -m "Update: <description>"
git push
```

GitHub Pages se met à jour automatiquement en 1-2 minutes.

**Important** : pour que les utilisateurs reçoivent les mises à jour, incrémenter la version du cache dans `service-worker.js` :
```js
const CACHE_NAME = 'vegas-kit-v1.0.0'; // → v1.0.1, v1.1.0, etc.
```

Sans ce changement, le cache servira l'ancienne version aux utilisateurs déjà visiteurs.

---

## 💼 Stratégie commerciale (différenciation file:// vs hostée)

### Version `vegas-kit-maman-v6.html` (fichier unique offline)
- **Cible** : Acheteurs Gumroad
- **Prix conseillé** : 29€ (paiement unique)
- **Avantage** : zéro hébergement requis, fonctionne offline
- **Limite** : pas de mises à jour automatiques

### Version PWA hostée (ce dossier)
- **Cible** : Abonnés premium / réseau Vegas direct
- **Prix conseillé** : 9€/mois ou 79€/an
- **Avantage** : mises à jour auto, nouveaux prompts ajoutés régulièrement, accessible sur tous appareils
- **Limite** : nécessite une connexion à la 1ère visite

---

## 🛠️ Maintenance technique

### Ajouter un nouveau produit

Modifier `index.html`, dans les blocs JavaScript :

```js
// Dans PRODUTOS :
{ id: 'nom_id', nome: 'Nom', cat: '🔧 Catégorie', img: 'nom_id',
  desc: 'Description courte', prompts: [...20 prompts pro...] }

// Dans IMGS :
nom_id: "data:image/jpeg;base64,..."

// Dans TEXTOS_PROMO :
nom_id: [{ tipo: '✨ Accroche', texto: `...` }, ...7 variantes]
```

Puis bumper `CACHE_NAME` dans `service-worker.js` et push.

### Désactiver le service worker (en cas de bug)

Si une mise à jour casse l'app, accéder à :
```
https://<URL>/service-worker.js
```
Et remplacer son contenu par :
```js
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))));
  e.waitUntil(self.clients.claim());
});
```

Cela vide tous les caches et désactive proprement le SW chez tous les utilisateurs.

---

## 📊 Statistiques d'usage (optionnel)

Pour suivre combien de personnes installent et utilisent le kit, ajouter dans `index.html` avant `</body>` :

```html
<!-- Plausible (RGPD-friendly, pas de cookies) -->
<script defer data-domain="kit.vegas.designeffect.studio" 
        src="https://plausible.io/js/script.js"></script>
```

Ou Google Analytics 4 si tu préfères (mais avec bandeau cookies obligatoire en EU).

---

## 🆘 Support

Pour toute question technique : **AbduLlah — Design Effect Studio**

Version : **1.0.0** | Date : **Avril 2026**
