\# AUDITORIA.md — Encargo para Claude Code



Repo: JPcamareno/monkeia-landing — el sitio monkeia.com.

Stack: Next.js App Router + TypeScript, desplegado en Vercel.

Auditoría del 21 ago 2026. 15 hallazgos: 3 críticos, 8 importantes, 3 menores, 1 de seguridad.



Antes de nada: lee AGENTS.md. Advierte que la versión de Next.js tiene cambios de

ruptura frente a lo que conocen los modelos. Verifica las APIs contra la

documentación en vez de asumirlas.



\## Cómo trabajar

1\. Primero reconoce, después toca. No edites hasta terminar el Paso 0.

2\. Trabaja siempre en una rama, nunca directo en main. Una rama por hallazgo:

&#x20;  fix/c-01-formulario, fix/c-02-privacidad, etc.

3\. Una tarea = un commit. Mensaje en español con el ID: `fix(C-01): ...`

4\. No refactorices de más. Si un arreglo te tienta a reescribir un componente

&#x20;  entero, para y pregunta.

5\. Verifica cada tarea contra su criterio de aceptación. Si no puedes, dilo.

6\. Pregunta cuando la decisión cambie el producto (copy visible, precios, URLs).

&#x20;  No inventes contenido de negocio.

7\. No hagas merge a main. Después de cada tarea, push de la rama y dame el

&#x20;  comando de gh para abrir el PR. Yo apruebo tras revisar el preview de Vercel.

8\. Ninguna clave ni ID va en el código. Esas van en Environment Variables de Vercel.



\## PASO 0 — Reconocimiento (antes de todo)

Recorre el repo y repórtame:

\- Versión exacta de Next.js y React en package.json.

\- Estructura de app/: rutas de /, /diagnostico, /diagnostico-b2c, /gracias.

\- Cómo se declaran los metadatos: `export const metadata` o `generateMetadata`,

&#x20; y qué hereda cada página del layout raíz.

\- El componente del formulario de diagnóstico: estado de pasos, cliente o

&#x20; servidor, y a dónde envía los datos (app/api, webhook, servicio externo).

\- Contenido de next.config.ts y si ya existe algún redirects().

\- Si existe middleware.ts y si existe app/not-found.tsx.

\- Dónde se inyecta el pixel de Meta y con qué mecanismo.

\- Si robots.txt y sitemap.xml son estáticos en public/ o generados

&#x20; (app/robots.ts, app/sitemap.ts).

\- De dónde salen las imágenes de cdn.ln-cdn.com (los testimonios).



Termina con un plan de la Fase 1 y espera mi aprobación antes de escribir código.



\# FASE 1 — Críticos (esta semana)



\## C-01 · Mover la captura de contacto al final del diagnóstico

PROBLEMA: en /diagnostico y /diagnostico-b2c, el paso 1 de 7 pide nombre,

empresa, correo y WhatsApp ANTES de que el visitante responda una sola pregunta.

Se le cobra el peaje antes de darle el viaje. Es la fuga más cara del sitio.



QUÉ HACER:

\- Reordenar: preguntas de diagnóstico primero, contacto como ÚLTIMO paso.

\- Persistir respuestas en sessionStorage mientras avanza, para que un refresco

&#x20; no lo devuelva al inicio.

\- El paso final encabeza con lo que ya se sabe de él, no con un formulario frío.

&#x20; Copy sugerido (ajústalo al tono del sitio):

&#x20; "Listo. Identificamos 2 áreas donde la IA puede darte más retorno.

&#x20;  ¿A dónde te enviamos el diagnóstico?"

\- Indicador de progreso honesto en cada paso ("Pregunta 3 de 6").

\- Mantener el selector de país con +506 por defecto.



ACEPTACIÓN: se llega a la última pregunta sin escribir ningún dato personal. Al

recargar a media ruta, las respuestas siguen ahí. El envío final funciona igual.



\## C-02 · Política de privacidad y consentimiento

PROBLEMA: el sitio captura nombre, correo y WhatsApp, y corre el pixel de Meta

(id 345409495117303). No hay política de privacidad, ni aviso de tratamiento de

datos, ni casilla de consentimiento, ni aviso de cookies. En Costa Rica la Ley

8968 exige consentimiento informado y expreso. Meta exige política de privacidad

accesible en sitios que corren su pixel y capturan prospectos.



QUÉ HACER:

\- Crear /privacidad, legible, cubriendo: responsable (Monkeia, hi@monkeia.com),

&#x20; qué datos se recogen y por qué canal, finalidad, plazo de conservación,

&#x20; terceros con quienes se comparte (PREGÚNTAME cuáles usan), derechos de acceso,

&#x20; rectificación y eliminación y cómo ejercerlos, y uso de cookies.

\- Enlazarla desde el pie y desde el paso final del diagnóstico.

\- Casilla de consentimiento NO premarcada en el paso final:

&#x20; "Autorizo a Monkeia a contactarme y a tratar mis datos según su política de

&#x20;  privacidad."

\- Bloquear el envío si no está marcada.

\- Aviso de cookies que condicione la carga del pixel hasta que haya aceptación.



ACEPTACIÓN: /privacidad responde 200 y está enlazada en todas las páginas. No se

puede enviar el diagnóstico sin consentimiento. El pixel no corre antes de la

aceptación.



NOTA: redacta un borrador completo pero márcalo como pendiente de revisión legal.



\## C-03 · Redirigir las cuatro URL muertas de la marca anterior

PROBLEMA: Google indexa cuatro URL que hoy devuelven 404, con títulos de la etapa

anterior de la marca:

&#x20; /services   → "Estrategias de Chat Marketing para Negocios"

&#x20; /about      → "Chatbots IA - Estrategias y Diseños Personalizados"

&#x20; /monkeiapp  → "Agencia Chatbot IA"

&#x20; /test30     → "New Web Page"

Además el título que Google muestra para la portada es el antiguo

("Automatización con IA para escalar tu negocio"): no ha recrawleado desde el

rediseño.



QUÉ HACER:

\- redirects() en next.config.ts con permanent: true para las cuatro → "/".

&#x20; Si existe ancla de la sección de enfoque, /about puede apuntar ahí.

\- Averiguar si /test30 sigue existiendo como ruta en app/. Si está, elimínala.

\- Revisar app/ completo por otras rutas huérfanas publicadas.

\- Crear app/not-found.tsx con el diseño del sitio y botón al diagnóstico.



ACEPTACIÓN: curl -I sobre las cuatro devuelve 308 o 301 con el location correcto.

Una ruta inexistente muestra la 404 personalizada.



\## I-03 · Alinear la promesa con el flujo real

La portada dice "en 2 minutos" con 5 preguntas; el diagnóstico tiene 7 pasos.

Cuenta los pasos reales tras C-01 y ajusta el copy. Muéstrame la propuesta antes.



\## I-08 · Texto alternativo en imágenes

El logo y las fotos de los testimonios no declaran alt. alt="Monkeia" en el logo;

en los retratos, nombre y empresa ("Rubén Ocampo, Mi Ranking"). Revisa todas las

imágenes. Las decorativas con alt="".



\## M-01 · Correo del pie como enlace

hi@monkeia.com es texto plano. Envolver en

mailto:hi@monkeia.com?subject=Consulta%20desde%20el%20sitio



\## R-01 · El repositorio es público

Cualquiera puede leer el código del embudo y los 60 commits de historial.

\- Recorre el HISTORIAL buscando secretos: claves de API, webhooks, tokens de CRM

&#x20; o correo. Un .env borrado después SIGUE estando en el historial.

\- Confirma que todas las credenciales viven en variables de entorno de Vercel.

\- Repórtame lo que encuentres antes de que yo decida si lo paso a privado.

Si aparece un secreto expuesto, rotar esa credencial es más urgente que todo lo

demás en este archivo.



\# FASE 2 — Medición y SEO (días 8 a 30)



\## I-02 · Analítica y eventos del embudo

Hoy el único rastreo es el pixel de Meta. No se sabe cuántos empiezan el

diagnóstico ni dónde abandonan.

\- Instalar GA4 y verificar el dominio en Search Console.

\- Evento por paso: diagnostico\_paso\_1 ... diagnostico\_paso\_n.

\- Evento diagnostico\_completado en el envío final.

\- Respetar el consentimiento de C-02: nada se dispara antes de la aceptación.

ACEPTACIÓN: en GA4 se ve el embudo paso a paso y la tasa de abandono por pregunta.



\## I-01 · Títulos y descripciones únicos

Las tres páginas declaran el mismo title y la misma descripción porque heredan el

metadata del layout raíz sin sobrescribirlo. Exportar metadata propio en cada

page.tsx. Añadir alternates.canonical por página. Verificar que el layout raíz

defina metadataBase.

DECISIÓN PENDIENTE: si las dos versiones del diagnóstico apuntan al mismo público,

conviene canonicalizar una hacia la otra. Pregúntame antes.



\## I-04 · Datos estructurados (JSON-LD)

No hay ningún marcado. Añadir:

\- Organization: nombre, logo, hi@monkeia.com, WhatsApp +50683225178, Costa Rica.

\- Service: los tres niveles (diagnóstico y consultoría, implementación y

&#x20; optimización, sistema completo).

\- FAQPage: sobre las objeciones que el copy ya resuelve (cómo funciona la

&#x20; garantía de 30 días, qué pasa si ya tengo CRM, cuánto tarda la implementación).

Insertar como <script type="application/ld+json"> con dangerouslySetInnerHTML en

el layout raíz y en cada página. NO uses next/script: debe estar en el HTML del

servidor para que el rastreador lo vea sin ejecutar JavaScript.

ACEPTACIÓN: aparecen en el HTML servido (verificable con curl) y validan en la

prueba de resultados enriquecidos de Google.



\## I-05 · El tablero de pipeline de la portada

Muestra $76,700 y "último lead hace 4 minutos". Es ficticio y no está rotulado.

Para una consultora que vende confianza es un riesgo de credibilidad.

Dos salidas, en orden de preferencia:

1\. Reemplazarlo con cifras reales anonimizadas de un cliente.

2\. Rotularlo "ejemplo ilustrativo" dentro del propio componente.

PREGÚNTAME cuál antes de tocarlo. El componente está bien; solo debe ser honesto.



\## I-07 · Completar los testimonios

El de Rubén Ocampo funciona: nombre, empresa y cifra concreta. Los de Gianpiero

Fusco y Juan Cáceres van sin cargo, sin empresa identificable y sin enlace.

Ampliar la estructura de datos para admitir cargo, empresa, logo y enlace.

Yo te paso los datos que falten.



\## M-02 · /gracias con noindex

Hoy está en Disallow del robots.txt: eso impide el rastreo, pero si alguien la

enlaza, Google puede indexar la URL sin contenido. Exportar

metadata: { robots: { index: false, follow: false } } en la página, y retirar su

Disallow para que el rastreador pueda leer la directiva. Mantén Disallow: /api/.



\## Rendimiento — pendiente de medir

La auditoría no pudo medirlo. Corre Lighthouse contra la portada y /diagnostico

en móvil y repórtame LCP, CLS, TBT y peso total antes de proponer optimizaciones.



\## Vulnerabilidades de npm

8 reportadas (1 baja, 7 altas). NO corras npm audit fix --force. Revísalas una por

una y dime cuáles son reales y cuáles vienen de dependencias de desarrollo que

nunca llegan a producción.



\# FASE 3 — Contenido (días 31 a 90)

El sitemap tiene 3 URL. Competidores locales con contenido indexable en volumen:

automate.cr, thinkler.ai, nexuracr.com, smartizalatam.com, porcontar.com. Todo el

tráfico depende hoy de pauta y referidos.

\- Caso de estudio de Mi Ranking: de 300 a 7,000 jugadores mensuales. La cifra ya

&#x20; está en la portada sin desarrollar; es el mejor material disponible.

\- Cinco a nueve páginas más de intención comercial. No un blog genérico:

&#x20; comparativas de herramientas y costos por industria ("Make vs. n8n para una

&#x20; PYME", "cuánto cuesta automatizar la atención en WhatsApp en Costa Rica").

\- M-03: rangos de inversión por nivel de servicio. Hoy los tres van sin ninguna

&#x20; referencia de precio, y eso llena la agenda de llamadas que no van a cerrar.

Construye la infraestructura (rutas, plantillas, sitemap dinámico). El contenido

lo escribimos juntos.



\# LO QUE NO HAY QUE TOCAR

Esto ya funciona. No lo "mejores":

\- El H1: "Tu empresa no necesita más herramientas. Necesita un sistema que las

&#x20; conecte." Nombra el dolor y separa a Monkeia de la competencia genérica.

\- El proceso de 5 pasos y la garantía de 30 días.

\- El enlace de WhatsApp con mensaje pre-llenado (wa.me/50683225178).

\- Open Graph y Twitter cards: completos, imagen 1200x630, locale es\_CR.

\- "No trabajamos con todos." Filtra e invierte el marco de poder.

\- robots.txt y sitemap.xml: bien formados. Solo actualizarlos con rutas nuevas.

