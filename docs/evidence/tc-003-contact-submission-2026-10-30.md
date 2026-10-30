# Evidencia: envío único autorizado de contacto (TC-003)

- **Fecha:** 2026-10-30 (~15:2x UTC), autorizado explícitamente por el usuario para un único envío.
- **Herramienta:** Playwright MCP (`playwright-test`), Chromium.
- **Datos enviados (ficticios, [AUTOTEST]):**
  - name: `QA Autotest 1793375085866`
  - email: `qa+1793375085866@example.com`
  - phone: `01234567890`
  - subject: `[AUTOTEST] Consulta 1793375085866`
  - description: `[AUTOTEST] Mensaje de prueba automatizada 1793375085866. Ignorar, no requiere respuesta.`

## Red
| Método | URL | Estado | Respuesta |
|---|---|---|---|
| POST | `/api/message` | 200 | `{"success":true}` |

Payload JSON con las claves `name`, `email`, `phone`, `subject`, `description`.

## Interfaz
El formulario se reemplaza (los campos dejan de estar visibles) por una tarjeta en `#contact`:

```
<h3>Thanks for getting in touch QA Autotest 1793375085866!</h3>
<p>We'll get back to you about</p>
<p style="font-weight: bold;">[AUTOTEST] Consulta 1793375085866</p>
<p>as soon as possible.</p>
```

Sin elementos `.alert` visibles. Captura: `docs/evidence/tc-003-contact-confirmation-2026-10-30.png`.

## Notas
- El envío no se repitió.
- Esto es una observación exploratoria, no una ejecución de TC-003.
