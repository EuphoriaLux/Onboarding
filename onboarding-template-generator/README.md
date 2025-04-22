# Microsoft Support Tools - Chrome Extension

A Chrome extension providing a dashboard of tools designed to assist Microsoft Support engineers and related roles. It includes features for generating onboarding email templates, managing CRM data (alpha), generating `.ics` calendar files, viewing support requests, and more.

## Overview

This extension serves as a central hub for various utilities commonly used in Microsoft support workflows. The main interface is accessed via the extension's options page, which presents a dashboard of available tools.

## Features

*   **Homepage Dashboard:** Central navigation page displaying available tools categorized for easy access.
*   **Onboarding Template Generator:** Creates customized rich text onboarding emails including:
    *   Support tier selection (Bronze, Silver, Gold, Platinum - *Note: Tiers might need updating based on current offerings*)
    *   Customer information collection
    *   Authorized contact management
    *   Microsoft Tenant ID input
    *   Template preview
    *   Copy to clipboard (HTML format)
*   **.ICS File Generators:**
    *   On-Call Duty periods
    *   Support Request entries
    *   Vacation Requests
*   **CRM Management (Alpha):** Basic functionality to manage customer records stored in Azure Blob Storage.
*   **Support Request Viewer (Alpha):** View support requests, potentially integrating with Azure Blob Storage and requiring Azure AD login.
*   **Settings:** Configuration options for the extension (e.g., theme, feature flags).
*   **Roadmap:** Visual timeline of planned features and their status.
*   **Multi-language Support:** Includes translations for English, French, and German.
*   **Theming:** Supports light and dark modes.

*(Note: Some features listed, like CRM and Support Request Viewer, might be in early alpha/beta stages based on code structure.)*

## Tech Stack

This extension is built using modern web technologies:

*   **Framework:** React (`^19.0.0`)
*   **Language:** TypeScript (`^5.8.2`)
*   **Build Tool:** Vite (`^6.3.2`)
*   **Extension Plugin:** `@crxjs/vite-plugin` (`^2.0.0-beta.23`)
*   **Styling:** Tailwind CSS (`^3.4.3`) with PostCSS (`^8.5.3`) and Autoprefixer (`^10.4.21`)
*   **UI Components:** Includes custom components and `react-datepicker` (`^8.2.1`)
*   **Azure Integration:** Uses `@azure/msal-browser` (`^4.10.0`) for authentication and `@azure/storage-blob` (`^12.27.0`) for storage (in specific features).

## Development Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd onboarding-template-generator
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm start
    ```
    This will start Vite in watch mode. Load the extension in Chrome using the `dist` directory (see next step). Changes will trigger rebuilds, but you may need to manually reload the extension in `chrome://extensions`.

4.  **Load the extension in Chrome:**
    *   Open Chrome and navigate to `chrome://extensions/`
    *   Enable "Developer mode" (toggle in the top right).
    *   Click "Load unpacked".
    *   Select the `onboarding-template-generator/dist` folder from your project directory.

## Building for Production

To create an optimized production build:

```bash
npm run build
```

This will generate the production-ready files in the `dist` directory.

## Project Structure (Simplified)

```
onboarding-template-generator/
├── dist/                 # Build output directory (loaded into Chrome)
├── src/
│   ├── assets/           # Static assets (icons, images - currently unused in manifest)
│   ├── components/       # Shared React components (Navbar, Icons, etc.)
│   ├── contexts/         # React Context providers (AppState, Language)
│   ├── features/         # Core feature modules (Homepage, EmailBuilder, CRM, etc.)
│   │   └── [featureName]/
│   │       ├── components/ # Components specific to the feature
│   │       ├── hooks/      # Hooks specific to the feature
│   │       ├── services/   # Services specific to the feature
│   │       └── types/      # Types specific to the feature
│   ├── services/         # Shared services (i18n, storage, etc.)
│   ├── styles/           # Global styles (tailwind.css)
│   ├── types/            # Shared TypeScript types
│   ├── utils/            # Shared utility functions
│   ├── options.html      # Options page HTML template
│   ├── options.tsx       # Options page entry point (renders Homepage)
│   ├── popup.html        # Popup page HTML template
│   ├── popup.tsx         # Popup page entry point
│   └── manifest.json     # Extension manifest
├── postcss.config.mjs    # PostCSS configuration (for Tailwind)
├── tailwind.config.js    # Tailwind CSS configuration
├── vite.config.js        # Vite build configuration
├── tsconfig.json         # TypeScript configuration
├── package.json          # Project dependencies and scripts
└── README.md             # This file
```

*(Note: Some configuration files like `webpack.config.js` might still be present but are no longer used after switching to Vite.)*
