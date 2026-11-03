# Investigación de la fuente — 03/11/2026

Se consultó el historial por ruta mediante la API pública de GitHub y el contenido de los dos templates en la primera revisión. El commit [d8e53bda8b0c4fa1d0ca3d38134e60b9aeb0b387](https://github.com/testsmith-io/practice-software-testing/commit/d8e53bda8b0c4fa1d0ca3d38134e60b9aeb0b387) es raíz (sin padres) y ya incorpora ambos defectos: Home tiene `routerLink="/contact"`; las etiquetas Low–High y High–Low tienen valores descendente y ascendente intercambiados.

El cambio identificado es la incorporación de esos archivos con el defecto en el commit inicial de este repositorio público. No existe un padre para atribuir un cambio anterior en este historial. Esto no prueba dónde se escribió originalmente el código ni que ese commit sea el desplegado.

[Datos verificables](source-history.json) conserva las rutas, líneas iniciales, fecha, padres y SHA consultados. Los reportes enlazan además clases y método de la instantánea de referencia. Se contrastó con la UI reproducida en el diagnóstico de [GitHub Actions](https://github.com/diegogirotti-jpg/qa-training-playwright/actions/runs/41641759716): ambos hallazgos reproducidos, sin login ni escrituras.

Certeza: confirmada para el origen en este historial público y el código consultado; probable para la correspondencia con el despliegue. La aceptación de esta evidencia para el hito de Nivel 2 corresponde al referente.
