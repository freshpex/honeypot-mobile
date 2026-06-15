# Mobile Architecture

The mobile app is organized by product domain under `src/app`.

Each module owns:

- `components`: module-specific presentational components.
- `screens`: route screens for the module.
- `tab`: bottom-tab or tab-local entry points.
- `modal`: modal flows.
- `hooks`: module-specific hooks.
- `services`: API and local data services.
- `types`: module-local types.
- `test`: module-local tests.
- `index.ts`: module barrel.

Reusable UI belongs in `src/components/<component-name>` with its own root `index.ts`.

