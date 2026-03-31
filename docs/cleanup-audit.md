# Cleanup audit

## Hallazgos iniciales

- El proyecto venía con nombre genérico: `react-example`.
- El `README.md` era el típico de exportación de AI Studio.
- Aparecen dependencias impropias para la app actual: `express`, `dotenv`, `better-sqlite3`, `@google/genai`, `motion`, `clsx`, `tailwind-merge`, `tsx`, `@types/express`.
- `metadata.json` parece artefacto de exportación y no forma parte del runtime del repo.
- El lockfile heredado se elimina para regenerarlo con el grafo real de dependencias.

## Riesgos pendientes

- Validar instalación real de paquetes.
- Confirmar que no haya imports rotos tras la poda.
- Confirmar build final en CI.

## Criterio de limpieza aplicado

Se ha tocado solo lo que huele a residuo claro o naming incorrecto. No se ha reestructurado la lógica de generación procedural para evitar introducir regresiones gratuitas.
