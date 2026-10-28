# Librerías incluidas

Se descargaron una sola vez durante el desarrollo. La aplicación nunca carga nada de internet al usarse (FR-032).

| Archivo | Librería | Versión | Origen |
|---------|----------|---------|--------|
| jspdf.umd.min.js | jsPDF | 2.5.2 | https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js |
| jspdf.plugin.autotable.min.js | jspdf-autotable | 3.8.4 | https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.4/jspdf.plugin.autotable.min.js |

La URL de jsPDF prevista en las tareas, en cdnjs, devolvía error 404 para la versión 2.5.2. Por eso se usó el mismo paquete publicado en npm a través de jsDelivr.
