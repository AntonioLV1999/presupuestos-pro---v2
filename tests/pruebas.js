/* Pruebas de Presupuestos Pro: se ejecutan abriendo pruebas.html en el navegador. */
(function () {
  'use strict';

  var resultados = [];
  var seccionActual = '';

  function seccion(nombre) {
    seccionActual = nombre;
    resultados.push({ seccion: nombre });
  }

  function texto(valor) {
    return typeof valor === 'string' ? '«' + valor + '»' : JSON.stringify(valor);
  }

  function esIgual(obtenido, esperado, descripcion) {
    if (JSON.stringify(obtenido) !== JSON.stringify(esperado)) {
      throw new Error((descripcion ? descripcion + ': ' : '') +
        'se obtuvo ' + texto(obtenido) + ' y se esperaba ' + texto(esperado));
    }
  }

  function caso(nombre, fn) {
    try {
      fn();
      resultados.push({ nombre: nombre, ok: true });
    } catch (e) {
      resultados.push({ nombre: nombre, ok: false, detalle: e && e.message ? e.message : String(e) });
    }
  }

  function mensajes(errores) {
    return (errores || []).map(function (e) { return e.mensaje; });
  }

  function linea(cantidadCentesimas, precioCentimos, concepto) {
    return { concepto: concepto || 'Servicio', cantidadCentesimas: cantidadCentesimas, precioCentimos: precioCentimos };
  }

  function presupuesto(tipo, porcentaje, lineas) {
    return {
      cliente: { nombre: 'Cliente de prueba', nif: '', email: '', tipo: tipo },
      porcentajeRetencion: porcentaje,
      lineas: lineas,
      observaciones: ''
    };
  }

  function repetir(caracter, veces) {
    return new Array(veces + 1).join(caracter);
  }

  var ejemplo = [linea(100, 75000), linea(200, 4500), linea(300, 12000)];

  // ---------------------------------------------------------------- Formato
  seccion('Formato');

  caso('Importes con punto de miles y coma decimal', function () {
    esIgual(Formato.importe(123456), '1.234,56 €');
    esIgual(Formato.importe(0), '0,00 €');
    esIgual(Formato.importe(100), '1,00 €');
    esIgual(Formato.importe(127200), '1.272,00 €');
    esIgual(Formato.importe(100000000), '1.000.000,00 €');
  });

  caso('Importe negativo con guion normal', function () {
    esIgual(Formato.importe(-18000), '-180,00 €');
  });

  caso('Cantidades sin decimales si son enteras', function () {
    esIgual(Formato.cantidad(150), '1,5');
    esIgual(Formato.cantidad(300), '3');
    esIgual(Formato.cantidad(125), '1,25');
  });

  caso('Fechas en formato dd/mm/aaaa', function () {
    esIgual(Formato.fecha('2026-10-23'), '23/10/2026');
  });

  caso('Lectura de importes escritos', function () {
    esIgual(Formato.leerImporte('1.234,56'), 123456);
    esIgual(Formato.leerImporte('1.234'), 123400);
    esIgual(Formato.leerImporte('750'), 75000);
    esIgual(Formato.leerImporte('45,5'), 4550);
    esIgual(Formato.leerImporte('-5'), -500);
    esIgual(Formato.leerImporte('abc'), null);
    esIgual(Formato.leerImporte('1,234'), null);
  });

  caso('Lectura de cantidades con hasta dos decimales', function () {
    esIgual(Formato.leerCantidad('1,5'), 150);
    esIgual(Formato.leerCantidad('3'), 300);
    esIgual(Formato.leerCantidad('1,555'), null);
  });

  caso('Fecha de hoy en formato AAAA-MM-DD', function () {
    esIgual(/^\d{4}-\d{2}-\d{2}$/.test(Formato.hoy()), true);
  });

  // --------------------------------------------------------------- Cálculos
  seccion('Cálculos');

  caso('Importes de línea', function () {
    esIgual(Calculos.importeLinea(100, 75000), 75000);
    esIgual(Calculos.importeLinea(200, 4500), 9000);
    esIgual(Calculos.importeLinea(300, 12000), 36000);
    esIgual(Calculos.importeLinea(150, 4000), 6000);
    esIgual(Calculos.importeLinea(150, 33), 50, '1,5 × 0,33 € redondeado');
  });

  caso('Base de 2 × 50,00 € y 3 × 20,00 € es 160,00 €', function () {
    esIgual(Calculos.totales(presupuesto('particular', 0, [linea(200, 5000), linea(300, 2000)])).baseCentimos, 16000);
  });

  caso('100,00 € para un particular: IVA 21,00 €, retención 0,00 €, total 121,00 €', function () {
    esIgual(Calculos.totales(presupuesto('particular', 0, [linea(100, 10000)])),
      { baseCentimos: 10000, ivaCentimos: 2100, retencionCentimos: 0, totalCentimos: 12100 });
  });

  caso('100,00 € para una empresa al 15 %: retención 15,00 €, total 106,00 €', function () {
    esIgual(Calculos.totales(presupuesto('empresa', 15, [linea(100, 10000)])),
      { baseCentimos: 10000, ivaCentimos: 2100, retencionCentimos: 1500, totalCentimos: 10600 });
  });

  caso('100,00 € para un autónomo al 7 %: retención 7,00 €, total 114,00 €', function () {
    esIgual(Calculos.totales(presupuesto('autonomo', 7, [linea(100, 10000)])),
      { baseCentimos: 10000, ivaCentimos: 2100, retencionCentimos: 700, totalCentimos: 11400 });
  });

  caso('Ejemplo completo, empresa al 15 %: total 1.272,00 €', function () {
    esIgual(Calculos.totales(presupuesto('empresa', 15, ejemplo)),
      { baseCentimos: 120000, ivaCentimos: 25200, retencionCentimos: 18000, totalCentimos: 127200 });
  });

  caso('Ejemplo completo al 7 %: retención 84,00 €, total 1.368,00 €', function () {
    var t = Calculos.totales(presupuesto('empresa', 7, ejemplo));
    esIgual(t.retencionCentimos, 8400);
    esIgual(t.totalCentimos, 136800);
  });

  caso('Ejemplo completo para un particular: total 1.452,00 €', function () {
    esIgual(Calculos.totales(presupuesto('particular', 0, ejemplo)).totalCentimos, 145200);
  });

  caso('Caso de comprobación: base 1.000,00 € al 15 %, total 1.060,00 €', function () {
    esIgual(Calculos.totales(presupuesto('empresa', 15, [linea(100, 100000)])),
      { baseCentimos: 100000, ivaCentimos: 21000, retencionCentimos: 15000, totalCentimos: 106000 });
  });

  caso('Un particular nunca tiene retención aunque se marque un porcentaje', function () {
    esIgual(Calculos.totales(presupuesto('particular', 15, [linea(100, 10000)])).retencionCentimos, 0);
  });

  caso('Validez a 30 días naturales', function () {
    esIgual(Calculos.fechaValidez('2026-10-23'), '2026-11-22');
    esIgual(Calculos.fechaValidez('2026-12-15'), '2027-01-14');
  });

  // ------------------------------------------------------------- Numeración
  seccion('Numeración');

  caso('Primer presupuesto del año: 2026-001', function () {
    esIgual(Numeracion.siguiente({}, '2026-03-01'), { numero: '2026-001', contadores: { '2026': 1 } });
  });

  caso('Segundo presupuesto del año: 2026-002', function () {
    esIgual(Numeracion.siguiente({ '2026': 1 }, '2026-03-02').numero, '2026-002');
  });

  caso('Un número borrado no se reutiliza', function () {
    esIgual(Numeracion.siguiente({ '2026': 3 }, '2026-05-01').numero, '2026-004');
  });

  caso('La numeración se reinicia con el año nuevo', function () {
    esIgual(Numeracion.siguiente({ '2026': 5 }, '2027-01-02'),
      { numero: '2027-001', contadores: { '2026': 5, '2027': 1 } });
  });

  caso('Más de 999 presupuestos en un año', function () {
    esIgual(Numeracion.siguiente({ '2026': 999 }, '2026-12-01').numero, '2026-1000');
  });

  caso('No modifica los contadores recibidos', function () {
    var contadores = { '2026': 2 };
    Numeracion.siguiente(contadores, '2026-06-01');
    esIgual(contadores, { '2026': 2 });
  });

  // ------------------------------------------------- Validación de presupuesto
  seccion('Validación de presupuesto');

  caso('Línea sin concepto', function () {
    esIgual(mensajes(Validacion.validarLinea(linea(100, 1000, '  '), 0)), ['Escribe un concepto para esta línea.']);
  });

  caso('Cantidad 0 o negativa', function () {
    esIgual(mensajes(Validacion.validarLinea(linea(0, 1000), 0)), ['La cantidad debe ser mayor que cero.']);
    esIgual(mensajes(Validacion.validarLinea(linea(-100, 1000), 0)), ['La cantidad debe ser mayor que cero.']);
  });

  caso('Precio negativo', function () {
    esIgual(mensajes(Validacion.validarLinea(linea(100, -500), 0)), ['El precio debe ser igual o superior a 0 €.']);
  });

  caso('Precio 0 es válido', function () {
    esIgual(Validacion.validarLinea(linea(100, 0), 0), []);
  });

  caso('Cliente sin nombre', function () {
    var p = presupuesto('particular', 0, [linea(100, 1000)]);
    p.cliente.nombre = '';
    esIgual(mensajes(Validacion.validarPresupuesto(p)), ['Escribe el nombre o la razón social del cliente.']);
  });

  caso('Un presupuesto sin líneas se puede guardar', function () {
    esIgual(Validacion.validarPresupuesto(presupuesto('empresa', 15, [])), []);
  });

  caso('Textos demasiado largos', function () {
    esIgual(mensajes(Validacion.validarLinea(linea(100, 1000, repetir('a', 201)), 0)),
      ['Este texto admite como máximo 200 caracteres.']);
    var p = presupuesto('particular', 0, []);
    p.observaciones = repetir('a', 1001);
    esIgual(mensajes(Validacion.validarPresupuesto(p)), ['Este texto admite como máximo 1000 caracteres.']);
  });

  caso('Retención según el tipo de cliente', function () {
    esIgual(Validacion.normalizarRetencion('particular', 15), 0);
    esIgual(Validacion.normalizarRetencion('empresa', 0), 15);
    esIgual(Validacion.normalizarRetencion('autonomo', 7), 7);
    esIgual(Validacion.normalizarRetencion('empresa', 99), 15);
  });

  // ---------------------------------------------------- Requisitos del PDF
  seccion('Requisitos del PDF');

  var profesionalCompleta = { nombre: 'Ana Ruiz', nif: '12345678Z', telefono: '', email: '', direccion: '', logo: '' };

  caso('Sin líneas no se puede descargar', function () {
    esIgual(Validacion.requisitosPdf(presupuesto('particular', 0, []), profesionalCompleta),
      { bloqueo: 'Añade al menos una línea para poder descargar el presupuesto.', aviso: null });
  });

  caso('Sin nombre o NIF de la profesional se avisa, pero no se bloquea', function () {
    var aviso = 'Faltan tus datos (nombre y NIF). Puedes completarlos en «Perfil». ¿Descargar el PDF igualmente?';
    esIgual(Validacion.requisitosPdf(presupuesto('particular', 0, [linea(100, 1000)]),
      { nombre: '', nif: '12345678Z' }), { bloqueo: null, aviso: aviso });
    esIgual(Validacion.requisitosPdf(presupuesto('particular', 0, [linea(100, 1000)]),
      { nombre: 'Ana Ruiz', nif: ' ' }), { bloqueo: null, aviso: aviso });
  });

  caso('Con todo completo no hay bloqueo ni aviso', function () {
    esIgual(Validacion.requisitosPdf(presupuesto('particular', 0, [linea(100, 1000)]), profesionalCompleta),
      { bloqueo: null, aviso: null });
  });

  // ------------------------------------------------ Validación de datos y logo
  seccion('Validación de datos y logo');

  var mensajeLogo = 'El logo debe ser una imagen PNG o JPG de 500 KB como máximo.';

  caso('Logo GIF rechazado', function () {
    esIgual(Validacion.validarLogo({ type: 'image/gif', size: 1000 }), mensajeLogo);
  });

  caso('Logo de más de 500 KB rechazado', function () {
    esIgual(Validacion.validarLogo({ type: 'image/png', size: 600 * 1024 }), mensajeLogo);
  });

  caso('Logo JPG de 100 KB aceptado', function () {
    esIgual(Validacion.validarLogo({ type: 'image/jpeg', size: 100 * 1024 }), null);
  });

  caso('Nombre de la profesional de 121 caracteres rechazado', function () {
    esIgual(mensajes(Validacion.validarProfesional({ nombre: repetir('a', 121), nif: '', telefono: '', email: '', direccion: '' })),
      ['Este texto admite como máximo 120 caracteres.']);
  });

  caso('Datos de la profesional vacíos y email sin validar', function () {
    esIgual(Validacion.validarProfesional({ nombre: '', nif: '', telefono: '', email: '', direccion: '' }), []);
    esIgual(Validacion.validarProfesional({ nombre: 'Ana', nif: '', telefono: '', email: 'ana@', direccion: '' }), []);
  });

  // ---------------------------------------------------------------- Catálogo
  seccion('Catálogo');

  caso('Servicio sin nombre rechazado', function () {
    esIgual(mensajes(Validacion.validarServicio({ nombre: ' ', precioCentimos: 1000 })), ['Escribe el nombre del servicio.']);
  });

  caso('Servicio con precio negativo rechazado', function () {
    esIgual(mensajes(Validacion.validarServicio({ nombre: 'Diseño', precioCentimos: -1 })), ['El precio debe ser igual o superior a 0 €.']);
  });

  caso('Servicio con precio 0 aceptado', function () {
    esIgual(Validacion.validarServicio({ nombre: 'Diseño', precioCentimos: 0 }), []);
  });

  caso('Una línea creada desde el catálogo es una copia independiente', function () {
    var servicio = { id: 's1', nombre: 'Diseño de identidad visual', precioCentimos: 75000 };
    var l = Calculos.lineaDesdeServicio(servicio);
    esIgual(l, { concepto: 'Diseño de identidad visual', cantidadCentesimas: 100, precioCentimos: 75000 });
    l.precioCentimos = 1;
    esIgual(servicio.precioCentimos, 75000);
  });

  // ---------------------------------------------------------------- Vigencia
  seccion('Vigencia y resumen de actividad');

  caso('Un presupuesto es vigente hasta el último día de validez y caducado después', function () {
    var p = { fechaEmision: '2026-10-23' };
    esIgual(Vigencia.estado(p, '2026-11-22'), 'vigente');
    esIgual(Vigencia.estado(p, '2026-11-23'), 'caducado');
  });

  caso('El resumen sin datos sale todo a cero', function () {
    esIgual(Vigencia.resumen({ presupuestos: [], clientes: [], catalogo: [] }, '2026-10-27'),
      { total: 0, vigentes: 0, caducados: 0, clientes: 0, servicios: 0 });
  });

  caso('Vigentes más caducados suman el total de presupuestos', function () {
    var datos = {
      presupuestos: [{ fechaEmision: '2026-10-20' }, { fechaEmision: '2026-01-01' }, { fechaEmision: '2026-01-02' }],
      clientes: [{}, {}],
      catalogo: [{}]
    };
    var r = Vigencia.resumen(datos, '2026-10-27');
    esIgual(r, { total: 3, vigentes: 1, caducados: 2, clientes: 2, servicios: 1 });
    esIgual(r.vigentes + r.caducados, r.total);
  });

  // --------------------------------------------------------------- Resultado
  function pintar() {
    var contenedor = document.getElementById('resultados');
    var fallidas = 0;
    var total = 0;
    resultados.forEach(function (r) {
      var nodo;
      if (r.seccion) {
        nodo = document.createElement('h2');
        nodo.textContent = r.seccion;
      } else {
        total++;
        if (!r.ok) { fallidas++; }
        nodo = document.createElement('div');
        nodo.className = 'caso ' + (r.ok ? 'ok' : 'fallo');
        nodo.textContent = (r.ok ? '✔ ' : '✘ ') + r.nombre;
        if (!r.ok) {
          var detalle = document.createElement('span');
          detalle.className = 'detalle';
          detalle.textContent = r.detalle;
          nodo.appendChild(detalle);
        }
      }
      contenedor.appendChild(nodo);
    });
    var resumen = document.getElementById('resumen');
    if (fallidas === 0) {
      resumen.textContent = 'Todas las pruebas superadas (' + total + ' casos)';
      resumen.className = 'caso ok';
    } else {
      resumen.textContent = fallidas + (fallidas === 1 ? ' prueba fallida' : ' pruebas fallidas') + ' de ' + total;
      resumen.className = 'caso fallo';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', pintar);
  } else {
    pintar();
  }
}());
