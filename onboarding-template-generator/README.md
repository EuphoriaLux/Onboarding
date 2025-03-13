# Microsoft Support Onboarding Template Generator

A Chrome extension that generates rich text onboarding templates for Microsoft support customers, designed to streamline the customer onboarding process.

## Features

- Support tier selection (Bronze, Silver, Gold, Platinum)
- Collection of customer information
- Authorized contact management based on tier limits
- Microsoft Tenant ID definition
- Rich text template generation
- Copy to clipboard functionality with HTML formatting preserved
- Template preview before copying
- Data persistence using Chrome storage API

## Installation for Development

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/onboarding-template-generator.git
   cd onboarding-template-generator
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Build the extension:
   ```
   npm run build
   ```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in the top right)
   - Click "Load unpacked" and select the `dist` folder from your project directory

## Usage

1. Click on the extension icon in Chrome to open the popup
2. Select the appropriate support tier (Bronze, Silver, Gold, or Platinum)
3. Enter customer and contact information
4. Enter tenant ID if available
5. Add authorized contacts (up to the limit based on the selected tier)
6. Preview the template using the "Show Preview" button
7. Generate and copy the template to clipboard using the "Generate & Copy to Clipboard" button
8. Paste the formatted template into Outlook or any rich text editor

## Development

### Project Structure

```
onboarding-template-generator/
├── src/
│   ├── assets/           # Icons and static resources
│   ├── components/       # React components
│   │   ├── App.tsx
│   │   ├── OnboardingTemplateGenerator.tsx
│   │   ├── TierSelector.tsx
│   │   ├── ContactsForm.tsx
│   │   ├── TenantForm.tsx
│   │   └── TemplatePreview.tsx
│   ├── data/             # Static data
│   │   └── supportTiers.ts
│   ├── styles/           # CSS styles
│   │   └── App.css
│   ├── utils/            # Utility functions
│   │   ├── clipboardUtils.ts
│   │   └── templateGenerator.ts
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   ├── popup.tsx         # Extension popup entry point
│   ├── popup.html        # Extension popup HTML
│   ├── background.ts     # Background script
│   └── manifest.json     # Extension manifest
├── webpack.config.js     # Webpack configuration
├── tsconfig.json         # TypeScript configuration
├── package.json          # NPM dependencies
└── README.md             # Documentation
```

### Development Commands

- `npm start`: Start development mode with watch
- `npm run build`: Build the extension
- `npm run build:dev`: Build the extension in development mode
- `npm run build:prod`: Build the extension in production mode

## Template Structure

The generated template includes:

1. Introduction and meeting request
2. Support tier details (hours, contacts, tenants, etc.)
3. Authorized contacts list
4. Tenant ID section
5. GDAP link acceptance instructions
6. RBAC role establishment with PowerShell script
7. Service provider acceptance in conditional access policy

## Future Enhancements

- Add more customization options for templates
- Implement template saving and management
- Add direct integration with Outlook
- Support for multiple languages
- Theme customization options
- Template versioning