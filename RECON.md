# RECON.md — Reconocimiento del repo (Paso 0 de AUDITORIA.md)

Generado: 2026-08-31. Repo: JPcamareno/monkeia-landing (monkeia.com), público.
Objetivo: que una sesión futura no tenga que volver a explorar el repo desde cero
antes de retomar AUDITORIA.md.

## Stack

- Next.js **16.2.3**, React **19.2.4** / React DOM 19.2.4.
- Esta versión de Next.js tiene cambios de ruptura frente al training data de los
  modelos (así lo advierte `AGENTS.md`). Verificado contra
  `node_modules/next/dist/docs/`:
  - `robots.txt` y `sitemap.xml` son **generados** (`app/robots.ts`,
    `app/sitemap.ts`), no estáticos en `public/`.
  - `redirects()` en `next.config.ts` es la convención vigente para C-03.
  - Antes de tocar APIs de metadata/redirects/routing, releer los docs en
    `node_modules/next/dist/docs/` en vez de asumir por training data.

## Estructura de `app/`

- `/` → `app/page.tsx` (home: hero, `CRMMockup`, testimonios, footer)
- `/diagnostico` → `app/diagnostico/page.tsx`
- `/diagnostico-b2c` → `app/diagnostico-b2c/page.tsx`
- `/gracias` → `app/gracias/page.tsx`
- `/api/submit-diagnostico`, `/api/submit-diagnostico-b2c` (route handlers)
- `app/components/Analytics.tsx`, `app/lib/track.ts`
- `app/opengraph-image.tsx`, `app/robots.ts`, `app/sitemap.ts`
- **No existen** `/services`, `/about`, `/monkeiapp`, `/test30` como rutas en
  `app/` → no hay rutas huérfanas que borrar; C-03 es solo añadir `redirects()`.
- **No existe** `middleware.ts`.
- **No existe** `app/not-found.tsx` → falta crearlo (C-03).

## Metadatos

- Solo `app/layout.tsx` exporta `metadata` (con `metadataBase`, OG, Twitter, y un
  JSON-LD `ProfessionalService` inline con `dangerouslySetInnerHTML`).
- Ninguna de las tres páginas (`/`, `/diagnostico`, `/diagnostico-b2c`)
  sobrescribe `title`/`description` → las tres heredan el mismo metadata del
  layout raíz. Confirma I-01.
- **Detalle técnico para M-02**: `app/gracias/page.tsx` empieza con
  `"use client"`. Un client component **no puede** exportar `metadata` en App
  Router. Para el `robots: { index: false, follow: false }` de M-02 hay que
  envolverlo en un server component (p.ej. un `layout.tsx` propio de
  `/gracias`, o separar la UI a un componente cliente hijo).

## Formulario de diagnóstico

- `app/diagnostico/page.tsx` y `app/diagnostico-b2c/page.tsx`: client component
  (`'use client'`), estado con `useState`, array `SECTIONS`/preguntas.
- Paso 1 de 7 (`sec-0`) pide nombre/empresa/email/WhatsApp **antes** de
  cualquier pregunta de diagnóstico → confirma C-01 tal cual lo describe el
  audit.
- Selector de país (`PhoneField`) ya tiene `+506` (Costa Rica) por defecto,
  ajustado además por geolocalización vía `https://ipapi.co/json/`.
- **Sin `sessionStorage`**: recargar a media ruta pierde todas las respuestas
  (pendiente para C-01).
- Envío: `POST /api/submit-diagnostico` (y su variante `-b2c`), que:
  1. Guarda en Supabase (`diagnosticos_express` / `diagnosticos_b2c`).
  2. Genera un borrador de diagnóstico llamando a `api.anthropic.com` con
     `process.env.ANTHROPIC_API_KEY` (correcto, vive en env var).
  3. Reenvía todo (incluido el borrador) a un webhook de ActivePieces.

## ⚠️ Hallazgo nuevo para R-01 — más urgente que el resto de AUDITORIA.md

Las URLs de webhook de ActivePieces están **hardcodeadas en el código fuente**,
no en variables de entorno de Vercel:

- `app/api/submit-diagnostico/route.ts:4` →
  `https://cloud.activepieces.com/api/v1/webhooks/hnOyI74mg97pmuw3IIIC2`
- `app/api/submit-diagnostico-b2c/route.ts:4` →
  `https://cloud.activepieces.com/api/v1/webhooks/vQQUNXOtIit8q2in5udFO`

Confirmado con `git log -p` sobre todo el historial: aparecen igual en todos
los commits, no hay rotación previa. Como el repo es público, cualquiera puede
leer estas URLs y hacer POST directo al webhook (inyectar leads falsos o
disparar el flujo de ActivePieces sin pasar por el sitio).

Verificado también: **no hay ningún `.env` en el historial** (`git log --all
--source -- '*.env*'` no devuelve nada) y no aparecen claves de API/Supabase
hardcodeadas en ningún commit — esas sí viven correctamente en variables de
entorno (`ANTHROPIC_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`,
`SUPABASE_SERVICE_ROLE_KEY`). `.gitignore` incluye `.env*`.

**Recomendación**: rotar ambos webhooks y moverlos a variables de entorno de
Vercel (p.ej. `ACTIVEPIECES_WEBHOOK_URL`, `ACTIVEPIECES_WEBHOOK_URL_B2C`) antes
o junto con C-01/C-02 — tiene prioridad sobre el resto de Fase 1 según la
propia nota de R-01 en AUDITORIA.md.

## Pixel de Meta y demás scripts de tracking

- Todo se inyecta client-side en `app/components/Analytics.tsx` (montado desde
  `app/layout.tsx`):
  - Meta Pixel (`fbq`), id vía `NEXT_PUBLIC_FB_PIXEL_ID` (env var). ID conocido:
    345409495117303 (según AUDITORIA.md).
  - Microsoft Clarity, id vía `NEXT_PUBLIC_CLARITY_ID` (env var).
  - Script de terceros "visitor-tracking" (`app.visitortracking.com`), site-id
    hardcodeado `cbc4ac48-79a7-4fe1-a060-237b00e715eb` — no es secreto, es un
    id público de sitio, no una credencial.
- Nada de esto respeta consentimiento hoy: se dispara en el primer render.
  Confirma C-02 (pixel debe esperar a la aceptación del aviso de cookies).

## robots.txt / sitemap.xml

- Generados dinámicamente, no estáticos:
  - `app/robots.ts`: `allow: "/"`, `disallow: ["/api/", "/gracias"]`, apunta a
    `sitemap: "https://www.monkeia.com/sitemap.xml"`.
  - `app/sitemap.ts`: 3 URLs — `/`, `/diagnostico`, `/diagnostico-b2c`.
- Para M-02 (noindex en `/gracias` en vez de Disallow) hay que editar
  `app/robots.ts` quitando `/gracias` del disallow, y resolver primero el
  problema de `"use client"` en `app/gracias/page.tsx` (ver sección Metadatos).

## Imágenes de testimonios (`cdn.ln-cdn.com`)

- Dos testimonios reales usan foto vía `<img>` plano (no `next/image`,
  `eslint-disable-next-line @next/next/no-img-element`), apuntando a
  `cdn.ln-cdn.com/c/recQV0G1EGj5iilpD/images/...`:
  - Jimmy Labin (Flowback) — `photoUrl` línea ~2291 de `app/page.tsx`.
  - Gianpiero Fusco (`@sw_gianpiero`) — `photoUrl` línea ~2332.
  - Parece un CDN externo tipo GoHighLevel/Leadconnector, no gestionado por
    este repo (no hay config de `images.remotePatterns` en `next.config.ts`
    porque se usa `<img>`, no `<Image>`, para estas fotos).
- **Ya tienen `alt={t.name}`** (línea ~2380) → I-08 ya está resuelto para estas
  dos fotos específicas.
- El resto de testimonios (Rubén Ocampo, Juan Cáceres, SERcuidados, Alejandro
  Restrepo, Eliana, ...) no tiene `photoUrl`: se renderiza un div con iniciales,
  no una imagen, no aplica `alt`.
- El logo (`/logo.svg`) ya tiene `alt="Monkeia"` en todos los usos vistos
  (`app/page.tsx`, `app/diagnostico/page.tsx`, `app/gracias/page.tsx`).
- Hay un carrusel de logos de clientes **comentado** (código muerto, no se
  renderiza) en `app/page.tsx` líneas ~1020-1039+, con `alt=""` correcto ya
  puesto por si se reactiva algún día. No requiere acción.

## Tablero de pipeline ficticio (I-05)

- Componente `CRMMockup` en `app/page.tsx` (línea ~748), con datos de ejemplo
  en `INITIAL_STAGES` (línea ~614) y `NEW_LEAD_POOL` (línea ~663).
- El monto total (~$76,700 que aparece en pantalla) **se calcula
  dinámicamente** sumando `numericValue` de los deals iniciales vía
  `sumDeals()` (línea ~676) — no es un texto fijo, pero tampoco está rotulado
  como ejemplo/ilustrativo en ningún lado. Confirma I-05 tal cual.
- Columna "Nuevo Lead" ya fue limitada a 4 tarjetas máx (commit `c32226a`,
  previo a esta sesión) — eso ya no es un pendiente.

## M-01 (correo del pie como enlace) — ya parcialmente resuelto

- El footer de `app/page.tsx` (línea ~3118) y de `app/gracias/page.tsx`
  (línea ~468) **ya** envuelven `hi@monkeia.com` en
  `<a href="mailto:hi@monkeia.com">`.
- Solo falta agregar el query param que sugiere el audit:
  `?subject=Consulta%20desde%20el%20sitio`.

## Otros datos útiles

- `next.config.ts`: solo tiene `turbopack.root`, nada de `redirects()`,
  `images`, ni headers todavía. Punto de partida limpio para C-03.
- Teléfono/WhatsApp de la empresa: `+506 8322 5178` (`wa.me/50683225178`),
  usado en CTAs y en el JSON-LD del layout.
- Modelo usado para generar el borrador de diagnóstico:
  `claude-haiku-4-5-20251001`.

## Estado frente a AUDITORIA.md (resumen)

| Hallazgo | Estado a esta fecha |
|---|---|
| R-01 (secretos) | **Nuevo hallazgo concreto**: 2 webhooks de ActivePieces hardcodeados en el código y en todo el historial. Prioridad máxima. |
| C-01 (form al final) | Pendiente, tal cual lo describe el audit. |
| C-02 (privacidad/consentimiento) | Pendiente, tal cual. Depende de que C-01 tenga el paso final rediseñado. |
| C-03 (redirects + 404) | Pendiente. Sin rutas huérfanas que limpiar, solo falta `redirects()` + `not-found.tsx`. |
| I-01 (títulos únicos) | Pendiente, confirmado que las 3 páginas heredan el mismo metadata. |
| I-03 (copy "2 min"/pasos) | Pendiente, depende del conteo final de pasos tras C-01. |
| I-05 (pipeline ficticio) | Pendiente, decisión de negocio (cifras reales vs. rotular "ejemplo"). |
| I-07 (testimonios incompletos) | Pendiente, depende de datos que el usuario debe pasar. |
| I-08 (alt en imágenes) | **Ya resuelto** para logo y fotos de testimonios con `photoUrl`. Nada pendiente detectado. |
| M-01 (mailto) | **Ya resuelto** el `mailto:`, solo falta el `?subject=`. |
| M-02 (noindex /gracias) | Pendiente. Bloqueado técnicamente por `"use client"` en la page — requiere reestructurar antes de exportar `metadata`. |

## Plan de Fase 1 propuesto (pendiente de aprobación del usuario)

1. **R-01** primero: rotar los 2 webhooks de ActivePieces, moverlos a env vars
   de Vercel (`ACTIVEPIECES_WEBHOOK_URL`, `ACTIVEPIECES_WEBHOOK_URL_B2C`).
   Rama `fix/r-01-webhooks`.
2. **C-03**: `redirects()` + `app/not-found.tsx`. Rama `fix/c-03-redirects-404`.
3. **C-01**: reordenar formulario, `sessionStorage`, progreso honesto. Rama
   `fix/c-01-formulario`. Aplicar en `/diagnostico` y `/diagnostico-b2c`.
4. **C-02**: `/privacidad` + checkbox de consentimiento + condicionar pixel.
   Depende de C-01. Rama `fix/c-02-privacidad`.
5. M-01 (subject en mailto) e I-08 (verificación final) como retoques menores.
6. I-03 al final de Fase 1, con propuesta de copy a aprobar antes de tocar
   nada (depende del conteo final de pasos tras C-01).

No se ha editado ningún archivo de producto todavía — este documento es solo
reconocimiento.
