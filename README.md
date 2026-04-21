# ElectroLab — Electrochemistry Platform

Premium dark-themed learning cockpit: theory hub, Three.js simulations, drag-and-drop virtual lab, calculators, Chart.js analytics, battery & Pourbaix schematics, quiz mode, and an Express-backed assistant API with offline fallbacks.

## Prerequisites

- Node.js 20+ (includes `npm`)
- Two terminal sessions (frontend + API) or a process manager of your choice

## 1. Install dependencies

```bash
cd electrochemistry-platform
npm install
cd server
npm install
cd ..
```

## 2. Run locally

Terminal A — Vite dev server (port `5173`):

```bash
npm run dev
```

Terminal B — Express API (port `4000`):

```bash
cd server
npm start
```

The Vite config proxies `/api/*` to `http://localhost:4000`, so the AI assistant call succeeds at `/api/assistant`.

## 3. Production build

```bash
npm run build
npm run preview
```

Serve `dist/` with any static host; run the API separately and point `VITE_*` proxy equivalents at your gateway, or configure your edge to forward `/api` to the Node service.

## Project layout

- `src/pages/*` — Routed modules (Home, Theory, Sims, Virtual Lab, …)
- `src/components/*` — Reusable UI + Three.js scenes
- `src/data/*` — Standard potentials, theory content, physical constants
- `server/index.js` — Express tutor (swap in an LLM client later)

## Notes

- Pourbaix curves are **schematic** for pedagogy, not published atlas data.
- Virtual lab uses **@dnd-kit** for smooth drag/drop (modern React DnD patterns).
- Three.js scenes are GPU-accelerated; disable orbit auto-rotate in simulations if you add XR or accessibility controls.

## License

Educational use. Extend and attribute as needed for your classroom or research group.
