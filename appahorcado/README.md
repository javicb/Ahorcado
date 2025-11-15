# 🎮 Ahorcado - Hangman Game

Juego del Ahorcado desarrollado con Vue 3, TypeScript y Vite. Utiliza la API de la Real Academia Española (RAE) para obtener palabras auténticas del diccionario oficial.

## 🌟 Características

- 🎯 **Palabras Auténticas**: Integración con la [RAE API](https://rae-api.com/) para obtener palabras del diccionario oficial
- 🌍 **Multiidioma**: Soporte para Español (con ñ) e Inglés
- ♿ **Accesibilidad**: Implementado siguiendo las pautas WCAG 2.2 Level AA
- 🎨 **UI/UX Moderna**: Interfaz intuitiva con estados de carga y manejo de errores
- 🧪 **100% Testeado**: 59 tests unitarios con Vitest
- 🔄 **Modo Fallback**: Usa listas locales si la API no está disponible
- 🎭 **Figura del Ahorcado**: Animada progresivamente con SVG

## 🚀 Funcionalidades del Juego

1. **Selección de Idioma**: Cambia entre español e inglés
2. **Palabras Aleatorias**: Cada juego usa una palabra diferente de la API RAE
3. **Teclado Virtual**: Clickeable con indicadores visuales (correctas/incorrectas)
4. **Estados del Juego**: Victoria, derrota y jugando
5. **Contador de Fallos**: Máximo 6 intentos fallidos
6. **Mensajes Multiidioma**: Todos los textos adaptados al idioma seleccionado

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
