# LAIZI - AI Calendar Assistant Chrome Extension

A Chrome extension that provides an AI-powered assistant for Google Calendar and Gmail integration. LAIZI helps users with various calendar tasks and email scanning capabilities directly from their browser.

## 📋 Features

- **AI Chatbot Assistant**: Interact with an intelligent assistant named Laizi for calendar-related queries and tasks
- **Gmail Integration**: Scan and process Gmail inbox directly from the extension
- **Side Panel UI**: Clean, modern chat interface accessible via Chrome's side panel
- **Google Calendar Integration**: Seamless integration with Google Calendar
- **Identity Authentication**: Secure OAuth-based authentication with Chrome's identity API

## 🛠️ Tech Stack

- **Manifest V3**: Latest Chrome extension manifest version for enhanced security
- **JavaScript**: Core scripting language
- **HTML/CSS**: User interface
- **Chrome APIs**: 
  - Storage API
  - Tabs API
  - Side Panel API
  - Identity API (OAuth)

## 📁 Project Structure

```
├── scripts/
│   ├── start.js                 # Entry point for content script loading
│   ├── serviceWorkerLoader.js   # Background service worker
│   ├── sidePanelToggle.js       # Side panel functionality
│   ├── scanGmail.js             # Gmail scanning logic
│   └── authPopup.js             # Authentication popup handler
├── popup/
│   ├── popup.html               # Main UI layout
│   ├── popup.js                 # UI logic
│   ├── redirect.html            # OAuth redirect handler
│   └── styles.css               # UI styling
├── images/                      # Extension icons (16x16, 32x32, 48x48, 128x128)
├── anaconda_projects/           # Additional project resources
├── manifest.json                # Extension configuration
├── package.json                 # Project dependencies
└── add-module.js               # Module addition utility
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (for development)
- Chrome/Chromium browser
- Google account (for Calendar and Gmail access)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd f25-group-5
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Load extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked" and select the project folder
   - The LAIZI extension should now appear in your extensions list

## 📦 Adding New Modules

To add new scripts to the extension:

```bash
npm run add-module <scriptName.js>
```

Example:
```bash
npm run add-module newFeature.js
```

**Important**: Do not manually edit `scripts/start.js` as it manages the core module loading system.

## 🔐 Permissions

The extension requires the following Chrome permissions:

| Permission | Purpose |
|-----------|---------|
| `sidePanel` | Display UI in Chrome's side panel |
| `tabs` | Access current tab information |
| `storage` | Store user preferences and data |
| `identity` | OAuth authentication with Google |

## 🎯 Usage

1. Click the LAIZI extension icon in your Chrome toolbar
2. The side panel opens on the right side of your screen
3. Chat with Laizi or use the "📧 Scan Gmail" button to process emails
4. Assistant provides calendar-related suggestions and email insights

## 🔧 Development

### File Descriptions

- **start.js**: Core module loader - manages dynamic script injection
- **popup.js**: Handles chat UI interactions and message sending
- **scanGmail.js**: Gmail scanning and processing logic
- **sidePanelToggle.js**: Side panel display and toggle functionality
- **serviceWorkerLoader.js**: Background worker for persistent operations
- **authPopup.js**: Handles Google OAuth authentication flow

### Building & Debugging

- **Chrome DevTools**: Right-click extension icon → "Inspect popup" or "Inspect side panel"
- **View logs**: Chrome DevTools → Console tab
- **Reload extension**: Click the refresh icon on the extension card in `chrome://extensions/`





