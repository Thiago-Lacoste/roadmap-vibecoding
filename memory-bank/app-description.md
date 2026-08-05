# App Description — Roadmap Builder

## Problema
Los usuarios pierden el rumbo hacia sus objetivos porque sus notas y planes están dispersos en múltiples lugares (apps de notas, papel, documentos), sin un punto único de referencia.

## Beneficio Principal
Una aplicación simple para crear y organizar roadmaps personales de objetivos, en un solo lugar.

## Características Principales (MVP)
1. Entrada de texto para crear un roadmap
2. Sistema de etiquetado para organizar roadmaps
3. Barra de búsqueda para encontrar roadmaps por etiqueta o texto
4. Descarga de un roadmap como archivo `.roadmap`

## Flujo de Usuario
1. Abrir la aplicación
2. Crear un roadmap y agregarle una etiqueta
3. Verlo en el inicio (panel central local)
4. Buscarlo por título, etiqueta o texto dentro del roadmap
5. Editarlo, renombrarlo o borrarlo

## Éxito
Los usuarios pueden encontrar un roadmap específico en menos de 10 segundos usando la búsqueda.

## Stack Tecnológico
- Frontend: React + Vite
- Persistencia: localStorage (sin base de datos, sin login)
- Exportación: descarga de cada roadmap como archivo `.roadmap` (texto plano/JSON)

## Notas
La entrada no especificaba si el roadmap debe ser compartible con otros o solo de uso individual; se asumió uso individual/privado por ser el caso más simple para validar el MVP.

Archivos de ejemplo: