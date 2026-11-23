# For Tiya, with love — by Mayank 💗

A dreamy, interactive React + Vite birthday website inspired by the shared reference reel, personalized for **Tiya** from **Mayank**.

## The experience

1. An animated romantic welcome.
2. A heart-shaped tree that blooms as she taps.
3. A birthday cake: light the candles, make a wish, blow them out.
4. Pop five balloons to reveal five sweet messages.
5. Browse four real photos in an animated Polaroid gallery.
6. Open Mayank's envelope and read his birthday letter.
7. A sparkling birthday finale, with the option to replay.

All interactions run on the client (no server, account or database). The optional background track is `public/Bulleya-Sultan.mp3`, trimmed to 78 seconds, and starts only when someone turns on the sound.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Open the `Local` URL Vite prints (usually http://localhost:5173).

## Personalize it

- Edit `src/content.js` to change the letter, gallery captions, and balloon messages.
- Replace the four images under `src/assets/` (keep their filenames, or update imports in `src/App.jsx`).
- All occurrences of Mayank and Tiya are controlled through `src/content.js`.
- All layouts are mobile-friendly. The design and animations live in `src/styles.css`.

## Publish on GitHub Pages (free)

1. Create a GitHub repository such as `tiya-birthday-surprise`.
2. Upload this project's files or use:

   ```sh
   git init
   git add .
   git commit -m "A birthday universe for Tiya"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/tiya-birthday-surprise.git
   git push -u origin main
   ```
3. In the repository go to **Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. The included `.github/workflows/deploy.yml` automatically builds and publishes the website when you push to `main`.
5. Once the action succeeds, your link should be `https://YOUR_USERNAME.github.io/tiya-birthday-surprise/`.

`vite.config.js` uses `base: './'` so it works for repository subpaths and GitHub Pages custom domains.

**Privacy note:** GitHub Pages sites are normally publicly accessible, even if only Mayank sends Tiya the link. Use photos only with appropriate permission, and avoid posting any photos you don't want public.

## Tech

React 19, Vite 7, custom SVG/CSS animations, optional Web Audio melody. No heavy animation library or backend needed.
