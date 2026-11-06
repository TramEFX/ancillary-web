> **This repo predates Ancillary v1, the current canon.** Start at [TramEFX/ancillary](https://github.com/TramEFX/ancillary).

# Ancillary Web

**Open-source web application for the Ancillary Protocol**

Build your own persistent, sovereign AI companion.

---

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open http://localhost:5173

---

## What is Ancillary?

- **You own your data** — Manifests in your private GitHub repo
- **You control inference** — Use Claude, ChatGPT, or Grok (BYOK)
- **Memory is cumulative** — Never resets, only grows
- **Relationship is devoted** — Bound to your priorities

---

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create GitHub OAuth app** (optional for now):
   - Go to https://github.com/settings/developers
   - Create new OAuth app
   - Add credentials to `.env.local`

3. **Run dev server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   - Navigate to http://localhost:5173

---

## Tech Stack

- React 19 + Vite
- Tailwind CSS
- Zustand (state)
- GitHub API (storage)
- Claude/OpenAI/Grok APIs

---

## Project Structure

```
ancillary-web/
├── src/
│   ├── components/      # UI components
│   │   └── Wizard/     # Init wizard (coming soon)
│   ├── services/       # API integrations
│   │   ├── github.js   # GitHub operations
│   │   └── claude.js   # Claude API
│   ├── store/          # Global state
│   │   └── useStore.js
│   └── utils/          # Utilities
│       └── storage.js
├── public/             # Static assets
└── package.json
```

---

## Next Steps

**Phase 1:** GitHub auth + basic chat
**Phase 2:** Initialization wizard
**Phase 3:** Semantic retrieval
**Phase 4:** Multi-LLM support

---

**Your AI. Your data. Your future.**
