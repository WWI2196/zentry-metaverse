# Zentry Metaverse Website

This project is a modern, animated website showcasing the [Zentry Metaverse](https://melkorsa.github.io/zentry-metaverse/) platform, built with React and Vite. It features various sections including a hero area with video transitions, about, features (using a bento grid layout), story, and contact sections, along with GSAP animations and React Router for navigation.

## Project Structure

```
/public          # Static assets (images, videos, fonts, audio)
/src
  /components    # Reusable React components for different sections
  App.jsx        # Main application component with routing
  main.jsx       # Entry point of the React application
  index.css      # Global styles and Tailwind base/utilities
vite.config.js   # Vite configuration file
package.json     # Project dependencies and scripts
README.md        # This file
...              # Other configuration files (ESLint, PostCSS, etc.)
```

## Key Technologies

*   **React:** JavaScript library for building user interfaces.
*   **Vite:** Fast frontend build tool.
*   **Tailwind CSS:** Utility-first CSS framework.
*   **GSAP (GreenSock Animation Platform):** JavaScript library for high-performance animations.
*   **React Router:** Declarative routing for React applications.
*   **gh-pages:** Utility for deploying files to a `gh-pages` branch on GitHub.

## Setup and Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/MelKorSA/zentry-metaverse.git
    cd zentry-metaverse
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start the Vite development server, typically at `http://localhost:5173`.

## Building for Production

```bash
npm run build
```
This command builds the application for production in the `dist` directory.

## Deploying to GitHub Pages

This project uses GitHub Actions for automated deployment. Here's a breakdown of the setup, including the troubleshooting steps we identified:

**A. Configuration Steps (Do these once):**

1.  **Install `gh-pages` (Optional but good practice):**
    While GitHub Actions handles the deployment, having `gh-pages` locally can be useful for testing or manual deployments.
    ```bash
    npm install gh-pages --save-dev
    ```
2.  **Update `package.json`:**
    *   Add a `homepage` field pointing to your GitHub Pages URL:
        ```json
        "homepage": "https://<your-username>.github.io/<your-repo-name>/"
        ```
        *(In this project, it's `https://wwi2196.github.io/zentry-metaverse/`)*
    *   (Optional) Add `predeploy` and `deploy` scripts for manual deployment:
        ```json
        "scripts": {
          // ... other scripts
          "predeploy": "npm run build",
          "deploy": "gh-pages -d dist"
        }
        ```
3.  **Configure Vite Base Path:**
    *   In `vite.config.js`, set the `base` option to your repository name (including leading and trailing slashes). This is crucial for assets to load correctly on GitHub Pages.
        ```javascript
        // vite.config.js
        import { defineConfig } from 'vite';
        // ... other imports

        export default defineConfig({
          // ... plugins
          base: '/<your-repo-name>/', // e.g., '/zentry-metaverse/'
        });
        ```
4.  **Configure React Router Basename:**
    *   If using React Router, wrap your routes in a `<Router>` component and provide the `basename` prop matching the Vite `base` path (without the trailing slash). This ensures routing works correctly within the subdirectory on GitHub Pages.
        ```jsx
        // src/App.jsx
        import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

        function App() {
          return (
            <Router basename="/<your-repo-name>"> {/* e.g., "/zentry-metaverse" */}
              {/* ... Routes ... */}
            </Router>
          );
        }
        ```
5.  **Import Static Assets:**
    *   **Crucially**, for Vite to correctly handle asset paths during the build, especially when deploying to a subdirectory, you **must** `import` static assets (images, videos, audio files) into your JavaScript/JSX files and use the imported variable as the `src` or in `style` attributes.
    *   **Example:**
        ```jsx
        // Instead of: <img src="/img/logo.png" alt="Logo" />
        // Do this:
        import logoSrc from '/img/logo.png';
        // ... later in the component
        <img src={logoSrc} alt="Logo" />

        // Similarly for background images in style props:
        import bgImage from '/img/background.webp';
        // ...
        <div style={{ backgroundImage: `url(${bgImage})` }}>...</div>
        ```
    *   This ensures Vite processes the assets and generates the correct URLs relative to the `base` path in the final build. Using absolute paths like `/img/logo.png` directly in `src` attributes will likely result in 404 errors on the deployed GitHub Pages site.

**B. GitHub Actions Workflow Setup:**

1.  **Create Workflow File:**
    *   Create a directory structure `.github/workflows` in the root of your project if it doesn't exist.
    *   Inside `.github/workflows`, create a file named `deploy.yml` (or any other `.yml` name).
2.  **Add Workflow Content:**
    *   Paste the following content into `deploy.yml`. This is a standard workflow for deploying Vite projects to GitHub Pages:
        ```yaml
        # Simple workflow for deploying static content to GitHub Pages
        name: Deploy static content to Pages

        on:
          # Runs on pushes targeting the default branch
          push:
            branches: ["main"] # Or your default branch name

          # Allows you to run this workflow manually from the Actions tab
          workflow_dispatch:

        # Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
        permissions:
          contents: read
          pages: write
          id-token: write

        # Allow only one concurrent deployment, skipping runs queued between the run in-progress and latest queued.
        # However, do NOT cancel in-progress runs as we want to allow these production deployments to complete.
        concurrency:
          group: "pages"
          cancel-in-progress: false

        jobs:
          # Build job
          build:
            runs-on: ubuntu-latest
            steps:
              - name: Checkout
                uses: actions/checkout@v4
              - name: Set up Node
                uses: actions/setup-node@v4
                with:
                  node-version: 20 # Use a recent LTS version
                  cache: 'npm'
              - name: Install dependencies
                run: npm install
              - name: Build
                run: npm run build
              - name: Setup Pages
                uses: actions/configure-pages@v5
              - name: Upload artifact
                uses: actions/upload-pages-artifact@v3
                with:
                  # Upload dist folder
                  path: './dist'

          # Deployment job
          deploy:
            environment:
              name: github-pages
              url: ${{ steps.deployment.outputs.page_url }}
            runs-on: ubuntu-latest
            needs: build
            steps:
              - name: Deploy to GitHub Pages
                id: deployment
                uses: actions/deploy-pages@v4
        ```
3.  **Commit and Push:**
    *   Commit the `.github/workflows/deploy.yml` file and push it to your default branch (`main`).

**C. GitHub Repository Settings:**

1.  **Navigate to Settings:** Go to your repository on GitHub.
2.  **Go to Pages:** Click on the "Settings" tab, then select "Pages" from the left sidebar.
3.  **Configure Source:** Under "Build and deployment", select **"GitHub Actions"** as the source.

**D. Deployment Process:**

*   Now, every time you push changes to your `main` branch (or whichever branch you specified in `deploy.yml`), the GitHub Action will automatically:
    1.  Check out your code.
    2.  Set up Node.js.
    3.  Install dependencies (`npm install`).
    4.  Build the project (`npm run build`).
    5.  Upload the build output (`dist` folder) as a GitHub Pages artifact.
    6.  Deploy the artifact to your GitHub Pages site.
*   You can monitor the progress in the "Actions" tab of your repository.
*   Your site will be available at the URL specified in your `homepage` field in `package.json` (e.g., `https://wwi2196.github.io/zentry-metaverse/`).

*(Previous steps 6 & 7 about manual deployment and gh-pages branch settings are removed as they are superseded by the GitHub Actions setup)*

## Acknowledgements

This project was heavily inspired by and references resources from Adrian Hajdin. Special thanks for his valuable content:

*   **GitHub:** [github.com/adrianhajdin](https://github.com/adrianhajdin)

