# Kamran Javed — Portfolio

A static website: `index.html`, `styles.css`, `script.js` and the `assets/` folder (images).
No server or installation is needed.

## Images
If the `assets/` folder is missing, download it once from the Figma design:
- Windows: `powershell -ExecutionPolicy Bypass -File download-assets.ps1`
- Mac/Linux: `bash download-assets.sh`

## Open it
Double-click `index.html`, or in VS Code right-click it → "Open with Live Server".

## Contact form (FormSubmit)
Messages are sent by https://formsubmit.co to the address in `script.js` (`CONTACT_EMAIL`).
- Testing: `sultanovafizza@gmail.com`. When live, change it to `kami206@gmail.com`.
- The first message to a new address sends an activation email from FormSubmit —
  click **Activate Form** in it once; after that, messages arrive normally.

## Put it on Vercel (kamran-javed.vercel.app)
1. Push this folder (including `assets/`) to a GitHub repository.
2. https://vercel.com → **Add New… → Project** → import the repository.
3. **Project Name:** `kamran-javed` → the site is at **https://kamran-javed.vercel.app**.
   Framework Preset: **Other**, leave build settings empty → **Deploy**.
If the name is taken, add another free one under **Settings → Domains** (e.g. `kamranjaved.vercel.app`).
