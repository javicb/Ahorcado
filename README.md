# 🎮 Ahorcado - Hangman Game

Juego del Ahorcado desarrollado con Vue 3, TypeScript y Vite. Utiliza la API de la Real Academia Española (RAE) para obtener palabras auténticas del diccionario oficial.

## 🌟 Características

- 🎯 **Palabras Auténticas**: Integración con la [RAE API](https://rae-api.com/) para obtener palabras del diccionario oficial
- 🌍 **Multiidioma**: Soporte para Español (con ñ) e Inglés
- 🎮 **Tres Niveles de Dificultad**:
  - **Fácil** 😊: Revela automáticamente todas las vocales
  - **Medio** 😐: Revela 2-3 letras aleatorias
  - **Difícil** 😤: No revela ninguna letra (modo clásico)
- ♿ **Accesibilidad**: Implementado siguiendo las pautas WCAG 2.2 Level AA
- 📱 **Responsive**: Diseño optimizado para móvil, tablet y escritorio
- 🎨 **UI/UX Moderna**: Interfaz intuitiva con estados de carga y manejo de errores
- 🧪 **100% Testeado**: Tests unitarios completos con Vitest
- 🔄 **Modo Fallback**: Usa listas locales de ~1000 palabras si la API no está disponible
- 🎭 **Figura del Ahorcado**: Animada progresivamente con SVG
- 👶 **Vocabulario Infantil**: Palabras apropiadas para niños de 6 a 10 años
- 💾 **Persistencia**: Guarda tu nivel de dificultad preferido en localStorage
- 🔊 **Audio Interactivo**: Efectos de sonido que mejoran la experiencia de juego

## 🚀 Funcionalidades del Juego

1. **Selección de Idioma**: Cambia entre español e inglés
2. **Palabras Aleatorias**: Cada juego usa una palabra diferente de la API RAE
3. **Teclado Virtual**: Clickeable con indicadores visuales (correctas/incorrectas)
4. **Estados del Juego**: Victoria, derrota y jugando
5. **Contador de Fallos**: Máximo 6 intentos fallidos
6. **Mensajes Multiidioma**: Todos los textos adaptados al idioma seleccionado
7. **Diseño Responsive**: Adaptado automáticamente a cualquier dispositivo
8. **Sistema de Niveles**: Tres niveles de dificultad con diferentes pistas
9. **Efectos de Sonido**: Audio interactivo con control de activación/desactivación

### 🎮 Niveles de Dificultad

El juego incluye tres niveles de dificultad que se ajustan automáticamente:

- **😊 Fácil**: Ideal para niños o principiantes
  - Revela todas las vocales (a, e, i, o, u) automáticamente al inicio
  - Facilita enormemente adivinar la palabra
  - Perfecto para aprender y ganar confianza

- **😐 Medio** (por defecto): Equilibrio perfecto
  - Revela 2-3 letras aleatorias al inicio
  - Proporciona una ayuda moderada
  - Desafío balanceado para la mayoría de jugadores

- **😤 Difícil**: Para expertos
  - No revela ninguna letra (modo clásico del ahorcado)
  - Máximo desafío
  - Solo 6 intentos para adivinar la palabra completa

Tu nivel de dificultad preferido se guarda automáticamente en el navegador.

### 🔊 Sistema de Audio

El juego incluye efectos de sonido para mejorar la experiencia de juego:

- **🎵 Efectos de Sonido**:
  - ✅ **Letra Correcta**: Melodía ascendente agradable (C5 → E5)
  - ❌ **Letra Incorrecta**: Tonos descendentes de error (G4 → Eb4)
  - 🎉 **Victoria**: Secuencia melódica celebratoria de 4 notas
  - 😢 **Derrota**: Melodía descendente de final de juego
  - 🖱️ **Click**: Retroalimentación al activar el audio

- **🎛️ Control de Audio**:
  - Botón de toggle en el header (🔊/🔇)
  - Activación/desactivación con un click
  - Configuración persistente (se guarda tu preferencia)
  - Control de volumen ajustable (por defecto 50%)

- **⚙️ Tecnología**:
  - Web Audio API para generación de tonos programática
  - Sin archivos de audio externos necesarios
  - Compatible con todos los navegadores modernos
  - Tonos generados dinámicamente con OscillatorNode

Los efectos de sonido se reproducen automáticamente durante el juego y tu preferencia de audio se guarda en el navegador.

## ⚠️ Nota sobre RAE API en Producción

La API de RAE tiene restricciones CORS que impiden su uso desde dominios externos en producción. Por este motivo:

- ✅ **Funciona en desarrollo local**: La API responde correctamente
- ❌ **No funciona en producción** (Netlify, Vercel, etc.): CORS bloqueará las peticiones
- 🔄 **Solución automática**: El juego usa automáticamente las listas locales de ~1000 palabras
- ⏱️ **Timeout de 3 segundos**: Las peticiones a la API se cancelan automáticamente si tardan demasiado

El juego funciona perfectamente usando las palabras del diccionario local, que están optimizadas para niños de 6 a 10 años.

## 📖 Documentación Adicional

- [Integración con RAE API](./INTEGRATION_RAE_API.md) - Detalles técnicos de la implementación

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
