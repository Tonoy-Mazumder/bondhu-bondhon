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

- `cacheComponents: true`: async/server data access inside components must be wrapped appropriately (suspense boundaries / cache) or builds will error. This is easy to trip when editing server components.
- `reactCompiler: true` (babel-plugin-react-compiler): components are auto-memoized; do not hand-add `useMemo`/`useCallback`/`React.memo` purely for performance — the compiler handles it.
- Tailwind CSS v4 loads via the `turbopack.rules` block. There is no `tailwind.config` file — theming is CSS-first in `src/app/globals.css`.

## shadcn / Base UI

- shadcn/ui is initialized with the `base-nova` style (`components.json`): generated components in `src/components/ui/` build on **Base UI** (`@base-ui/react`), not Radix — component APIs differ from the Radix-based shadcn components in older examples/training data. Check `src/components/ui/button.tsx` for the established pattern (primitives imported per-part, `data-slot` attributes, `cva` variants, `cn` for class merging).
- `cn` is imported from the standalone `cn` package (re-exported as `@/lib/utils`), not `clsx` + `tailwind-merge` directly.
- Theme tokens (oklch CSS variables, `--radius` scale, dark mode via a `.dark` class + `@custom-variant dark`) live in `src/app/globals.css`; colors/utilities reference the `@theme inline` block there.
- The `shadcn` CLI is a runtime dependency; use it (`npx shadcn add <component>`) instead of hand-writing more `src/components/ui/` files, and respect its aliases (`@/components`, `@/hooks`, `@/lib`).

## Structure & conventions

- **Responsiveness is mandatory.** Every UI the user asks for must be built responsive from the start: mobile-first with Tailwind breakpoints (`sm:`, `md:`, `lg:`), stacked/wrapped layouts on small screens, and a mobile treatment (e.g. hamburger navigation) for any desktop-only element. Never ship a desktop-only layout or defer responsiveness to a later pass.

- App Router code lives in `src/app/` only; route file conventions (`page.tsx`, `layout.tsx`) apply there.
- Path alias: `@/*` → `./src/*`.
- TypeScript is `strict`. Typed route helpers like `LayoutProps<"/">` in `layout.tsx` are validated against generated types under `.next/types` and `.next/dev/types` (tsconfig `include`). If `tsc` fails to find them, run `next dev` or `next build` once to generate.
