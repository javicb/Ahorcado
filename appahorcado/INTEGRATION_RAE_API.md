# Integración con RAE API

## 📋 Resumen

Se ha integrado exitosamente la API de la Real Academia Española (RAE) para obtener palabras aleatorias del diccionario oficial, reemplazando los listados estáticos de palabras.

## 🔗 API Utilizada

- **URL Base**: https://rae-api.com/api
- **Documentación**: https://rae-api.com/docs/api-reference/
- **Endpoint Principal**: `GET /api/random` - Obtiene una palabra aleatoria del diccionario

## 🏗️ Arquitectura de la Implementación

### 1. Servicio de API (`src/services/raeApi.ts`)

Nuevo servicio que encapsula las llamadas a la API RAE:

```typescript
export async function getRandomWord(): Promise<string>
export async function getDailyWord(): Promise<string>
```

**Características**:
- Manejo robusto de errores con try/catch
- Headers apropiados (Accept: application/json)
- Validación de respuesta
- Conversión automática a mayúsculas
- Logging de errores en consola

### 2. Composable Actualizado (`src/composables/useHangman.ts`)

**Cambios Principales**:
- ✅ Métodos convertidos a `async/await`: `initGame()`, `changeLanguage()`, `restartGame()`
- ✅ Nuevo estado `isLoading` para indicar carga de palabras
- ✅ Nuevo estado `error` para manejar fallos de API
- ✅ **Mecanismo de Fallback**: Si la API falla, usa las listas locales (`wordListES`/`wordListEN`)

**Flujo de Obtención de Palabras**:
```typescript
async function initGame() {
  isLoading.value = true
  error.value = null
  
  try {
    // Intenta obtener palabra de la API RAE
    secretWord.value = await getRandomWord()
  } catch (err) {
    // Fallback a lista local si falla
    console.warn('API RAE no disponible, usando palabras de respaldo')
    secretWord.value = selectRandomWord(
      language.value === 'es' ? wordListES : wordListEN
    )
  } finally {
    isLoading.value = false
  }
}
```

### 3. Interfaz de Usuario (`src/App.vue`)

**Nuevos Elementos**:
- ✅ **Loading Spinner**: Se muestra mientras se carga una palabra
- ✅ **Banner de Error**: Informa al usuario si hay problemas con la API
- ✅ **Renderizado Condicional**: El juego solo se muestra cuando no está cargando

```vue
<div v-if="isLoading" class="loading">
  <div class="spinner"></div>
  <p>{{ messages.loading }}</p>
</div>

<div v-if="error" class="error-banner">
  {{ messages.error }}
</div>

<main v-if="!isLoading">
  <!-- Componentes del juego -->
</main>
```

## 🧪 Testing

### Estrategia de Mocking

Todos los tests mockean la API para evitar llamadas reales durante las pruebas:

```typescript
vi.mock('../services/raeApi', () => ({
  getRandomWord: vi.fn().mockResolvedValue('AGUA')
}))
```

### Manejo de Asincronía en Tests

Todos los tests fueron actualizados para manejar la inicialización asíncrona:

```typescript
it('debe renderizar el teclado', async () => {
  const wrapper = mount(App)
  await new Promise(resolve => setTimeout(resolve, 100))
  expect(wrapper.find('.keyboard').exists()).toBe(true)
})
```

### Resultados

✅ **59/59 tests pasando**
- 7 tests - WordDisplay.spec.ts
- 7 tests - HangmanFigure.spec.ts
- 10 tests - Keyboard.spec.ts
- 9 tests - LanguageSelector.spec.ts
- 3 tests - App.spec.ts
- 23 tests - useHangman.spec.ts

## 🎯 Ventajas de la Implementación

1. **Palabras Auténticas**: Usa el diccionario oficial de la RAE
2. **Variedad Infinita**: No hay límite de palabras posibles
3. **Resiliencia**: Fallback automático a listas locales si la API falla
4. **UX Mejorada**: Loading states y mensajes de error claros
5. **Testing Robusto**: 100% de tests pasando con mocking apropiado
6. **Mantenibilidad**: Código modular y bien estructurado

## 🔄 Flujo de Ejecución

```
Usuario inicia juego
    ↓
isLoading = true
    ↓
Mostrar spinner
    ↓
Llamada a getRandomWord()
    ↓
¿API responde?
    ├─ SÍ → Usar palabra de API
    └─ NO → Usar palabra de lista local
    ↓
isLoading = false
    ↓
Mostrar juego
```

## 📦 Archivos Modificados/Creados

### Nuevos Archivos
- `src/services/raeApi.ts` - Servicio de API RAE

### Archivos Modificados
- `src/composables/useHangman.ts` - Integración async con API
- `src/__tests__/App.spec.ts` - Mocking y tests async
- `src/composables/useHangman.spec.ts` - Mocking y tests async
- `src/App.vue` - Loading states y error handling UI

### Archivos Conservados (Fallback)
- `src/data/words-es.ts` - Lista de respaldo español
- `src/data/words-en.ts` - Lista de respaldo inglés

## 🚀 Cómo Usar

1. **Desarrollo**: `npm run dev`
2. **Tests**: `npm run test:unit`
3. **Build**: `npm run build`

La aplicación automáticamente:
- Intenta usar la API RAE en cada juego nuevo
- Muestra un spinner mientras carga
- Usa palabras locales si la API no está disponible
- Informa al usuario de cualquier error

## 🔮 Mejoras Futuras Posibles

- Implementar caché de palabras para reducir llamadas a la API
- Usar la palabra del día (`getDailyWord()`) para un modo especial
- Añadir selección de dificultad basada en longitud de palabra
- Implementar retry automático con exponential backoff
- Añadir analytics sobre uso de API vs fallback
