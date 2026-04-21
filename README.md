# PixRoom+

PixRoom+ is a simple event photo-sharing SaaS built for fast collaboration around rooms, guest invites, shared uploads, and lightweight premium features.

## V1 Architecture

### Product shape

- `freemium users`: public rooms only, maximum 8 rooms per month, can invite anyone
- `premium users`: unlimited rooms, private or public rooms, AI assistant access
- `photographers`: marketplace profile, 7-day free trial, 3 months at `1 DT`, then `20 DT/month`

### Tech stack

- `frontend`: React + Vite + React Router
- `backend`: Node.js + Express
- `database`: MongoDB + Mongoose
- `auth`: JWT with hashed passwords
- `uploads`: local storage in V1, easy to replace with S3 later
- `payments`: subscription service abstraction with room for Stripe/Lemon Squeezy integration later
- `AI assistant`: OpenAI API via backend proxy

### Folder structure

```text
pixroom/
  apps/
    api/
      src/
        config/        # env, db, constants
        controllers/   # route handlers
        middleware/    # auth, errors, guards
        models/        # mongoose schemas
        routes/        # express routers
        services/      # billing, assistant, room logic
        utils/         # helpers
        app.js
        server.js
    web/
      src/
        components/    # reusable UI
        layouts/       # public/app shells
        lib/           # config, helpers, API client
        pages/
          public/      # home, login, register, pricing, demo
          app/         # dashboard, rooms, billing, marketplace
        routes/        # router config
        styles/        # global styles and design tokens
        App.jsx
        main.jsx
  package.json
```

### Why this structure

- Keeps frontend and backend independent without unnecessary microservices
- Uses clear vertical slices so auth, rooms, billing, and marketplace can grow cleanly
- Starts simple for V1 while staying ready for file storage, payments, and admin features later

## Milestone order

1. Landing page and public app shell
2. Authentication and role selection
3. Room creation, join by code, uploads, comments
4. Subscription and limits
5. OpenAI assistant
6. Photographer marketplace

## Getting started

```bash
npm install
npm run dev
```

### App URLs

- `web`: `http://localhost:5173`
- `api`: `http://localhost:4000`
