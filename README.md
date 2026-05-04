# 🥩 Viande-TP1 - Plateforme E-commerce Boucherie

## 📋 Vue d'ensemble

Plateforme e-commerce complète avec :
- **Frontend** : React + TypeScript + Tailwind CSS (port 8080)
- **Backend** : Node.js + Express (port 5000)
- **Gestion des prix** : Franc CFA (XOF) formaté automatiquement
- **Admin** : Dashboard complet avec gestion produits/commandes
- **Authentification** : Login/Register avec rôles

---

## ⚡ Démarrage rapide (RECOMMANDÉ)

### Windows
```bash
# Double-clic sur start.bat
# OU dans PowerShell/CMD:
start.bat
```

### macOS / Linux
```bash
chmod +x start.sh
./start.sh
```

### Démarrage manuel
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

---

## 🔍 Accès à l'application

| Élément | URL | Identifiants de test |
|--------|-----|---------------------|
| **Frontend** | http://localhost:8080 | - |
| **Admin Panel** | http://localhost:8080/admin | admin@test.com / admin123 |
| **Test Connexion** | http://localhost:8080/test | - |
| **Backend API** | http://localhost:5000 | - |

### Compte administrateur par défaut
```
Email: jeanpierreantoinediadhiou@gmail.com
Mot de passe: antoine256
Rôle: admin
```

---

## 🏗️ Architecture du projet

```
viande-TP1/
├── backend/                 # 🚀 Serveur Express
│   ├── index.js            # Routes API
│   ├── package.json        # Dépendances
│   ├── .env                # Variables d'environnement
│   └── node_modules/
│
├── frontend/               # 🎨 Application React
│   ├── src/
│   │   ├── pages/         # Pages principales
│   │   ├── components/    # Composants réutilisables
│   │   ├── context/       # Context API (gestion d'état)
│   │   ├── store/         # Redux (gestion produits/commandes)
│   │   ├── lib/           # Utilitaires
│   │   └── App.tsx        # Routeur principal
│   ├── vite.config.ts     # Configuration Vite (proxy)
│   ├── package.json
│   └── node_modules/
│
├── start.bat              # 🪟 Script démarrage (Windows)
├── start.sh               # 🐧 Script démarrage (Linux/Mac)
└── README.md              # Cette documentation
```

---

## 🔌 Architecture API

### Routes d'authentification
```
POST /api/register    # Créer un compte
POST /api/login       # Se connecter
POST /api/logout      # Se déconnecter (future)
```

### Routes produits
```
GET    /api/products        # Lister tous les produits
POST   /api/products        # Créer un produit
PUT    /api/products/:id    # Mettre à jour un produit (prix, stock)
DELETE /api/products/:id    # Supprimer un produit
```

### Routes commandes
```
GET           /api/orders              # Lister toutes les commandes
PATCH         /api/orders/:id/confirm  # Confirmer une commande
PATCH         /api/orders/:id/cancel   # Annuler une commande
PATCH         /api/orders/bulk-confirm # Confirmer plusieurs
PATCH         /api/orders/bulk-cancel  # Annuler plusieurs
```

### Routes de diagnostic
```
GET  /api/test           # Test simple de connexion
GET  /api/health         # État du serveur (uptime, etc.)
```

---

## 💰 Gestion des prix en Franc CFA

Tous les prix sont enregistrés en **nombres entiers** (ex: 10000) et affichés formatés.

### Exemples
```
Données enregistrées:   10000
Affichage frontend:     10 000 FCFA
```

### Fonction de formatage
```typescript
// frontend/src/lib/format.ts
export const formatPrice = (n: number) =>
  new Intl.NumberFormat("fr-FR").format(n) + " FCFA";

// Utilisation:
formatPrice(10000)  // "10 000 FCFA"
formatPrice(25500)  // "25 500 FCFA"
```

---

## 🐛 Diagnostiquer les problèmes

### 1️⃣ Le frontend ne se connecte pas au backend

Allez à http://localhost:8080/test et cliquez sur "Relancer les tests"

**Causes possibles:**
- ❌ Backend pas démarré → Lancez `npm run dev` dans `/backend`
- ❌ Port 5000 utilisé → Changez le port dans `.env`
- ❌ Firewall → Vérifiez les permissions réseau

### 2️⃣ Les prix s'affichent mal

Vérifiez que tous les composants utilisent `formatPrice()` ou `formatFCFA()` :
```typescript
import { formatPrice } from "@/lib/format";
// Utiliser:
<p>{formatPrice(product.prix)}</p>
```

### 3️⃣ Erreurs React Router

Le projet utilise déjà les **future flags v7** :
```typescript
// App.tsx
<BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
```

### 4️⃣ Vérifier les logs du serveur

Ouvrez le terminal backend et cherchez les messages :
```
[2026-05-04T...] POST /api/login
✓ Connexion réussie: user@example.com (admin)
```

---

## 📦 Installation des dépendances

### Première installation
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Nettoyer et réinstaller
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules bun.lockb
npm install
```

---

## 🚀 Commandes utiles

### Backend
```bash
cd backend
npm run dev      # Démarrage en développement (avec nodemon)
npm start        # Production
```

### Frontend
```bash
cd frontend
npm run dev      # Démarrage Vite (port 8080)
npm run build    # Build production
npm run preview  # Prévisualiser la build
npm run lint     # Vérifier le code
```

---

## 🔐 Variables d'environnement

### Backend (.env)
```
PORT=5000
```

### Frontend (Vite automatique)
- Proxy API : `/api` → `http://localhost:5000`
- Configuré dans `vite.config.ts`

---

## ✅ Checklist de démarrage

- [ ] Node.js installé (`node --version`)
- [ ] npm installé (`npm --version`)
- [ ] Backend dependencies installées (`cd backend && npm install`)
- [ ] Frontend dependencies installées (`cd frontend && npm install`)
- [ ] Port 5000 disponible (pas d'autre process)
- [ ] Port 8080 disponible (pas d'autre process)
- [ ] Backend démarré (`npm run dev` dans `/backend`)
- [ ] Frontend démarré (`npm run dev` dans `/frontend`)
- [ ] Accéder à http://localhost:8080
- [ ] Tester la connexion : http://localhost:8080/test

---

## 🛠️ Stack technique

### Frontend
- **React 18** avec TypeScript
- **Vite** (bundler ultra-rapide)
- **React Router v6** (avec future flags v7)
- **Redux Toolkit** (gestion état produits/commandes)
- **Tailwind CSS** (styling)
- **Shadcn/ui** (composants)
- **Tanstack React Query** (requêtes HTTP)
- **Sonner** (notifications toast)

### Backend
- **Node.js** + **Express**
- **CORS** (cross-origin requests)
- **dotenv** (variables d'environnement)
- **Nodemon** (auto-reload en dev)

---

## 📄 Fichiers importants

| Fichier | Description |
|---------|-------------|
| `backend/index.js` | Serveur Express complet avec toutes les routes |
| `frontend/src/App.tsx` | Routeur React (avec future flags v7) |
| `frontend/src/pages/Auth.tsx` | Authentification login/register |
| `frontend/src/lib/format.ts` | Formatage des prix FCFA |
| `frontend/vite.config.ts` | Configuration proxy vers backend |
| `frontend/src/store/slices/productsSlice.ts` | Redux thunks pour API produits |

---

## 🤝 Support

Si vous rencontrez des problèmes :

1. Allez sur http://localhost:8080/test
2. Cliquez sur "Relancer les tests"
3. Vérifiez les résultats affichés
4. Consultez les logs du backend (`npm run dev`)

---

## 📝 Notes

- Toutes les données sont stockées en **mémoire** (réinitialisation à chaque restart)
- Pour une production, remplacer par une base de données (MongoDB, PostgreSQL, etc.)
- CORS est configuré pour localhost:8080 uniquement en dev
- Les mots de passe ne sont **pas hashés** (dev uniquement)

---

**Dernière mise à jour**: 4 mai 2026
**Version**: 1.0.0
