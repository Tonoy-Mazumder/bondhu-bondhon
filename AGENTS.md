<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commands

- `npm run dev` (Turbopack dev server), `npm run build`, `npm run lint`, `npm run start`.
- No test framework is configured — do not invent or run test commands.
- There is no typecheck script. For a clean tree, run `npx tsc --noEmit` first, then `npm run lint`, then `npm run build`.

## Non-default Next.js config (next.config.ts)

- `cacheComponents: false` (intentionally off — if re-enabled, dynamic server data in pages must be wrapped in Suspense boundaries or builds will error).
- `reactCompiler: true` (babel-plugin-react-compiler): components are auto-memoized; do not hand-add `useMemo`/`useCallback`/`React.memo` purely for performance — the compiler handles it.
- Tailwind CSS v4 loads via the `turbopack.rules` block. There is no `tailwind.config` file — theming is CSS-first in `src/app/globals.css`.
- `images.remotePatterns` allowlists `images.unsplash.com` only — remote images from any other host will 400 until added there.

## Data & backend

- Event data comes from an **external backend** at `http://localhost:5000/events` (must be running for events-related data to load; not an npm package). The event shape lives in `src/app/types/Events.ts` as `IEventItem` — type event data against it instead of redefining the shape elsewhere.
- Event detail navigation conventionally targets `/events/<_id>` (the registered dynamic route).
- A `next dev` server is often already running on port 3000 (the user's). If `npm run dev` reports the port in use, do not kill it — smoke-test HTTP responses against the existing server instead.

## shadcn / Base UI

- shadcn/ui is initialized with the `base-nova` style (`components.json`): generated components in `src/components/ui/` build on **Base UI** (`@base-ui/react`), not Radix — component APIs differ from the Radix-based shadcn components in older examples/training data. Check `src/components/ui/button.tsx` for the established pattern (primitives imported per-part, `data-slot` attributes, `cva` variants, `cn` for class merging).
- Base UI components have no `asChild`/Radix `Slot` API — to render a `Button` as a `Link`, use Base UI's `render` prop: `<Button render={<Link href="…" />}>Text</Button>`. Using `asChild` fails the typecheck. **User preference:** for simple link-buttons (card CTAs like View Event / View All Events / Retry), skip `Button` entirely and use a plain styled Next `<Link>` with the button classes instead.
- `cn` is imported from the standalone `cn` package (re-exported as `@/lib/utils`), not `clsx` + `tailwind-merge` directly.
- Theme tokens (oklch CSS variables, `--radius` scale, dark mode via a `.dark` class + `@custom-variant dark`) live in `src/app/globals.css`; colors/utilities reference the `@theme inline` block there.
- The `shadcn` CLI is a runtime dependency; use it (`npx shadcn add <component>`) instead of hand-writing more `src/components/ui/` files, and respect its aliases (`@/components`, `@/hooks`, `@/lib`).

## Structure & conventions

- **Responsiveness is mandatory.** Every UI the user asks for must be built responsive from the start: mobile-first with Tailwind breakpoints (`sm:`, `md:`, `lg:`), stacked/wrapped layouts on small screens, and a mobile treatment (e.g. hamburger navigation) for any desktop-only element. Never ship a desktop-only layout or defer responsiveness to a later pass.
- **Locked design palette** (user-specified; keep unchanged): forest green `#14532D`, warm cream `#F8F7F0`, lime accent `#D9F99D`, charcoal `#292524`, muted green `#647067`, placeholder-photo tint `#DCE8DC`. Components hardcode these hex values rather than mapping them into the shadcn theme tokens — match the existing sections instead of introducing new colors or restyling built UI.
- `src/components/site/event-card.tsx` is the one reusable event card (dashed cover frame, category badge, View Event → `/events/<id>`); take an `IEventItem` prop and render it with `<EventCard event={…}/>` in any listing instead of hand-building card markup.

- App Router code lives in `src/app/` only; route file conventions (`page.tsx`, `layout.tsx`) apply there.
- Path alias: `@/*` → `./src/*`.
- TypeScript is `strict`. Typed route helpers like `LayoutProps<"/">` in `layout.tsx` are validated against generated types under `.next/types` and `.next/dev/types` (tsconfig `include`). If `tsc` fails to find them, run `next dev` or `next build` once to generate.
- After renaming/moving files under `src/app/`, `tsc` can fail referencing old paths from stale `.next/types` (e.g. after a route folder rename). Regenerate with `npm run build` before diagnosing; the project tree itself is usually fine.
