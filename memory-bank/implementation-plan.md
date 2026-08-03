# Plan de Implementación — Roadmap Builder (MVP)

Basado en [app-description.md](./app-description.md). Sin backend, persistencia 100% en `localStorage`, exportación a archivo `.roadmap`.

## Cómo usar este plan

Cada paso es una unidad de trabajo **ACID**:
- **Atómico**: la unidad más pequeña posible de código funcional.
- **Consistente**: al terminar el paso, la app queda en un estado funcional (no rota), aunque incompleto.
- **Aislado**: se puede implementar y probar sin depender de pasos futuros no hechos aún.
- **Durable**: el resultado queda verificado y fijado (idealmente con un commit) antes de avanzar al siguiente paso.

No pases al siguiente paso hasta confirmar la **Prueba Humana** del paso actual.

---

## Fase 0 — Setup del proyecto

### Paso 0.1 — Inicializar proyecto Vite + React
Crear el proyecto con el template `react` de Vite dentro de `roadmap-builder/`, instalar dependencias.

**Prueba Humana**: Ejecutar `npm run dev`, abrir la URL local en el navegador y ver la pantalla default de Vite + React, sin errores en la consola del navegador ni en la terminal.

### Paso 0.2 — Limpiar boilerplate y estructura base
Eliminar el contenido de ejemplo de Vite. Crear carpetas `src/components`, `src/lib`. Renderizar un único título "Roadmap Builder".

**Prueba Humana**: La app carga una pantalla con el título "Roadmap Builder" y nada más, sin errores en consola.

### Paso 0.3 — Capa de datos: modelo y funciones de localStorage
Definir el modelo de un roadmap (`id`, `title`, `content`, `tags`, `createdAt`, `updatedAt`) y crear `src/lib/storage.js` con funciones puras: `getRoadmaps()`, `saveRoadmap(roadmap)`, `updateRoadmap(id, changes)`, `deleteRoadmap(id)`. Sin UI todavía.

**Prueba Humana**: Desde la consola del navegador (o un botón temporal de debug), llamar `saveRoadmap({...})` con datos de prueba y confirmar en DevTools → Application → Local Storage que aparece una entrada con la estructura JSON esperada.

---

## Fase 1 — Feature 1: Entrada de texto para crear un roadmap

### Paso 1.1 — Formulario de creación (sin guardar)
Componente con campos "Título" y "Contenido". Al enviar, solo hacer `console.log` de los valores (todavía no toca `storage.js`).

**Prueba Humana**: Escribir un título y contenido, click en "Crear", verificar en la consola del navegador que se loguea el objeto con los valores correctos.

### Paso 1.2 — Conectar formulario a localStorage
Al enviar el formulario, llamar a `saveRoadmap` de la Fase 0 y limpiar los campos.

**Prueba Humana**: Crear un roadmap desde el formulario y verificar en DevTools → Application → Local Storage que se agregó una entrada nueva con `id` único, `title` y `content` correctos.

### Paso 1.3 — Panel central: listar roadmaps guardados
Al montar la app, leer `getRoadmaps()` y renderizar una tarjeta por cada uno (título + fecha de creación).

**Prueba Humana**: Crear 2 roadmaps, recargar la página (F5) y confirmar que ambos siguen visibles en el panel central en el mismo orden (persistencia real tras un refresh, no solo estado en memoria).

---

## Fase 2 — Feature 2: Sistema de etiquetado

### Paso 2.1 — Input de etiquetas en el formulario (sin persistir)
Agregar un campo de etiquetas (texto separado por comas) al formulario de creación. Al enviar, solo loguear el array parseado.

**Prueba Humana**: Escribir "trabajo, 2026, urgente" en el campo, enviar, y verificar en consola que se logueó `["trabajo", "2026", "urgente"]` (sin espacios sobrantes ni duplicados).

### Paso 2.2 — Persistir etiquetas en el roadmap
Extender el modelo de datos y `saveRoadmap` para incluir `tags: string[]`.

**Prueba Humana**: Crear un roadmap con etiquetas "trabajo, 2026", y verificar en Local Storage que el objeto guardado tiene `tags: ["trabajo", "2026"]`.

### Paso 2.3 — Mostrar etiquetas como chips en el panel central
Cada tarjeta del listado muestra sus etiquetas como chips/pastillas visuales.

**Prueba Humana**: Ver visualmente que cada roadmap del panel muestra sus etiquetas debajo del título, y que un roadmap sin etiquetas no muestra chips rotos ni vacíos.

---

## Fase 3 — Feature 3: Barra de búsqueda

### Paso 3.1 — Input de búsqueda (sin filtrar)
Barra de búsqueda en la parte superior que solo captura el valor en estado local (`console.log` en cada cambio).

**Prueba Humana**: Escribir texto en la barra y verificar en consola que el valor se actualiza en cada tecla.

### Paso 3.2 — Filtrar por título
El panel central filtra los roadmaps cuyo título contiene el texto buscado (case-insensitive).

**Prueba Humana**: Crear 3 roadmaps con títulos distintos, buscar una palabra que solo esté en el título de uno, y confirmar que solo ese aparece en el panel.

### Paso 3.3 — Extender filtro por etiqueta
La búsqueda también compara contra las etiquetas de cada roadmap.

**Prueba Humana**: Buscar el nombre exacto de una etiqueta (ej. "trabajo") y confirmar que aparecen todos los roadmaps que la tienen, incluso si el título no coincide.

### Paso 3.4 — Extender filtro por contenido
La búsqueda también compara contra el texto del cuerpo (`content`) del roadmap.

**Prueba Humana**: Buscar una palabra que exista solo en el cuerpo de texto de un roadmap (no en título ni etiquetas) y confirmar que ese roadmap aparece en los resultados.

### Paso 3.5 — Estado vacío de búsqueda
Mostrar un mensaje ("No se encontraron roadmaps") cuando el filtro no arroja resultados.

**Prueba Humana**: Buscar un término inexistente y verificar que se muestra el mensaje de estado vacío en lugar de una lista en blanco.

---

## Fase 4 — Editar, renombrar y borrar

### Paso 4.1 — Eliminar roadmap
Botón "Eliminar" en cada tarjeta, con confirmación (`window.confirm` o modal simple), que llama a `deleteRoadmap`.

**Prueba Humana**: Crear un roadmap, eliminarlo confirmando el diálogo, y verificar que desaparece del panel y también de Local Storage tras recargar la página.

### Paso 4.2 — Abrir formulario de edición pre-rellenado
Botón "Editar" que reutiliza el formulario de creación, pre-cargado con título, contenido y etiquetas del roadmap seleccionado.

**Prueba Humana**: Click en "Editar" sobre un roadmap existente y verificar que el formulario se abre con los tres campos ya completos con los datos correctos.

### Paso 4.3 — Guardar cambios de edición (update, no duplicado)
Al confirmar la edición, llamar a `updateRoadmap` en lugar de `saveRoadmap`.

**Prueba Humana**: Editar el título de un roadmap existente, guardar, recargar la página y confirmar que sigue existiendo una sola entrada (no se creó un duplicado) con el título actualizado.

---

## Fase 5 — Feature 4: Descarga como archivo `.roadmap`

### Paso 5.1 — Función de exportación (sin UI)
Función pura `exportRoadmap(roadmap)` en `src/lib/storage.js` (o un nuevo `src/lib/export.js`) que devuelve un string JSON con título, etiquetas, contenido y fechas.

**Prueba Humana**: Invocar la función manualmente desde la consola del navegador con un objeto de prueba y confirmar que el string devuelto es JSON válido y legible (se puede pegar en `JSON.parse` sin error).

### Paso 5.2 — Botón "Descargar" con descarga real de archivo
Botón en cada tarjeta que genera un `Blob` a partir de `exportRoadmap` y dispara la descarga vía `URL.createObjectURL`, con extensión `.roadmap`.

**Prueba Humana**: Click en "Descargar" sobre un roadmap, confirmar que el navegador descarga un archivo con extensión `.roadmap`; abrirlo con un editor de texto y verificar que el contenido coincide con el roadmap (título, etiquetas, contenido).

### Paso 5.3 — Sanitizar nombre de archivo
El nombre del archivo descargado se genera a partir del título, removiendo caracteres inválidos para nombres de archivo.

**Prueba Humana**: Crear un roadmap con título "Plan: 2026 / Metas" (caracteres especiales), descargarlo, y confirmar que el nombre de archivo resultante es válido en el sistema operativo y la descarga no falla.

---

## Fase 6 — Pulido final y validación del MVP

### Paso 6.1 — Estado vacío inicial
Mostrar un mensaje/CTA ("Creá tu primer roadmap") cuando no hay ningún roadmap guardado.

**Prueba Humana**: Borrar manualmente el Local Storage (DevTools → Application → Clear Storage), recargar la app, y verificar que se muestra el mensaje de bienvenida en lugar de un panel en blanco.

### Paso 6.2 — Validación del criterio de éxito del MVP
Prueba end-to-end contra el criterio definido en app-description.md.

**Prueba Humana**: Crear al menos 5 roadmaps con títulos, etiquetas y contenidos variados. Cronometrar cuánto tarda en encontrar uno específico usando la búsqueda: debe tomar menos de 10 segundos.

---

## Notas de secuencia

- El orden de fases respeta dependencias reales: la Fase 0 (capa de datos) es prerrequisito de todo; Feature 1 antes que Feature 2 (etiquetas se agregan al mismo formulario); Feature 3 (búsqueda) requiere que ya existan título/etiquetas/contenido que buscar; Feature 4 (descarga) es independiente y podría reordenarse antes de la Fase 4 si se prefiere entregar valor antes.
- Si se usa control de versiones, se recomienda un commit por paso una vez pasada su Prueba Humana, para que cada unidad quede durable y reversible de forma aislada.
