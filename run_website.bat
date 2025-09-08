@echo off
npx vite build
if %errorlevel% neq 0 exit /b %errorlevel%
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist