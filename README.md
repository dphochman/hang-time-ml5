# Hang Time - Reach Higher (ml5.js integrated)

A single-page Next.js site that helps users **learn to jump higher** by analyzing a video of their jump.

## Quick Start

```bash
npm install
npm run dev
# open http://localhost:3000
```

## What’s new
- **ml5.js PoseNet** overlay in the middle column. Loads TF.js + ml5.js via CDN in `app/layout.tsx`.
- Overlays **keypoints** and **skeleton** on a canvas synced with your uploaded video (video is hidden; canvas is shown).

## How it works
1. Upload a video in the left column to preview.
2. The same file is passed to the ml5 viewer (middle column).
3. PoseNet runs in the browser and draws keypoints/skeleton over frames.

## Files
- `app/page.tsx` — page/layout: header (20vh), 3 columns (40%/20%/40%), accordion below.
- `components/UploadPlayer.tsx` — file upload + preview.
- `components/ML5Viewer.tsx` — ml5 PoseNet overlay.
- `app/api/analyze/route.ts` — mock server-side analysis that returns comments.
- `app/layout.tsx` — loads **@tensorflow/tfjs** and **ml5** via `<Script>` tags.

## Swap the header background video
Replace `public/placeholder.mp4` with your muted loop, or edit `src` in `app/page.tsx`.

## Deployment
Build with `npm run build`, run with `npm start`. Works on Vercel/Netlify/Render/etc.
