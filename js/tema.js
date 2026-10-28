/* Única definición de la paleta: se vuelca como variables CSS y la usa también el PDF (contracts/tema.md). */
(function () {
  'use strict';

  var colores = {
    'texto': '#1f2933',
    'suave': '#52606d',
    'borde': '#d9dee3',
    'fondo': '#f5f7f9',
    'superficie': '#ffffff',
    'acento': '#1f4b78',
    'acento-oscuro': '#163757',
    'exito': '#1e6b34',
    'exito-fondo': '#e6f4ea',
    'aviso': '#8a5a00',
    'aviso-fondo': '#fff4dc',
    'error': '#b42318',
    'error-fondo': '#fdecea'
  };

  /** Color como [r, g, b] para jsPDF. */
  function rgb(nombre) {
    var hex = colores[nombre].slice(1);
    return [0, 2, 4].map(function (i) { return parseInt(hex.substr(i, 2), 16); });
  }

  Object.keys(colores).forEach(function (nombre) {
    document.documentElement.style.setProperty('--' + nombre, colores[nombre]);
  });

  window.Tema = { colores: colores, rgb: rgb };
}());
