# CI/CD — Frontend (Mi Punto)

Pipeline de integración y despliegue continuo con **GitHub Actions**.
Despliegue en **Vercel**.

## Workflows

| Archivo | Cuándo se ejecuta | Qué hace |
|---|---|---|
| `.github/workflows/ci.yml` | En cada **Pull Request** hacia `main` y en cada **push** a `main` | **Lint** (`eslint`), **Pruebas** (`vitest`) y **Build** (`tsc -b && vite build`) |
| `.github/workflows/deploy.yml` | Solo al hacer **merge / push a `main`** | Despliega a producción en Vercel (`vercel pull` → `vercel build` → `vercel deploy --prebuilt --prod`) |

## Ejecutar localmente

```bash
npm ci
npm run lint    # lint
npm test        # pruebas
npm run build   # build
```

## Despliegue en Vercel

1. Crea el proyecto en [vercel.com](https://vercel.com) importando el repo
   `NataBravo/mi-punto-frontend` (framework: **Vite**). `vercel.json` ya define
   el build y el *rewrite* SPA hacia `index.html`.
2. Configura la variable de entorno del proyecto en Vercel:
   - `VITE_API_URL` → URL pública del backend en Render
     (ej. `https://mi-punto-backend.onrender.com`).
3. Obtén los datos para los secrets:
   - **Token:** *Vercel → Account Settings → Tokens → Create*.
   - **Org ID / Project ID:** ejecuta `vercel link` en local (genera
     `.vercel/project.json`) o míralos en *Project → Settings → General*.

### Secrets requeridos en GitHub

*GitHub → repo → Settings → Secrets and variables → Actions → New repository secret:*

| Secret | Valor |
|---|---|
| `VERCEL_TOKEN` | Token de Vercel |
| `VERCEL_ORG_ID` | ID de la organización/cuenta |
| `VERCEL_PROJECT_ID` | ID del proyecto |

> Para evitar un doble deploy, desactiva la integración Git automática de Vercel
> (*Project → Settings → Git → Ignored Build Step* o desconectar el auto-deploy),
> ya que el despliegue lo controla el pipeline.

## Evidencia de ejecuciones

Las ejecuciones quedan registradas en la pestaña **Actions** del repositorio.
Para tres ejecuciones exitosas: abrir 2–3 Pull Requests (o pushes a `main`) y
capturar los runs en verde de los workflows **CI** y **Deploy**.
