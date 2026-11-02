# BUG-001 - [Reservas] La página queda en blanco al abrir una habitación

**Estado del reporte:** publicado previamente en Trello; adaptado al estándar de Santex el 2026-11-02. Evidencia del 2026-10-30. No se revalidó el defecto durante esta adaptación.

## Datos generales

- **Título**: [Reservas] La página queda en blanco al abrir una habitación
- **Severidad**: Alta, propuesta. Impide continuar el flujo principal de reserva en las habitaciones observadas; el alcance de usuarios no está medido. Pendiente de validación del responsable.
- **Prioridad**: [FALTA DATO: la define el PO]. El reporte anterior proponía Alta; no hay una decisión del PO acreditada.
- **Ambiente**: Demo pública; [FALTA DATO: clasificación oficial dev/QA/staging/prod] - https://automationintesting.online/
- **Versión**: [FALTA DATO: versión, tag o commit desplegado]. El commit del repositorio de tests no identifica la versión del producto.
- **Navegador / dispositivo**: Chromium vía Playwright MCP; agente de usuario registrado `Chrome/156.0.8078.4`; laptop macOS. [FALTA DATO: versión exacta de macOS].
- **Ticket relacionado**: [BUG-001 en Trello](https://trello.com/c/zYqVZc0p/1-bug-001-reserva-en-blanco-get-api-room-id-responde-500); [plan de pruebas](../../specs/challenge-plan.md), TC-001 y TC-002 obligatorios del challenge.
- **Reportado con**: Otra IA: Claude Code, con Playwright MCP para la exploración original; Codex para esta adaptación documental. No se atribuye este hallazgo a una ejecución de QATES sin evidencia.

## Qué pasó

Un visitante que intentaba reservar una habitación llegaba a una pantalla en blanco y no podía continuar. Se observó al abrir las habitaciones 1 y 2; las consultas de detalle de las habitaciones 1, 2 y 3 devolvieron un error del servidor. Esto impidió ejecutar los dos escenarios obligatorios de reserva del challenge.

## Pasos para reproducir

**Precondiciones**: demo accesible; visitante sin iniciar sesión; esperar a que la home muestre las habitaciones. Los datos corresponden al estado de la demo observado el 2026-10-30; pueden haber cambiado.

1. Abrir https://automationintesting.online/.
2. Ubicar la habitación Double en la sección `Our Rooms`.
3. Pulsar `Book now` para esa habitación (ID 2 en la observación original).
4. Observar la pantalla de reserva y las consultas de detalle en la red y la consola.

**Ruta alternativa observada**: abrir `/reservation/1?checkin=2026-11-20&checkout=2026-11-22` y observar el resultado. Es una reproducción alternativa, no un paso posterior al flujo anterior.

**Resultado esperado**: se muestra la página de la habitación y la interfaz para continuar la reserva, según el flujo descrito en TC-001 del [plan](../../specs/challenge-plan.md). [FALTA DATO: criterio de aceptación técnico del producto para la respuesta de detalle y el manejo de errores].

**Resultado obtenido**: la página de reserva queda en blanco; el registro original informa `document.body.innerText` vacío y ausencia de controles. La API responde HTTP `500`, con el texto `Internal Server Error`. La consola de la habitación 1 contiene estos mensajes, conservados en la evidencia:

```text
[    1753ms] [ERROR] Failed to load resource: the server responded with a status of 500 () @ https://automationintesting.online/api/room/1:0
[    1760ms] Unexpected token 'I', "Internal S"... is not valid JSON
```

**Frecuencia**: se registró el problema en dos momentos de exploración, aproximadamente a las 15:12 y 15:18 UTC del 2026-10-30. [FALTA DATO: total de intentos realizados con un protocolo uniforme]. No se afirma una frecuencia universal ni una tasa de fallo x/N; dos sesiones no equivalen al total de requests.

## Datos de prueba

- **Usuario y rol**: visitante anónimo / invitado; sin credenciales.
- **Valores ingresados**: no se completó ni envió un formulario de reserva. En la ruta alternativa: habitación `1`, `checkin=2026-11-20`, `checkout=2026-11-22`.
- **Registros**: habitación `1` (Single), `2` (Double), `3` (Suite), según el catálogo observado. No son IDs de reservas creadas.
- **De dónde salen los datos**: catálogo compartido de la demo, consultado durante la exploración. Navegación y consulta de detalle registradas mediante Playwright MCP. [FALTA DATO: seed y versión de los datos del servidor]. `e2e/seed.spec.ts` solo abre la home; no crea ni controla esos datos.
- **Contexto**: 2026-10-30, aproximadamente 15:12-15:18 UTC (12:12-12:18 en Mendoza, UTC-3). Textos visibles en inglés. [FALTA DATO: flags activos y zona horaria de la aplicación]. No se accedió a `/admin` ni se crearon reservas.

## Origen

- **Cómo se encontró**: exploración del flujo de reserva mediante Playwright MCP, previa a implementar TC-001 y TC-002; ver [registro de consola](../evidence/reservation-500-console.txt) y sección 1.9 del [plan](../../specs/challenge-plan.md).
- **Capa**: error observado en API y síntoma visible en UI. [FALTA DATO: componente interno que origina el HTTP 500]. No se atribuye a base de datos ni infraestructura.
- **Dónde falla**: `GET /api/room/1`, `GET /api/room/2` y `GET /api/room/3` -> HTTP `500`. Pantallas `/reservation/1` y `/reservation/2` -> contenido en blanco en las observaciones registradas. [FALTA DATO: trace ID de servidor].
- **Desde cuándo**: primera evidencia disponible: 2026-10-30, aproximadamente 15:12 UTC. [FALTA DATO: versión afectada]. Última versión sin el bug: no se sabe. La fecha de detección no demuestra cuándo se introdujo.

## Impacto

- **Qué flujo afecta**: consulta de detalle e inicio de reserva de una habitación como invitado; no se pudo acceder al formulario para comprobar reserva válida ni validación de formulario vacío.
- **A quién afecta**: visitantes anónimos en las habitaciones y navegador observados. [FALTA DATO: alcance en otros roles, navegadores, países y sesiones]. No se generaliza a todos los usuarios.
- **Cuántos**:

  | Medida | Valor observado | Fuente y límite |
  | --- | --- | --- |
  | IDs de habitación con detalle HTTP 500 | 3: `1`, `2`, `3` | Tres endpoints distintos en el extracto `console-2026-10-30T15-18-02-863Z.log`. Son 3 de los 3 IDs consultados en esa comprobación; no una tasa de disponibilidad del servicio. |
  | Habitaciones con pantalla de reserva en blanco | 2: `1`, `2` | Exploración UI documentada en el plan y reporte original. No hay una captura directa de esas pantallas publicada en el repo. |
  | Escenarios obligatorios del challenge bloqueados | 2 de 3: TC-001 y TC-002 | Plan de tres flujos obligatorios; TC-003 es contacto y tiene evidencia independiente. Es impacto en el challenge, no en la población de usuarios. |

  [FALTA DATO: usuarios, intentos de reserva y monto afectados; se necesitan logs o métricas del servidor para medirlos]. No se calcula pérdida económica ni se estima población sin fuente.
- **Alternativa (workaround)**: no se verificó una alternativa para completar la reserva desde el flujo observado. Que la home, el listado y el contacto funcionen no resuelve la reserva. [FALTA DATO: otro canal de reserva habilitado].
- **¿Funcionaba antes?**: No se sabe; no hay una versión anterior verificada.

## Evidencia

- [Extracto de consola conservado en el repositorio](../evidence/reservation-500-console.txt): mensajes HTTP 500 para las habitaciones 1, 2 y 3 y errores de interpretación JSON. Los tiempos entre corchetes son tiempos relativos del registro, no horarios UTC.
- [Plan de pruebas, sección 1.9 y fichas TC-001/TC-002](../../specs/challenge-plan.md): observaciones de navegación, consultas y bloqueo del formulario. Es un documento de observaciones; no sustituye un HAR.
- [Ticket original en Trello](https://trello.com/c/zYqVZc0p/1-bug-001-reserva-en-blanco-get-api-room-id-responde-500): conserva el reporte anterior. Esta adaptación se entrega en el repo; no se actualizó automáticamente la descripción de Trello.
- Archivos originales locales: `.playwright-mcp/console-2026-10-30T15-12-49-241Z.log`, `console-2026-10-30T15-13-14-447Z.log`, `console-2026-10-30T15-18-02-863Z.log`; snapshots `page-2026-10-30T15-12-50-744Z.yml` y `page-2026-10-30T15-13-17-994Z.yml`. Esa carpeta está excluida de Git: estos originales no se presentan como adjuntos accesibles al evaluador.
- [FALTA DATO: request/response HTTP completos con headers, captura directa de la pantalla en blanco y logs del backend]. No hay HAR disponible en el repositorio.

## Fuente del error (Nivel 2)

- **Archivo y clase**: [FALTA DATO: no se inspeccionó el código correspondiente al despliegue afectado]. Los archivos de nuestros tests no son la fuente del error del producto.
- **Commit o PR que lo introdujo**: [FALTA DATO: no se identificó el cambio causante ni una versión anterior sana].
- **Cómo lo encontraste**: se contrastaron navegación, consola y consultas de detalle con el listado de habitaciones. No se dispone de una investigación de `git log`, `git blame` ni trazas internas del servidor. El archivo, la clase y el cambio siguen pendientes.
- **Causa**: hipótesis: la pantalla no maneja adecuadamente una respuesta de detalle no JSON y queda sin contenido; se apoya en el HTTP 500 y el error de interpretación registrado en la misma exploración. No explica por qué el backend devuelve 500 y no fue confirmada mediante código.
- **Certeza**: Hipótesis para el mecanismo interno. Confirmados en la evidencia: respuestas HTTP 500 y errores de interpretación; la causa raíz no está determinada.

**Este reporte no acredita el entregable de Nivel 2: faltan archivo, clase y cambio identificados.**

## Solución propuesta (Nivel 3, opcional)

- **Cambio propuesto**: [FALTA DATO: diagnóstico de código necesario para proponer el arreglo mínimo del 500]. Como línea de investigación, revisar el manejo de errores de carga de detalle y evitar la pantalla vacía. No se implementó un fix.
- **Test que lo cubre**: TC-001 y TC-002 diseñados en el plan, todavía bloqueados y no implementados como pruebas de reserva. Un futuro test debe comprobar que el detalle y formulario aparecen antes de continuar; probar el manejo de un error es otro escenario y no reemplaza el flujo exitoso.
- **Riesgo**: [FALTA DATO: componentes y dependencias afectados por un eventual fix]. Deben revisarse detalle, disponibilidad y creación de reserva con datos controlados; sin aprobar un cambio no puede declararse riesgo cerrado.

## Estado de entrega

Reporte histórico adaptado a la plantilla con mediciones acotadas y faltantes explícitos. Se puede entregar como archivo Markdown para revisión junto con su evidencia; la aceptación de ese canal y de los faltantes corresponde al referente del programa. No se presenta como aprobado, completo en Nivel 2 ni reproducido nuevamente el 2026-11-02.
