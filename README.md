# TaskFlow

TaskFlow est une application web de gestion de projets et de tâches réalisée avec **React** dans le cadre d'un TP de formation.

L'application permet à un utilisateur de créer un compte, de se connecter, de gérer plusieurs projets et leurs tâches, puis de suivre leur avancement depuis un tableau de bord.

Le projet utilise **JSON Server** comme API REST simulée et base de données locale.

---

## Fonctionnalités

### Authentification

- Création d'un compte utilisateur
- Connexion
- Déconnexion
- Persistance de la session avec `localStorage`
- Protection des routes privées

### Gestion des projets

L'utilisateur peut :

- consulter ses projets ;
- créer un projet ;
- modifier un projet ;
- supprimer un projet ;
- consulter le détail d'un projet.

Chaque projet possède notamment :

- un nom ;
- une description ;
- une couleur ;
- une date de création.

### Gestion des tâches

Pour chaque projet, l'utilisateur peut :

- afficher les tâches ;
- créer une tâche ;
- modifier une tâche ;
- supprimer une tâche ;
- changer rapidement son statut.

Une tâche possède notamment :

- un titre ;
- une description ;
- un statut ;
- une priorité ;
- une échéance ;
- une date de création ;
- une date de modification.

### Statuts des tâches

Les trois statuts disponibles sont :

- `a_faire`
- `en_cours`
- `terminee`

### Priorités

Les priorités disponibles sont :

- `basse`
- `moyenne`
- `haute`

### Recherche, filtres et tri

Dans le détail d'un projet, les tâches peuvent être recherchées, filtrées et triées.

La recherche s'effectue notamment sur :

- le titre ;
- la description.

Les filtres disponibles sont :

- le statut ;
- la priorité.

Les tris disponibles sont :

- échéance la plus proche ;
- échéance la plus lointaine ;
- priorité haute en premier ;
- titre de A à Z.

La recherche, les filtres et le tri peuvent être combinés.

### Tableau de bord

Le tableau de bord fournit une vue générale de l'activité de l'utilisateur.

Il affiche notamment :

- le nombre total de projets ;
- le nombre total de tâches ;
- les tâches à faire ;
- les tâches en cours ;
- les tâches terminées ;
- la progression générale ;
- la progression de chaque projet ;
- les prochaines échéances ;
- les tâches en retard ;
- les tâches récemment créées.

### Interface responsive

L'interface est adaptée à différentes tailles d'écran :

- ordinateur ;
- tablette ;
- smartphone.

Au-dessus de `768px`, TaskFlow utilise une barre latérale.

À `768px` et moins, la navigation passe au-dessus du contenu afin d'améliorer l'utilisation sur les petits écrans.

---

## Technologies utilisées

- React
- React Router
- JavaScript
- JSX
- CSS
- Vite
- JSON Server
- Fetch API
- LocalStorage
- Git
- GitHub
- Oxlint

---

## Concepts React utilisés

Le projet met en pratique plusieurs concepts fondamentaux de React :

- composants ;
- props ;
- `useState` ;
- `useEffect` ;
- `useContext` ;
- hook personnalisé `useAuth` ;
- formulaires contrôlés ;
- rendu conditionnel ;
- affichage de listes avec `map()` ;
- clés React ;
- React Router ;
- `BrowserRouter` ;
- `Routes` et `Route` ;
- `NavLink` ;
- `Navigate` ;
- `Outlet` ;
- `useNavigate` ;
- `useParams` ;
- routes privées ;
- appels API asynchrones avec `fetch` ;
- `async / await` ;
- gestion des erreurs avec `try / catch`.

---

## Structure principale du projet

```text
taskflow-react/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── BarreLaterale.jsx
│   │   ├── FormulaireModificationProjet.jsx
│   │   ├── FormulaireModificationTache.jsx
│   │   ├── FormulaireProjet.jsx
│   │   ├── FormulaireTache.jsx
│   │   ├── MiseEnPage.jsx
│   │   └── RoutePrivee.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.js
│   │   └── AuthProvider.jsx
│   │
│   ├── hooks/
│   │   └── useAuth.js
│   │
│   ├── pages/
│   │   ├── Connexion.jsx
│   │   ├── Dashboard.jsx
│   │   ├── DetailProjet.jsx
│   │   ├── Inscription.jsx
│   │   ├── NonTrouve.jsx
│   │   └── Projets.jsx
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── db.json
├── package.json
├── package-lock.json
└── README.md
```

---

## Modèle des données

JSON Server utilise le fichier :

```text
db.json
```

La base contient trois collections principales.

### Utilisateurs

Exemple :

```json
{
  "id": 1,
  "nom": "Utilisateur Test",
  "email": "test@taskflow.local",
  "motDePasse": "1234"
}
```

### Projets

Exemple :

```json
{
  "id": 1,
  "utilisateurId": 1,
  "nom": "Application TaskFlow",
  "description": "Application de gestion de projets et de tâches",
  "couleur": "#4F46E5",
  "creeLe": "2026-09-06"
}
```

### Tâches

Exemple :

```json
{
  "id": 1,
  "projetId": 1,
  "titre": "Créer la structure du projet",
  "description": "Préparer l'organisation générale de l'application",
  "statut": "en_cours",
  "priorite": "haute",
  "echeance": "2026-09-07",
  "creeLe": "2026-09-06",
  "modifieLe": "2026-09-06"
}
```

---

## Relations entre les données

Un utilisateur peut posséder plusieurs projets :

```text
Utilisateur
    │
    └── Projets
```

Un projet peut contenir plusieurs tâches :

```text
Projet
   │
   └── Tâches
```

Les relations sont réalisées avec :

```text
utilisateurId
```

et :

```text
projetId
```

---

## Prérequis

Avant de lancer le projet, il faut avoir installé :

- Node.js
- npm
- Git

Pour vérifier les versions :

```powershell
node --version
npm --version
git --version
```

---

## Installation

Cloner le dépôt :

```powershell
git clone https://github.com/ir-kel/taskflow-react.git
```

Entrer dans le projet :

```powershell
cd taskflow-react
```

Installer les dépendances :

```powershell
npm install
```

---

## Lancer l'application

TaskFlow nécessite deux terminaux.

### Terminal 1 — API JSON Server

```powershell
npm run api
```

L'API est alors disponible sur :

```text
http://localhost:3000
```

### Terminal 2 — React avec Vite

```powershell
npm run dev
```

Vite affiche ensuite l'adresse locale de l'application, généralement :

```text
http://localhost:5173
```

---

## Compte de démonstration

Un utilisateur de test est disponible dans `db.json`.

```text
E-mail :
test@taskflow.local

Mot de passe :
1234
```

Ce compte est prévu uniquement pour la démonstration du TP.

---

## Routes principales

### Routes publiques

```text
/connexion
/inscription
```

### Routes privées

```text
/dashboard
/projets
/projets/:id
```

Les routes privées nécessitent qu'un utilisateur soit connecté.

### Route inconnue

Toute route inexistante affiche une page :

```text
404 - Page introuvable
```

---

## Scripts npm

### Démarrer Vite

```powershell
npm run dev
```

### Démarrer JSON Server

```powershell
npm run api
```

### Vérifier le code

```powershell
npm run lint
```

### Générer le build

```powershell
npm run build
```

### Prévisualiser le build

```powershell
npm run preview
```

---

## API utilisée

L'application communique avec JSON Server via :

```text
http://localhost:3000
```

Principales ressources :

```text
/utilisateurs
/projets
/taches
```

Exemples :

```text
GET /projets?utilisateurId=1

GET /taches?projetId=1

POST /projets

PATCH /projets/1

DELETE /projets/1
```

---

## Gestion des états de l'interface

L'application prend en charge plusieurs états d'interface.

### Chargement

Un état visuel est affiché pendant certaines requêtes API.

### Erreur

Un message est affiché lorsqu'une opération importante ne peut pas être effectuée.

### État vide

Un message spécifique est affiché lorsqu'il n'existe aucun projet ou aucune tâche correspondant aux données recherchées.

---

## Responsive design

TaskFlow est conçu avec une approche responsive.

### Ordinateur

La navigation utilise une sidebar sticky placée à gauche.

```text
┌───────────────┬────────────────────────────┐
│ Navigation    │ Contenu                    │
│               │                            │
│               │                            │
└───────────────┴────────────────────────────┘
```

### Smartphone et tablette étroite

À `768px` ou moins, la navigation passe au-dessus du contenu.

```text
┌────────────────────────────────────────────┐
│ Navigation                                 │
├────────────────────────────────────────────┤
│ Contenu                                    │
│                                            │
└────────────────────────────────────────────┘
```

---

## Vérification du projet

Avant une démonstration ou un push final, il est recommandé d'exécuter :

```powershell
npm run lint
npm run build
git status
```

Le projet doit pouvoir être construit sans erreur et le dépôt Git doit être propre.

---

## Limites pédagogiques du projet

TaskFlow est un **TP pédagogique** destiné à mettre en pratique React et non une application destinée à être utilisée en production.

JSON Server joue le rôle d'une API REST locale simulée.

L'authentification est également simulée côté frontend.

Par conséquent :

- les mots de passe sont stockés en clair dans `db.json` ;
- `localStorage` est utilisé pour conserver la session ;
- JSON Server ne fournit pas de véritable système d'autorisation ;
- il n'existe pas de backend sécurisé ;
- il n'existe pas de chiffrement des mots de passe ;
- les contrôles d'accès sont essentiellement réalisés dans React.

Ces choix sont adaptés au cadre du TP, mais devraient être remplacés par une véritable API et un système d'authentification sécurisé dans une application de production.

---

## Améliorations possibles

Dans une évolution future du projet, plusieurs fonctionnalités pourraient être ajoutées :

- véritable API backend ;
- authentification avec token ;
- chiffrement des mots de passe ;
- gestion plus avancée des utilisateurs ;
- tests unitaires et tests d'intégration ;
- centralisation des appels API ;
- variables d'environnement ;
- pagination ;
- système de notifications ;
- gestion avancée des erreurs ;
- suppression en cascade des tâches lors de la suppression d'un projet ;
- davantage de statistiques ;
- amélioration de l'accessibilité.

Ces améliorations ne font pas partie du périmètre principal de ce TP.

---

## Objectif pédagogique

L'objectif de TaskFlow est de démontrer la maîtrise des bases essentielles du développement d'une application React moderne :

```text
React
   │
   ├── Components
   ├── Props
   ├── State
   ├── Hooks
   ├── Context
   ├── Router
   ├── Forms
   ├── Fetch API
   ├── CRUD
   ├── Responsive CSS
   └── Git / GitHub
```

---

## Statut du projet

Le projet comprend actuellement :

```text
✓ Authentification simulée
✓ Routes privées
✓ Gestion des projets
✓ Gestion des tâches
✓ Recherche
✓ Filtres
✓ Tri des tâches
✓ Changement de statut
✓ Dashboard
✓ Statistiques
✓ Progression
✓ Gestion des échéances
✓ Gestion des retards
✓ États de chargement
✓ États d'erreur
✓ États vides
✓ Page 404
✓ Interface responsive
✓ JSON Server
✓ Lint
✓ Build Vite
✓ Gestion Git / GitHub
```

---

## Contexte

Projet réalisé dans le cadre d'un **TP React / TaskFlow** afin de mettre en pratique les notions fondamentales de React, la consommation d'une API REST simulée et la gestion d'un projet avec Git et GitHub.