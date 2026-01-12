

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

Clear Domain Driven Structuce

src/
├── components/
│   ├── common/        # Buttons, Modals, Layout
│   ├── layout/        # Header, Footer, Nav
│   └── seo/           # Meta, Schema
├── pages/
│   ├── index.js
│   ├── _app.js
│   ├── _document.js
│   └── api/
├── styles/
│   ├── globals.css
│   └── variables.css
├── utils/
│   ├── constants.js
│   ├── helpers.js
│   └── analytics.js
├── hooks/
│   └── useViewport.js
└── config/
    └── seo.config.js

