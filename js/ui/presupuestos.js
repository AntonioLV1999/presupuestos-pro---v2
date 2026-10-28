/* Pantalla de presupuestos guardados (contracts/pantallas.md, apartado 1; FR-017, FR-018). */
(function () {
  'use strict';

  function ordenados() {
    return App.estado.presupuestos.slice().sort(function (a, b) {
      if (a.fechaEmision !== b.fechaEmision) { return a.fechaEmision < b.fechaEmision ? 1 : -1; }
      return a.numero < b.numero ? 1 : (a.numero > b.numero ? -1 : 0);
    });
  }

  function borrar(presupuesto) {
    var pregunta = '¿Seguro que quieres borrar el presupuesto ' + presupuesto.numero + '? Su número no se volverá a usar.';
    if (!App.confirmar(pregunta)) { return; }
    var ok = App.cambiar(function (estado) {
      // Los contadores no se tocan: el número no se reutiliza (FR-013).
      estado.presupuestos = estado.presupuestos.filter(function (p) { return p.id !== presupuesto.id; });
    });
    if (ok) { App.ir('presupuestos'); }
  }

  function etiquetaEstado(p, hoy) {
    var caducado = Vigencia.estado(p, hoy) === 'caducado';
    return App.el('span', { class: 'estado ' + (caducado ? 'caducado' : 'vigente'), text: caducado ? 'Caducado' : 'Vigente' });
  }

  function mostrar(seccion) {
    seccion.appendChild(App.el('h2', { text: 'Presupuestos' }));
    seccion.appendChild(App.el('div', { class: 'acciones' }, [
      App.el('button', { type: 'button', class: 'primario', text: 'Nuevo presupuesto', onclick: function () { App.ir('editor'); } })
    ]));

    var lista = ordenados();
    if (lista.length === 0) {
      seccion.appendChild(App.el('p', {
        class: 'vacio',
        text: 'Todavía no tienes presupuestos. Pulsa «Nuevo presupuesto» para crear el primero.'
      }));
      return;
    }

    var hoy = Formato.hoy();
    var filas = lista.map(function (p) {
      return App.el('tr', {}, [
        App.el('td', { 'data-label': 'Número', text: p.numero }),
        App.el('td', { 'data-label': 'Cliente', text: p.cliente.nombre }),
        App.el('td', { 'data-label': 'Fecha de emisión', text: Formato.fecha(p.fechaEmision) }),
        App.el('td', { class: 'numero', 'data-label': 'Total', text: Formato.importe(Calculos.totales(p).totalCentimos) }),
        App.el('td', { 'data-label': 'Estado' }, [etiquetaEstado(p, hoy)]),
        App.el('td', {}, [App.el('div', { class: 'acciones' }, [
          App.el('button', { type: 'button', class: 'pequeno', text: 'Abrir', onclick: function () { App.ir('editor', { id: p.id }); } }),
          App.el('button', { type: 'button', class: 'pequeno', text: 'Descargar PDF', onclick: function () { Pantallas.editor.descargarGuardado(p); } }),
          App.el('button', { type: 'button', class: 'pequeno peligro', 'data-guarda': true, text: 'Borrar', onclick: function () { borrar(p); } })
        ])])
      ]);
    });

    seccion.appendChild(App.el('table', {}, [
      App.el('thead', {}, [App.el('tr', {}, [
        App.el('th', { text: 'Número' }),
        App.el('th', { text: 'Cliente' }),
        App.el('th', { text: 'Fecha de emisión' }),
        App.el('th', { class: 'numero', text: 'Total' }),
        App.el('th', { text: 'Estado' }),
        App.el('th', {})
      ])]),
      App.el('tbody', {}, filas)
    ]));
  }

  window.Pantallas = window.Pantallas || {};
  window.Pantallas.presupuestos = { mostrar: mostrar };
}());
