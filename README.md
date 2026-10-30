# Challenge final — Playwright · Shady Meadows B&B

Proyecto de Diego Girotti para el challenge de QA. La consigna original menciona Cypress; esta entrega utiliza Playwright y TypeScript según la adaptación indicada.

Aplicación: https://automationintesting.online/

## Estado real de la entrega

Actualizado el 30/10/2026. **La entrega es parcial.**

| Caso obligatorio | Estado | Evidencia |
| --- | --- | --- |
| TC-001 — Reserva exitosa como invitado | Blocked | Página de reserva en blanco; consultas de detalle responden 500 |
| TC-002 — Reserva con formulario vacío | Blocked | El mismo impedimento evita acceder al formulario |
| TC-003 — Contacto válido | OK | Ejecución informada: `1 passed (5.2s)`; última ejecución guardada: passed |

Hay 16 casos diseñados: 1 OK, 2 Blocked y 13 sin ejecutar. El test seed solo comprueba navegación inicial; no cuenta como uno de los tres casos obligatorios.

## Documentación

- [Plan de pruebas y supuestos pendientes](specs/challenge-plan.md)
- [Planilla Excel con los 16 casos](docs/casos-prueba-challenge.xlsx)
- [BUG-001: reserva en blanco y respuesta 500](docs/bugs/reservation-page-500.md)
- [Evidencia exploratoria de contacto](docs/evidence/tc-003-contact-submission-2026-10-30.md)
- [Captura de confirmación de contacto](docs/evidence/tc-003-contact-confirmation-2026-10-30.png)

**Trello:** [Tablero del challenge](https://trello.com/b/TQskTxT5/challenge-qa-shady-meadows-playwright) · [BUG-001](https://trello.com/c/zYqVZc0p/1-bug-001-reserva-en-blanco-get-api-room-id-responde-500). El tablero se creó privado; el acceso del evaluador todavía debe resolverse.

**Repositorio público:** https://github.com/diegogirotti-jpg/challenge-playwright-booker

## Descargar y preparar el proyecto

Requisitos: Node.js 24, npm, Git y acceso a Internet. Abrir una terminal dentro de esta carpeta, donde está `package.json`.

```bash
git clone https://github.com/diegogirotti-jpg/challenge-playwright-booker.git
cd challenge-playwright-booker
node --version
npm --version
npm ci
npx playwright install chromium
```

En Linux o GitHub Actions, instalar también las dependencias del navegador:

```bash
npx playwright install --with-deps chromium
```

`npm ci` instala las versiones registradas en `package-lock.json`. Chromium es el navegador configurado para este challenge.

## Revisar sin enviar datos

Estos comandos verifican tipos y muestran las pruebas detectadas. No ejecutan los escenarios ni envían mensajes.

```bash
npx tsc --noEmit
npx playwright test --list --project=chromium
```

## Ejecutar el caso de contacto

**Cada ejecución de TC-003 envía un mensaje real a la demo pública.** Usa datos ficticios identificados con `[AUTOTEST]`. Ejecutarlo solo cuando se necesite verificar ese envío; no habilitar ejecuciones repetidas automáticas sin contemplar este efecto.

```bash
npx playwright test e2e/myTestRestfulBooker.spec.ts --project=chromium --workers=1 --retries=0
```

Para observar el navegador, agregar `--headed`. Para abrir el último reporte:

```bash
npx playwright show-report
```

El caso comprueba valores de los campos, respuesta HTTP 200, cuerpo `{ "success": true }`, datos enviados, confirmación con el nombre y asunto, y desaparición del formulario. No se simula la respuesta del backend en este caso.

## Organización

```text
e2e/myTestRestfulBooker.spec.ts  Caso obligatorio TC-003
e2e/pages/ContactPage.ts        Localizadores y acciones del formulario
e2e/seed.spec.ts               Navegación inicial para exploración
specs/challenge-plan.md        Diseño y estado de 16 casos
docs/                         Planilla, bug y evidencia disponible
playwright.config.ts          Chromium, un worker, cero reintentos
```

TC-001 y TC-002 no tienen pruebas vacías ni se cuentan como aprobados. Su automatización queda pendiente hasta poder observar el formulario y confirmar sus reglas.

## Decisiones y límites

- Las reglas de longitud, fechas y validaciones que no pudieron observarse están identificadas como pendientes. No se inventan mensajes exactos.
- No se crearon reservas ni se accedió al panel administrativo.
- La causa raíz del 500 no está determinada; la evidencia corresponde al momento registrado, no garantiza que la demo siga fallando hoy.
- La ausencia de un POST o de una confirmación es evidencia indirecta; por sí sola no demuestra que no exista un registro en el servidor.
- El diseño asistido utilizó QATES y Playwright Agents en Claude Code. Los resultados de exploración y ejecución se distinguen de los casos solo diseñados.
- No se incluyen secretos, estado de autenticación, dependencias instaladas ni reportes temporales en el repositorio.

## Pendientes de entrega

1. Resolver el acceso del evaluador al tablero de Trello; BUG-001 ya está publicado y enlazado.
2. Compartir el enlace del repositorio público y de los casos con el evaluador.
3. Confirmar integrantes y correos que deben figurar en la entrega. Autor conocido: Diego Girotti.
4. Revalidar el bloqueo de reserva y completar TC-001/TC-002 cuando el entorno permita observar y ejecutar sus flujos.

El resultado de Toolshop pertenece a otro proyecto y no acredita los escenarios de este challenge.
