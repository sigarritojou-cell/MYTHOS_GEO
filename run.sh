#!/usr/bin/env bash
# run.sh — helper para instalar dependencias y ejecutar los tests de MYTHOS_GEO.
#
# Uso:
#   ./run.sh              # instala deps y ejecuta los tests (una sola vez)
#   ./run.sh install      # solo instala las dependencias
#   ./run.sh test         # instala deps y ejecuta los tests (una sola vez)
#   ./run.sh watch        # instala deps y arranca el modo watch de Vitest
#   ./run.sh ui           # instala deps y abre la UI gráfica de Vitest
#   ./run.sh -h|--help    # muestra esta ayuda

set -euo pipefail

# ── colores ──────────────────────────────────────────────────────────────────
BOLD='\033[1m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
RESET='\033[0m'

# ── funciones ─────────────────────────────────────────────────────────────────
usage() {
  echo -e "${BOLD}Uso:${RESET}  ./run.sh [comando]"
  echo ""
  echo -e "${BOLD}Comandos disponibles:${RESET}"
  echo -e "  ${CYAN}(sin argumento)${RESET}  instala deps y ejecuta los tests (una sola vez)"
  echo -e "  ${CYAN}install${RESET}          instala las dependencias (npm install)"
  echo -e "  ${CYAN}test${RESET}             instala deps y ejecuta los tests (una sola vez)"
  echo -e "  ${CYAN}watch${RESET}            instala deps y arranca Vitest en modo watch"
  echo -e "  ${CYAN}ui${RESET}               instala deps y abre la UI gráfica de Vitest"
  echo -e "  ${CYAN}-h, --help${RESET}       muestra esta ayuda"
}

step() {
  echo -e "\n${BOLD}${GREEN}▶ $*${RESET}"
}

install_deps() {
  step "npm install"
  npm install
}

# ── punto de entrada ──────────────────────────────────────────────────────────
CMD="${1:-test}"

case "$CMD" in
  -h|--help)
    usage
    exit 0
    ;;
  install)
    install_deps
    ;;
  test)
    install_deps
    step "npm test"
    npm test
    ;;
  watch)
    install_deps
    step "npm run test:watch"
    npm run test:watch
    ;;
  ui)
    install_deps
    step "npm run test:ui"
    npm run test:ui
    ;;
  *)
    echo "Error: comando desconocido '${CMD}'"
    echo ""
    usage
    exit 1
    ;;
esac
