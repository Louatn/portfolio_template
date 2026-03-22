# Configuration Cloudinary pour l'Upload d'Images

## Étapes de configuration

### 1. Créer un compte Cloudinary
Si ce n'est pas déjà fait, créez un compte sur [cloudinary.com](https://cloudinary.com)

### 2. Obtenir vos credentials
1. Connectez-vous à votre dashboard Cloudinary
2. Notez votre **Cloud Name** (visible en haut du dashboard)
3. Allez dans Settings → Upload
4. Créez un **Upload Preset** non-signé :
   - Cliquez sur "Add upload preset"
   - Mode: **Unsigned**
   - Preset name: choisissez un nom (ex: "portfolio-uploads")
   - Folder: "portfolio" (optionnel, pour organiser vos images)
   - Transformations: vous pouvez ajouter des optimisations automatiques

### 3. Configurer les variables d'environnement
Ajoutez ces lignes à votre fichier `.env` :

```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="votre-cloud-name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="portfolio-uploads"
```

**Important**: Remplacez les valeurs par vos vraies credentials Cloudinary.

### 4. Redémarrer le serveur
Après avoir modifié le `.env`, redémarrez votre serveur de développement :

```bash
npm run dev
```

## Sécurité

L'upload est configuré en mode **client-side** avec un upload preset non-signé. Pour sécuriser :

1. Dans votre dashboard Cloudinary, configurez l'upload preset avec :
   - **Allowed formats**: jpg, jpeg, png, webp, gif
   - **Max file size**: 5MB (ou votre limite préférée)
   - **Folder**: "portfolio" (pour organiser)
   
2. (Optionnel) Activez les restrictions par domaine :
   - Settings → Security → Allowed fetch domains
   - Ajoutez votre domaine de production

## Test

Pour tester que tout fonctionne :

1. Lancez le serveur : `npm run dev`
2. Connectez-vous en tant qu'admin
3. Allez sur le Dashboard
4. Cliquez sur "Nouveau projet"
5. Essayez d'uploader une image
6. Vérifiez que l'image s'affiche avec un indicateur de progression

## Dépannage

### Erreur "Cloudinary configuration missing"
- Vérifiez que les variables `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` et `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` sont bien définies dans `.env`
- Redémarrez le serveur après modification du `.env`

### Upload échoue avec erreur 401/403
- Vérifiez que l'upload preset est bien en mode **Unsigned**
- Vérifiez le nom de l'upload preset

### Upload trop lent
- Cloudinary compresse automatiquement les images
- Pour de meilleures performances, optimisez vos images avant upload (max 2-3MB)
