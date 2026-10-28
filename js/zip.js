/* Escritor ZIP mínimo: método «almacenado», nombres UTF-8, sin ZIP64 (contracts/copia-zip.md). Sin DOM. */
(function () {
  'use strict';

  var tabla = null;

  function tablaCrc() {
    if (tabla) { return tabla; }
    tabla = new Uint32Array(256);
    for (var n = 0; n < 256; n++) {
      var c = n;
      for (var k = 0; k < 8; k++) { c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1); }
      tabla[n] = c >>> 0;
    }
    return tabla;
  }

  /** CRC-32 de un Uint8Array, como entero sin signo. */
  function crc32(bytes) {
    var t = tablaCrc();
    var c = 0xFFFFFFFF;
    for (var i = 0; i < bytes.length; i++) { c = t[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8); }
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  /** Fecha y hora locales en formato MS-DOS. */
  function fechaDos(d) {
    var anio = Math.max(d.getFullYear(), 1980);
    return {
      fecha: ((anio - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate(),
      hora: (d.getHours() << 11) | (d.getMinutes() << 5) | Math.floor(d.getSeconds() / 2)
    };
  }

  /** entradas: [{ nombre, datos: Uint8Array }] → Uint8Array con un ZIP válido. */
  function crear(entradas) {
    var codificador = new TextEncoder();
    var dos = fechaDos(new Date());
    var info = entradas.map(function (e) {
      return { nombre: codificador.encode(e.nombre), datos: e.datos, crc: crc32(e.datos), posicion: 0 };
    });

    var total = 22;
    info.forEach(function (e) { total += 30 + e.nombre.length + e.datos.length + 46 + e.nombre.length; });

    var salida = new Uint8Array(total);
    var vista = new DataView(salida.buffer);
    var p = 0;

    info.forEach(function (e) {
      e.posicion = p;
      vista.setUint32(p, 0x04034b50, true);
      vista.setUint16(p + 4, 20, true);
      vista.setUint16(p + 6, 0x0800, true);
      vista.setUint16(p + 8, 0, true);
      vista.setUint16(p + 10, dos.hora, true);
      vista.setUint16(p + 12, dos.fecha, true);
      vista.setUint32(p + 14, e.crc, true);
      vista.setUint32(p + 18, e.datos.length, true);
      vista.setUint32(p + 22, e.datos.length, true);
      vista.setUint16(p + 26, e.nombre.length, true);
      vista.setUint16(p + 28, 0, true);
      salida.set(e.nombre, p + 30);
      salida.set(e.datos, p + 30 + e.nombre.length);
      p += 30 + e.nombre.length + e.datos.length;
    });

    var inicioDirectorio = p;
    info.forEach(function (e) {
      vista.setUint32(p, 0x02014b50, true);
      vista.setUint16(p + 4, 20, true);
      vista.setUint16(p + 6, 20, true);
      vista.setUint16(p + 8, 0x0800, true);
      vista.setUint16(p + 10, 0, true);
      vista.setUint16(p + 12, dos.hora, true);
      vista.setUint16(p + 14, dos.fecha, true);
      vista.setUint32(p + 16, e.crc, true);
      vista.setUint32(p + 20, e.datos.length, true);
      vista.setUint32(p + 24, e.datos.length, true);
      vista.setUint16(p + 28, e.nombre.length, true);
      vista.setUint16(p + 30, 0, true);
      vista.setUint16(p + 32, 0, true);
      vista.setUint16(p + 34, 0, true);
      vista.setUint16(p + 36, 0, true);
      vista.setUint32(p + 38, 0, true);
      vista.setUint32(p + 42, e.posicion, true);
      salida.set(e.nombre, p + 46);
      p += 46 + e.nombre.length;
    });

    vista.setUint32(p, 0x06054b50, true);
    vista.setUint16(p + 4, 0, true);
    vista.setUint16(p + 6, 0, true);
    vista.setUint16(p + 8, info.length, true);
    vista.setUint16(p + 10, info.length, true);
    vista.setUint32(p + 12, p - inicioDirectorio, true);
    vista.setUint32(p + 16, inicioDirectorio, true);
    vista.setUint16(p + 20, 0, true);
    return salida;
  }

  window.Zip = { crc32: crc32, crear: crear };
}());
