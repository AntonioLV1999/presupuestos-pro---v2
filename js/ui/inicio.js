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
    seccion.appendChild(App.titulo('Resumen de actividad'));

    // El resumen, su aviso y el botón principal forman un único bloque (FR-006a).
    var bloque = App.el('div', { class: 'bloque-resumen' });

    if (!App.estaBloqueado()) {
      var r = Vigencia.resumen(App.estado, Formato.hoy());
      bloque.appendChild(App.el('div', { class: 'resumen' }, [
        cifra('Presupuestos', r.total),
        cifra('Vigentes', r.vigentes),
        cifra('Caducados', r.caducados),
        cifra('Clientes', r.clientes),
        cifra('Servicios del catálogo', r.servicios)
      ]));
      if (r.total === 0) {
        bloque.appendChild(App.el('p', {
          class: 'vacio',
          text: 'Todavía no tienes presupuestos. Pulsa «Nuevo presupuesto» para crear el primero.'
        }));
      }
    }

    bloque.appendChild(App.el('div', { class: 'acciones' }, [
      App.el('button', { type: 'button', class: 'primario', text: 'Nuevo presupuesto', onclick: function () { App.ir('editor'); } })
    ]));
    seccion.appendChild(bloque);

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
