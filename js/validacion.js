/* Reglas de validación (data-model.md y FR-015, FR-016, FR-030, FR-034). Funciones puras. */
(function () {
  'use strict';

  var M = {
    concepto: 'Escribe un concepto para esta línea.',
    cantidad: 'La cantidad debe ser mayor que cero.',
    cantidadIlegible: 'Escribe una cantidad válida, por ejemplo 1 o 1,5.',
    precio: 'El precio debe ser igual o superior a 0 €.',
    precioIlegible: 'Escribe un precio válido, por ejemplo 45 o 45,50.',
    cliente: 'Escribe el nombre o la razón social del cliente.',
    tipo: 'Elige el tipo de cliente.',
    servicio: 'Escribe el nombre del servicio.',
    sinLineas: 'Añade al menos una línea para poder descargar el presupuesto.',
    faltanDatos: 'Faltan tus datos (nombre y NIF). Puedes completarlos en «Perfil». ¿Descargar el PDF igualmente?',
    logo: 'El logo debe ser una imagen PNG o JPG de 500 KB como máximo.'
  };

  var LOGO_MAXIMO = 500 * 1024;
  var TIPOS = ['particular', 'empresa', 'autonomo'];

  function vacio(texto) {
    return String(texto == null ? '' : texto).trim() === '';
  }

  function largo(max) {
    return 'Este texto admite como máximo ' + max + ' caracteres.';
  }

  function comprobarLargo(errores, campo, texto, max) {
    if (String(texto == null ? '' : texto).length > max) {
      errores.push({ campo: campo, mensaje: largo(max) });
    }
  }

  /** Errores de una línea. Una cantidad o un precio null significa que no se pudo leer lo escrito. */
  function validarLinea(linea, indice) {
    var errores = [];
    var prefijo = 'lineas.' + indice + '.';
    if (vacio(linea.concepto)) {
      errores.push({ campo: prefijo + 'concepto', mensaje: M.concepto });
    } else {
      comprobarLargo(errores, prefijo + 'concepto', linea.concepto, 200);
    }
    if (linea.cantidadCentesimas === null || linea.cantidadCentesimas === undefined) {
      errores.push({ campo: prefijo + 'cantidad', mensaje: M.cantidadIlegible });
    } else if (linea.cantidadCentesimas <= 0) {
      errores.push({ campo: prefijo + 'cantidad', mensaje: M.cantidad });
    }
    if (linea.precioCentimos === null || linea.precioCentimos === undefined) {
      errores.push({ campo: prefijo + 'precio', mensaje: M.precioIlegible });
    } else if (linea.precioCentimos < 0) {
      errores.push({ campo: prefijo + 'precio', mensaje: M.precio });
    }
    return errores;
  }

  function validarCliente(cliente) {
    var errores = [];
    if (vacio(cliente.nombre)) {
      errores.push({ campo: 'cliente.nombre', mensaje: M.cliente });
    } else {
      comprobarLargo(errores, 'cliente.nombre', cliente.nombre, 200);
    }
    comprobarLargo(errores, 'cliente.nif', cliente.nif, 20);
    if (TIPOS.indexOf(cliente.tipo) === -1) {
      errores.push({ campo: 'cliente.tipo', mensaje: M.tipo });
    }
    return errores;
  }

  /** Errores que impiden guardar. Un presupuesto sin líneas sí se puede guardar. */
  function validarPresupuesto(presupuesto) {
    var errores = validarCliente(presupuesto.cliente || {});
    (presupuesto.lineas || []).forEach(function (linea, i) {
      errores = errores.concat(validarLinea(linea, i));
    });
    comprobarLargo(errores, 'observaciones', presupuesto.observaciones, 1000);
    return errores;
  }

  /** 0 para particulares; para empresa o autónomo, 7 si se eligió 7 y 15 en cualquier otro caso. */
  function normalizarRetencion(tipo, porcentaje) {
    if (tipo === 'particular') { return 0; }
    return porcentaje === 7 ? 7 : 15;
  }

  /** Bloqueo (impide el PDF) y aviso (pide confirmación) antes de generar el PDF. */
  function requisitosPdf(presupuesto, profesional) {
    if (!presupuesto.lineas || presupuesto.lineas.length === 0) {
      return { bloqueo: M.sinLineas, aviso: null };
    }
    var p = profesional || {};
    var aviso = (vacio(p.nombre) || vacio(p.nif)) ? M.faltanDatos : null;
    return { bloqueo: null, aviso: aviso };
  }

  /** Devuelve el mensaje de error o null si el archivo es válido (FR-003). */
  function validarLogo(archivo) {
    if (!archivo) { return M.logo; }
    var tipoValido = archivo.type === 'image/png' || archivo.type === 'image/jpeg';
    if (!tipoValido || archivo.size > LOGO_MAXIMO) { return M.logo; }
    return null;
  }

  function validarProfesional(datos) {
    var errores = [];
    comprobarLargo(errores, 'nombre', datos.nombre, 120);
    comprobarLargo(errores, 'nif', datos.nif, 20);
    comprobarLargo(errores, 'telefono', datos.telefono, 30);
    comprobarLargo(errores, 'direccion', datos.direccion, 200);
    return errores;
  }

  function validarServicio(servicio) {
    var errores = [];
    if (vacio(servicio.nombre)) {
      errores.push({ campo: 'nombre', mensaje: M.servicio });
    } else {
      comprobarLargo(errores, 'nombre', servicio.nombre, 200);
    }
    if (servicio.precioCentimos === null || servicio.precioCentimos === undefined) {
      errores.push({ campo: 'precio', mensaje: M.precioIlegible });
    } else if (servicio.precioCentimos < 0) {
      errores.push({ campo: 'precio', mensaje: M.precio });
    }
    return errores;
  }

  window.Validacion = {
    mensajes: M,
    validarLinea: validarLinea,
    validarCliente: validarCliente,
    validarPresupuesto: validarPresupuesto,
    normalizarRetencion: normalizarRetencion,
    requisitosPdf: requisitosPdf,
    validarLogo: validarLogo,
    validarProfesional: validarProfesional,
    validarServicio: validarServicio
  };
}());
