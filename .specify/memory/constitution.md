<!--
Sync Impact Report
- Versión: 1.0.0 → 1.0.1 (PARCHE: nombre del proyecto "Presupuestos-Pro" → "PresupuestosPro")
- Principios (sin cambios de contenido): I. Simplicidad ante todo; II. Español de España y euro;
  III. Cero alcance fantasma; IV. Verificable por una persona no técnica;
  V. Respeto por los datos del usuario
- Secciones añadidas: ninguna
- Secciones eliminadas: ninguna
- Plantillas: no se modifican (leen la constitución en tiempo de ejecución)
- TODO pendientes: ninguno
-->
# Constitución de PresupuestosPro

## Core Principles

### I. Simplicidad ante todo

Ante dos soluciones válidas, se elige SIEMPRE la más simple. Esto es una versión 1:
no se añaden capas, opciones ni abstracciones "por si acaso". Cualquier complejidad
extra debe justificarse por escrito con una necesidad actual de la spec.

### II. Español de España y euro

Todo lo que ve el usuario (textos, mensajes, PDF) DEBE estar en español de España.
Los importes se expresan en euros (€), con el formato habitual en España
(por ejemplo, 1.234,56 €).

### III. Cero alcance fantasma

NO se implementa ninguna funcionalidad que no esté escrita en la spec. Si surge
una idea nueva, se propone para la spec; no se construye hasta que esté aprobada
y escrita en ella.

### IV. Verificable por una persona no técnica

Cada criterio de éxito DEBE poder comprobarse usando la app, sin leer código ni
usar herramientas técnicas. Si un criterio no se puede comprobar así, se reescribe.

### V. Respeto por los datos del usuario

Se pide al usuario solo la información imprescindible para generar el presupuesto.
NUNCA se escriben claves, contraseñas ni secretos en el código.

## Restricciones del producto

PresupuestosPro es una herramienta web para que freelancers generen presupuestos
en PDF. Todo lo que se construya debe servir a ese propósito.

## Flujo de trabajo

Primero se escribe la spec, después se planifica y por último se implementa.
Antes de dar algo por terminado, se comprueba contra estos cinco principios.

## Governance

Esta constitución prevalece sobre cualquier otra práctica del proyecto. Para
cambiarla hay que dejar el cambio por escrito y actualizar la versión:
MAYOR si se elimina o redefine un principio, MENOR si se añade uno, PARCHE si
solo se aclara la redacción. Cada spec, plan y revisión debe respetarla.

**Version**: 1.0.1 | **Ratified**: 2026-10-14 | **Last Amended**: 2026-10-14
