/* Pantalla de clientes guardados (contracts/pantallas.md, apartado 3; FR-008a, FR-008c). */
(function () {
  'use strict';

  var TIPOS = { particular: 'Particular', empresa: 'Empresa', autonomo: 'Autónomo' };
  var editando = null; // null, 'nuevo' o el id del cliente

  function formulario(seccion) {
    var existente = App.estado.clientes.filter(function (c) { return c.id === editando; })[0];
    var datos = existente
      ? { nombre: existente.nombre, nif: existente.nif || '', email: existente.email || '', tipo: existente.tipo }
      : { nombre: '', nif: '', email: '', tipo: 'particular' };

    var nombre = App.el('input', { type: 'text', value: datos.nombre, 'data-campo': 'cliente.nombre' });
    var nif = App.el('input', { type: 'text', value: datos.nif, 'data-campo': 'cliente.nif' });
    var email = App.el('input', { type: 'text', value: datos.email });
    var tipo = App.el('select', { 'data-campo': 'cliente.tipo' }, Object.keys(TIPOS).map(function (t) {
      return App.el('option', { value: t, text: TIPOS[t], selected: t === datos.tipo });
    }));

    var caja = App.el('div', { class: 'formulario recuadro' }, [
      App.campo('Nombre o razón social', nombre),
      App.campo('NIF/CIF', nif),
      App.campo('Email', email),
      App.campo('Tipo de cliente', tipo)
    ]);

    function guardar() {
      var cliente = { nombre: nombre.value.trim(), nif: nif.value.trim(), email: email.value.trim(), tipo: tipo.value };
      var errores = Validacion.validarCliente(cliente);
      App.mostrarErrores(caja, errores);
      if (errores.length) { return; }
      var ok = App.cambiar(function (estado) {
        // Solo cambia la lista de clientes; los presupuestos guardados no se tocan (FR-008c).
        if (existente) {
          estado.clientes = estado.clientes.map(function (c) {
            return c.id === existente.id ? { id: c.id, nombre: cliente.nombre, nif: cliente.nif, email: cliente.email, tipo: cliente.tipo } : c;
          });
        } else {
          cliente.id = Almacen.nuevoId();
          estado.clientes.push(cliente);
        }
      });
      if (ok) {
        editando = null;
        App.ir('clientes');
      }
    }

    seccion.appendChild(App.el('h3', { text: existente ? 'Editar cliente' : 'Nuevo cliente' }));
    seccion.appendChild(caja);
    seccion.appendChild(App.el('div', { class: 'acciones' }, [
      App.el('button', { type: 'button', class: 'primario', 'data-guarda': true, text: 'Guardar', onclick: guardar }),
      App.el('button', { type: 'button', text: 'Cancelar', onclick: function () { editando = null; App.ir('clientes'); } })
    ]));
    nombre.focus();
  }

  function borrar(cliente) {
    if (!App.confirmar('¿Seguro que quieres borrar a ' + cliente.nombre + '? Sus presupuestos no cambiarán.')) { return; }
    var ok = App.cambiar(function (estado) {
      estado.clientes = estado.clientes.filter(function (c) { return c.id !== cliente.id; });
    });
    if (ok) { App.ir('clientes'); }
  }

  function mostrar(seccion) {
    seccion.appendChild(App.el('h2', { text: 'Clientes' }));
    if (editando) {
      formulario(seccion);
    } else {
      seccion.appendChild(App.el('div', { class: 'acciones' }, [
        App.el('button', { type: 'button', class: 'primario', text: 'Nuevo cliente', onclick: function () { editando = 'nuevo'; App.ir('clientes'); } })
      ]));
    }

    if (App.estado.clientes.length === 0) {
      seccion.appendChild(App.el('p', { class: 'vacio', text: 'Todavía no tienes clientes guardados.' }));
      return;
    }

    var lista = App.estado.clientes.slice().sort(function (a, b) { return a.nombre.localeCompare(b.nombre, 'es'); });
    seccion.appendChild(App.el('table', {}, [
      App.el('thead', {}, [App.el('tr', {}, [
        App.el('th', { text: 'Nombre' }),
        App.el('th', { text: 'NIF/CIF' }),
        App.el('th', { text: 'Email' }),
        App.el('th', { text: 'Tipo' }),
        App.el('th', {})
      ])]),
      App.el('tbody', {}, lista.map(function (c) {
        return App.el('tr', {}, [
          App.el('td', { 'data-label': 'Nombre', text: c.nombre }),
          App.el('td', { 'data-label': 'NIF/CIF', text: c.nif || '' }),
          App.el('td', { 'data-label': 'Email', text: c.email || '' }),
          App.el('td', { 'data-label': 'Tipo', text: TIPOS[c.tipo] || '' }),
          App.el('td', {}, [App.el('div', { class: 'acciones' }, [
            App.el('button', { type: 'button', class: 'pequeno', text: 'Editar', onclick: function () { editando = c.id; App.ir('clientes'); } }),
            App.el('button', { type: 'button', class: 'pequeno peligro', 'data-guarda': true, text: 'Borrar', onclick: function () { borrar(c); } })
          ])])
        ]);
      }))
    ]));
  }

  window.Pantallas = window.Pantallas || {};
  window.Pantallas.clientes = { mostrar: mostrar };
}());
