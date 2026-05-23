# 🛍️ E-Commerce Mobile App (React Native + Expo)

## 📌 Introduction

Ce projet est une application mobile e-commerce développée avec **React Native (Expo)**.
Elle permet aux utilisateurs de parcourir des produits, consulter les détails, gérer un panier (cart) et simuler un système d’authentification sécurisé.

L’objectif principal est de construire une application **moderne, scalable et proche d’un projet réel en entreprise**.

---

## 🚀 Fonctionnalités principales

### 🔐 Authentification
- Login utilisateur
- Gestion de session
- Blocage après plusieurs tentatives échouées
- Auto logout (session expiration)
- Protection des écrans sensibles contre les screenshots
- Gestion du timeout de session automatique
- Vérification de l’état d’authentification au lancement de l’app

### 🛍️ Produits
- Liste des produits
- Détails produit
- Recherche par catégorie
- Pagination

### 🛒 Panier (Cart)
- Ajouter un produit au panier
- Modifier quantité
- Supprimer un produit
- Calcul total automatique

### 🎨 UI/UX
- Mode dark/light
- Interface responsive
- Navigation fluide avec Expo Router

---

## 🧱 Architecture du projet

Le projet est structuré comme suit :
src/
│
├── api/ # appels API (products, cart, auth)
├── store/ # Zustand state management
├── hooks/ # custom hooks (React Query)
├── types/ # types TypeScript
├── theme/ # colors, fonts
├── i18n/ # internationalisation
└── utils/ # helpers


---

## ⚙️ Technologies utilisées

- React Native (Expo)
- TypeScript
- Expo Router
- Zustand (state management)
- React Query (data fetching)
- Axios
- Jest + axios-mock-adapter (unit tests)

---

## 🧪 Tests unitaires

Le projet inclut des tests unitaires pour assurer la fiabilité des APIs.

### ✔ Cart API tests :
- getCarts
- getCartById
- getCartsByUser
- addCart
- updateCart
- deleteCart

### ✔ Produits API tests :
- getProducts
- getProductById
- getCategories

Tests réalisés avec :
- Jest
- Axios Mock Adapter

---

## 🔐 Sécurité (Auth System)

- Gestion des tentatives de login
- Blocage temporaire après 3 essais échoués
- Session expiration automatique
- Protection des routes avec Expo Router

---

## 📱 Navigation

Le routing est géré avec :

- `(auth)` → Login / Register
- `(app)` → Home / Products / Cart

Protection des routes :
- Si non connecté → redirection login
- Si connecté → accès app

---

## 📦 Installation

```bash
npm install
npx expo start