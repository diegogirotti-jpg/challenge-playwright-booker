# Reportes de bugs - capacitación QA

Esta carpeta reúne evidencia de dos aplicaciones de práctica. No usa datos de clientes y no afirma que la entrega haya sido aprobada por el referente.

| ID | Aplicación | Hallazgo | Evidencia e impacto observado | Estado |
| --- | --- | --- | --- | --- |
| [BUG-001](reservation-page-500.md) | Shady Meadows, demo pública | Reserva queda en blanco y detalle devuelve 500 | 3 IDs con 500; 2 pantallas de habitación observadas en blanco; 2 escenarios obligatorios bloqueados. Evidencia del 30/10/2026, sin revalidar el 02/11. | Histórico documentado; causa raíz pendiente. |
| [BUG-002](BUG-002-home-contact.md) | Toolshop **with-bugs** | Home lleva a Contacto | 2 de 2 clics medidos. Captura, snapshot y JSON de ambos intentos del 02/11/2026. | Reproducido; código público relacionado identificado; cambio de introducción pendiente. |
| [BUG-003](BUG-003-price-sort.md) | Toolshop **with-bugs** | Orden de precios contrario a la selección | 9 tarjetas y 8 de 8 pares invertidos en cada uno de dos intentos. Captura, snapshot, JSON y cálculo reproducible. | Reproducido; código público relacionado identificado; cambio de introducción pendiente. |

## Alcance

- BUG-002 y BUG-003 son fallos sembrados y conocidos por el fabricante de la demo. Se reprodujeron de forma independiente para la capacitación; no se reportan como descubrimientos inéditos.
- La demo `https://with-bugs.practicesoftwaretesting.com/` es distinta de `https://practicesoftwaretesting.com/`, que usa la suite del repositorio qa-training-playwright.
- Estos dos reportes adicionales no amplían los 16 casos diseñados ni completan los dos escenarios de reserva bloqueados del challenge de Shady Meadows.
- No se ejecutaron logins, compras, contactos ni cambios de inventario para BUG-002/BUG-003.
- El impacto medido describe lo observado; no cuantifica la población de usuarios, ventas ni pérdidas económicas.
- Se entrega en Markdown versionado con evidencia local accesible. La aceptación de este canal corresponde al referente; no hay tickets de Jira creados. Solo BUG-001 tiene el ticket Trello previo.
- El Nivel 2 de BUG-002/BUG-003 es parcial: código de referencia identificado, sin commit de introducción ni trazabilidad del despliegue. No se acredita todavía ese hito completo.

## Recalcular las mediciones

Desde la raíz del repositorio:

```bash
python3 docs/evidence/toolshop-with-bugs/measure-impact.py
```

El script solo lee los JSON guardados y recalcula `impact-measurements.json`; no reproduce la UI ni genera una nueva ejecución de pruebas. No equivale al futuro proceso automático de detección y reporte en cada PR.
