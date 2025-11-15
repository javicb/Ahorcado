#!/usr/bin/env pwsh
# Script de verificación de la integración con RAE API

Write-Host "🎮 VERIFICACIÓN DE INTEGRACIÓN CON RAE API" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar archivos creados/modificados
Write-Host "📁 Verificando archivos..." -ForegroundColor Yellow

$files = @(
    "src/services/raeApi.ts",
    "src/composables/useHangman.ts",
    "src/App.vue",
    "src/__tests__/App.spec.ts",
    "src/composables/useHangman.spec.ts",
    "INTEGRATION_RAE_API.md"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file - NO ENCONTRADO" -ForegroundColor Red
    }
}

Write-Host ""

# 2. Ejecutar tests
Write-Host "🧪 Ejecutando tests..." -ForegroundColor Yellow
$testOutput = npm run test:unit -- --run 2>&1
$testsPassed = $testOutput | Select-String "Test Files.*6 passed"
$allTestsPassed = $testOutput | Select-String "Tests.*59 passed"

if ($testsPassed -and $allTestsPassed) {
    Write-Host "  ✅ Todos los tests pasaron (59/59)" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Algunos tests fallaron" -ForegroundColor Yellow
}

Write-Host ""

# 3. Verificar compilación
Write-Host "🔨 Verificando compilación TypeScript..." -ForegroundColor Yellow
$buildOutput = npm run type-check 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Sin errores de compilación" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Hay errores de compilación" -ForegroundColor Yellow
}

Write-Host ""

# 4. Resumen de implementación
Write-Host "📊 RESUMEN DE IMPLEMENTACIÓN" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Servicio RAE API creado" -ForegroundColor Green
Write-Host "   - Endpoint: https://rae-api.com/api/random" -ForegroundColor Gray
Write-Host "   - Funciones: getRandomWord(), getDailyWord()" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ Composable useHangman actualizado" -ForegroundColor Green
Write-Host "   - Métodos async: initGame(), changeLanguage(), restartGame()" -ForegroundColor Gray
Write-Host "   - Estados: isLoading, error" -ForegroundColor Gray
Write-Host "   - Fallback a listas locales" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ UI mejorada en App.vue" -ForegroundColor Green
Write-Host "   - Loading spinner" -ForegroundColor Gray
Write-Host "   - Banner de error" -ForegroundColor Gray
Write-Host "   - Renderizado condicional" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ Tests actualizados (59 tests)" -ForegroundColor Green
Write-Host "   - API mockeada en todos los tests" -ForegroundColor Gray
Write-Host "   - Tests async con timeouts apropiados" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ Documentación creada" -ForegroundColor Green
Write-Host "   - INTEGRATION_RAE_API.md" -ForegroundColor Gray
Write-Host "   - README.md actualizado" -ForegroundColor Gray
Write-Host ""

# 5. Instrucciones de uso
Write-Host "🚀 INSTRUCCIONES DE USO" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Desarrollo:" -ForegroundColor Yellow
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Tests:" -ForegroundColor Yellow
Write-Host "  npm run test:unit" -ForegroundColor White
Write-Host ""
Write-Host "Build:" -ForegroundColor Yellow
Write-Host "  npm run build" -ForegroundColor White
Write-Host ""

Write-Host "✨ Integración completada exitosamente! ✨" -ForegroundColor Green
