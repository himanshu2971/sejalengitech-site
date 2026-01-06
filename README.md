

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

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.






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

