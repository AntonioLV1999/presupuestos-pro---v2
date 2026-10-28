/* Numeración AAAA-NNN con un contador por año que nunca decrece (research R7). */
(function () {
  'use strict';

  /** Devuelve el número siguiente y una copia de los contadores actualizada. No modifica los recibidos. */
  function siguiente(contadores, fechaEmision) {
    var anio = String(fechaEmision).slice(0, 4);
    var nuevos = {};
    Object.keys(contadores || {}).forEach(function (clave) { nuevos[clave] = contadores[clave]; });
    var valor = (nuevos[anio] || 0) + 1;
    nuevos[anio] = valor;
    var cifras = String(valor);
    while (cifras.length < 3) { cifras = '0' + cifras; }
    return { numero: anio + '-' + cifras, contadores: nuevos };
  }

  window.Numeracion = { siguiente: siguiente };
}());
