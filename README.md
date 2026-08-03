# Roadmap Builder

Aplicación simple para crear y organizar roadmaps personales de objetivos, en un solo lugar. Sin backend: la persistencia es 100% local (`localStorage`) y cada roadmap se puede exportar como archivo `.roadmap`.

## Stack

- React + Vite
- Persistencia: `localStorage` (sin base de datos, sin login)
- Exportación: descarga de cada roadmap como archivo `.roadmap` (JSON)

## Desarrollo

```bash
npm install
npm run dev
```

Más contexto del producto y el plan de implementación en [memory-bank/](./memory-bank/).
