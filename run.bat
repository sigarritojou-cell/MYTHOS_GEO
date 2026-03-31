@echo off
chcp 65001 >nul 2>&1
:: run.bat — helper para instalar dependencias y ejecutar los tests de MYTHOS_GEO.
::
:: Uso:
::   run.bat              instala deps y ejecuta los tests (una sola vez)
::   run.bat install      solo instala las dependencias
::   run.bat test         instala deps y ejecuta los tests (una sola vez)
::   run.bat watch        instala deps y arranca Vitest en modo watch
::   run.bat ui           instala deps y abre la UI gráfica de Vitest
::   run.bat /?           muestra esta ayuda
setlocal EnableDelayedExpansion

:: ── argumento por defecto ────────────────────────────────────────────────────
set "CMD=%~1"
if "%CMD%"=="" set "CMD=test"

:: ── despacho de comandos ─────────────────────────────────────────────────────
if /i "%CMD%"=="/?"     goto :usage
if /i "%CMD%"=="-h"     goto :usage
if /i "%CMD%"=="--help" goto :usage
if /i "%CMD%"=="install" goto :do_install
if /i "%CMD%"=="test"    goto :do_test
if /i "%CMD%"=="watch"   goto :do_watch
if /i "%CMD%"=="ui"      goto :do_ui

echo Error: comando desconocido '%CMD%'
echo.
goto :usage_exit1

:: ── subrutinas ────────────────────────────────────────────────────────────────
:install_deps
echo.
echo ^> npm install
call npm install
if errorlevel 1 (
    echo.
    echo Error: npm install falló.
    exit /b 1
)
goto :eof

:do_install
call :install_deps
goto :end

:do_test
call :install_deps
echo.
echo ^> npm test
call npm test
if errorlevel 1 exit /b 1
goto :end

:do_watch
call :install_deps
echo.
echo ^> npm run test:watch
call npm run test:watch
if errorlevel 1 exit /b 1
goto :end

:do_ui
call :install_deps
echo.
echo ^> npm run test:ui
call npm run test:ui
if errorlevel 1 exit /b 1
goto :end

:usage
echo Uso:  run.bat [comando]
echo.
echo Comandos disponibles:
echo   (sin argumento)  instala deps y ejecuta los tests (una sola vez)
echo   install          instala las dependencias (npm install)
echo   test             instala deps y ejecuta los tests (una sola vez)
echo   watch            instala deps y arranca Vitest en modo watch
echo   ui               instala deps y abre la UI gráfica de Vitest
echo   /?, -h, --help   muestra esta ayuda
goto :end

:usage_exit1
echo Uso:  run.bat [comando]
echo.
echo Comandos disponibles:
echo   (sin argumento)  instala deps y ejecuta los tests (una sola vez)
echo   install          instala las dependencias (npm install)
echo   test             instala deps y ejecuta los tests (una sola vez)
echo   watch            instala deps y arranca Vitest en modo watch
echo   ui               instala deps y abre la UI gráfica de Vitest
echo   /?, -h, --help   muestra esta ayuda
exit /b 1

:end
endlocal
