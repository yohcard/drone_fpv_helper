# 🚁 Drone FPV Builder Helper

Une plateforme full-stack premium pour la gestion des réparations et montages de drones FPV en Suisse.

## 🚀 Fonctionnalités

- **Dashboard Client** : Suivi des interventions, messagerie en temps réel, gestion du profil.
- **Dashboard Admin** : Centre de contrôle global, gestion des stocks (logistique), suivi du temps de travail et facturation.
- **Animations Premium** : Transitions fluides avec `framer-motion`.
- **Notifications** : Système de toasts avec `sonner`.
- **Backend Robuste** : Fastify + TypeORM + JWT.

## 📦 Installation & Développement

### Frontend
```bash
cd /Users/yohancardis/Documents/GitHub/drone_fpv_helper
npm install
npm run dev
```

### Backend
```bash
cd server
npm install
npm run dev
```

## 🌍 Déploiement (Vercel + Gandi)

Ce projet est optimisé pour être déployé sur **Vercel**.

1. **Frontend (Vercel)** :
   - Connectez votre repository GitHub à Vercel.
   - Configurez les variables d'environnement (`VITE_API_URL`).
   - Le build command est `npm run build`.

2. **Domaine (Gandi)** :
   - Sur Vercel, ajoutez votre domaine personnalisé.
   - Dans votre interface Gandi (DNS), créez un enregistrement `CNAME` pointant vers `cname.vercel-dns.com` ou un enregistrement `A` pointant vers l'IP de Vercel (76.76.21.21).

3. **Backend** : 
   - Vous pouvez déployer le dossier `/server` sur un service Node.js (Railway, Render, ou Vercel Serverless).
   - Assurez-vous de configurer `DATABASE_URL` (Postgres) pour la production.

---
*Développé pour drone-builder.ch*
