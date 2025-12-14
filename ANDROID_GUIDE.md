# How to Publish Camera Tycoon to Play Store
This project is built as a **Progressive Web App (PWA)**. The easiest way to publish it to the Google Play Store is by wrapping it as a **Trusted Web Activity (TWA)**.

## Prerequisites
1.  **Host your app:** You must deploy this code to a public HTTPS URL (e.g., Vercel, Netlify, GitHub Pages).
2.  **Asset Links:** You need to verify ownership of the domain.

## Steps (Using PWABuilder)
The simplest method for beginners:

1.  **Deploy the App:**
    *   Push this code to GitHub.
    *   Connect it to Vercel or Netlify.
    *   Get your live URL (e.g., `https://my-camera-tycoon.vercel.app`).

2.  **Generate Android Bundle:**
    *   Go to [PWABuilder.com](https://www.pwabuilder.com/).
    *   Enter your live URL.
    *   Click "Start".
    *   Wait for the audit to finish (ensure you have a `manifest.json` and `service worker` - Vite PWA plugin usually handles SW, or you can add a basic one).
    *   Click "Package for Stores".
    *   Select "Android".
    *   Download the zip file. It contains your **Signing Key** (extremely important, keep safe!) and your `.aab` (Android App Bundle).

3.  **Google Play Console:**
    *   Create a Developer Account ($25 fee).
    *   Create a new app.
    *   Upload the `.aab` file from PWABuilder.
    *   Fill out the store listing (screenshots, description).
    *   **Digital Asset Links:** Google will give you a snippet of JSON (SHA-256 fingerprint). You must add this to a file named `assetlinks.json` in your `.well-known` folder on your website (e.g., `public/.well-known/assetlinks.json`).

## Steps (Using Bubblewrap CLI)
For more control:

1.  Install Node.js and JDK 8+.
2.  Install Bubblewrap: `npm install -g @bubblewrap/cli`.
3.  Run: `bubblewrap init --manifest https://your-site.com/manifest.json`.
4.  Follow the prompts to generate your key and build the project.
5.  Run: `bubblewrap build`.
