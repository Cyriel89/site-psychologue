# 🌿 Site Psychologue

Un site professionnel personnalisé développé sur mesure pour une psychologue du travail, avec un back-office sécurisé, une gestion complète des contenus et une architecture moderne.

---

## 🎯 Objectif du projet
Ce projet vise à créer une **plateforme web complète** permettant à une psychologue du travail de présenter son activité, son expertise et ses services, tout en gardant une **autonomie totale sur les contenus** grâce à une interface d’administration dédiée.

L’application se distingue d’un simple site vitrine grâce à son **approche sur mesure** : intégration future d’un blog, gestion des pages légales, modules de rendez-vous et d’interaction, et respect strict des normes de performance, accessibilité et RGPD.

---

## 🛠️ Stack Technique
| Domaine | Technologies |
|---------|-------------|
| **Framework** | Next.js 14 (App Router) + TypeScript |
| **Base de données** | PostgreSQL via Prisma ORM |
| **UI / Front** | React, Framer Motion, Markdown sécurisée |
| **Auth & Sécurité** | Sessions custom (cookies HMAC), rôles ADMIN/SUPPORT, bcrypt |
| **Back-office** | Interface admin personnalisée (CRUD, upload média) |
| **Emails** | Nodemailer (Ethereal en dev, SMTP en prod) |
| **SEO / RGPD** | Sitemap, robots.txt, pages légales, future gestion SEO |

---

## 🧱 Architecture du projet
- **Front public** : sections Hero, About, Services, Partenaires, Lieu, Contact, FAQ, Pages légales.
- **Back-office** : tableau de bord sécurisé, gestion des contenus (texte, images, services…), blog (à venir), pages dynamiques.
- **Données** : structure Prisma modulaire (Service, Location, Media, Setting, Page, PageRevision...).
- **Sécurité** : Accès restreint, cookies signés, validation serveur.

---

## 🚀 Principales fonctionnalités
✅ Gestion des contenus (Hero, About, Services, Partenaires...)
✅ Upload et gestion d’images
✅ Authentification avec rôles
✅ Pages légales dynamiques (Mentions, Politique)
🔒 Contact sécurisé + anti-spam
🛠️ Blog (articles, commentaires, likes) — *à venir*
👤 Comptes clients + agenda interne — *à venir*
🗺️ SEO technique et accessibilité — *à venir*

---

## 📅 Roadmap (extrait)
- [x] Structure du site + base de données
- [x] Authentification & rôles
- [x] Interface admin (CRUD contenus principaux)
- [ ] Pages dynamiques (Mentions, Politique) — *en cours*
- [ ] Blog & interactions
- [ ] Comptes clients + calendrier
- [ ] SEO, Accessibilité, Performance
- [ ] Mise en production (domaine, HTTPS, serveur)

---

## 🧩 Installation & Lancement (Dev)
```bash
git clone https://github.com/Cyriel89/site-psychologue.git
cd site-psychologue
npm install

npm run dev
# Accès : http://localhost:3000
```

Créer un fichier `.env` :
```
DATABASE_URL=postgresql://user:pass@localhost:5432/psy_site
SESSION_SECRET=ton_secret
```

Appliquer Prisma :
```bash
npx prisma migrate dev
npx prisma db seed   # si seed défini
```

---

## 🛡️ Compétences clés démontrées

| Domaine | Compétences mises en œuvre |
|---------|----------------------------|
| **Architecture** | Conception fullstack, séparation front/back, App Router Next.js |
| **Back-end** | API REST, Prisma ORM, gestion BDD PostgreSQL, validations serveur |
| **Front-end** | React/Next.js, rendu SSR/CSR, Markdown sécurisé, UI admin custom |
| **Sécurité** | Sessions custom (HMAC), rôles ADMIN/SUPPORT, anti-spam, RGPD |
| **Performance** | Optimisation SSR, cache, revalidation, structure scalable |
| **Produit / UX** | Back-office autonome, gestion contenus, roadmap fonctionnelle |

---

## 🏷️ Badges

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-ORM-green?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-DB-blue?logo=postgresql)
![Security](https://img.shields.io/badge/Security-Custom%20Auth-orange)
![Status](https://img.shields.io/badge/Status-In%20Progress-yellow)

---

## 👤 Auteur
**Anthony Carrer** – Développeur Fullstack / Backend
> Projet personnel visant à démontrer des compétences en architecture web, sécurisation, CMS sur mesure et expérience utilisateur.

---

▶️ *Ce README évoluera avec les prochaines fonctionnalités (blog, agenda, SEO, production…)*

