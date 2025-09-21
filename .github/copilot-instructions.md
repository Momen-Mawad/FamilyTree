# Copilot Instructions for FamilyTree

## Overview

This repository is a full-stack family tree application with a React/TypeScript/Vite frontend (`client/`) and a Node.js/Express/Mongoose backend (`server/`). The app allows users to register, log in, and manage family trees with nested relationships.

## Architecture & Key Patterns

- **Frontend (`client/`):**
  - Uses React with functional components and hooks.
  - Uses MUI (Material UI) as the main component library.
  - Routing is managed in `src/router/router.tsx` using `react-router`.
  - State for authentication and user info is stored in localStorage and React state.
  - Family tree visualization uses `react-d3-tree` (`src/containers/tree/FamilyTree.tsx`, `CustomNode.tsx`).
  - API endpoints are configured via `src/config.ts` and accessed with `axios`.
  - Responsive design is handled via `screenSizeContext`.
- **Backend (`server/`):**
  - Express REST API with routes in `routes/routes.js` and controllers in `controllers/controllers.js`.
  - MongoDB models for `Person`, `Family`, and `User` in `models/models.js`.
  - Auth uses JWT tokens; endpoints: `/register`, `/login`, `/verify_token`.
  - Family and person CRUD endpoints: `/families`, `/persons`.

## Developer Workflows

- **Frontend:**
  - Start dev server: `npm run dev` (in `client/`)
  - Build: `npm run build`
  - Lint: `npm run lint` or `npm run format`
  - Typecheck: `npm run typecheck`
- **Backend:**
  - Start dev server: `nodemon index.js` (or `npm run dev`, which uses nodemon, in `server/`)
  - Run tests: `npm test`

## Conventions & Patterns

- Use TypeScript for all React code; keep types close to usage.
- API calls should use the `URL` from `config.ts` and include JWT if available.
- Family tree data is hierarchical; use `react-d3-tree` node structure.
- All user authentication state is managed via localStorage and React state.
- Use `NuqsAdapter` (from `nuqs`) as the top-level React context provider in `App.tsx`.
- Backend expects MongoDB ObjectIds for references.

## Integration Points

- **Frontend ↔ Backend:** Communicate via REST API; endpoints are versioned and mapped in `routes/routes.js`.
- **Auth:** JWT token is required for protected endpoints; set as `Authorization` header in axios.
- **Family Tree:** Tree structure is built from `/families/:id` and `/persons` endpoints.

## Notable Files

- `client/src/router/router.tsx` — Routing and auth logic
- `client/src/containers/tree/FamilyTree.tsx` — Tree rendering
- `server/controllers/controllers.js` — API logic
- `server/models/models.js` — Data models
- `server/routes/routes.js` — API routes

## Tips for AI Agents

- Follow the established folder structure and naming conventions.
- When adding new API endpoints, update both backend routes/controllers and frontend API calls.
- Use existing patterns for state, context, and API integration.
- Prefer functional React components and hooks.
- Keep backend logic stateless and RESTful.
