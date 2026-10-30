# BUG-001 — La página de reserva queda en blanco: `GET /api/room/{id}` responde 500

**Estado:** Publicado en Trello; abierto, pendiente de corrección y revalidación
**Ticket Trello:** https://trello.com/c/zYqVZc0p/1-bug-001-reserva-en-blanco-get-api-room-id-responde-500
**Severidad propuesta:** Alta (bloquea el flujo de reserva completo)
**Prioridad propuesta:** Alta (bloquea TC-001, TC-002 y TC-004 del challenge)
**Reportado:** 2026-10-30, durante exploración de solo lectura

## Ambiente
- URL: https://automationintesting.online/ (demo pública Shady Meadows B&B / restful-booker-platform)
- Navegador: Chromium vía Playwright MCP (`playwright-test`), UA `Chrome/156.0.8078.4`
- Seed: `e2e/seed.spec.ts` (solo `page.goto` a la home)
- Usuario: invitado, sin login
- Fechas de observación: 2026-10-30 ~15:12 UTC y nueva verificación 15:18 UTC

## Pasos para reproducir
1. Abrir https://automationintesting.online/ y esperar a que se muestren las habitaciones.
2. En "Our Rooms", hacer clic en "Book now" de cualquier habitación (observado con Double, room 2).
3. Alternativa: navegar directo a `/reservation/1?checkin=2026-11-20&checkout=2026-11-22`.

## Resultado esperado
Se muestra la página de reserva de la habitación elegida, con su detalle, el calendario y la posibilidad de iniciar la reserva.

## Resultado observado
- La página `/reservation/{id}` queda completamente en blanco (`document.body.innerText` vacío, sin botones).
- `GET /api/room/{id}` responde **500** con el cuerpo de texto `Internal Server Error`.
- La consola muestra:
  - `Failed to load resource: the server responded with a status of 500 () @ https://automationintesting.online/api/room/1`
  - `Unexpected token 'I', "Internal S"... is not valid JSON`
- La UI no muestra ningún mensaje de error al usuario.

## Endpoints afectados
| Endpoint | Estado observado |
|---|---|
| `GET /api/room/1` | 500 |
| `GET /api/room/2` | 500 |
| `GET /api/room/3` | 500 (verificado con fetch desde la home a las 15:18 UTC) |

Endpoints que funcionaron en la misma sesión, como contraste:
| Endpoint | Estado |
|---|---|
| `GET /api/branding` | 200 |
| `GET /api/room` (lista, incluye roomid 1, 2 y 3) | 200 |
| `GET /api/room?checkin=2026-10-30&checkout=2026-10-31` | 200 |

## Impacto
- El flujo de reserva no pudo continuar en las habitaciones 1 y 2 observadas en la UI; las consultas de detalle de las habitaciones 1, 2 y 3 respondieron 500.
- Bloquea los casos TC-001 (reserva exitosa) y TC-002 (reserva con formulario vacío), ambos obligatorios del challenge, además de TC-004 a TC-011 y TC-016.
- El frontend no maneja el error: pantalla en blanco sin feedback (observación secundaria, posible ticket aparte).

## Causa raíz
No determinada. Solo se observó el 500 y el texto `Internal Server Error`. Tampoco se sabe si es un problema persistente o transitorio de la demo pública (por ejemplo, un reset de datos); se reprodujo dos veces con ~6 minutos de diferencia.

## Evidencias disponibles
- Extracto de consola conservado en el proyecto: `docs/evidence/reservation-500-console.txt`.
- `.playwright-mcp/console-2026-10-30T15-12-49-241Z.log`: 500 en `/api/room/1` y error de parseo JSON
- `.playwright-mcp/console-2026-10-30T15-13-14-447Z.log`: errores al abrir room 2 desde "Book now"
- `.playwright-mcp/console-2026-10-30T15-18-02-863Z.log`: nueva verificación (rooms 1-3)
- `.playwright-mcp/page-2026-10-30T15-12-50-744Z.yml` y `page-2026-10-30T15-13-17-994Z.yml`: snapshots de la página de reserva en blanco
- Lista de requests de red de la sesión (sección 1.9 de `specs/challenge-plan.md`)
- No hay captura directa de la página en blanco ni HAR. No se adjuntan archivos inexistentes. Los logs y snapshots disponibles permiten registrar el defecto con esta limitación.

## Seguimiento
- Publicado en Trello el 2026-10-30: https://trello.com/c/zYqVZc0p/1-bug-001-reserva-en-blanco-get-api-room-id-responde-500. Estado abierto. La causa raíz sigue sin determinarse.
- Revalidar más adelante para comprobar si persiste; no se volvió a navegar durante esta preparación.
- Captura y HAR pueden complementar el reporte; no son condición para registrarlo.
