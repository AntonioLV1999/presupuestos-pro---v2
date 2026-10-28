/* Pantalla de datos de la profesional (contracts/pantallas.md, apartado 5; FR-001 a FR-003). */
(function () {
  'use strict';

  function mostrar(seccion) {
    var actual = App.estado.profesional;
    var logo = actual.logo || '';

    function entrada(valor, campo) {
      return App.el('input', { type: 'text', value: valor || '', 'data-campo': campo });
    }

    var nombre = entrada(actual.nombre, 'nombre');
    var nif = entrada(actual.nif, 'nif');
    var telefono = entrada(actual.telefono, 'telefono');
    var email = entrada(actual.email, 'email');
    var direccion = entrada(actual.direccion, 'direccion');

    var vistaPrevia = App.el('div');
    var selector = App.el('input', { type: 'file', accept: 'image/png,image/jpeg', 'data-campo': 'logo' });

    function pintarLogo() {
      vistaPrevia.innerHTML = '';
      if (logo) {
        vistaPrevia.appendChild(App.el('img', { class: 'logo-previo', src: logo, alt: 'Logo' }));
        vistaPrevia.appendChild(App.el('button', {
          type: 'button',
          class: 'pequeno',
          text: 'Quitar logo',
          onclick: function () { logo = ''; selector.value = ''; pintarLogo(); }
        }));
      } else {
        vistaPrevia.appendChild(App.el('p', { class: 'vacio', text: 'Sin logo.' }));
      }
    }

    var caja = App.el('div', { class: 'formulario recuadro' }, [
      App.campo('Nombre', nombre),
      App.campo('NIF', nif),
      App.campo('Teléfono', telefono),
      App.campo('Email', email),
      App.campo('Dirección', direccion),
      App.el('div', {}, [App.el('label', { text: 'Logo (PNG o JPG, máximo 500 KB)' }), selector, vistaPrevia])
    ]);

    selector.addEventListener('change', function () {
      var archivo = selector.files && selector.files[0];
      if (!archivo) { return; }
      var error = Validacion.validarLogo(archivo);
      App.mostrarErrores(caja, error ? [{ campo: 'logo', mensaje: error }] : []);
      if (error) {
        selector.value = '';
        return;
      }
      var lector = new FileReader();
      lector.onload = function () { logo = lector.result; pintarLogo(); };
      lector.readAsDataURL(archivo);
    });

    function guardar() {
      var datos = {
        nombre: nombre.value.trim(),
        nif: nif.value.trim(),
        telefono: telefono.value.trim(),
        email: email.value.trim(),
        direccion: direccion.value.trim(),
        logo: logo
      };
      var errores = Validacion.validarProfesional(datos);
      App.mostrarErrores(caja, errores);
      if (errores.length) { return; }
      if (App.cambiar(function (estado) { estado.profesional = datos; })) {
        App.mensaje('Tus datos se han guardado.', 'exito');
      }
    }

    seccion.appendChild(App.el('h2', { text: 'Perfil' }));
    seccion.appendChild(App.el('p', { class: 'vacio', text: 'Estos datos aparecen en todos tus presupuestos en PDF.' }));
    seccion.appendChild(caja);
    seccion.appendChild(App.el('div', { class: 'acciones' }, [
      App.el('button', { type: 'button', class: 'primario', 'data-guarda': true, text: 'Guardar', onclick: guardar })
    ]));
    pintarLogo();
  }

  window.Pantallas = window.Pantallas || {};
  window.Pantallas['mis-datos'] = { mostrar: mostrar };
}());
