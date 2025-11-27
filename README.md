# Gestion d'Abonnement - Frontend

Interface web React + Vite pour gérer les abonnements, utilisateurs, vendeurs et cartes prépayées.

## 🚀 Démarrage rapide

### Prérequis
- Node.js v16+
- npm ou yarn
- Backend en cours d'exécution (`http://localhost:5000`)

### Installation

```bash
# Cloner le repo
git clone https://github.com/verchy1/gestion-abonnement-frontend.git
cd gestion-abonnement-frontend

# Installer les dépendances
npm install

# Démarrer le serveur dev
npm run dev
```

L'app s'ouvre sur `http://localhost:5173`

### Sur mobile (même réseau Wi-Fi)

```bash
npm run dev -- --host 0.0.0.0
```

Récupère l'IP locale :
```bash
hostname -I | awk '{print $1}'
# Exemple : 192.168.1.42
```

Ouvre sur ton téléphone : `http://192.168.1.42:5173`

---

## 📁 Structure du projet

```
frontend/gs_ovfa_stream/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── PageConnexion.tsx
│   │   ├── DashboardContent.tsx
│   │   ├── AbonnementsContent.tsx
│   │   ├── UtilisateursContent.tsx
│   │   ├── VendeursContent.tsx
│   │   ├── CartesContent.tsx
│   │   ├── Modal.tsx
│   │   ├── FormulaireAbonnement.tsx
│   │   ├── FormulaireUtilisateur.tsx
│   │   ├── FormulaireCarte.tsx
│   │   ├── FormulaireLiaisonCarte.tsx
│   │   └── Skeleton.tsx        # Composants de chargement
│   ├── App.tsx               # Composant principal
│   ├── App.css               # Styles globaux
│   ├── index.css             # Styles Tailwind
│   ├── types.ts              # Interfaces TypeScript
│   └── main.tsx              # Point d'entrée
├── public/                   # Assets statiques
├── vite.config.ts            # Config Vite
├── tailwind.config.js        # Config Tailwind CSS
├── tsconfig.json             # Config TypeScript
├── package.json              # Dépendances
└── README.md                 # Ce fichier
```

---

## 🎨 Pages principales

### 1. **Page de Connexion**
- Authentification admin
- Génère et stocke le JWT dans localStorage
- Redirige vers le dashboard

### 2. **Dashboard**
- Vue d'ensemble des stats (utilisateurs, abonnements, revenus, etc.)
- Cartes de stats avec skeleton loading

### 3. **Abonnements**
- Liste tous les services/abonnements
- CRUD (créer, lire, mettre à jour, supprimer)
- Affiche prix, slots disponibles, utilisateurs

### 4. **Utilisateurs**
- Liste tous les utilisateurs
- CRUD avec tableau
- Affiche abonnement, dates de début/fin, statut
- Skeleton loading pendant le chargement

### 5. **Vendeurs**
- Gestion des vendeurs
- CRUD complet
- Affiche commission, email, statut

### 6. **Cartes Prépayées** ⭐
- Gère les cartes prépayées
- Affiche solde et abonnements liés (avec email)
- Lier un abonnement à une carte
- Supprimer une carte

---

## 🔐 Authentification

L'app utilise JWT stocké dans localStorage :
- Clé : `token`
- Utilisé dans les headers : `Authorization: Bearer <TOKEN>`
- Automatiquement envoyé avec chaque requête API

**Logout** : supprime le token et revient à la page de connexion

---

## 🌐 Configuration API

Le backend est configuré dans `src/types.ts` :
```typescript
export const API_URL = 'http://localhost:5000/api';
```

À modifier si le backend tourne sur un autre port/domaine.

---

## 📦 Dépendances principales

- **React 18** — Framework UI
- **Vite** — Build tool (plus rapide que Webpack)
- **TypeScript** — Typage statique
- **Tailwind CSS** — Framework CSS utility
- **Lucide React** — Icons SVG
- **Axios** (optionnel) — HTTP client (les requêtes utilisent `fetch`)

---

## 🎯 Fonctionnalités clés

✅ Authentification JWT  
✅ CRUD pour tous les entités (abonnements, utilisateurs, vendeurs, cartes)  
✅ Dashboard avec stats en temps réel  
✅ Skeleton loading pour UX fluide  
✅ Modals pour ajouter/modifier  
✅ Responsive design (mobile-friendly)  
✅ Liaison carte → abonnement avec email  
✅ Gestion d'erreurs et notifications  

---

## 🚀 Build pour production

```bash
npm run build
```

Génère un dossier `dist/` prêt à déployer.

```bash
# Prévisualiser le build
npm run preview
```

---

## 🔧 Technos utilisées

- **React 18** — Framework UI
- **Vite** — Build tool
- **TypeScript** — Typage
- **Tailwind CSS** — Styles
- **Lucide React** — Icons
- **Fetch API** — Requêtes HTTP
- **React Hooks** — État et effets

---

## 🛠️ Commandes utiles

```bash
# Développement
npm run dev

# Build production
npm run build

# Prévisualiser le build
npm run preview

# Exposer sur le réseau local
npm run dev -- --host 0.0.0.0

# Linter (TypeScript check)
npm run type-check  # (si configuré)
```

---

## 🎨 Customisation

### Changer la couleur principale
Édite `tailwind.config.js` ou utilise Tailwind utilities directement dans les composants.

### Ajouter une nouvelle page
1. Crée `src/components/NouveauContenu.tsx`
2. Ajoute un onglet dans `App.tsx`
3. Importe et utilise le nouveau composant

---

## 📝 Exemple d'appel API

```typescript
// Dans un composant React
const chargerAbonnements = async (token: string) => {
  const response = await fetch(`${API_URL}/abonnements`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  setAbonnements(data);
};
```

---

## 🐛 Dépannage

**"Cannot read property of undefined"**
- Assure-toi que le backend répond à l'URL configurée
- Vérifie le token dans localStorage (`F12 → Application → localStorage → token`)

**Inputs non fonctionnels**
- Vérifie que les champs ont une classe de couleur de texte (ex. `text-gray-900`)

**Overlay modal trop sombre**
- Édite la classe `bg-black/30` dans le composant `Modal.tsx`

**Erreur CORS**
- Assure-toi que le backend autorise les requêtes du frontend
- Vérifie la variable `CORS_ORIGIN` côté backend

---

## 📄 License

ISC

---

## 👨‍💻 Support

Pour des questions, ouvre une issue sur le repo GitHub.
