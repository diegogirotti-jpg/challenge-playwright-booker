# BUG-002 - [Navegación] Home abre Contacto en lugar del catálogo

## Datos generales
- **Título**: [Navegación] Home abre Contacto en lugar del catálogo
- **Severidad**: Media, propuesta: navegación principal incorrecta con alternativa verificada mediante el enlace de marca.
- **Prioridad**: [FALTA DATO: la define el PO].
- **Ambiente**: demo pública de entrenamiento con bugs sembrados - https://with-bugs.practicesoftwaretesting.com/#/. No es la tienda normal ni Shady Meadows.
- **Versión**: título visible `Practice Software Testing - Toolshop - v5.0 with bugs`. [FALTA DATO: tag y commit del despliegue]. El SHA del código público consultado se indica en Nivel 2, sin atribuirlo al despliegue.
- **Navegador / dispositivo**: navegador integrado de Codex sobre macOS. [FALTA DATO: versión exacta de navegador y sistema operativo].
- **Reportado con**: Otra IA: Codex, con interacción de navegador y revisión de evidencia. No se atribuye esta reproducción a QATES.
- **Ticket relacionado**: reporte de capacitación BUG-002; referencia conocida del fabricante: bug 29 de [listOfBugs.md](https://github.com/testsmith-io/practice-software-testing/blob/ae7caecb811dd8952c09d997e69be7cb946ecd44/sprint5-with-bugs/testSessions/listOfBugs.md). No se creó ticket en Jira ni Trello.

## Qué pasó
Un visitante que pulsa Home llega al formulario de Contacto en lugar de permanecer o volver al catálogo. El enlace principal de navegación conduce a una pantalla distinta de la que anuncia. La marca de la tienda sí permitió regresar al catálogo durante la comprobación.

## Pasos para reproducir
**Precondiciones**: abrir la demo con bugs sin iniciar sesión y esperar a que se vean productos en el catálogo. Sin datos personales ni formularios completados.
1. Abrir https://with-bugs.practicesoftwaretesting.com/#/.
2. Pulsar `Home` en el menú principal.
3. Comprobar la URL y el título de la pantalla mostrada.

**Resultado esperado**: Home conduce al catálogo/inicio. Referencia funcional: nombre del enlace y bug 29, que documenta este destino de Contacto como incorrecto. [FALTA DATO: historia de usuario formal del producto].

**Resultado obtenido**: URL `https://with-bugs.practicesoftwaretesting.com/#/contact`; aparece el heading `Contact` con campos First name, Last name, Email address, Subject y Message. El DOM del enlace registra `href="#/contact"`. No hay un mensaje de error: el defecto es el destino incorrecto.

**Frecuencia**: Siempre en los **2 de 2 clics medidos**, dentro de la misma sesión y navegador; no implica frecuencia universal. Entre intentos se regresó al catálogo mediante la marca y se esperó un producto visible.

## Datos de prueba
- **Usuario y rol**: visitante anónimo; sin login.
- **Valores ingresados**: ninguno; clic en Home. No se envió Contacto.
- **Registros**: ningún registro creado o modificado; la preparación se verificó con Combination Pliers visible, sin abrir ni comprar el producto.
- **De dónde salen los datos**: catálogo de la demo compartida; no se ejecutó seed ni se modificó inventario. [FALTA DATO: versión del seed desplegado].
- **Contexto**: 2026-11-02, intentos iniciados a las 18:37:10.932 y 18:37:39.693 UTC (15:37 en Mendoza, UTC-3); interfaz en inglés. [FALTA DATO: flags y zona horaria configurada por la app].

## Origen
- **Cómo se encontró**: exploración dirigida por la lista pública del fabricante, seguida de dos reproducciones propias en navegador. Esa lista es un catálogo de fallos sembrados, no un ticket nuestro nuevo en el tracker del fabricante.
- **Capa**: UI, navegación del frontend.
- **Dónde falla**: menú principal > Home; ruta `#/contact` en lugar del catálogo `#/`.
- **Desde cuándo**: detectado en nuestra observación del 2026-11-02. [FALTA DATO: fecha de introducción y última versión sin el bug].

## Impacto
- **Qué flujo afecta**: volver al catálogo mediante Home; el visitante pierde el destino esperado de navegación.
- **A quién afecta**: visitante anónimo del navegador medido. [FALTA DATO: otros navegadores, sesiones autenticadas y población afectada].
- **Cuántos**: **1 enlace de navegación comprobado; 2 de 2 activaciones llevaron a Contacto**. La fuente es [BUG-002-home-attempts.json](../evidence/toolshop-with-bugs/BUG-002-home-attempts.json); el cómputo está en [impact-measurements.json](../evidence/toolshop-with-bugs/impact-measurements.json). [FALTA DATO: número de usuarios y sesiones afectados; no hay analítica de tráfico].
- **Alternativa (workaround)**: pulsar el enlace de marca `Practice Software Testing - Toolshop`; se verificó que regresó al catálogo y mostró Combination Pliers antes del segundo intento.
- **¿Funcionaba antes?**: no se sabe; no se probó una versión anterior.

## Evidencia
- [Captura de Contacto después de pulsar Home](../evidence/toolshop-with-bugs/BUG-002-home-contact.png): muestra el menú y el formulario vacío, sin datos sensibles.
- [Snapshot posterior al primer clic](../evidence/toolshop-with-bugs/BUG-002-home-contact-snapshot.txt): incluye Home con `#/contact` y el heading Contact.
- [Dos intentos con URL antes/después y estado del título](../evidence/toolshop-with-bugs/BUG-002-home-attempts.json).
- [Script de cálculo reproducible](../evidence/toolshop-with-bugs/measure-impact.py): `python3 docs/evidence/toolshop-with-bugs/measure-impact.py`. Solo lee archivos y escribe el resumen; no navega ni envía datos.

## Fuente del error (Nivel 2)
- **Archivo y clase**: código público de referencia: [header.component.html:24](https://github.com/testsmith-io/practice-software-testing/blob/ae7caecb811dd8952c09d997e69be7cb946ecd44/sprint5-with-bugs/UI/src/app/header/header.component.html#L24), asociado a [HeaderComponent:18](https://github.com/testsmith-io/practice-software-testing/blob/ae7caecb811dd8952c09d997e69be7cb946ecd44/sprint5-with-bugs/UI/src/app/header/header.component.ts#L18). El fallo está en un binding del template, no en un método identificado como causante.
- **Commit o PR que lo introdujo**: [FALTA DATO: cambio de introducción]. Se consultó la instantánea upstream `ae7caecb811dd8952c09d997e69be7cb946ecd44`; ese SHA no se presenta como commit causante ni como despliegue confirmado.
- **Cómo lo encontraste**: comparar el `href` del enlace visible con el template público; ambos apuntan a Contacto.
- **Causa**: en el template consultado, Home tiene `routerLink="/contact"` en vez del destino de catálogo. La configuración incorrecta está confirmada en ese código; su coincidencia con el síntoma desplegado es probable, sin trazabilidad de build.
- **Certeza**: Confirmada para la configuración de la instantánea pública y el comportamiento medido; Probable para vincular exactamente esa fuente con el despliegue. **Nivel 2 parcial: el cambio de introducción sigue sin identificar.**

## Solución propuesta (Nivel 3, opcional)
- **Cambio propuesto**: corregir solo el destino de Home a la ruta de catálogo, después de confirmar el routing de la versión objetivo. No se modificó la app ni se implementó el fix.
- **Test que lo cubre**: propuesto, no implementado: desde el catálogo y desde Contacto, pulsar Home y comprobar ruta de inicio y productos visibles. La reproducción documentada partió solo del catálogo.
- **Riesgo**: revisar menú móvil y escritorio, resolución de rutas y navegación autenticada antes de aprobar el arreglo.

**Estado**: reproducido y documentado el 2026-11-02. Hallazgo conocido de una demo intencionalmente defectuosa; no se presenta como vulnerabilidad nueva ni como corrección aprobada.
