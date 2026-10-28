/* Arranque: carga de datos, navegación entre pantallas, mensajes y guardado seguro. */
(function () {
  'use strict';

  var pantallas = {};
  var actual = null;
  var bloqueado = false;
  var errorCarga = null;

  /** Crea un elemento: App.el('button', { class: 'primario', text: 'Guardar', onclick: fn }, [hijos]). */
  function el(etiqueta, props, hijos) {
    var nodo = document.createElement(etiqueta);
    Object.keys(props || {}).forEach(function (clave) {
      var valor = props[clave];
      if (valor === undefined || valor === null || valor === false) { return; }
      if (clave === 'text') {
        nodo.textContent = valor;
      } else if (clave === 'class') {
        nodo.className = valor;
      } else if (clave === 'value') {
        nodo.value = valor;
      } else if (clave === 'checked') {
        nodo.checked = !!valor;
      } else if (clave.indexOf('on') === 0 && typeof valor === 'function') {
        nodo.addEventListener(clave.slice(2), valor);
      } else {
        nodo.setAttribute(clave, valor === true ? '' : valor);
      }
    });
    (hijos || []).forEach(function (hijo) {
      if (hijo === null || hijo === undefined || hijo === false) { return; }
      nodo.appendChild(typeof hijo === 'string' ? document.createTextNode(hijo) : hijo);
    });
    return nodo;
  }

  /** Campo con etiqueta: App.campo('Nombre', input). */
  function campo(etiqueta, control) {
    return el('div', {}, [el('label', { text: etiqueta }), control]);
  }

  function mensaje(texto, tipo, lista) {
    var zona = document.getElementById('mensajes');
    zona.innerHTML = '';
    if (!texto) { return; }
    var caja = el('div', { class: 'mensaje ' + (tipo || 'exito'), role: tipo === 'error' ? 'alert' : 'status' }, [texto]);
    if (lista && lista.length) {
      caja.appendChild(el('ul', {}, lista.map(function (t) { return el('li', { text: t }); })));
    }
    zona.appendChild(caja);
    window.scrollTo(0, 0);
  }

  /** Marca en rojo los campos con data-campo que tengan error y pone el mensaje debajo. */
  function mostrarErrores(contenedor, errores) {
    Array.prototype.forEach.call(contenedor.querySelectorAll('.error-campo'), function (n) { n.remove(); });
    Array.prototype.forEach.call(contenedor.querySelectorAll('.invalido'), function (n) { n.classList.remove('invalido'); });
    (errores || []).forEach(function (error) {
      var control = contenedor.querySelector('[data-campo="' + error.campo + '"]');
      if (!control) { return; }
      control.classList.add('invalido');
      control.insertAdjacentElement('afterend', el('span', { class: 'error-campo', text: error.mensaje }));
    });
  }

  /**
   * Aplica un cambio al estado y lo guarda. Si no se puede guardar, deshace el cambio,
   * muestra el error y devuelve false (FR-031a).
   */
  function cambiar(modificar) {
    if (bloqueado) {
      mensaje(errorCarga, 'error');
      return false;
    }
    var copia = JSON.stringify(App.estado);
    modificar(App.estado);
    var error = Almacen.guardar(App.estado);
    if (error) {
      App.estado = JSON.parse(copia);
      mensaje(error, 'error');
      return false;
    }
    return true;
  }

  function confirmar(texto) {
    return window.confirm(texto);
  }

  function registrar(nombre, pantalla) {
    pantallas[nombre] = pantalla;
  }

  function ir(nombre, datos) {
    mensaje(null);
    actual = nombre;
    Object.keys(pantallas).forEach(function (clave) {
      document.getElementById('pantalla-' + clave).hidden = clave !== nombre;
    });
    var menu = nombre === 'editor' ? 'presupuestos' : nombre;
    Array.prototype.forEach.call(document.querySelectorAll('nav button'), function (b) {
      var activo = b.getAttribute('data-ir') === menu;
      b.classList.toggle('activo', activo);
      if (activo) { b.setAttribute('aria-current', 'page'); } else { b.removeAttribute('aria-current'); }
    });
    var seccion = document.getElementById('pantalla-' + nombre);
    seccion.innerHTML = '';
    pantallas[nombre].mostrar(seccion, datos);
    if (bloqueado) {
      Array.prototype.forEach.call(seccion.querySelectorAll('[data-guarda]'), function (b) { b.disabled = true; });
      mensaje(errorCarga, 'error');
    }
  }

  window.App = {
    estado: null,
    el: el,
    campo: campo,
    mensaje: mensaje,
    mostrarErrores: mostrarErrores,
    cambiar: cambiar,
    confirmar: confirmar,
    registrar: registrar,
    ir: ir,
    actual: function () { return actual; },
    estaBloqueado: function () { return bloqueado; }
  };

  function arrancar() {
    var carga = Almacen.cargar();
    App.estado = carga.estado;
    if (carga.error) {
      bloqueado = true;
      errorCarga = carga.error;
    }
    Almacen.pedirPersistencia();

    var registradas = window.Pantallas || {};
    Object.keys(registradas).forEach(function (nombre) { registrar(nombre, registradas[nombre]); });

    Array.prototype.forEach.call(document.querySelectorAll('nav button'), function (boton) {
      boton.addEventListener('click', function () { ir(boton.getAttribute('data-ir')); });
    });

    ir('inicio');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', arrancar);
  } else {
    arrancar();
  }
}());
