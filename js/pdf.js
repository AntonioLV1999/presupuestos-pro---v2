/* Construcción del PDF del presupuesto con jsPDF (contracts/pdf.md). */
(function () {
  'use strict';

  var MARGEN = 15;
  var ANCHO = 210;
  var DERECHA = ANCHO - MARGEN;
  var LIMITE_INFERIOR = 280;

  function texto(doc, nombre) { doc.setTextColor.apply(doc, Tema.rgb(nombre)); }

  function rellenos(valores) {
    return valores.filter(function (v) { return v && String(v).trim() !== ''; });
  }

  function comprobarSalto(doc, y, alto) {
    if (y + alto > LIMITE_INFERIOR) {
      doc.addPage();
      return MARGEN + 5;
    }
    return y;
  }

  /** Cabecera con el logo a la izquierda y los datos rellenos de la profesional a la derecha. */
  function cabecera(doc, profesional) {
    var y = MARGEN;
    var altoLogo = 0;
    if (profesional.logo) {
      try {
        var props = doc.getImageProperties(profesional.logo);
        var alto = Math.min(40, props.height * 60 / props.width);
        var ancho = props.width * alto / props.height;
        var formato = profesional.logo.indexOf('data:image/png') === 0 ? 'PNG' : 'JPEG';
        doc.addImage(profesional.logo, formato, MARGEN, y, ancho, alto);
        altoLogo = alto;
      } catch (e) {
        altoLogo = 0;
      }
    }

    var lineaY = y + 5;
    texto(doc, 'texto');
    if (profesional.nombre && profesional.nombre.trim()) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text(profesional.nombre.trim(), DERECHA, lineaY, { align: 'right' });
      lineaY += 6;
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    var datos = rellenos([
      profesional.nif ? 'NIF: ' + profesional.nif.trim() : '',
      profesional.telefono,
      profesional.email
    ]);
    datos.forEach(function (texto) {
      doc.text(String(texto).trim(), DERECHA, lineaY, { align: 'right' });
      lineaY += 5;
    });
    if (profesional.direccion && profesional.direccion.trim()) {
      doc.splitTextToSize(profesional.direccion.trim(), 90).forEach(function (parte) {
        doc.text(parte, DERECHA, lineaY, { align: 'right' });
        lineaY += 5;
      });
    }
    return Math.max(y + altoLogo, lineaY) + 8;
  }

  function construir(presupuesto, profesional) {
    var jsPDF = window.jspdf.jsPDF;
    var doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    var prof = profesional || {};
    var totales = Calculos.totales(presupuesto);
    var porcentaje = Calculos.porcentajeEfectivo(presupuesto);

    texto(doc, 'texto');
    var y = cabecera(doc, prof);

    // Línea de acento a todo el ancho útil bajo la cabecera.
    doc.setDrawColor.apply(doc, Tema.rgb('acento'));
    doc.setLineWidth(0.6);
    doc.line(MARGEN, y - 4, DERECHA, y - 4);
    y += 4;

    // Título, número y fechas.
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    texto(doc, 'acento');
    doc.text('PRESUPUESTO', MARGEN, y);
    doc.setFontSize(12);
    texto(doc, 'suave');
    doc.text('Nº ' + presupuesto.numero, DERECHA, y, { align: 'right' });
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Fecha de emisión: ' + Formato.fecha(presupuesto.fechaEmision), MARGEN, y);
    y += 5;
    doc.text('Válido hasta: ' + Formato.fecha(Calculos.fechaValidez(presupuesto.fechaEmision)), MARGEN, y);
    y += 10;

    // Cliente.
    var cliente = presupuesto.cliente || {};
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    texto(doc, 'suave');
    doc.text('Cliente', MARGEN, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    texto(doc, 'texto');
    rellenos([
      cliente.nombre,
      cliente.nif ? 'NIF/CIF: ' + cliente.nif : '',
      cliente.email
    ]).forEach(function (t) {
      doc.splitTextToSize(String(t).trim(), 120).forEach(function (parte) {
        doc.text(parte, MARGEN, y);
        y += 5;
      });
    });
    y += 4;

    // Líneas del presupuesto (solo las del presupuesto, nunca el catálogo).
    doc.autoTable({
      startY: y,
      margin: { left: MARGEN, right: MARGEN },
      theme: 'plain',
      showHead: 'everyPage',
      head: [['Concepto', 'Cantidad', 'Precio unitario', 'Importe']],
      body: presupuesto.lineas.map(function (l) {
        return [
          l.concepto,
          Formato.cantidad(l.cantidadCentesimas),
          Formato.importe(l.precioCentimos),
          Formato.importe(Calculos.importeLinea(l.cantidadCentesimas, l.precioCentimos))
        ];
      }),
      styles: {
        font: 'helvetica', fontSize: 10, cellPadding: 2.5, textColor: Tema.rgb('texto'),
        overflow: 'linebreak', lineColor: Tema.rgb('borde'), lineWidth: { bottom: 0.2 }
      },
      headStyles: { fillColor: Tema.rgb('acento'), textColor: Tema.rgb('superficie'), fontStyle: 'bold', lineWidth: 0 },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { halign: 'right', cellWidth: 22 },
        2: { halign: 'right', cellWidth: 35 },
        3: { halign: 'right', cellWidth: 35 }
      },
      didParseCell: function (dato) {
        if (dato.section === 'head' && dato.column.index > 0) { dato.cell.styles.halign = 'right'; }
      }
    });
    y = doc.lastAutoTable.finalY + 8;

    // Totales (el bloque entero cabe en una página).
    var filas = [
      ['Base imponible', Formato.importe(totales.baseCentimos)],
      ['IVA (' + Calculos.IVA + ' %)', Formato.importe(totales.ivaCentimos)]
    ];
    if (totales.retencionCentimos > 0) {
      filas.push(['Retención IRPF (' + porcentaje + ' %)', Formato.importe(-totales.retencionCentimos)]);
    }
    y = comprobarSalto(doc, y, filas.length * 6 + 16);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    texto(doc, 'texto');
    filas.forEach(function (fila) {
      doc.text(fila[0], 150, y, { align: 'right' });
      doc.text(fila[1], DERECHA, y, { align: 'right' });
      y += 6;
    });
    doc.setFillColor.apply(doc, Tema.rgb('fondo'));
    doc.rect(110, y - 3, DERECHA - 110, 10, 'F');
    doc.setDrawColor.apply(doc, Tema.rgb('texto'));
    doc.setLineWidth(0.4);
    doc.line(110, y - 3, DERECHA, y - 3);
    y += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('TOTAL', 150, y, { align: 'right' });
    doc.text(Formato.importe(totales.totalCentimos), DERECHA, y, { align: 'right' });
    y += 12;

    // Observaciones.
    if (presupuesto.observaciones && presupuesto.observaciones.trim()) {
      y = comprobarSalto(doc, y, 15);
      doc.setFontSize(9);
      texto(doc, 'suave');
      doc.text('Observaciones', MARGEN, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      texto(doc, 'texto');
      doc.splitTextToSize(presupuesto.observaciones.trim(), ANCHO - 2 * MARGEN).forEach(function (parte) {
        y = comprobarSalto(doc, y, 5);
        doc.text(parte, MARGEN, y);
        y += 5;
      });
    }

    return doc;
  }

  function nombreArchivo(presupuesto) {
    return 'Presupuesto-' + presupuesto.numero + '.pdf';
  }

  /** Genera y descarga el PDF (FR-027, FR-028). */
  function generar(presupuesto, profesional) {
    construir(presupuesto, profesional).save(nombreArchivo(presupuesto));
  }

  window.Pdf = { construir: construir, generar: generar, nombreArchivo: nombreArchivo };
}());
