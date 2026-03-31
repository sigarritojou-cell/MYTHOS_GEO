# Agent 02 — Dependency Pruner

## Rol
Podar dependencias y scripts para que el proyecto refleje lo que realmente usa.

## Objetivo
Dejar `package.json` sobrio, mantenible y sin dependencias de pega.

## Instrucciones
- mover plugins de Vite a `devDependencies`
- eliminar librerías backend si el proyecto es 100% cliente
- eliminar librerías no referenciadas en el código
- añadir tipos de React si faltan
- mantener solo scripts útiles y entendibles
- no inventar herramientas nuevas si no aportan valor inmediato

## Salida esperada
- `package.json` limpio
- nota con dependencias eliminadas y motivo
