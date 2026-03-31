# MYTHOS_GEO

Generador procedural de mundos esféricos con React, TypeScript, Three.js y Zustand.

Este volcado se ha limpiado respecto a la exportación original para que el repositorio arranque con menos ruido:

- nombre de paquete corregido a `mythos-geo`
- dependencias ajenas al proyecto retiradas
- lockfile eliminado para regenerarlo de forma limpia
- documentación base del proyecto añadida
- sistema de agentes de limpieza y publicación incluido en `/agents`
- pipeline de CI mínima añadido en `.github/workflows/ci.yml`

## Stack

- Vite
- React 19
- TypeScript
- Three.js / React Three Fiber / Drei
- Zustand
- Tailwind CSS v4

## Puesta en marcha

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run typecheck
npm run lint
npm test          # ejecuta todos los tests (una sola vez)
npm run test:watch  # ejecuta los tests en modo watch
npm run test:ui     # abre la interfaz gráfica de Vitest
```

## Estructura

```text
src/
  core/        generación procedural
  data/        modelos y tipos
  render/      renderizado 3D y shaders
  store/       estado global
  ui/          paneles e inspectores
  utils/       utilidades
agents/        agentes para auditar, limpiar y publicar
docs/         notas de auditoría
```

## Agentes incluidos

Consulta `AGENTS.md` y la carpeta `agents/`.

## Observaciones

El proyecto procede de una exportación de AI Studio. La CI del repo verifica instalación, tipado y build reales en GitHub. Los tests unitarios se ejecutan con `npm test` (Vitest).
