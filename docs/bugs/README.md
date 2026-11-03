# Reportes de bugs - capacitación QA

Esta carpeta reúne evidencia de dos aplicaciones de práctica. No usa datos de clientes y no afirma que la entrega haya sido aprobada por el referente.

| ID | Aplicación | Hallazgo | Evidencia e impacto observado | Estado |
| --- | --- | --- | --- | --- |
| [BUG-001](reservation-page-500.md) | Shady Meadows, demo pública | Reserva queda en blanco y detalle devuelve 500 | 3 IDs con 500; 2 pantallas de habitación observadas en blanco; 2 escenarios obligatorios bloqueados. Evidencia del 30/10/2026, sin revalidar el 02/11. | Histórico documentado; causa raíz pendiente. |
| [BUG-002](BUG-002-home-contact.md) | Toolshop **with-bugs** | Home lleva a Contacto | 2 de 2 clics medidos. Captura, snapshot y JSON de ambos intentos del 02/11/2026. | Reproducido; código público relacionado identificado; incorporación defectuosa en el commit raíz identificada. |
| [BUG-003](BUG-003-price-sort.md) | Toolshop **with-bugs** | Orden de precios contrario a la selección | 9 tarjetas y 8 de 8 pares invertidos en cada uno de dos intentos. Captura, snapshot, JSON y cálculo reproducible. | Reproducido; código público relacionado identificado; incorporación defectuosa en el commit raíz identificada. |

## Alcance

- BUG-002 y BUG-003 son fallos sembrados y conocidos por el fabricante de la demo. Se reprodujeron de forma independiente para la capacitación; no se reportan como descubrimientos inéditos.
- La demo `https://with-bugs.practicesoftwaretesting.com/` es distinta de `https://practicesoftwaretesting.com/`, que usa la suite del repositorio qa-training-playwright.
- Estos dos reportes adicionales no amplían los 16 casos diseñados ni completan los dos escenarios de reserva bloqueados del challenge de Shady Meadows.
- No se ejecutaron logins, compras, contactos ni cambios de inventario para BUG-002/BUG-003.
- El impacto medido describe lo observado; no cuantifica la población de usuarios, ventas ni pérdidas económicas.
- Se entrega en Markdown versionado con evidencia local accesible. La aceptación de este canal corresponde al referente; no hay tickets de Jira creados. Solo BUG-001 tiene el ticket Trello previo.
- En BUG-002/BUG-003 se identificaron archivo, clase y cambio de incorporación en el historial público. La [investigación](../evidence/toolshop-with-bugs/source-investigation.md) documenta los límites: no hay trazabilidad del build desplegado. Su aceptación corresponde al referente. BUG-001 sigue sin causa raíz identificada.

## Recalcular las mediciones

Desde la raíz del repositorio:

```bash
python3 docs/evidence/toolshop-with-bugs/measure-impact.py
```

El script solo lee los JSON guardados y recalcula `impact-measurements.json`; no reproduce la UI ni genera una nueva ejecución de pruebas. El proceso automático de detección y reporte ya está implementado por separado en [qa-training-playwright](https://github.com/diegogirotti-jpg/qa-training-playwright/blob/main/docs/AUTOMATED-BUG-REPORTS.md).

[Revisión de formato y limitaciones del 03/11](revision-standard-20261103.md).
