# Guide de Test - Système de Gestion de Projets

## Prérequis
- [ ] Cloudinary configuré (voir CLOUDINARY_SETUP.md)
- [ ] Base de données PostgreSQL accessible
- [ ] Compte admin créé
- [ ] Serveur de développement lancé (`npm run dev`)

## 1. Test du Flux d'Upload d'Images

### Upload d'image de couverture
1. Connectez-vous en tant qu'admin
2. Allez sur `/dashboard`
3. Cliquez sur "Nouveau projet"
4. Cliquez sur la zone d'upload de l'image de couverture
5. Sélectionnez une image (JPG, PNG ou WEBP)
6. **Vérifier** :
   - [ ] Un spinner s'affiche pendant l'upload
   - [ ] Le pourcentage de progression s'affiche
   - [ ] L'image apparaît en aperçu après upload
   - [ ] L'image est grisée pendant l'upload
   - [ ] Aucune erreur dans la console

### Upload d'images dans la galerie
1. Dans le même modal de nouveau projet
2. Cliquez sur "Ajouter" dans la section Galerie
3. Dans le popup, sélectionnez une image
4. Ajoutez un titre et une description
5. Cliquez sur "Ajouter"
6. **Vérifier** :
   - [ ] L'image apparaît dans la galerie avec un spinner
   - [ ] Le pourcentage de progression s'affiche
   - [ ] L'image devient nette une fois uploadée
   - [ ] En cas d'erreur, une icône d'erreur s'affiche
   - [ ] On peut supprimer l'image avec le bouton X

### Test d'erreurs réseau
1. Ouvrir DevTools → Network
2. Activer "Offline" ou "Slow 3G"
3. Essayer d'uploader une image
4. **Vérifier** :
   - [ ] Un message d'erreur s'affiche
   - [ ] L'interface reste utilisable
   - [ ] On peut réessayer après reconnexion

## 2. Test du Flux de Sauvegarde

### Sauvegarde en brouillon (DRAFT)
1. Créer un nouveau projet
2. Remplir le titre : "Test Brouillon"
3. Remplir description, localisation, catégorie
4. Uploader une image de couverture
5. Cliquer sur "Sauvegarder et visualiser"
6. **Vérifier** :
   - [ ] Un indicateur "Sauvegarde..." s'affiche
   - [ ] Le modal se ferme après sauvegarde
   - [ ] Le projet apparaît dans le dashboard avec badge "Brouillon"
   - [ ] Le brouillon localStorage est supprimé
   - [ ] On reste sur /dashboard (pas de redirection)

### Sauvegarde et publication (PUBLISHED)
1. Créer un nouveau projet
2. Remplir tous les champs
3. Uploader une cover et 2-3 images galerie
4. Attendre que toutes les images soient uploadées
5. Cliquer sur "Sauvegarder et publier"
6. **Vérifier** :
   - [ ] Un indicateur "Publication..." s'affiche
   - [ ] Redirection vers la page d'accueil (/)
   - [ ] Le projet est visible sur la page d'accueil
   - [ ] Le projet a un badge "Publié" dans le dashboard

### Modification d'un projet existant
1. Dans le dashboard, éditer un projet (fonctionnalité à implémenter)
2. Modifier le titre et la description
3. Sauvegarder
4. **Vérifier** :
   - [ ] Les modifications sont enregistrées
   - [ ] Le cache local est mis à jour
   - [ ] La date de mise à jour change

### Validation des données
1. Essayer de sauvegarder sans titre
2. **Vérifier** :
   - [ ] Message d'erreur "Le titre est requis"
   - [ ] Le projet n'est pas sauvegardé

3. Essayer de sauvegarder pendant qu'une image est en upload
4. **Vérifier** :
   - [ ] Message "Veuillez attendre que toutes les images soient téléchargées"
   - [ ] Le projet n'est pas sauvegardé

## 3. Test du Système de Cache

### Cache initial
1. Ouvrir le dashboard (première fois)
2. Ouvrir DevTools → Network
3. **Vérifier** :
   - [ ] Une requête fetch vers `/api/projects`
   - [ ] Les projets s'affichent
   - [ ] localStorage contient 'portfolio_projects_cache'
   - [ ] localStorage contient 'portfolio_cache_timestamp'

### Cache frais (< 5 minutes)
1. Rafraîchir la page (F5)
2. **Vérifier** :
   - [ ] Aucune requête vers `/api/projects`
   - [ ] Les projets s'affichent immédiatement
   - [ ] Message console "Loading from cache"

### Cache expiré (> 5 minutes)
1. Ouvrir DevTools → Application → localStorage
2. Modifier 'portfolio_cache_timestamp' avec un timestamp ancien
3. Rafraîchir la page
4. **Vérifier** :
   - [ ] Nouvelle requête vers `/api/projects`
   - [ ] Les projets sont rechargés
   - [ ] Le cache est mis à jour

### Mise à jour du cache après sauvegarde
1. Créer un nouveau projet
2. Le sauvegarder
3. Fermer le modal
4. **Vérifier** :
   - [ ] Le nouveau projet apparaît dans la liste
   - [ ] Pas de rechargement complet de la page
   - [ ] Le cache localStorage contient le nouveau projet

### Force refresh
1. Cliquer sur le bouton "🔄 Actualiser"
2. **Vérifier** :
   - [ ] Requête vers `/api/projects` même si cache frais
   - [ ] Les projets sont rechargés
   - [ ] Le cache est mis à jour

### Comportement hors ligne (fallback)
1. Charger le dashboard normalement (cache créé)
2. Activer le mode offline dans DevTools
3. Rafraîchir la page
4. **Vérifier** :
   - [ ] Les projets du cache s'affichent
   - [ ] Message d'avertissement sur données possiblement obsolètes
   - [ ] L'interface reste utilisable

## 4. Test de Gestion d'Erreurs

### localStorage plein
1. Ouvrir DevTools → Console
2. Exécuter:
```javascript
// Remplir localStorage
for(let i=0; i<10000; i++) {
  try {
    localStorage.setItem('test_' + i, 'x'.repeat(1000));
  } catch(e) {
    console.log('localStorage full');
    break;
  }
}
```
3. Essayer de sauvegarder un projet
4. **Vérifier** :
   - [ ] Le système tente de libérer de l'espace (clear cache)
   - [ ] Message d'erreur si échec
   - [ ] L'application reste fonctionnelle

### Données corrompues dans localStorage
1. Ouvrir DevTools → Application → localStorage
2. Modifier manuellement 'portfolio_projects_cache' avec du texte invalide
3. Rafraîchir le dashboard
4. **Vérifier** :
   - [ ] Pas de crash
   - [ ] Le cache corrompu est supprimé
   - [ ] Nouvelle requête vers le serveur
   - [ ] Les projets s'affichent normalement

### Erreur serveur (500)
1. Arrêter le serveur
2. Essayer de sauvegarder un projet
3. **Vérifier** :
   - [ ] Message d'erreur clair
   - [ ] Le brouillon reste en mémoire
   - [ ] On peut réessayer après redémarrage du serveur

### Upload Cloudinary échoué
1. Modifier temporairement CLOUDINARY_UPLOAD_PRESET avec une valeur invalide
2. Essayer d'uploader une image
3. **Vérifier** :
   - [ ] L'image affiche une icône d'erreur
   - [ ] Message d'erreur dans la console
   - [ ] On peut supprimer l'image en erreur
   - [ ] Les autres images continuent de fonctionner

## 5. Test des Filtres et Navigation

### Filtres de statut
1. Créer des projets avec différents statuts (DRAFT, PUBLISHED, ARCHIVED)
2. Tester chaque filtre :
   - [ ] "Tous" affiche tous les projets
   - [ ] "Brouillons" affiche uniquement les DRAFT
   - [ ] "Publiés" affiche uniquement les PUBLISHED
   - [ ] "Archivés" affiche uniquement les ARCHIVED
3. Vérifier les compteurs :
   - [ ] Chaque filtre affiche le bon nombre de projets
   - [ ] Les totaux correspondent

### Actions sur les projets
1. Archiver un projet publié
2. **Vérifier** :
   - [ ] Le badge passe à "Archivé"
   - [ ] Le projet apparaît dans le filtre "Archivés"
   - [ ] Le compteur "Archivés" augmente

3. Désarchiver un projet archivé
4. **Vérifier** :
   - [ ] Le badge passe à "Brouillon"
   - [ ] Le projet apparaît dans le filtre "Brouillons"

5. Supprimer un projet
6. **Vérifier** :
   - [ ] Confirmation demandée
   - [ ] Le projet disparaît de la liste
   - [ ] Le projet est supprimé du cache
   - [ ] Le compteur diminue

### Navigation Dashboard ↔ Home
1. Depuis le dashboard, cliquer sur le logo ou retourner à "/"
2. **Vérifier** :
   - [ ] La page d'accueil s'affiche
   - [ ] Les projets publiés sont visibles
   - [ ] Le bouton "Gérer les projets" est visible (si admin)

3. Cliquer sur "Gérer les projets"
4. **Vérifier** :
   - [ ] Retour au dashboard
   - [ ] Les filtres conservent leur état
   - [ ] La liste des projets est à jour

### Persistance de l'état des filtres
1. Sélectionner le filtre "Brouillons"
2. Créer un nouveau projet (brouillon)
3. Fermer le modal
4. **Vérifier** :
   - [ ] Le filtre "Brouillons" reste sélectionné
   - [ ] Le nouveau projet est visible
   - [ ] Le compteur est mis à jour

## 6. Test de l'Auto-Save (localStorage)

### Détection de modification
1. Ouvrir le modal de nouveau projet
2. Taper un titre
3. Ouvrir DevTools → Application → localStorage
4. **Vérifier** :
   - [ ] 'portfolio_project_draft' apparaît dans localStorage
   - [ ] Il contient le titre saisi
   - [ ] Le champ isModified est à true

### Restauration après fermeture accidentelle
1. Commencer à créer un projet
2. Remplir plusieurs champs
3. Uploader une image
4. Fermer le modal (sans sauvegarder)
5. Réouvrir le modal
6. **Vérifier** :
   - [ ] Tous les champs sont restaurés
   - [ ] Les images uploadées sont présentes
   - [ ] On peut continuer l'édition

### Nettoyage après sauvegarde
1. Créer un projet avec brouillon
2. Le sauvegarder
3. Vérifier localStorage
4. **Vérifier** :
   - [ ] 'portfolio_project_draft' est supprimé
   - [ ] Aucune trace du brouillon

## Résumé des Tests

- [ ] Upload d'images fonctionne avec indicateurs visuels
- [ ] Sauvegarde DRAFT et PUBLISHED fonctionnent
- [ ] Cache localStorage optimise les performances
- [ ] Gestion d'erreurs robuste partout
- [ ] Filtres et navigation fluides
- [ ] Auto-save protège contre les pertes de données

## Bugs Trouvés

Documentez ici les bugs découverts pendant les tests :

1. 
2. 
3. 

## Notes

- Le système est conçu pour être résilient aux erreurs
- En cas de problème réseau, le cache permet de continuer à travailler
- Tous les uploads sont asynchrones pour ne pas bloquer l'interface
