/* Editor de presupuesto (contracts/pantallas.md, apartado 2). */
(function () {
  'use strict';

  var TIPOS = [
    { valor: 'particular', texto: 'Particular' },
    { valor: 'empresa', texto: 'Empresa' },
    { valor: 'autonomo', texto: 'Autónomo' }
  ];

  var borrador = null;
  var seccion = null;
  var cambios = false;
  var catalogoAbierto = false;

  function nuevoBorrador() {
    return {
      id: null,
      numero: null,
      fechaEmision: null,
      cliente: { nombre: '', nif: '', email: '', tipo: 'particular', clienteGuardadoId: null },
      porcentajeRetencion: 15,
      lineas: [],
      observaciones: '',
      guardarEnClientes: false
    };
  }

  function lineaEditable(linea) {
    return {
      concepto: linea.concepto,
      cantidadTexto: Formato.cantidad(linea.cantidadCentesimas),
      precioTexto: Formato.importeEditable(linea.precioCentimos)
    };
  }

  function desdePresupuesto(p) {
    return {
      id: p.id,
      numero: p.numero,
      fechaEmision: p.fechaEmision,
      cliente: {
        nombre: p.cliente.nombre || '',
        nif: p.cliente.nif || '',
        email: p.cliente.email || '',
        tipo: p.cliente.tipo || 'particular',
        clienteGuardadoId: p.cliente.clienteGuardadoId || null
      },
      porcentajeRetencion: p.porcentajeRetencion === 7 ? 7 : 15,
      lineas: (p.lineas || []).map(lineaEditable),
      observaciones: p.observaciones || '',
      guardarEnClientes: false
    };
  }

  /** Convierte el borrador en un presupuesto con importes en céntimos. */
  function aPresupuesto() {
    var c = borrador.cliente;
    return {
      cliente: {
        nombre: c.nombre.trim(),
        nif: c.nif.trim(),
        email: c.email.trim(),
        tipo: c.tipo,
        clienteGuardadoId: c.clienteGuardadoId || null
      },
      porcentajeRetencion: Validacion.normalizarRetencion(c.tipo, borrador.porcentajeRetencion),
      lineas: borrador.lineas.map(function (l) {
        return {
          concepto: l.concepto.trim(),
          cantidadCentesimas: Formato.leerCantidad(l.cantidadTexto),
          precioCentimos: Formato.leerImporte(l.precioTexto)
        };
      }),
      observaciones: borrador.observaciones
    };
  }

  function buscarPresupuesto(id) {
    return App.estado.presupuestos.filter(function (p) { return p.id === id; })[0] || null;
  }

  // ------------------------------------------------------------- Totales

  /** Totales para la pantalla: lo que aún no se puede leer cuenta como 0. */
  function totalesEnPantalla() {
    var p = aPresupuesto();
    p.lineas = p.lineas.map(function (l) {
      return {
        cantidadCentesimas: l.cantidadCentesimas || 0,
        precioCentimos: l.precioCentimos || 0
      };
    });
    return { totales: Calculos.totales(p), porcentaje: Calculos.porcentajeEfectivo(p) };
  }

  function actualizarTotales() {
    if (!seccion) { return; }
    var r = totalesEnPantalla();
    var t = r.totales;
    var poner = function (clave, texto) {
      var nodo = seccion.querySelector('[data-total="' + clave + '"]');
      if (nodo) { nodo.textContent = texto; }
    };
    poner('base', Formato.importe(t.baseCentimos));
    poner('iva', Formato.importe(t.ivaCentimos));
    poner('etiqueta-retencion', r.porcentaje > 0 ? 'Retención IRPF (' + r.porcentaje + ' %)' : 'Retención IRPF');
    poner('retencion', Formato.importe(-t.retencionCentimos).replace('-0,00', '0,00'));
    poner('total', Formato.importe(t.totalCentimos));
    borrador.lineas.forEach(function (l, i) {
      var cantidad = Formato.leerCantidad(l.cantidadTexto) || 0;
      var precio = Formato.leerImporte(l.precioTexto) || 0;
      poner('importe-' + i, Formato.importe(Calculos.importeLinea(cantidad, precio)));
    });
  }

  function marcarCambio() {
    cambios = true;
    actualizarTotales();
  }

  // ------------------------------------------------------- Guardar y PDF

  /** Guarda el presupuesto. Devuelve el presupuesto guardado o null si no se pudo (FR-012 a FR-015). */
  function guardar(mostrarExito) {
    var p = aPresupuesto();
    var errores = Validacion.validarPresupuesto(p);
    App.mostrarErrores(seccion, errores);
    if (errores.length) {
      var unicos = [];
      errores.forEach(function (e) { if (unicos.indexOf(e.mensaje) === -1) { unicos.push(e.mensaje); } });
      App.mensaje('No se ha podido guardar. Revisa estos datos:', 'error', unicos);
      return null;
    }

    var guardado = null;
    var ok = App.cambiar(function (estado) {
      if (borrador.id) {
        p.id = borrador.id;
        p.numero = borrador.numero;
        p.fechaEmision = borrador.fechaEmision;
      } else {
        var fecha = Formato.hoy();
        var siguiente = Numeracion.siguiente(estado.contadores, fecha);
        estado.contadores = siguiente.contadores;
        p.id = Almacen.nuevoId();
        p.numero = siguiente.numero;
        p.fechaEmision = fecha;
      }
      if (!p.cliente.clienteGuardadoId && borrador.guardarEnClientes) {
        var nuevo = {
          id: Almacen.nuevoId(),
          nombre: p.cliente.nombre,
          nif: p.cliente.nif,
          email: p.cliente.email,
          tipo: p.cliente.tipo
        };
        estado.clientes.push(nuevo);
        p.cliente.clienteGuardadoId = nuevo.id;
      }
      var posicion = -1;
      estado.presupuestos.forEach(function (existente, i) { if (existente.id === p.id) { posicion = i; } });
      if (posicion >= 0) {
        estado.presupuestos[posicion] = p;
      } else {
        estado.presupuestos.push(p);
      }
      guardado = p;
    });
    if (!ok) { return null; }

    borrador = desdePresupuesto(guardado);
    cambios = false;
    pintar();
    if (mostrarExito) { App.mensaje('Presupuesto ' + guardado.numero + ' guardado.', 'exito'); }
    return guardado;
  }

  /** Descarga el PDF de un presupuesto ya guardado, con el aviso de datos si procede (FR-016, FR-030). */
  function descargarGuardado(presupuesto) {
    var requisitos = Validacion.requisitosPdf(presupuesto, App.estado.profesional);
    if (requisitos.bloqueo) {
      App.mensaje(requisitos.bloqueo, 'error');
      return false;
    }
    if (requisitos.aviso && !App.confirmar(requisitos.aviso)) { return false; }
    Pdf.generar(presupuesto, App.estado.profesional);
    return true;
  }

  /** Botón «Descargar PDF» del editor: comprueba las líneas antes de guardar para no gastar un número (FR-027a). */
  function descargar() {
    var requisitos = Validacion.requisitosPdf(aPresupuesto(), App.estado.profesional);
    if (requisitos.bloqueo) {
      App.mensaje(requisitos.bloqueo, 'error');
      return;
    }
    var presupuesto = (borrador.id && !cambios) ? buscarPresupuesto(borrador.id) : guardar(true);
    if (!presupuesto) { return; }
    descargarGuardado(presupuesto);
  }

  // ------------------------------------------------------------ Pantalla

  function entrada(valor, campo, alCambiar, extra) {
    var props = { type: 'text', value: valor, 'data-campo': campo };
    Object.keys(extra || {}).forEach(function (k) { props[k] = extra[k]; });
    props.oninput = function (e) { alCambiar(e.target.value); marcarCambio(); };
    return App.el('input', props);
  }

  function pintarCabecera() {
    var guardado = !!borrador.id;
    var fecha = guardado ? borrador.fechaEmision : Formato.hoy();
    var nota = guardado ? null : App.el('span', { class: 'provisional', text: ' (provisional)' });
    return App.el('div', { class: 'cabecera-presupuesto' }, [
      App.el('div', {}, ['Número', App.el('strong', { text: borrador.numero || 'Sin número (se asigna al guardar)' })]),
      App.el('div', {}, ['Fecha de emisión', App.el('strong', {}, [Formato.fecha(fecha), nota])]),
      App.el('div', {}, ['Válido hasta', App.el('strong', {}, [Formato.fecha(Calculos.fechaValidez(fecha)), nota && nota.cloneNode(true)])])
    ]);
  }

  function elegirCliente(id) {
    var c = borrador.cliente;
    if (!id) {
      borrador.cliente = { nombre: '', nif: '', email: '', tipo: 'particular', clienteGuardadoId: null };
    } else {
      var guardado = App.estado.clientes.filter(function (x) { return x.id === id; })[0];
      if (guardado) {
        c.nombre = guardado.nombre;
        c.nif = guardado.nif || '';
        c.email = guardado.email || '';
        c.tipo = guardado.tipo;
        c.clienteGuardadoId = guardado.id;
        borrador.porcentajeRetencion = 15;
      }
    }
    borrador.guardarEnClientes = false;
    cambios = true;
    pintar();
  }

  function pintarCliente() {
    var c = borrador.cliente;
    var opciones = [App.el('option', { value: '', text: 'Cliente nuevo' })].concat(
      App.estado.clientes.map(function (cl) {
        return App.el('option', { value: cl.id, text: cl.nombre, selected: cl.id === c.clienteGuardadoId });
      })
    );
    var selector = App.el('select', { onchange: function (e) { elegirCliente(e.target.value); } }, opciones);

    var tipo = App.el('select', {
      'data-campo': 'cliente.tipo',
      onchange: function (e) {
        var antes = c.tipo;
        c.tipo = e.target.value;
        if (antes === 'particular' && c.tipo !== 'particular') { borrador.porcentajeRetencion = 15; }
        cambios = true;
        pintar();
      }
    }, TIPOS.map(function (t) { return App.el('option', { value: t.valor, text: t.texto, selected: t.valor === c.tipo }); }));

    var hijos = [
      App.campo('Elegir cliente guardado', selector),
      App.campo('Nombre o razón social', entrada(c.nombre, 'cliente.nombre', function (v) { c.nombre = v; })),
      App.campo('NIF/CIF', entrada(c.nif, 'cliente.nif', function (v) { c.nif = v; })),
      App.campo('Email', entrada(c.email, 'cliente.email', function (v) { c.email = v; })),
      App.campo('Tipo de cliente', tipo)
    ];

    if (c.tipo !== 'particular') {
      hijos.push(App.campo('Retención IRPF', App.el('select', {
        onchange: function (e) { borrador.porcentajeRetencion = parseInt(e.target.value, 10); marcarCambio(); }
      }, [
        App.el('option', { value: '15', text: '15 %', selected: borrador.porcentajeRetencion !== 7 }),
        App.el('option', { value: '7', text: '7 %', selected: borrador.porcentajeRetencion === 7 })
      ])));
    }

    if (!c.clienteGuardadoId) {
      hijos.push(App.el('div', {}, [App.el('label', { class: 'casilla' }, [
        App.el('input', {
          type: 'checkbox',
          checked: borrador.guardarEnClientes,
          onchange: function (e) { borrador.guardarEnClientes = e.target.checked; cambios = true; }
        }),
        'Guardar en mis clientes'
      ])]));
    }

    return App.el('div', { class: 'formulario recuadro' }, hijos);
  }

  function pintarLineas() {
    if (borrador.lineas.length === 0) {
      return App.el('p', { class: 'vacio', text: 'Todavía no hay líneas. Añade una desde el catálogo o escríbela a mano.' });
    }
    var filas = borrador.lineas.map(function (l, i) {
      return App.el('tr', {}, [
        App.el('td', { class: 'concepto', 'data-label': 'Concepto' }, [entrada(l.concepto, 'lineas.' + i + '.concepto', function (v) { l.concepto = v; })]),
        App.el('td', { 'data-label': 'Cantidad' }, [entrada(l.cantidadTexto, 'lineas.' + i + '.cantidad', function (v) { l.cantidadTexto = v; }, { inputmode: 'decimal', size: '6' })]),
        App.el('td', { 'data-label': 'Precio unitario (€)' }, [entrada(l.precioTexto, 'lineas.' + i + '.precio', function (v) { l.precioTexto = v; }, { inputmode: 'decimal', size: '10' })]),
        App.el('td', { class: 'numero', 'data-label': 'Importe', 'data-total': 'importe-' + i }),
        App.el('td', {}, [App.el('button', {
          type: 'button',
          class: 'pequeno peligro',
          text: 'Quitar',
          onclick: function () { borrador.lineas.splice(i, 1); cambios = true; pintar(); }
        })])
      ]);
    });
    return App.el('table', { class: 'lineas' }, [
      App.el('thead', {}, [App.el('tr', {}, [
        App.el('th', { text: 'Concepto' }),
        App.el('th', { text: 'Cantidad' }),
        App.el('th', { text: 'Precio unitario (€)' }),
        App.el('th', { class: 'numero', text: 'Importe' }),
        App.el('th', {})
      ])]),
      App.el('tbody', {}, filas)
    ]);
  }

  function pintarCatalogo() {
    if (!catalogoAbierto || App.estado.catalogo.length === 0) { return null; }
    return App.el('div', { class: 'lista-catalogo' }, App.estado.catalogo.map(function (s) {
      return App.el('button', {
        type: 'button',
        onclick: function () {
          borrador.lineas.push(lineaEditable(Calculos.lineaDesdeServicio(s)));
          catalogoAbierto = false;
          cambios = true;
          pintar();
        }
      }, [App.el('span', { text: s.nombre }), App.el('span', { text: Formato.importe(s.precioCentimos) })]);
    }));
  }

  function pintarTotales() {
    var fila = function (etiqueta, clave, claseFila) {
      return App.el('tr', { class: claseFila }, [
        App.el('td', { 'data-total': clave === 'retencion' ? 'etiqueta-retencion' : null, text: etiqueta }),
        App.el('td', { class: 'numero', 'data-total': clave })
      ]);
    };
    return App.el('table', { class: 'totales' }, [App.el('tbody', {}, [
      fila('Base imponible', 'base'),
      fila('IVA (' + Calculos.IVA + ' %)', 'iva'),
      fila('Retención IRPF', 'retencion'),
      fila('Total', 'total', 'total')
    ])]);
  }

  function pintar() {
    seccion.innerHTML = '';
    var titulo = borrador.numero ? 'Presupuesto ' + borrador.numero : 'Nuevo presupuesto';
    var sinCatalogo = App.estado.catalogo.length === 0;

    seccion.appendChild(App.el('h2', { text: titulo }));
    seccion.appendChild(pintarCabecera());
    seccion.appendChild(App.el('h3', { text: 'Cliente' }));
    seccion.appendChild(pintarCliente());
    seccion.appendChild(App.el('h3', { text: 'Líneas' }));
    seccion.appendChild(pintarLineas());
    seccion.appendChild(App.el('div', { class: 'acciones' }, [
      App.el('button', {
        type: 'button',
        text: 'Añadir del catálogo',
        disabled: sinCatalogo,
        title: sinCatalogo ? 'Tu catálogo está vacío. Añade servicios en «Catálogo».' : null,
        onclick: function () { catalogoAbierto = !catalogoAbierto; pintar(); }
      }),
      App.el('button', {
        type: 'button',
        text: 'Añadir línea manual',
        onclick: function () {
          borrador.lineas.push({ concepto: '', cantidadTexto: '1', precioTexto: '' });
          cambios = true;
          pintar();
          var conceptos = seccion.querySelectorAll('td.concepto input');
          if (conceptos.length) { conceptos[conceptos.length - 1].focus(); }
        }
      })
    ]));
    var catalogo = pintarCatalogo();
    if (catalogo) { seccion.appendChild(catalogo); }

    seccion.appendChild(App.el('h3', { text: 'Observaciones' }));
    seccion.appendChild(App.el('textarea', {
      'data-campo': 'observaciones',
      value: borrador.observaciones,
      placeholder: 'Opcional. Por ejemplo, forma de pago o condiciones.',
      oninput: function (e) { borrador.observaciones = e.target.value; cambios = true; }
    }));

    seccion.appendChild(pintarTotales());
    seccion.appendChild(App.el('div', { class: 'acciones' }, [
      App.el('button', { type: 'button', class: 'primario', 'data-guarda': true, text: 'Guardar', onclick: function () { guardar(true); } }),
      App.el('button', { type: 'button', 'data-guarda': true, text: 'Descargar PDF', onclick: descargar }),
      App.el('button', { type: 'button', text: 'Volver', onclick: function () { App.ir('presupuestos'); } })
    ]));

    if (App.estaBloqueado()) {
      Array.prototype.forEach.call(seccion.querySelectorAll('[data-guarda]'), function (b) { b.disabled = true; });
    }
    actualizarTotales();
  }

  function mostrar(contenedor, datos) {
    seccion = contenedor;
    catalogoAbierto = false;
    cambios = false;
    var existente = datos && datos.id ? buscarPresupuesto(datos.id) : null;
    borrador = existente ? desdePresupuesto(JSON.parse(JSON.stringify(existente))) : nuevoBorrador();
    pintar();
  }

  window.Pantallas = window.Pantallas || {};
  window.Pantallas.editor = { mostrar: mostrar, descargarGuardado: descargarGuardado };
}());
