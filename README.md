# Sales Funnel Hero

A production-ready, multi-step sales funnel application for generating leads for home services like Solar, HVAC, Roofing, and Smart Home installations. It includes contact information collection, solar potential analysis using the Google Solar API, user qualification, and appointment scheduling.

## Features

- **Multi-Step Form:** Guides users through a logical flow.
- **Service Selection:** Supports Solar, HVAC, Roofing, and Smart Home services.
- **Address Autocomplete:** Powered by Google Places API for accurate address entry.
- **Dynamic Solar Analysis:** For solar customers, it provides an instant analysis of their roof's solar potential, estimated savings, and system costs using the Google Solar API.
- **Interactive Map:** Visualizes the user's roof and potential solar panel layout.
- **Qualification Questions:** Gathers key information like credit score and interest level.
- **File Uploads:** Allows users to upload utility bills.
- **Appointment Scheduling:** A simple calendar interface to book a consultation.
- **Responsive Design:** Looks great on all devices.

## Tech Stack

- React & TypeScript
- Vite
- Tailwind CSS
- Google Maps Platform APIs (Maps, Places, Solar)

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### 1. Prerequisites

- **Node.js and npm:** Make sure you have Node.js (v18 or newer) and npm installed. You can download them from [nodejs.org](https://nodejs.org/).
- **Git & SSH:** You'll need Git to clone the repository and an SSH key configured with your GitHub account.

### 2. Get a Google API Key

This application requires a Google Cloud Platform API key with specific APIs enabled.

1.  **Create a Google Cloud Project:** Go to the [Google Cloud Console](https://console.cloud.google.com/) and create a new project.
2.  **Enable APIs:** In your project's dashboard, go to "APIs & Services" > "Library" and enable the following three APIs:
    *   **Solar API**
    *   **Maps JavaScript API**
    *   **Places API**
3.  **Create an API Key:** Go to "APIs & Services" > "Credentials", click "Create Credentials", and select "API key".
4.  **Restrict Your API Key:** This is a crucial security step!
    *   Click on your newly created API key.
    *   Under **Application restrictions**, select "HTTP referrers (web sites)" and add your development and production URLs (e.g., `http://localhost:5173/*` for local dev, and your GitHub Pages URL `https://matthewbrake.github.io/*` for production).
    *   Under **API restrictions**, select "Restrict key" and choose the three APIs you enabled above.
5.  **Copy the API Key:** You will need this key in a later step.

### 3. Clone Your Repository

Open your terminal and run the following command. Make sure you have SSH set up with your GitHub account.

```bash
# Replace <YOUR_USERNAME>/<YOUR_REPOSITORY_NAME> with your actual repository path
git clone git@github.com:matthewbrake/Solar-SalesFunnel-8725.git
cd Solar-SalesFunnel-8725
```

### 4. Create Project Configuration Files

You'll need to create a few configuration files for the build process and dependencies.

#### `package.json`

Create a file named `package.json` in the root of the project and paste the following content.

**Note:** The `homepage` field has been pre-filled for you.

```json
{
  "name": "sales-funnel-hero",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "homepage": "https://matthewbrake.github.io/Solar-SalesFunnel-8725",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "dependencies": {
    "react": "^19.1.1",
    "react-dom": "^19.1.1"
  },
  "devDependencies": {
    "@types/google.maps": "^3.55.11",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "gh-pages": "^6.1.1",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.4",
    "typescript": "^5.5.3",
    "vite": "^5.3.3"
  }
}
```

#### `vite.config.js`

Create a file named `vite.config.js` in the root of the project. This configures the Vite build tool.

```javascript
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  // Dynamically set the base path for GitHub Pages deployment
  const repoName = env.npm_package_homepage ? new URL(env.npm_package_homepage).pathname : '/';
  
  return {
    base: repoName,
    plugins: [react()],
    define: {
      // Expose environment variables to the client
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})
```

### 5. Install Dependencies

Now, run this command in your terminal to install all the necessary packages defined in `package.json`:

```bash
npm install
```

### 6. Configure Environment Variables

Create a file named `.env` in the root of your project. This file will securely store your API key and is ignored by Git.

Add your Google API key to this file:

```env
# .env
API_KEY=PASTE_YOUR_GOOGLE_API_KEY_HERE
```
Replace `PASTE_YOUR_GOOGLE_API_KEY_HERE` with the key you copied earlier.

---

## Development

To run the application in development mode with hot-reloading, use the following command:

```bash
npm run dev
```

This will start a local development server, typically at `http://localhost:5173`. Open this URL in your browser to see the app.

---

## Deployment to GitHub Pages

These instructions will guide you through deploying the application as a live website using GitHub Pages.

### 1. Run the Deploy Command

This single command will build the application for production and push the contents of the build folder (`dist`) to a special `gh-pages` branch on your repository.

```bash
npm run deploy
```

The `gh-pages` package will handle the entire deployment process for you.

### 2. Configure GitHub Pages Settings

1.  Go to your repository on GitHub.
2.  Click on the **Settings** tab.
3.  In the left sidebar, click on **Pages**.
4.  Under "Build and deployment", for the **Source**, select **Deploy from a branch**.
5.  For the **Branch**, select `gh-pages` and keep the folder as `/ (root)`.
6.  Click **Save**.

Your website should be live at the URL specified in your `package.json` `homepage` field within a few minutes.

**To update your live application, simply run `npm run deploy` again after pushing your code changes.**