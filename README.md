# EcoBac AI

> Assistant intelligent pour l'économie générale — Bac Maroc

A premium AI-powered chat application for Moroccan Baccalaureate economics revision, built with React + Vite + Tailwind CSS.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or later
- A [Fireworks AI](https://fireworks.ai) API key

### 1. Install dependencies

```bash
npm install
```

### 2. Add your API key

Open **`src/config/fireworks.js`** and replace the placeholder:

```js
export const FIREWORKS_API_KEY = "PASTE YOUR FIREWORKS API KEY HERE";
```

> ⚠️ This is the **only** place you need to update. The model and base URL are already configured.

### 3. Start the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧠 Features

| Feature | Description |
|---|---|
| **4 Study Modes** | Normal, Explication simple, Calcul économique, Révision Bac |
| **Session Memory** | Full conversation history with localStorage persistence |
| **Sidebar** | Browse, resume, and delete past conversations |
| **Suggestion Cards** | One-click prompts on the welcome screen |
| **Export Chat** | Download any conversation as a `.txt` file |
| **Copy Message** | Copy any AI response to clipboard |
| **Regenerate** | Re-ask the last question with one click |
| **Responsive** | Works on desktop and mobile |

---

## 📁 Project Structure

```
src/
├── config/
│   └── fireworks.js       ← ✏️ API key lives here
├── lib/
│   ├── api.js             ← Fireworks API + system prompts
│   └── storage.js         ← localStorage session helpers
├── data/
│   └── suggestions.js     ← Prompt cards & modes
├── components/
│   ├── Sidebar.jsx
│   ├── Header.jsx
│   ├── ChatWindow.jsx
│   ├── MessageBubble.jsx
│   ├── Composer.jsx
│   ├── EmptyState.jsx
│   ├── ModeSwitcher.jsx
│   ├── TypingIndicator.jsx
│   └── ChatList.jsx
├── App.jsx
├── main.jsx
└── styles.css
```

---

## ⚙️ Study Modes

| Mode | Behavior |
|---|---|
| **Normal** | Balanced, structured pedagogical answers |
| **Explication simple** | Very accessible language for beginners |
| **Calcul économique** | Always shows: Formule → Étapes → Résultat → Interprétation |
| **Révision Bac** | Concise, exam-focused study cards |

---

## 🔑 Configuration

All configuration is in one file: `src/config/fireworks.js`

```js
export const FIREWORKS_API_KEY  = "your-key-here";       // ← Change this
export const FIREWORKS_BASE_URL = "https://api.fireworks.ai/inference/v1/chat/completions";
export const FIREWORKS_MODEL    = "accounts/mohamed1elbouihi-hpe/deployments/w556hzi3";
```

---

*Local demo — not for public deployment.*
