# BUG-003 - [Catálogo] Precio de menor a mayor muestra orden descendente

## Datos generales
- **Título**: [Catálogo] Precio de menor a mayor muestra orden descendente
- **Severidad**: Media, propuesta: orden de comparación incorrecto con alternativa temporal observada; no se midió impacto económico.
- **Prioridad**: [FALTA DATO: la define el PO].
- **Ambiente**: demo pública de entrenamiento con bugs sembrados - https://with-bugs.practicesoftwaretesting.com/#/. No es la tienda normal ni Shady Meadows.
- **Versión**: título visible `Practice Software Testing - Toolshop - v5.0 with bugs`. [FALTA DATO: tag y commit del despliegue]. El SHA del código público consultado se indica en Nivel 2, sin atribuirlo al despliegue.
- **Navegador / dispositivo**: navegador integrado de Codex sobre macOS. [FALTA DATO: versión exacta de navegador y sistema operativo].
- **Reportado con**: Otra IA: Codex, con interacción de navegador y revisión de evidencia. No se atribuye esta reproducción a QATES.
- **Ticket relacionado**: reporte de capacitación BUG-003; bug 2 del catálogo público [listOfBugs.md](https://github.com/testsmith-io/practice-software-testing/blob/ae7caecb811dd8952c09d997e69be7cb946ecd44/sprint5-with-bugs/testSessions/listOfBugs.md). No se creó ticket en Jira ni Trello. No es una falla de la suite que corre contra la tienda normal.

## Qué pasó
Al elegir precio de menor a mayor, la tienda muestra primero los productos más caros. Esto dificulta comparar las opciones económicas porque la lista hace lo contrario de lo seleccionado. Las dos selecciones de precio observadas están invertidas; se reportan juntas como un único problema de ordenamiento.

## Pasos para reproducir
**Precondiciones**: visitante sin login, demo con bugs abierta, catálogo cargado, primera página, sin filtros adicionales. Conservar el rango inicial visible sin modificarlo.
1. Abrir https://with-bugs.practicesoftwaretesting.com/#/ y esperar productos visibles.
2. En el selector `Sorth`, elegir `Price (Low - High)` por su texto visible.
3. Esperar a que cambien las tarjetas y leer sus precios de izquierda a derecha y de arriba hacia abajo.
4. Para repetir, elegir `Price (High - Low)`, esperar a que cambien las tarjetas y volver a elegir `Price (Low - High)`.

**Resultado esperado**: con `Price (Low - High)` los precios deben ser no decrecientes: precio[i] <= precio[i+1]. Referencia: texto de la opción y bug 2 del catálogo de defectos sembrados. [FALTA DATO: criterio formal para paginación y descuentos]; el alcance medido es la primera página visible y sus precios mostrados.

**Resultado obtenido**: `Price (Low - High)` queda seleccionado, el DOM registra `value="price,desc"` y la primera página muestra:

| Posición | Producto | Precio mostrado |
| --- | --- | --- |
| 1 | Cordless Drill 20V | $125.23 |
| 2 | Cordless Drill 18V | $119.24 |
| 3 | Random Orbit Sander | $100.79 |
| 4 | Circular Saw | $80.19 |
| 5 | Belt Sander | $73.59 |
| 6 | Cordless Drill 24V | $66.54 |
| 7 | Sheet Sander | $58.48 |
| 8 | Bolt Cutters | $48.41 |
| 9 | Cordless Drill 12V | $46.50 |

Los 8 pares consecutivos incumplen el orden ascendente. En el control, `Price (High - Low)` tiene `value="price,asc"` y mostró precios ascendentes desde $4.92 hasta $13.96. No apareció un error textual del sistema: el defecto es la contradicción entre la opción y la lista.

**Frecuencia**: Siempre en **2 de 2 selecciones de Low - High medidas**, en la misma sesión y navegador. Se realizó un control inverso entre ellas. No se afirma frecuencia universal ni cobertura de todas las páginas.

## Datos de prueba
- **Usuario y rol**: visitante anónimo; no se usaron credenciales.
- **Valores ingresados**: selector `Price (Low - High)`; control `Price (High - Low)`. Sin texto de búsqueda, compras ni formularios enviados.
- **Registros**: IDs de tarjetas `23`, `25`, `22`, `21`, `20`, `24`, `19`, `3`, `26`, tal como aparecen en los href guardados. No se modificaron productos.
- **De dónde salen los datos**: catálogo público compartido de la demo; valores leídos del DOM. [FALTA DATO: versión del seed desplegado].
- **Contexto**: 2026-11-02; capturas de datos a las 18:36:07.877 y 18:37:10.842 UTC (15:36-15:37 Mendoza, UTC-3). Interfaz en inglés; rango inicial visible 1-100 sin modificar y primera página. No se atribuye al fallo de ordenamiento otro posible problema del filtro de rango. [FALTA DATO: flags y zona horaria de la app].

## Origen
- **Cómo se encontró**: exploración dirigida por bug 2 del fabricante; comprobación propia de opción seleccionada y lista resultante en dos intentos, con control inverso.
- **Capa**: UI; asociación de opción visible con valor de ordenamiento.
- **Dónde falla**: catálogo > select `[data-test="sort"]` > `Price (Low - High)`; `price,desc` observado. No se capturó la request HTTP: no se afirma un endpoint o status de red.
- **Desde cuándo**: detectado por nosotros el 2026-11-02. [FALTA DATO: fecha de introducción, versión anterior sin defecto y commit desplegado].

## Impacto
- **Qué flujo afecta**: comparar productos por precio ascendente o descendente.
- **A quién afecta**: visitante anónimo, opción y página medidas. [FALTA DATO: alcance en otras páginas, filtros, roles y navegadores].
- **Cuántos**: **9 tarjetas y 8 de 8 pares adyacentes en orden contrario al esperado**, en cada uno de los dos intentos Low - High. El control High - Low también resultó invertido. Cálculo mediante [measure-impact.py](../evidence/toolshop-with-bugs/measure-impact.py), con salida [impact-measurements.json](../evidence/toolshop-with-bugs/impact-measurements.json). No se suman como 18 productos únicos porque los intentos mostraron las mismas tarjetas. [FALTA DATO: usuarios, sesiones, ventas e impacto económico].
- **Alternativa (workaround)**: elegir la opción opuesta produjo orden ascendente en el control observado. Es una alternativa temporal y poco intuitiva, no una corrección ni una garantía para otros contextos.
- **¿Funcionaba antes?**: no se sabe; no se probó una versión anterior.

## Evidencia
- [Captura del orden descendente con Low - High seleccionado](../evidence/toolshop-with-bugs/BUG-003-price-sort.png).
- [Precios y selección del intento 1](../evidence/toolshop-with-bugs/BUG-003-price-sort-attempt1.json) y [del intento 2](../evidence/toolshop-with-bugs/BUG-003-price-sort-attempt2.json): datos DOM y hora de captura.
- [Control con High - Low](../evidence/toolshop-with-bugs/BUG-003-control-high-low.json): lista ascendente y `price,asc`.
- [Snapshot posterior al segundo intento](../evidence/toolshop-with-bugs/BUG-003-price-sort-snapshot.txt).
- [Script de medición](../evidence/toolshop-with-bugs/measure-impact.py) y [resultado calculado](../evidence/toolshop-with-bugs/impact-measurements.json). No se dispone de HAR ni de headers HTTP; la evidencia es de UI.

## Fuente del error (Nivel 2)
- **Archivo y clase**: instantánea pública: [overview.component.html:19-24](https://github.com/testsmith-io/practice-software-testing/blob/ae7caecb811dd8952c09d997e69be7cb946ecd44/sprint5-with-bugs/UI/src/app/products/overview/overview.component.html#L19); [OverviewComponent:34](https://github.com/testsmith-io/practice-software-testing/blob/ae7caecb811dd8952c09d997e69be7cb946ecd44/sprint5-with-bugs/UI/src/app/products/overview/overview.component.ts#L34), método [changeSorting:184](https://github.com/testsmith-io/practice-software-testing/blob/ae7caecb811dd8952c09d997e69be7cb946ecd44/sprint5-with-bugs/UI/src/app/products/overview/overview.component.ts#L184).
- **Commit o PR que lo introdujo**: [FALTA DATO: cambio de introducción]. Fuente consultada en `ae7caecb811dd8952c09d997e69be7cb946ecd44`; no se identifica ese SHA como commit causante ni como build desplegado.
- **Cómo lo encontraste**: contrastar los valores de las options del DOM con el template público, y seguir changeSorting, que copia `event.target.value` a `this.sorting` y lo pasa a `getProductsNew`.
- **Causa**: en el template público están intercambiados los valores de las opciones de precio: High - Low usa `price,asc` y Low - High usa `price,desc`. Coincide con el DOM y el orden leído. No se depuró el servidor ni se verificó la trazabilidad del despliegue.
- **Certeza**: Confirmada para el mapeo en la instantánea y el comportamiento UI observado; Probable para vincular exactamente esa fuente con el despliegue. **Nivel 2 parcial: sigue pendiente el cambio que introdujo el problema.**

## Solución propuesta (Nivel 3, opcional)
- **Cambio propuesto**: revisar y corregir la correspondencia texto/valor de las dos opciones de precio en la versión objetivo. No se cambió el producto ni se implementó el fix.
- **Test que lo cubre**: propuesto, no implementado para esta demo: seleccionar ambas etiquetas y validar precios no decrecientes/no crecientes, con al menos dos tarjetas y números válidos. El test de ordenamiento del repo Toolshop apunta a otra URL y no acredita automáticamente este hallazgo.
- **Riesgo**: comprobar filtros, paginación, descuentos y otras opciones de ordenamiento tras el eventual arreglo.

**Estado**: reproducido y documentado el 2026-11-02. Defecto conocido de demo con errores sembrados. No hay fix ni validación independiente acreditada.
