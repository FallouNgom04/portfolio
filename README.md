# Portfolio (GitHub Pages)

Ce repo contient ton site dans le dossier `Style/`.

## Déploiement sur GitHub Pages

Ce projet inclut déjà un workflow GitHub Actions (`.github/workflows/pages.yml`) qui publie le contenu de `Style/` sur GitHub Pages.

### Étapes

1. Crée un dépôt GitHub (ex: `Portfolio`).
2. Pousse ce dossier sur la branche `main`.
3. Sur GitHub : **Settings → Pages → Build and deployment → Source = GitHub Actions**.
4. Fais un push (ou lance le workflow manuellement). Ton site sera disponible sur l’URL affichée dans l’onglet **Actions**.

## Note (formulaire de contact)

Le template utilise `forms/contact.php`, mais GitHub Pages est **statique** (pas de PHP).

Option simple (recommandée) : utiliser un service de formulaire (Formspree / Getform / Basin / etc.).

- Crée un formulaire sur le service
- Copie l’URL endpoint fournie (ex: `https://formspree.io/f/xxxxxx`)
- Remplace l’attribut `action` dans `Style/index.html`
- Push sur GitHub, puis teste le formulaire sur l’URL GitHub Pages
