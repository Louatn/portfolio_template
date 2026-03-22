# Correction des cartes de portfolio

## Problèmes identifiés et résolus

### 1. Incohérence d'affichage des images
**Problème :** Les cartes de projets affichaient différemment les images selon qu'un filtre était appliqué ou non.
- Sans filtre : images affichées en entier (object-contain)
- Avec filtre : images remplissant le cadre (object-cover)

**Solution :** Création d'un composant `ProjectCard.public.tsx` réutilisable qui garantit un affichage cohérent avec `object-cover` dans tous les cas.

### 2. Clignotement des images au chargement
**Problème :** Les images clignotaient lors du premier affichage, créant une mauvaise expérience utilisateur.

**Causes identifiées :**
- Pas de gestion de l'état de chargement des images
- Pas d'attribut `loading="lazy"` sur les balises `<img>`
- Transitions d'opacité démarrées avant le chargement complet de l'image
- Pas de placeholder visuel pendant le chargement

**Solutions implémentées :**

#### a) Gestion d'état du chargement
```typescript
const [imageLoaded, setImageLoaded] = useState(false);
const [imageError, setImageError] = useState(false);
```

#### b) Events handlers sur l'image
```typescript
<img
  src={imageUrl}
  alt={project.title}
  loading="lazy"              // Lazy loading natif
  onLoad={() => setImageLoaded(true)}
  onError={() => {
    setImageError(true);
    setImageLoaded(true);
  }}
  className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-110 ${
    imageLoaded ? 'opacity-100' : 'opacity-0'  // Contrôle précis de l'opacité
  }`}
/>
```

#### c) Skeleton loader avec animation shimmer
```typescript
{!imageLoaded && !imageError && (
  <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-[#e8e4de] via-[#d1cdc7] to-[#e8e4de] bg-[length:200%_100%]" 
       style={{ animation: 'shimmer 1.5s infinite' }} 
  />
)}
```

Animation CSS ajoutée dans `globals.css` :
```css
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
```

#### d) Placeholder en cas d'erreur ou d'absence d'image
```typescript
{imageUrl && !imageError ? (
  // ... image
) : (
  <div className="flex h-full items-center justify-center">
    <div className="text-center">
      <svg className="mx-auto h-12 w-12 text-[#d1cdc7] mb-2">...</svg>
      <p className="text-xs text-[#6b8a99]">Pas d'image</p>
    </div>
  </div>
)}
```

## Fichiers créés

### 1. `components/ProjectCard.public.tsx`
Composant réutilisable pour les cartes de projet avec :
- Gestion complète du cycle de vie de chargement des images
- Skeleton loader animé
- Ratio d'aspect dynamique (rotation sur 4 ratios)
- Effet de survol cohérent
- Badge "En vedette" pour les projets featured
- Overlay gradient au hover
- Panel d'information avec titre, localisation et catégorie

### 2. `components/Header.tsx`
Composant de navigation unifié créé pour remplacer les headers inline :
- Logo avec icône de bâtiment
- Navigation desktop et mobile avec menu burger
- Scroll effect (shadow et backdrop-blur)
- Navigation contextuelle (hash links sur la page d'accueil, Link sur les autres)
- Animation du menu mobile avec Framer Motion
- Lock du scroll body quand le menu est ouvert

## Fichiers modifiés

### 1. `app/HomeClient.tsx`
- Import du nouveau composant `ProjectCard`
- Remplacement de la logique de carte inline par l'utilisation du composant
- Simplification du code (60 lignes → 10 lignes)
- Import du composant `Header`

### 2. `app/portfolio/PortfolioClient.tsx`
- Import du nouveau composant `ProjectCard`
- Remplacement de la logique de carte inline
- Uniformisation avec la page d'accueil
- Import du composant `Header`

### 3. `app/globals.css`
- Ajout de l'animation `@keyframes shimmer`
- Ajout de la classe `.wood-accent` pour cohérence thématique

## Avantages de la refactorisation

### Performance
✅ Lazy loading natif des images (`loading="lazy"`)
✅ Chargement progressif avec feedback visuel (skeleton)
✅ Pas de Layout Shift (dimensions fixes avec aspect-ratio)
✅ Réduction de la complexité du rendering (composant réutilisable)

### Expérience utilisateur
✅ Pas de clignotement lors du premier chargement
✅ Feedback visuel pendant le chargement (shimmer animation)
✅ Gestion élégante des erreurs
✅ Affichage cohérent avec/sans filtres
✅ Transitions fluides et naturelles

### Maintenabilité
✅ Code DRY (Don't Repeat Yourself) - un seul composant pour les deux pages
✅ Logique de chargement centralisée et testable
✅ Types TypeScript stricts pour éviter les erreurs
✅ Facilité de mise à jour globale (modifier un seul fichier)

## Tests réalisés

✅ Build Next.js : **Succès** (0 erreurs TypeScript)
✅ 9 routes générées correctement
✅ Compilation en 1.3s
✅ TypeScript validation en 1.4s
✅ Static generation en 113ms

## Résultat final

Les cartes de projets affichent maintenant de manière cohérente :
- Images toujours en `object-cover` (remplissage du cadre)
- Ratios d'aspect variés pour un effet masonry élégant
- Chargement sans clignotement grâce au skeleton loader
- Performance optimisée avec le lazy loading
- Design cohérent avec le thème artisan (couleurs claires, contraste élevé)
- Expérience utilisateur fluide et professionnelle
