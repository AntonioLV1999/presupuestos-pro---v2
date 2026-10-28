/* Pantalla de inicio (contracts/pantallas.md, apartado «Inicio»; FR-001, FR-002, FR-005, FR-006). */
(function () {
  'use strict';

  var ACCESOS = [
    { destino: 'presupuestos', titulo: 'Presupuestos', frase: 'Crea, abre y descarga tus presupuestos.' },
    { destino: 'clientes', titulo: 'Clientes', frase: 'Tu lista de clientes guardados.' },
    { destino: 'catalogo', titulo: 'Catálogo', frase: 'Tus servicios y precios habituales.' },
    { destino: 'mis-datos', titulo: 'Perfil', frase: 'Tus datos y tu logo para los presupuestos.' }
  ];

  function cifra(etiqueta, valor) {
    return App.el('div', { class: 'cifra' }, [
      App.el('span', { class: 'cifra-valor', text: String(valor) }),
      App.el('span', { class: 'cifra-etiqueta', text: etiqueta })
    ]);
  }

  function mostrar(seccion) {
    seccion.appendChild(App.el('h2', { text: 'Inicio' }));

    if (!App.estaBloqueado()) {
      var r = Vigencia.resumen(App.estado, Formato.hoy());
      seccion.appendChild(App.el('div', { class: 'resumen' }, [
        cifra('Presupuestos', r.total),
        cifra('Vigentes', r.vigentes),
        cifra('Caducados', r.caducados),
        cifra('Clientes', r.clientes),
        cifra('Servicios del catálogo', r.servicios)
      ]));
      if (r.total === 0) {
        seccion.appendChild(App.el('p', {
          class: 'vacio',
          text: 'Todavía no tienes presupuestos. Pulsa «Nuevo presupuesto» para crear el primero.'
        }));
      }
    }

    seccion.appendChild(App.el('div', { class: 'acciones' }, [
      App.el('button', { type: 'button', class: 'primario', text: 'Nuevo presupuesto', onclick: function () { App.ir('editor'); } })
    ]));

    seccion.appendChild(App.el('div', { class: 'accesos' }, ACCESOS.map(function (a) {
      return App.el('button', { type: 'button', class: 'acceso', onclick: function () { App.ir(a.destino); } }, [
        App.el('strong', { text: a.titulo }),
        App.el('span', { text: a.frase })
      ]);
    })));
  }

  window.Pantallas = window.Pantallas || {};
  window.Pantallas.inicio = { mostrar: mostrar };
}());
