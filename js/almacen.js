/* Lectura y escritura de todos los datos en localStorage (contracts/almacenamiento.md, FR-031, FR-031a). */
(function () {
  'use strict';

  var CLAVE = 'presupuestospro.v1';
  var MENSAJE_DANADOS = 'No se han podido leer tus datos guardados. No se ha borrado nada.';
  var MENSAJE_ESPACIO = 'No queda espacio para guardar. Prueba con un logo más pequeño.';
  var MENSAJE_NO_GUARDADO = 'No se han podido guardar los cambios.';

  var bloqueado = false;

  function estadoInicial() {
    return {
      version: 1,
      profesional: { nombre: '', nif: '', telefono: '', email: '', direccion: '', logo: '' },
      catalogo: [],
      clientes: [],
      presupuestos: [],
      contadores: {}
    };
  }

  /** Completa con valores por defecto lo que falte en un estado leído. */
  function completar(datos) {
    var base = estadoInicial();
    var estado = {
      version: 1,
      profesional: base.profesional,
      catalogo: Array.isArray(datos.catalogo) ? datos.catalogo : [],
      clientes: Array.isArray(datos.clientes) ? datos.clientes : [],
      presupuestos: Array.isArray(datos.presupuestos) ? datos.presupuestos : [],
      contadores: datos.contadores && typeof datos.contadores === 'object' ? datos.contadores : {}
    };
    Object.keys(base.profesional).forEach(function (campo) {
      var valor = datos.profesional ? datos.profesional[campo] : '';
      estado.profesional[campo] = typeof valor === 'string' ? valor : '';
    });
    return estado;
  }

  /** Devuelve { estado, error }. Si los datos están dañados, no los toca y bloquea la escritura. */
  function cargar() {
    var texto;
    try {
      texto = window.localStorage.getItem(CLAVE);
    } catch (e) {
      bloqueado = true;
      return { estado: estadoInicial(), error: MENSAJE_DANADOS };
    }
    if (texto === null) {
      return { estado: estadoInicial(), error: null };
    }
    try {
      var datos = JSON.parse(texto);
      if (!datos || typeof datos !== 'object' || datos.version !== 1) {
        throw new Error('Formato desconocido');
      }
      return { estado: completar(datos), error: null };
    } catch (e) {
      bloqueado = true;
      return { estado: estadoInicial(), error: MENSAJE_DANADOS };
    }
  }

  /** Reescribe el documento completo. Devuelve null si todo fue bien o el mensaje de error. */
  function guardar(estado) {
    if (bloqueado) { return MENSAJE_DANADOS; }
    try {
      window.localStorage.setItem(CLAVE, JSON.stringify(estado));
      return null;
    } catch (e) {
      var cuota = e && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED' || e.code === 22);
      return cuota ? MENSAJE_ESPACIO : MENSAJE_NO_GUARDADO;
    }
  }

  function nuevoId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  /** Pide al navegador que no borre los datos por falta de espacio (research R3). */
  function pedirPersistencia() {
    try {
      if (navigator.storage && navigator.storage.persist) {
        navigator.storage.persist().catch(function () {});
      }
    } catch (e) { /* No es imprescindible. */ }
  }

  window.Almacen = {
    estadoInicial: estadoInicial,
    cargar: cargar,
    guardar: guardar,
    nuevoId: nuevoId,
    pedirPersistencia: pedirPersistencia,
    estaBloqueado: function () { return bloqueado; }
  };
}());
