# Pruebas — Frontend (Mi Punto)

## Tipos de prueba

| Tipo | Herramienta | Ubicacion | Que valida |
|---|---|---|---|
| Unitarias | `Vitest` (jsdom) | `src/**/*.test.ts` | Cliente HTTP, helpers geo, validaciones (zod), servicios |
| Coverage | `@vitest/coverage-v8` | — | Umbral **85%** sobre la capa de logica |
| E2E (3) | `Playwright` | `e2e/` | Flujos de usuario en un navegador real |

> Vitest es compatible con la API de Jest (`describe`/`it`/`expect`).

Las **3 pruebas E2E** son:
1. `01-landing.spec.ts` — la landing carga y navega a iniciar sesion.
2. `02-login-exitoso.spec.ts` — login con cuenta demo de owner → panel `/owner`.
3. `03-login-invalido.spec.ts` — credenciales incorrectas → mensaje de error.

## Coverage

El alcance del 85% es la **capa de logica** (`src/lib/api.ts`, `src/lib/geo.ts`,
`src/lib/utils.ts`, `src/modules/*/services.ts`, `src/modules/auth/schemas.ts`).
Se excluye la UI (paginas, componentes), hooks de React Query y tipos
(ver `vitest.config.ts`). Coverage actual: **~96%**.

## Correr las pruebas localmente

> Requiere **Node 20+** (Vitest 3 y Playwright lo exigen).

```bash
npm ci

npm run lint            # ESLint
npm test                # unitarias (Vitest)
npm run test:coverage   # unitarias + coverage (gate 85%)
npm run build           # build de produccion

# E2E (requiere el backend corriendo en VITE_API_URL y datos demo cargados)
npm run test:e2e
```

Para los E2E en local: levanta el backend (`uvicorn app.main:app` con la base
sembrada por `seed.py`) y luego corre `npm run test:e2e`. Playwright construye
y sirve el frontend automaticamente (vite preview en `:4173`).

## Hooks de pre-commit

En cada `git commit`, **husky** corre lint + pruebas unitarias (`.husky/pre-commit`).
Se activa solo al instalar dependencias (`npm install` ejecuta el script `prepare`).

## En CI

El workflow `.github/workflows/ci.yml` corre en cada Pull Request y push a `main`:
- **unit**: lint + unitarias con coverage (gate 85%) + build.
- **e2e**: levanta PostGIS + backend (repo `mi-punto-backend`, ramo `main`) + frontend,
  y ejecuta Playwright contra el stack local.
