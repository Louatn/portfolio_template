# Portfolio Template

Template Next.js 16 (App Router) avec TypeScript, Tailwind CSS v4 et Prisma + PostgreSQL.

## Architecture actuelle

- `app/`: interface front-end (layout global + page d'accueil).
- `lib/prisma.ts`: singleton Prisma Client pour eviter les connexions multiples en developpement.
- `lib/admin-auth.ts`: services serveur pour l'authentification admin (verification credentials, creation/revocation de session, nettoyage des sessions expirees).
- `prisma/schema.prisma`: schema de base de donnees.
- `scripts/seed-admin.mjs`: script de creation/mise a jour d'un administrateur.

## Modele de donnees mis en place (admin only)

- `Admin`: compte administrateur unique par email.
- `AdminSession`: jetons de session lies a `Admin` avec date d'expiration.

Ce socle est volontairement minimal pour ajouter ensuite un schema `Image` sans remettre en cause la partie authentification.

## Variables d'environnement

Copiez le fichier `.env.example` vers `.env` et renseignez vos valeurs:

```bash
cp .env.example .env
```

Variables utilisees:

- `DATABASE_URL`: URL PostgreSQL.
- `ADMIN_EMAIL`: email de l'admin initial.
- `ADMIN_PASSWORD`: mot de passe de l'admin initial.

## Commandes utiles

```bash
npm run dev
npm run lint
npm run prisma:generate
npm run prisma:migrate:dev -- --name init_admin_auth
npm run prisma:studio
npm run prisma:seed:admin
```

## Initialisation DB

1. Verifier que l'instance PostgreSQL est joignable depuis la machine locale.
2. Generer le client Prisma:

```bash
npm run prisma:generate
```

3. Appliquer la migration:

```bash
npm run prisma:migrate:dev -- --name init_admin_auth
```

4. Creer le compte admin initial:

```bash
npm run prisma:seed:admin
```

## Prochaine etape (images)

Ajouter un modele `Image` dans `prisma/schema.prisma` avec ses metadonnees (url, alt, ordre, tags, date d'ajout), puis relier les operations CRUD a des routes serveur protegees par la session admin.
