# Plan de pruebas - Shady Meadows B&B

**Estado:** Entrega parcial: 16 casos diseñados; TC-003 OK; TC-001 y TC-002 Blocked; 13 sin ejecutar.
**Fecha:** 2026-10-30
**Aplicación:** https://automationintesting.online/
**Proyecto:** /Users/diegogirotti/Desktop/challenge-playwright-booker (seed: `e2e/seed.spec.ts`, solo hace `page.goto` a la home)
**Fuentes:** análisis previo de qa-analyst (HTML inicial de la SPA), requerimiento del challenge y exploración de solo lectura en navegador (2026-10-30, Playwright MCP `playwright-test`, seed `e2e/seed.spec.ts`). Ver sección 1.9. Se realizó un envío exploratorio de contacto autorizado y luego Diego informó la ejecución automatizada de TC-003: 1 passed (5.2s). No se confirmaron reservas ni se accedió a `/admin`. Las observaciones de solo lectura de la sección 1.9 conservan su contexto histórico.

---

## 1. Resumen del análisis

### 1.1 Alcance
1. Reserva exitosa como invitado: habitación disponible, datos válidos, confirmación.
2. Reserva con formulario vacío: mensajes de validación y verificación de que no se creó la reserva.
3. Contacto válido: envío y confirmación.

### 1.2 Fuera de alcance
- Panel `/admin`.
- Escritura directa vía API.
- Performance y seguridad.

### 1.3 Módulos
- **Reserva (Booking):** selección de habitación/fechas y formulario de datos del huésped.
- **Contacto (Contact):** formulario de contacto de la home.

### 1.4 Observado vs. pendiente
| Observado | PENDIENTE DE CONFIRMAR |
|---|---|
| App SPA de Next.js | Campos de cada formulario, obligatoriedad y formatos |
| HTML inicial solo muestra un spinner (`.spinner-border` dentro de `#root-container`) | Límites de longitud, rangos de fechas, mínimo/máximo de noches |
| `<title>`: "Restful-booker-platform demo" | Reglas de disponibilidad |
| | Textos de confirmación y de error |
| | Si la validación es nativa HTML5 o custom |
| | Selectores y roles reales |

Ningún campo, botón, mensaje, límite, regla ni texto fue observado. Todo lo que figura abajo como esperado es una hipótesis a validar.

### 1.5 Supuestos
- S-1: la reserva y el contacto están disponibles para un invitado sin login.
- S-2: existe al menos una habitación disponible para fechas futuras.
- S-3: la app muestra algún tipo de confirmación observable tras una reserva o un contacto exitosos.
- S-4: se puede escribir en la demo pública con datos sintéticos (depende de A-003).
- S-5: los casos de borde no asumen valores; los límites se definen tras la exploración.

### 1.6 Matriz de riesgos
| ID | Riesgo | Prob. | Impacto | Mitigación |
|---|---|---|---|---|
| R-1 | Demo pública compartida: colisiones de disponibilidad entre corridas/usuarios | Alta | Alto | Fechas dinámicas y únicas; reintento controlado; evaluar instancia propia |
| R-2 | Basura generada por los tests en datos compartidos | Alta | Medio | Prefijo `[AUTOTEST]`, datos sintéticos, sin PII real |
| R-3 | Flakiness por render del SPA (spinner inicial) | Alta | Alto | Esperas por estado visible/web-first assertions, nunca `sleep` |
| R-4 | No se puede verificar "no se creó reserva" sin admin | Media | Alto | Evidencia indirecta (ver 1.8); requiere A-002 |
| R-5 | El contacto envía mensajes reales | Media | Medio | Mock con `route.fulfill` o aceptar envío real (decisión pendiente) |
| R-6 | Validación nativa vs. custom cambia la estrategia de aserción | Media | Medio | Confirmar en exploración (A-006) |

### 1.7 Preguntas abiertas / ambigüedades bloqueantes
| ID | Pregunta |
|---|---|
| A-001 | Campos, formatos y límites de los formularios de reserva y contacto |
| A-002 | ¿Se acepta como evidencia de "reserva no creada" la ausencia de POST + ausencia de confirmación + formulario con errores? |
| A-003 | ¿Hay permiso para escribir en la demo pública o se usa una instancia propia? |
| A-004 | Reglas de disponibilidad y rango de fechas permitido |
| A-005 | Texto/elemento de confirmación de reserva y de contacto |
| A-006 | ¿La validación es nativa HTML5 o custom? |

### 1.8 Estrategia de automatización y datos
- **Herramienta:** Playwright (TypeScript). Un spec por módulo; el seed se mantiene como base de navegación.
- **Siguiente paso:** exploración en solo lectura con Playwright MCP para cerrar A-001 a A-006 y validar selectores antes de escribir specs.
- **Sincronización:** esperar a que desaparezca el spinner / aparezca el contenido; assertions con auto-wait.
- **Verificación de "no creada" sin admin:** `page.on('request')` / `page.waitForRequest` para comprobar que NO hubo POST de booking; que no se muestra la confirmación; que el formulario sigue visible con errores.
- **Datos:** sintéticos, únicos por corrida: nombre `QA-<timestamp>`, email `qa+<ts>@example.com`, mensaje con prefijo `[AUTOTEST]`, fechas futuras calculadas dinámicamente. Cada caso independiente (sin estado compartido).
- **Contacto:** mockear con `page.route(...).fulfill(...)` o aceptar envío real (decisión pendiente, ver P-6).
- **Validación:** si es nativa, usar `validationMessage`/`:invalid`; si es custom, assertions sobre el DOM. No hardcodear mensajes hasta confirmarlos.

### 1.9 Hallazgos verificados en navegador (2026-10-30, solo lectura)

**Home (`/`)**
- Render: el HTML inicial muestra spinner; el contenido aparece tras ~1-3 s (llamadas `GET /api/branding` y `GET /api/room`). Confirma R-3.
- Navegación: Rooms `/#rooms`, Booking `/#booking`, Amenities, Location, Contact `/#contact`, Admin `/admin` (no visitado).
- Encabezados: H1 "Welcome to Shady Meadows B&B", H3 "Check Availability & Book Your Stay", H2 "Our Rooms", H3 "Send Us a Message".

**Consulta de disponibilidad (sección `#booking`)**
| Control | Detalle verificado |
|---|---|
| Check In | `input[type=text]` con label "Check In" (`for=checkin`, el input no tiene ese id); react-datepicker; valor por defecto = hoy (`30/10/2026`), formato `DD/MM/YYYY`; no es readonly |
| Check Out | Igual; valor por defecto = mañana (`31/10/2026`) |
| Check Availability | `button[type=button]`; dispara `GET /api/room?checkin=YYYY-MM-DD&checkout=YYYY-MM-DD` (200) |
- El calendario abierto (octubre 2026) no tiene días deshabilitados (`aria-disabled` = 0): los días pasados no se bloquean visualmente en el selector. Regla de rechazo de fechas pasadas/invertidas sigue PENDIENTE (TC-006/TC-007).

**Habitaciones (`GET /api/room`)**
| roomid | Tipo | Nombre | Precio | Features |
|---|---|---|---|---|
| 1 | Single | 101 | £100/noche | TV, WiFi, Safe |
| 2 | Double | 102 | £150/noche | TV, Radio, Safe |
| 3 | Suite | — | £225/noche | Radio, WiFi, Safe |
- Cada tarjeta tiene "Book now" → `/reservation/{roomid}?checkin=YYYY-MM-DD&checkout=YYYY-MM-DD` (fechas tomadas del widget).

**Página de reserva (`/reservation/{id}`) — BLOQUEADA en la exploración**
- Abierta para room 1 (fechas 2026-11-20 → 2026-11-22) y room 2 (desde "Book now" en la home): la página queda en blanco. `GET /api/room/1` y `GET /api/room/2` responden **500** ("Internal Server Error"), y la consola muestra error de parseo JSON.
- Por lo tanto **no se pudo observar** el calendario de la reserva, el botón "Reserve Now", ni los campos del formulario de huésped. Todo TC de reserva sigue con campos PENDIENTE (P-1, P-9). Reintentar; si persiste, reportar como defecto del entorno (bloquea TC-001/TC-002).

**Formulario de contacto (`#contact`, "Send Us a Message")**
| Label | Control | id | Atributos HTML5 |
|---|---|---|---|
| Name | `input[type=text]` | `name` | sin `required`, sin min/maxlength, sin pattern |
| Email | `input[type=email]` | `email` | ídem |
| Phone | `input[type=tel]` | `phone` | ídem |
| Subject | `input[type=text]` | `subject` | ídem |
| Message | `textarea` | `description` | ídem |
| Submit | `button[type=button]` | — | — |
- El label "Message" apunta a `for=message` pero el textarea tiene `id=description`: `getByLabel('Message')` no lo resolverá; usar `#description`. Posible hallazgo de accesibilidad (pendiente de registrar).
- Al no haber `required` y ser el botón `type=button`, la validación **no es nativa HTML5** del form; se infiere validación custom/servidor. Mensajes, obligatoriedad y longitudes siguen PENDIENTES (requieren enviar el formulario).

**Endpoints observados:** `GET /api/branding`, `GET /api/room`, `GET /api/room?checkin&checkout`, `GET /api/room/{id}` (500). Endpoints de creación de booking y de contacto: no observados (requieren envío).

---

## 2. Tabla resumen

| ID | Módulo | Descripción | Clasificación | Obligatorio | Automatización prevista (salvo TC-003) |
|---|---|---|---|---|---|
| TC-001 | Reserva | Reserva exitosa como invitado con datos válidos | Positivo | Sí (flujo 1) | Sí |
| TC-002 | Reserva | Reserva con formulario vacío muestra validaciones | Negativo | Sí (flujo 2) | Sí |
| TC-003 | Contacto | Contacto válido con envío y confirmación | Positivo | Sí (flujo 3) | Implementada y ejecutada OK |
| TC-004 | Reserva | Formulario vacío no genera POST de booking ni reserva | Negativo | No | Sí |
| TC-005 | Reserva | Email con formato inválido | Negativo | No | Sí |
| TC-006 | Reserva | Fecha de salida anterior a la de entrada | Negativo | No | Sí |
| TC-007 | Reserva | Fecha de entrada en el pasado / fuera de rango | Borde | No | Sí |
| TC-008 | Reserva | Estadía de duración mínima (límite) | Borde | No | Parcial |
| TC-009 | Reserva | Longitud mínima y máxima de nombre/apellido | Borde | No | Sí |
| TC-010 | Reserva | Longitud y formato límite del teléfono | Borde | No | Sí |
| TC-011 | Reserva | Fechas ya reservadas / habitación no disponible | Negativo | No | Parcial |
| TC-012 | Contacto | Formulario de contacto vacío | Negativo | No | Sí |
| TC-013 | Contacto | Contacto con email inválido | Negativo | No | Sí |
| TC-014 | Contacto | Longitud mínima y máxima del mensaje/asunto | Borde | No | Sí |
| TC-015 | Contacto | Contacto válido con respuesta mockeada | Positivo | No | Sí |
| TC-016 | Reserva | Caracteres especiales y espacios en nombre | Borde | No | Sí |

Totales: 3 Positivo, 7 Negativo, 6 Borde = 16 casos (3 obligatorios).

---

## 3. Fichas de casos

Convenciones: Ejecutado S solo para una ejecución completa informada; N también en los bloqueados. Estado Blocked identifica TC-001 y TC-002. TC-003 está OK; los otros 13 permanecen Sin ejecutar. Las reglas pendientes requieren confirmación.

### TC-001 - Reserva exitosa como invitado (OBLIGATORIO)
- **Módulo:** Reserva
- **Descripción:** Un invitado reserva una habitación disponible con datos válidos y recibe confirmación.
- **Clasificación:** Positivo
- **Precondiciones:** Demo accesible; existe habitación disponible en fechas futuras (A-004); permiso de escritura (A-003); spinner inicial resuelto.
- **Datos:** Nombre `QA-<timestamp>`; apellido sintético; email `qa+<ts>@example.com`; teléfono válido (formato PENDIENTE DE CONFIRMAR); fechas futuras dinámicas dentro del rango permitido (PENDIENTE DE CONFIRMAR).
- **Pasos:** 1. Abrir la home y esperar el render del SPA. 2. Seleccionar fechas futuras disponibles. 3. Elegir una habitación disponible e iniciar la reserva. 4. Completar el formulario con datos válidos. 5. Enviar la reserva.
- **Resultado esperado:** Se envía la reserva y se muestra una confirmación (texto PENDIENTE DE CONFIRMAR, A-005). No aparecen errores de validación.
- **Resultado obtenido:** No se pudo iniciar el flujo: página de reserva en blanco. GET /api/room/{id} respondió 500 durante la exploración. No se ejecutó el escenario completo.
- **Ejecutado:** N
- **Estado:** Blocked
- **Observaciones:** BLOQUEADO por la página de reserva en blanco (`GET /api/room/{id}` → 500, ver `docs/bugs/reservation-page-500.md`). Riesgos R-1 y R-2. Genera dato real en la demo; usar `[AUTOTEST]` si hay campo libre.
- **Ticket Trello:** https://trello.com/c/zYqVZc0p/1-bug-001-reserva-en-blanco-get-api-room-id-responde-500
- **Automatización prevista:** Sí. `e2e/booking.spec.ts`; fechas dinámicas; interceptar la respuesta del POST de booking como evidencia adicional.

### TC-002 - Reserva con formulario vacío (OBLIGATORIO)
- **Módulo:** Reserva
- **Descripción:** Enviar el formulario de reserva sin datos muestra validaciones y no crea la reserva.
- **Clasificación:** Negativo
- **Precondiciones:** Haber llegado al formulario de datos del huésped (A-001); validación nativa o custom definida (A-006).
- **Datos:** Todos los campos vacíos.
- **Pasos:** 1. Abrir la home y seleccionar habitación/fechas hasta ver el formulario. 2. No completar ningún campo. 3. Enviar el formulario. 4. Observar mensajes de validación.
- **Resultado esperado:** Se indican los campos obligatorios con mensajes (texto PENDIENTE DE CONFIRMAR). No se muestra confirmación. El formulario sigue visible con errores. No se emite POST de booking (ver TC-004).
- **Resultado obtenido:** No se pudo iniciar el flujo: página de reserva en blanco. GET /api/room/{id} respondió 500 durante la exploración. No se ejecutó el escenario completo.
- **Ejecutado:** N
- **Estado:** Blocked
- **Observaciones:** BLOQUEADO por la página de reserva en blanco (ver `docs/bugs/reservation-page-500.md`). Depende de A-002 y A-006. No se afirman mensajes exactos.
- **Ticket Trello:** https://trello.com/c/zYqVZc0p/1-bug-001-reserva-en-blanco-get-api-room-id-responde-500
- **Automatización prevista:** Sí. `e2e/booking-validation.spec.ts`; aserción según tipo de validación (nativa: `validationMessage`; custom: DOM).

### TC-003 - Contacto válido (OBLIGATORIO)
- **Módulo:** Contacto
- **Descripción:** Enviar el formulario de contacto con datos válidos y ver la confirmación.
- **Clasificación:** Positivo
- **Precondiciones:** Home cargada; formulario visible. Envío real autorizado para la ejecución informada.
- **Datos:** Nombre `QA-<timestamp>`; email `qa+<ts>@example.com`; teléfono válido (formato PENDIENTE); asunto y mensaje con prefijo `[AUTOTEST]` (longitudes PENDIENTE DE CONFIRMAR).
- **Pasos:** 1. Abrir la home y esperar el render. 2. Ubicar el formulario de contacto. 3. Completar todos los campos con datos válidos. 4. Enviar.
- **Resultado esperado:** POST /api/message responde 200 con {"success":true}; payload coincide con los campos; aparece "Thanks for getting in touch <name>!", el asunto y los textos de confirmación; formulario oculto.
- **Resultado obtenido:** Ejecución informada por Diego: 1 passed (5.2s). test-results/.last-run.json: passed, sin failedTests. El test verifica API, payload y confirmación visible.
- **Ejecutado:** S
- **Estado:** OK
- **Observaciones:** Cada nueva ejecución envía otro mensaje real a la demo. Evidencia exploratoria previa: docs/evidence/tc-003-contact-submission-2026-10-30.md. El resultado 5.2s proviene de la salida compartida por Diego.
- **Ticket Trello:** No aplica; no se reportó defecto en este caso.
- **Automatización prevista:** Implementada en e2e/myTestRestfulBooker.spec.ts y e2e/pages/ContactPage.ts. Ejecutada con resultado OK.

### TC-004 - Formulario vacío no genera POST ni reserva
- **Módulo:** Reserva
- **Descripción:** Verificar que el envío vacío no produce ninguna petición de creación de reserva.
- **Clasificación:** Negativo
- **Precondiciones:** Formulario de reserva visible; listener de requests activo antes de enviar.
- **Datos:** Campos vacíos.
- **Pasos:** 1. Registrar `page.on('request')` filtrando POST de booking (URL PENDIENTE DE CONFIRMAR). 2. Enviar el formulario vacío. 3. Esperar un tiempo acotado o un estado estable. 4. Revisar requests registrados y la UI.
- **Resultado esperado:** No hubo POST de booking; no hay confirmación; el formulario sigue con errores.
- **Resultado obtenido:** No ejecutado; no hay resultado de este caso.
- **Ejecutado:** N
- **Estado:** Sin ejecutar
- **Observaciones:** Evidencia indirecta (R-4); requiere aceptación A-002. Por qué: sin admin no se puede consultar la reserva. Caso planificado; las reglas pendientes son supuestos por confirmar, no comportamientos observados.
- **Ticket Trello:** pendiente
- **Automatización prevista:** Sí. Mismo spec que TC-002 o `booking-validation.spec.ts`; `page.on('request')` con contador.

### TC-005 - Email con formato inválido en reserva
- **Módulo:** Reserva
- **Descripción:** Un email mal formado es rechazado.
- **Clasificación:** Negativo
- **Precondiciones:** Formulario visible; resto de campos válidos.
- **Datos:** Email `qa-sin-arroba.example.com`; resto válido sintético.
- **Pasos:** 1. Completar campos válidos. 2. Ingresar email inválido. 3. Enviar.
- **Resultado esperado:** Se rechaza con indicación en el campo email (texto PENDIENTE DE CONFIRMAR). No se muestra confirmación ni se crea reserva.
- **Resultado obtenido:** No ejecutado; no hay resultado de este caso.
- **Ejecutado:** N
- **Estado:** Sin ejecutar
- **Observaciones:** Reglas de formato PENDIENTE DE CONFIRMAR (A-001). Caso planificado; las reglas pendientes son supuestos por confirmar, no comportamientos observados.
- **Ticket Trello:** pendiente
- **Automatización prevista:** Sí. `e2e/booking-validation.spec.ts`; data-driven con otros emails inválidos una vez confirmadas las reglas.

### TC-006 - Fecha de salida anterior a la de entrada
- **Módulo:** Reserva
- **Descripción:** Un rango de fechas invertido no permite reservar.
- **Clasificación:** Negativo
- **Precondiciones:** Selector de fechas disponible.
- **Datos:** Entrada: hoy + N días; salida: anterior a la entrada (N dinámico).
- **Pasos:** 1. Seleccionar entrada. 2. Intentar seleccionar salida anterior. 3. Intentar continuar.
- **Resultado esperado:** El selector lo impide o muestra error (comportamiento PENDIENTE DE CONFIRMAR). No se crea reserva.
- **Resultado obtenido:** No ejecutado; no hay resultado de este caso.
- **Ejecutado:** N
- **Estado:** Sin ejecutar
- **Observaciones:** El control puede impedir la selección en lugar de mostrar mensaje (A-004). Caso planificado; las reglas pendientes son supuestos por confirmar, no comportamientos observados.
- **Ticket Trello:** pendiente
- **Automatización prevista:** Sí. `e2e/booking-dates.spec.ts`; depende del tipo de calendario.

### TC-007 - Fecha de entrada pasada o fuera de rango
- **Módulo:** Reserva
- **Descripción:** Comportamiento al intentar fechas pasadas o más allá del rango permitido.
- **Clasificación:** Borde
- **Precondiciones:** Rango permitido conocido (A-004).
- **Datos:** Ayer; hoy; último día permitido; día siguiente al último permitido. Límite PENDIENTE DE CONFIRMAR.
- **Pasos:** 1. Intentar seleccionar cada fecha. 2. Observar si queda seleccionable o se rechaza.
- **Resultado esperado:** Las fechas fuera del rango se rechazan o deshabilitan; las dentro se aceptan (límite PENDIENTE DE CONFIRMAR).
- **Resultado obtenido:** No ejecutado; no hay resultado de este caso.
- **Ejecutado:** N
- **Estado:** Sin ejecutar
- **Observaciones:** No inventar el límite; calcularlo tras la exploración. Caso planificado; las reglas pendientes son supuestos por confirmar, no comportamientos observados.
- **Ticket Trello:** pendiente
- **Automatización prevista:** Sí. `e2e/booking-dates.spec.ts`; fechas relativas a `new Date()`.

### TC-008 - Estadía de duración mínima
- **Módulo:** Reserva
- **Descripción:** Reserva con la menor estadía posible (límite).
- **Clasificación:** Borde
- **Precondiciones:** Mínimo de noches conocido (A-004); habitación disponible.
- **Datos:** Entrada y salida con la duración mínima (PENDIENTE DE CONFIRMAR); y una unidad menos si es posible.
- **Pasos:** 1. Seleccionar el rango mínimo. 2. Completar datos válidos. 3. Enviar. 4. Repetir con rango menor al mínimo.
- **Resultado esperado:** El mínimo se acepta; menos del mínimo se rechaza (límite PENDIENTE DE CONFIRMAR).
- **Resultado obtenido:** No ejecutado; no hay resultado de este caso.
- **Ejecutado:** N
- **Estado:** Sin ejecutar
- **Observaciones:** Crea reserva real en la parte aceptada (R-2). Caso planificado; las reglas pendientes son supuestos por confirmar, no comportamientos observados.
- **Ticket Trello:** pendiente
- **Automatización prevista:** Parcial. Parte de rechazo automatizable; parte de creación según A-003.

### TC-009 - Longitud mínima y máxima de nombre/apellido
- **Módulo:** Reserva
- **Descripción:** Validación en los límites de longitud de nombre y apellido.
- **Clasificación:** Borde
- **Precondiciones:** Límites conocidos (A-001).
- **Datos:** 0, mínimo, mínimo-1, máximo, máximo+1 caracteres (límites PENDIENTE DE CONFIRMAR), generados con `'a'.repeat(n)`.
- **Pasos:** 1. Completar el resto válido. 2. Ingresar cada longitud. 3. Enviar. 4. Observar resultado.
- **Resultado esperado:** Longitudes dentro del límite aceptadas; fuera, rechazadas con mensaje (PENDIENTE DE CONFIRMAR).
- **Resultado obtenido:** No ejecutado; no hay resultado de este caso.
- **Ejecutado:** N
- **Estado:** Sin ejecutar
- **Observaciones:** Las filas válidas crean reservas; limitar su cantidad. Caso planificado; las reglas pendientes son supuestos por confirmar, no comportamientos observados.
- **Ticket Trello:** pendiente
- **Automatización prevista:** Sí. Data-driven en `e2e/booking-validation.spec.ts`; filas válidas con mock o permiso A-003.

### TC-010 - Longitud y formato límite del teléfono
- **Módulo:** Reserva
- **Descripción:** Validación del teléfono en sus límites.
- **Clasificación:** Borde
- **Precondiciones:** Reglas de formato/longitud conocidas (A-001).
- **Datos:** Vacío, solo letras, mínimo, mínimo-1, máximo, máximo+1 (límites PENDIENTE DE CONFIRMAR).
- **Pasos:** 1. Completar el resto válido. 2. Ingresar cada valor. 3. Enviar. 4. Observar.
- **Resultado esperado:** Valores válidos aceptados; inválidos rechazados con indicación (PENDIENTE DE CONFIRMAR).
- **Resultado obtenido:** No ejecutado; no hay resultado de este caso.
- **Ejecutado:** N
- **Estado:** Sin ejecutar
- **Observaciones:** No se asume formato internacional ni local. Caso planificado; las reglas pendientes son supuestos por confirmar, no comportamientos observados.
- **Ticket Trello:** pendiente
- **Automatización prevista:** Sí. Data-driven en `e2e/booking-validation.spec.ts`.

### TC-011 - Fechas ya reservadas / habitación no disponible
- **Módulo:** Reserva
- **Descripción:** Comportamiento al intentar reservar fechas ocupadas.
- **Clasificación:** Negativo
- **Precondiciones:** Reserva previa en las mismas fechas (creada por el test o existente); regla de disponibilidad conocida (A-004).
- **Datos:** Mismas fechas y habitación de una reserva existente.
- **Pasos:** 1. Crear o identificar fechas ocupadas. 2. Intentar reservar la misma habitación en esas fechas. 3. Observar.
- **Resultado esperado:** La reserva se rechaza o la habitación no se ofrece (mensaje PENDIENTE DE CONFIRMAR). No se duplica la reserva.
- **Resultado obtenido:** No ejecutado; no hay resultado de este caso.
- **Ejecutado:** N
- **Estado:** Sin ejecutar
- **Observaciones:** Alta colisión en datos compartidos (R-1). Sin admin, verificación indirecta. Caso planificado; las reglas pendientes son supuestos por confirmar, no comportamientos observados.
- **Ticket Trello:** pendiente
- **Automatización prevista:** Parcial. Requiere dos reservas encadenadas; evaluar mock de respuesta de conflicto con `route.fulfill`.

### TC-012 - Formulario de contacto vacío
- **Módulo:** Contacto
- **Descripción:** Enviar contacto sin datos muestra validaciones.
- **Clasificación:** Negativo
- **Precondiciones:** Formulario de contacto visible.
- **Datos:** Todos los campos vacíos.
- **Pasos:** 1. Registrar requests. 2. Enviar el formulario vacío. 3. Observar mensajes y requests.
- **Resultado esperado:** Se muestran validaciones (texto PENDIENTE DE CONFIRMAR); no hay confirmación; no se envía el POST de contacto (URL PENDIENTE).
- **Resultado obtenido:** No ejecutado; no hay resultado de este caso.
- **Ejecutado:** N
- **Estado:** Sin ejecutar
- **Observaciones:** No genera mensajes reales si la validación frena el envío. Caso planificado; las reglas pendientes son supuestos por confirmar, no comportamientos observados.
- **Ticket Trello:** pendiente
- **Automatización prevista:** Sí. `e2e/contact.spec.ts`; `page.on('request')`.

### TC-013 - Contacto con email inválido
- **Módulo:** Contacto
- **Descripción:** Un email mal formado es rechazado en contacto.
- **Clasificación:** Negativo
- **Precondiciones:** Formulario visible; otros campos válidos.
- **Datos:** Email `qa-sin-arroba.example.com`; resto válido sintético.
- **Pasos:** 1. Completar campos válidos. 2. Ingresar email inválido. 3. Enviar.
- **Resultado esperado:** Se rechaza con indicación en el campo (texto PENDIENTE DE CONFIRMAR); sin confirmación.
- **Resultado obtenido:** No ejecutado; no hay resultado de este caso.
- **Ejecutado:** N
- **Estado:** Sin ejecutar
- **Observaciones:** Reglas de formato PENDIENTE DE CONFIRMAR (A-001). Caso planificado; las reglas pendientes son supuestos por confirmar, no comportamientos observados.
- **Ticket Trello:** pendiente
- **Automatización prevista:** Sí. `e2e/contact.spec.ts`.

### TC-014 - Longitud mínima y máxima de asunto/mensaje
- **Módulo:** Contacto
- **Descripción:** Validación de los límites de longitud de asunto y mensaje.
- **Clasificación:** Borde
- **Precondiciones:** Límites conocidos (A-001); estrategia de mock definida (P-6).
- **Datos:** 0, mínimo, mínimo-1, máximo, máximo+1 caracteres (límites PENDIENTE DE CONFIRMAR).
- **Pasos:** 1. Completar el resto válido. 2. Ingresar cada longitud. 3. Enviar. 4. Observar.
- **Resultado esperado:** Dentro del límite aceptado; fuera, rechazado con mensaje (PENDIENTE DE CONFIRMAR).
- **Resultado obtenido:** No ejecutado; no hay resultado de este caso.
- **Ejecutado:** N
- **Estado:** Sin ejecutar
- **Observaciones:** Usar mock para filas válidas y evitar mensajes reales. Caso planificado; las reglas pendientes son supuestos por confirmar, no comportamientos observados.
- **Ticket Trello:** pendiente
- **Automatización prevista:** Sí. Data-driven en `e2e/contact.spec.ts` con `route.fulfill` para filas válidas.

### TC-015 - Contacto válido con respuesta mockeada
- **Módulo:** Contacto
- **Descripción:** Flujo válido de contacto con el backend mockeado para no enviar mensajes reales.
- **Clasificación:** Positivo
- **Precondiciones:** URL/método del endpoint de contacto conocidos (PENDIENTE); ruta interceptada antes de enviar.
- **Datos:** Igual que TC-003; respuesta mock de éxito (estructura PENDIENTE DE CONFIRMAR).
- **Pasos:** 1. Configurar `page.route` con `route.fulfill` de éxito. 2. Completar el formulario. 3. Enviar. 4. Verificar el payload enviado y la UI.
- **Resultado esperado:** El payload contiene los datos ingresados; se muestra la confirmación (PENDIENTE DE CONFIRMAR). No se envía mensaje real.
- **Resultado obtenido:** No ejecutado; no hay resultado de este caso.
- **Ejecutado:** N
- **Estado:** Sin ejecutar
- **Observaciones:** Valida el front, no el backend. Complementa TC-003. Caso planificado; las reglas pendientes son supuestos por confirmar, no comportamientos observados.
- **Ticket Trello:** pendiente
- **Automatización prevista:** Sí. `e2e/contact.spec.ts`; `route.fulfill`.

### TC-016 - Caracteres especiales y espacios en nombre
- **Módulo:** Reserva
- **Descripción:** Comportamiento con espacios, acentos, apóstrofes y símbolos en el nombre.
- **Clasificación:** Borde
- **Precondiciones:** Formulario visible; resto válido.
- **Datos:** `  QA Test  ` (espacios), `Ñandú Pérez`, `O'Brien`, `<b>x</b>`, solo espacios. Reglas PENDIENTE DE CONFIRMAR.
- **Pasos:** 1. Ingresar cada valor en nombre. 2. Enviar. 3. Observar aceptación o rechazo.
- **Resultado esperado:** Cada valor se acepta o se rechaza según reglas PENDIENTE DE CONFIRMAR; nunca se renderiza HTML sin escapar en la confirmación. Sin errores no controlados.
- **Resultado obtenido:** No ejecutado; no hay resultado de este caso.
- **Ejecutado:** N
- **Estado:** Sin ejecutar
- **Observaciones:** No es prueba de seguridad (fuera de alcance), solo comportamiento de entrada. Caso planificado; las reglas pendientes son supuestos por confirmar, no comportamientos observados.
- **Ticket Trello:** pendiente
- **Automatización prevista:** Sí. Data-driven en `e2e/booking-validation.spec.ts`; aserciones tras definir reglas.

---

## 4. Tabla completa

La planilla `docs/casos-prueba-challenge.xlsx` contiene estos mismos 16 casos y un resumen. Estado al 2026-10-30.

| ID | Módulo | Descripción | Clasificación | Precondiciones | Datos | Pasos | Resultado esperado | Resultado obtenido | Ejecutado | Estado | Observaciones | Ticket Trello | Automatización prevista |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TC-001 | Reserva | Un invitado reserva una habitación disponible con datos válidos y recibe confirmación. | Positivo | Demo accesible; existe habitación disponible en fechas futuras (A-004); permiso de escritura (A-003); spinner inicial resuelto. | Nombre `QA-<timestamp>`; apellido sintético; email `qa+<ts>@example.com`; teléfono válido (formato PENDIENTE DE CONFIRMAR); fechas futuras dinámicas dentro del rango permitido (PENDIENTE DE CONFIRMAR). | 1. Abrir la home y esperar el render del SPA. 2. Seleccionar fechas futuras disponibles. 3. Elegir una habitación disponible e iniciar la reserva. 4. Completar el formulario con datos válidos. 5. Enviar la reserva. | Se envía la reserva y se muestra una confirmación (texto PENDIENTE DE CONFIRMAR, A-005). No aparecen errores de validación. | No se pudo iniciar el flujo: página de reserva en blanco. GET /api/room/{id} respondió 500 durante la exploración. No se ejecutó el escenario completo. | N | Blocked | BLOQUEADO por la página de reserva en blanco (`GET /api/room/{id}` → 500, ver `docs/bugs/reservation-page-500.md`). Riesgos R-1 y R-2. Genera dato real en la demo; usar `[AUTOTEST]` si hay campo libre. | https://trello.com/c/zYqVZc0p/1-bug-001-reserva-en-blanco-get-api-room-id-responde-500 | Sí. `e2e/booking.spec.ts`; fechas dinámicas; interceptar la respuesta del POST de booking como evidencia adicional. |
| TC-002 | Reserva | Enviar el formulario de reserva sin datos muestra validaciones y no crea la reserva. | Negativo | Haber llegado al formulario de datos del huésped (A-001); validación nativa o custom definida (A-006). | Todos los campos vacíos. | 1. Abrir la home y seleccionar habitación/fechas hasta ver el formulario. 2. No completar ningún campo. 3. Enviar el formulario. 4. Observar mensajes de validación. | Se indican los campos obligatorios con mensajes (texto PENDIENTE DE CONFIRMAR). No se muestra confirmación. El formulario sigue visible con errores. No se emite POST de booking (ver TC-004). | No se pudo iniciar el flujo: página de reserva en blanco. GET /api/room/{id} respondió 500 durante la exploración. No se ejecutó el escenario completo. | N | Blocked | BLOQUEADO por la página de reserva en blanco (ver `docs/bugs/reservation-page-500.md`). Depende de A-002 y A-006. No se afirman mensajes exactos. | https://trello.com/c/zYqVZc0p/1-bug-001-reserva-en-blanco-get-api-room-id-responde-500 | Sí. `e2e/booking-validation.spec.ts`; aserción según tipo de validación (nativa: `validationMessage`; custom: DOM). |
| TC-003 | Contacto | Enviar el formulario de contacto con datos válidos y ver la confirmación. | Positivo | Home cargada; formulario visible. Envío real autorizado para la ejecución informada. | Nombre `QA-<timestamp>`; email `qa+<ts>@example.com`; teléfono válido (formato PENDIENTE); asunto y mensaje con prefijo `[AUTOTEST]` (longitudes PENDIENTE DE CONFIRMAR). | 1. Abrir la home y esperar el render. 2. Ubicar el formulario de contacto. 3. Completar todos los campos con datos válidos. 4. Enviar. | POST /api/message responde 200 con {"success":true}; payload coincide con los campos; aparece "Thanks for getting in touch <name>!", el asunto y los textos de confirmación; formulario oculto. | Ejecución informada por Diego: 1 passed (5.2s). test-results/.last-run.json: passed, sin failedTests. El test verifica API, payload y confirmación visible. | S | OK | Cada nueva ejecución envía otro mensaje real a la demo. Evidencia exploratoria previa: docs/evidence/tc-003-contact-submission-2026-10-30.md. El resultado 5.2s proviene de la salida compartida por Diego. | No aplica; no se reportó defecto en este caso. | Implementada en e2e/myTestRestfulBooker.spec.ts y e2e/pages/ContactPage.ts. Ejecutada con resultado OK. |
| TC-004 | Reserva | Verificar que el envío vacío no produce ninguna petición de creación de reserva. | Negativo | Formulario de reserva visible; listener de requests activo antes de enviar. | Campos vacíos. | 1. Registrar `page.on('request')` filtrando POST de booking (URL PENDIENTE DE CONFIRMAR). 2. Enviar el formulario vacío. 3. Esperar un tiempo acotado o un estado estable. 4. Revisar requests registrados y la UI. | No hubo POST de booking; no hay confirmación; el formulario sigue con errores. | No ejecutado; no hay resultado de este caso. | N | Sin ejecutar | Evidencia indirecta (R-4); requiere aceptación A-002. Por qué: sin admin no se puede consultar la reserva. Caso planificado; las reglas pendientes son supuestos por confirmar, no comportamientos observados. | pendiente | Sí. Mismo spec que TC-002 o `booking-validation.spec.ts`; `page.on('request')` con contador. |
| TC-005 | Reserva | Un email mal formado es rechazado. | Negativo | Formulario visible; resto de campos válidos. | Email `qa-sin-arroba.example.com`; resto válido sintético. | 1. Completar campos válidos. 2. Ingresar email inválido. 3. Enviar. | Se rechaza con indicación en el campo email (texto PENDIENTE DE CONFIRMAR). No se muestra confirmación ni se crea reserva. | No ejecutado; no hay resultado de este caso. | N | Sin ejecutar | Reglas de formato PENDIENTE DE CONFIRMAR (A-001). Caso planificado; las reglas pendientes son supuestos por confirmar, no comportamientos observados. | pendiente | Sí. `e2e/booking-validation.spec.ts`; data-driven con otros emails inválidos una vez confirmadas las reglas. |
| TC-006 | Reserva | Un rango de fechas invertido no permite reservar. | Negativo | Selector de fechas disponible. | Entrada: hoy + N días; salida: anterior a la entrada (N dinámico). | 1. Seleccionar entrada. 2. Intentar seleccionar salida anterior. 3. Intentar continuar. | El selector lo impide o muestra error (comportamiento PENDIENTE DE CONFIRMAR). No se crea reserva. | No ejecutado; no hay resultado de este caso. | N | Sin ejecutar | El control puede impedir la selección en lugar de mostrar mensaje (A-004). Caso planificado; las reglas pendientes son supuestos por confirmar, no comportamientos observados. | pendiente | Sí. `e2e/booking-dates.spec.ts`; depende del tipo de calendario. |
| TC-007 | Reserva | Comportamiento al intentar fechas pasadas o más allá del rango permitido. | Borde | Rango permitido conocido (A-004). | Ayer; hoy; último día permitido; día siguiente al último permitido. Límite PENDIENTE DE CONFIRMAR. | 1. Intentar seleccionar cada fecha. 2. Observar si queda seleccionable o se rechaza. | Las fechas fuera del rango se rechazan o deshabilitan; las dentro se aceptan (límite PENDIENTE DE CONFIRMAR). | No ejecutado; no hay resultado de este caso. | N | Sin ejecutar | No inventar el límite; calcularlo tras la exploración. Caso planificado; las reglas pendientes son supuestos por confirmar, no comportamientos observados. | pendiente | Sí. `e2e/booking-dates.spec.ts`; fechas relativas a `new Date()`. |
| TC-008 | Reserva | Reserva con la menor estadía posible (límite). | Borde | Mínimo de noches conocido (A-004); habitación disponible. | Entrada y salida con la duración mínima (PENDIENTE DE CONFIRMAR); y una unidad menos si es posible. | 1. Seleccionar el rango mínimo. 2. Completar datos válidos. 3. Enviar. 4. Repetir con rango menor al mínimo. | El mínimo se acepta; menos del mínimo se rechaza (límite PENDIENTE DE CONFIRMAR). | No ejecutado; no hay resultado de este caso. | N | Sin ejecutar | Crea reserva real en la parte aceptada (R-2). Caso planificado; las reglas pendientes son supuestos por confirmar, no comportamientos observados. | pendiente | Parcial. Parte de rechazo automatizable; parte de creación según A-003. |
| TC-009 | Reserva | Validación en los límites de longitud de nombre y apellido. | Borde | Límites conocidos (A-001). | 0, mínimo, mínimo-1, máximo, máximo+1 caracteres (límites PENDIENTE DE CONFIRMAR), generados con `'a'.repeat(n)`. | 1. Completar el resto válido. 2. Ingresar cada longitud. 3. Enviar. 4. Observar resultado. | Longitudes dentro del límite aceptadas; fuera, rechazadas con mensaje (PENDIENTE DE CONFIRMAR). | No ejecutado; no hay resultado de este caso. | N | Sin ejecutar | Las filas válidas crean reservas; limitar su cantidad. Caso planificado; las reglas pendientes son supuestos por confirmar, no comportamientos observados. | pendiente | Sí. Data-driven en `e2e/booking-validation.spec.ts`; filas válidas con mock o permiso A-003. |
| TC-010 | Reserva | Validación del teléfono en sus límites. | Borde | Reglas de formato/longitud conocidas (A-001). | Vacío, solo letras, mínimo, mínimo-1, máximo, máximo+1 (límites PENDIENTE DE CONFIRMAR). | 1. Completar el resto válido. 2. Ingresar cada valor. 3. Enviar. 4. Observar. | Valores válidos aceptados; inválidos rechazados con indicación (PENDIENTE DE CONFIRMAR). | No ejecutado; no hay resultado de este caso. | N | Sin ejecutar | No se asume formato internacional ni local. Caso planificado; las reglas pendientes son supuestos por confirmar, no comportamientos observados. | pendiente | Sí. Data-driven en `e2e/booking-validation.spec.ts`. |
| TC-011 | Reserva | Comportamiento al intentar reservar fechas ocupadas. | Negativo | Reserva previa en las mismas fechas (creada por el test o existente); regla de disponibilidad conocida (A-004). | Mismas fechas y habitación de una reserva existente. | 1. Crear o identificar fechas ocupadas. 2. Intentar reservar la misma habitación en esas fechas. 3. Observar. | La reserva se rechaza o la habitación no se ofrece (mensaje PENDIENTE DE CONFIRMAR). No se duplica la reserva. | No ejecutado; no hay resultado de este caso. | N | Sin ejecutar | Alta colisión en datos compartidos (R-1). Sin admin, verificación indirecta. Caso planificado; las reglas pendientes son supuestos por confirmar, no comportamientos observados. | pendiente | Parcial. Requiere dos reservas encadenadas; evaluar mock de respuesta de conflicto con `route.fulfill`. |
| TC-012 | Contacto | Enviar contacto sin datos muestra validaciones. | Negativo | Formulario de contacto visible. | Todos los campos vacíos. | 1. Registrar requests. 2. Enviar el formulario vacío. 3. Observar mensajes y requests. | Se muestran validaciones (texto PENDIENTE DE CONFIRMAR); no hay confirmación; no se envía el POST de contacto (URL PENDIENTE). | No ejecutado; no hay resultado de este caso. | N | Sin ejecutar | No genera mensajes reales si la validación frena el envío. Caso planificado; las reglas pendientes son supuestos por confirmar, no comportamientos observados. | pendiente | Sí. `e2e/contact.spec.ts`; `page.on('request')`. |
| TC-013 | Contacto | Un email mal formado es rechazado en contacto. | Negativo | Formulario visible; otros campos válidos. | Email `qa-sin-arroba.example.com`; resto válido sintético. | 1. Completar campos válidos. 2. Ingresar email inválido. 3. Enviar. | Se rechaza con indicación en el campo (texto PENDIENTE DE CONFIRMAR); sin confirmación. | No ejecutado; no hay resultado de este caso. | N | Sin ejecutar | Reglas de formato PENDIENTE DE CONFIRMAR (A-001). Caso planificado; las reglas pendientes son supuestos por confirmar, no comportamientos observados. | pendiente | Sí. `e2e/contact.spec.ts`. |
| TC-014 | Contacto | Validación de los límites de longitud de asunto y mensaje. | Borde | Límites conocidos (A-001); estrategia de mock definida (P-6). | 0, mínimo, mínimo-1, máximo, máximo+1 caracteres (límites PENDIENTE DE CONFIRMAR). | 1. Completar el resto válido. 2. Ingresar cada longitud. 3. Enviar. 4. Observar. | Dentro del límite aceptado; fuera, rechazado con mensaje (PENDIENTE DE CONFIRMAR). | No ejecutado; no hay resultado de este caso. | N | Sin ejecutar | Usar mock para filas válidas y evitar mensajes reales. Caso planificado; las reglas pendientes son supuestos por confirmar, no comportamientos observados. | pendiente | Sí. Data-driven en `e2e/contact.spec.ts` con `route.fulfill` para filas válidas. |
| TC-015 | Contacto | Flujo válido de contacto con el backend mockeado para no enviar mensajes reales. | Positivo | URL/método del endpoint de contacto conocidos (PENDIENTE); ruta interceptada antes de enviar. | Igual que TC-003; respuesta mock de éxito (estructura PENDIENTE DE CONFIRMAR). | 1. Configurar `page.route` con `route.fulfill` de éxito. 2. Completar el formulario. 3. Enviar. 4. Verificar el payload enviado y la UI. | El payload contiene los datos ingresados; se muestra la confirmación (PENDIENTE DE CONFIRMAR). No se envía mensaje real. | No ejecutado; no hay resultado de este caso. | N | Sin ejecutar | Valida el front, no el backend. Complementa TC-003. Caso planificado; las reglas pendientes son supuestos por confirmar, no comportamientos observados. | pendiente | Sí. `e2e/contact.spec.ts`; `route.fulfill`. |
| TC-016 | Reserva | Comportamiento con espacios, acentos, apóstrofes y símbolos en el nombre. | Borde | Formulario visible; resto válido. | `  QA Test  ` (espacios), `Ñandú Pérez`, `O'Brien`, `<b>x</b>`, solo espacios. Reglas PENDIENTE DE CONFIRMAR. | 1. Ingresar cada valor en nombre. 2. Enviar. 3. Observar aceptación o rechazo. | Cada valor se acepta o se rechaza según reglas PENDIENTE DE CONFIRMAR; nunca se renderiza HTML sin escapar en la confirmación. Sin errores no controlados. | No ejecutado; no hay resultado de este caso. | N | Sin ejecutar | No es prueba de seguridad (fuera de alcance), solo comportamiento de entrada. Caso planificado; las reglas pendientes son supuestos por confirmar, no comportamientos observados. | pendiente | Sí. Data-driven en `e2e/booking-validation.spec.ts`; aserciones tras definir reglas. |

---

## 5. Pendientes a confirmar antes de ejecutar

| ID | Pendiente | Bloquea |
|---|---|---|
| P-1 | A-001: campos, obligatoriedad, formatos y límites de reserva y contacto | TC-001 a TC-016 |
| P-2 | A-002: aceptación de la evidencia de "no creada" (sin POST + sin confirmación + errores visibles) | TC-002, TC-004 |
| P-3 | A-003: permiso de escritura en la demo pública o instancia propia | TC-001, TC-003, TC-008, TC-009, TC-011 |
| P-4 | A-004: reglas de disponibilidad, rango de fechas y mínimo/máximo de noches | TC-001, TC-006, TC-007, TC-008, TC-011 |
| P-5 | A-005: texto/elemento de confirmación de reserva y de contacto | TC-001, TC-003, TC-015 |
| P-6 | Decisión de contacto: mockear con `route.fulfill` o aceptar envío real | TC-003, TC-014, TC-015 |
| P-7 | A-006: validación nativa HTML5 o custom | TC-002, TC-005, TC-009, TC-010, TC-012, TC-013 |
| P-8 | URLs y métodos reales de los endpoints de booking y contacto (para filtros de request/mock) | TC-004, TC-012, TC-015 |
| P-9 | Selectores/roles reales vía exploración en solo lectura con Playwright MCP. Home, disponibilidad y contacto: verificados (1.9). Formulario de reserva: bloqueado por `GET /api/room/{id}` → 500 | TC-001, TC-002, TC-004 a TC-011, TC-016 |
| P-10 | Reintentar `/reservation/{id}`; si el 500 persiste, reportar defecto del entorno | TC-001, TC-002, TC-004 |

Estado de A-006 tras la exploración: contacto sin validación nativa HTML5 (confirmado); reserva sin observar. Mensajes de error y obligatoriedad de ambos formularios siguen pendientes porque requieren enviar.

## 6. Estado de entrega actualizado (2026-10-30)

- TC-003: OK, ejecución automatizada informada por Diego (5.2s); no se repitió durante la preparación documental.
- TC-001 y TC-002: Blocked por BUG-001; no implementados.
- Otros 13 casos: Sin ejecutar. Los límites y reglas no observados siguen como pendientes.
- Para contacto quedan resueltos el endpoint POST /api/message, la respuesta 200 con success:true y la confirmación de éxito. P-5/P-6/P-8 quedan cerrados solo para TC-003; los límites y validaciones negativas siguen abiertos.
- La evidencia sin POST y sin confirmación es indirecta; no demuestra por sí sola ausencia de registro en el servidor.
- Trello: BUG-001 publicado en https://trello.com/c/zYqVZc0p/1-bug-001-reserva-en-blanco-get-api-room-id-responde-500. Tablero: https://trello.com/b/TQskTxT5/challenge-qa-shady-meadows-playwright. Repositorio público: https://github.com/diegogirotti-jpg/challenge-playwright-booker.
