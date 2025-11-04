# Fake Certificate Check — Hosting Guide

This project is a Vite + React app. Below are two simple hosting options: GitHub Pages (automatic via `gh-pages`) and Netlify (drag-and-drop).

## Quick checklist before hosting

- Node.js and npm installed
- Your code is in a git repository and pushed to GitHub (for GitHub Pages)

## Option A — GitHub Pages (simple, free)

1. Install the deploy helper (Windows `cmd.exe`):

```cmd
npm install --save-dev gh-pages
```

2. Build and deploy (these scripts are added to `package.json`):

```cmd
npm run predeploy
npm run deploy
```

Notes:
- We set `base: './'` in `vite.config.js` so the built `dist` folder uses relative paths and works on GitHub Pages or any static host.
- The `deploy` script uses `gh-pages` and will push the `dist` folder to the `gh-pages` branch.

## Option B — Netlify (drag-and-drop, no CLI required)

1. Build the site:

```cmd
npm run build
```

2. Open https://app.netlify.com/sites/new and drag the generated `dist` folder into the UI.

Netlify will host the site and give you a public URL.

## If you prefer a manual GitHub Pages approach

1. Build the site:

```cmd
npm run build
```

2. Push `dist/` to the `gh-pages` branch manually (advanced users).

## Troubleshooting

- If the site assets 404, confirm `base: './'` is present in `vite.config.js`.
- If you used Node-only modules (like `crypto`) in frontend code, replace them with Web Crypto API implementations. This repo already uses Web Crypto for hashing and random token generation.

## Local preview

To preview the production build locally:

```cmd
npm run build
npm run start
```

--
If you'd like, I can:
- Add a GitHub Actions workflow to automatically deploy on push to `main`.
- Set up a Netlify _toml_ or automatic deploy steps.
Tell me which one you'd prefer and I'll add it.

## Automatic deploy (GitHub Actions)

This repository already includes a GitHub Actions workflow that will build and deploy the `dist/` folder to GitHub Pages whenever you push to the `main` branch.

Steps to use the automatic deploy:

1. Push your repository to GitHub (if it's not there already).

```cmd
git add .
git commit -m "Prepare site for deployment"
git push origin main
```

2. GitHub Actions will run the `build-and-deploy` workflow and publish to `gh-pages`.

3. In your repository settings -> Pages, confirm the site source is set to the `gh-pages` branch (or the Pages setting will show the published URL automatically).

If you prefer to deploy immediately from your machine instead of using Actions, run:

```cmd
npm install --save-dev gh-pages
npm run predeploy
npm run deploy
```

If you'd like, I can also:
- Add a status badge showing the deployment workflow in the README.
- Create a small script to open the published URL after deploy.