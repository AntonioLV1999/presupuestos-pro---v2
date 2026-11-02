/* Única definición de la paleta: se vuelca como variables CSS y la usa también el PDF (contracts/tema.md). */
(function () {
  'use strict';

  var colores = {
    'texto': '#1C1A17',
    'suave': '#6B6459',
    'borde': '#E6E1D8',
    'fondo': '#FBF9F5',
    'superficie': '#FFFFFF',
    'acento': '#8C2F39',
    'acento-oscuro': '#6E242C',
    'exito': '#4F6B4A',
    'exito-fondo': '#EDF2EB',
    'aviso': '#7C5415',
    'aviso-fondo': '#F7EFE0',
    'error': '#B3261E',
    'error-fondo': '#FBEDEB',
    'borde-fuerte': '#CFC7B8',
    'superficie-alt': '#F4F1EA',
    'papel-hundido': '#EDE8DC'
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
