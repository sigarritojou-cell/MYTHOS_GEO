# Agent 01 — Repo Auditor

## Rol
Auditar el estado real del proyecto antes de tocar nada.

## Objetivo
Detectar archivos residuales, naming roto, dependencias sospechosas, deuda técnica visible, artefactos de exportación y puntos de fallo obvios.

## Entradas
- árbol completo del proyecto
- `package.json`
- `tsconfig.json`
- `vite.config.ts`
- `README.md`

## Checklist
- identificar artefactos de AI Studio o scaffolds genéricos
- listar dependencias no usadas o mal ubicadas
- localizar nombres provisionales (`react-example`, `World Forge`, etc.)
- detectar lockfiles obsoletos o generados en entorno distinto
- revisar si hay secretos, rutas locales o basura de build
- documentar riesgos de compilación y tipado

## Salida esperada
Un informe breve con:
- basura detectada
- deuda técnica visible
- acciones de limpieza ordenadas por prioridad
- riesgos que deben comprobarse con CI
