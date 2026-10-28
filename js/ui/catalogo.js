/* Pantalla de catálogo de servicios (contracts/pantallas.md, apartado 4; FR-004, FR-007). */
(function () {
  'use strict';

  var editando = null; // null, 'nuevo' o el id del servicio

  function formulario(seccion) {
    var existente = App.estado.catalogo.filter(function (s) { return s.id === editando; })[0];
    var nombre = App.el('input', { type: 'text', value: existente ? existente.nombre : '', 'data-campo': 'nombre' });
    var precio = App.el('input', {
      type: 'text',
      inputmode: 'decimal',
      value: existente ? Formato.importeEditable(existente.precioCentimos) : '',
      'data-campo': 'precio'
    });
    var caja = App.el('div', { class: 'formulario recuadro' }, [
      App.campo('Servicio', nombre),
      App.campo('Precio habitual (€)', precio)
    ]);

    function guardar() {
      var servicio = { nombre: nombre.value.trim(), precioCentimos: Formato.leerImporte(precio.value) };
      var errores = Validacion.validarServicio(servicio);
      App.mostrarErrores(caja, errores);
      if (errores.length) { return; }
      var ok = App.cambiar(function (estado) {
        // Solo cambia el catálogo; los presupuestos guardados no se tocan (FR-007).
        if (existente) {
          estado.catalogo = estado.catalogo.map(function (s) {
            return s.id === existente.id ? { id: s.id, nombre: servicio.nombre, precioCentimos: servicio.precioCentimos } : s;
          });
        } else {
          servicio.id = Almacen.nuevoId();
          estado.catalogo.push(servicio);
        }
      });
      if (ok) {
        editando = null;
        App.ir('catalogo');
      }
    }

    seccion.appendChild(App.el('h3', { text: existente ? 'Editar servicio' : 'Nuevo servicio' }));
    seccion.appendChild(caja);
    seccion.appendChild(App.el('div', { class: 'acciones' }, [
      App.el('button', { type: 'button', class: 'primario', 'data-guarda': true, text: 'Guardar', onclick: guardar }),
      App.el('button', { type: 'button', text: 'Cancelar', onclick: function () { editando = null; App.ir('catalogo'); } })
    ]));
    nombre.focus();
  }

  function borrar(servicio) {
    if (!App.confirmar('¿Seguro que quieres borrar «' + servicio.nombre + '» del catálogo? Tus presupuestos no cambiarán.')) { return; }
    var ok = App.cambiar(function (estado) {
      estado.catalogo = estado.catalogo.filter(function (s) { return s.id !== servicio.id; });
    });
    if (ok) { App.ir('catalogo'); }
  }

  function mostrar(seccion) {
    seccion.appendChild(App.el('h2', { text: 'Catálogo' }));
    if (editando) {
      formulario(seccion);
    } else {
      seccion.appendChild(App.el('div', { class: 'acciones' }, [
        App.el('button', { type: 'button', class: 'primario', text: 'Nuevo servicio', onclick: function () { editando = 'nuevo'; App.ir('catalogo'); } })
      ]));
    }

    if (App.estado.catalogo.length === 0) {
      seccion.appendChild(App.el('p', { class: 'vacio', text: 'Todavía no tienes servicios en el catálogo.' }));
      return;
    }

    var lista = App.estado.catalogo.slice().sort(function (a, b) { return a.nombre.localeCompare(b.nombre, 'es'); });
    seccion.appendChild(App.el('table', {}, [
      App.el('thead', {}, [App.el('tr', {}, [
        App.el('th', { text: 'Servicio' }),
        App.el('th', { class: 'numero', text: 'Precio habitual' }),
        App.el('th', {})
      ])]),
      App.el('tbody', {}, lista.map(function (s) {
        return App.el('tr', {}, [
          App.el('td', { 'data-label': 'Servicio', text: s.nombre }),
          App.el('td', { class: 'numero', 'data-label': 'Precio habitual', text: Formato.importe(s.precioCentimos) }),
          App.el('td', {}, [App.el('div', { class: 'acciones' }, [
            App.el('button', { type: 'button', class: 'pequeno', text: 'Editar', onclick: function () { editando = s.id; App.ir('catalogo'); } }),
            App.el('button', { type: 'button', class: 'pequeno peligro', 'data-guarda': true, text: 'Borrar', onclick: function () { borrar(s); } })
          ])])
        ]);
      }))
    ]));
  }

  window.Pantallas = window.Pantallas || {};
  window.Pantallas.catalogo = { mostrar: mostrar };
}());
