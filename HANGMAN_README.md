# 🎮 Juego del Ahorcado / Hangman Game

Una aplicación interactiva del clásico juego del ahorcado, desarrollada con **Vue 3**, **TypeScript** y **Composition API**.

## ✨ Características

- 🌍 **Bilingüe**: Juega en español o inglés con cambio dinámico de idioma
- 🎨 **Interfaz moderna**: Diseño responsive con animaciones suaves
- ♿ **Accesible**: Cumple con estándares WCAG 2.2 Level AA
- 🧪 **Testeable**: Cobertura completa de tests unitarios con Vitest
- 📱 **Responsive**: Optimizado para móviles, tablets y escritorio
- ⌨️ **Navegación por teclado**: Totalmente accesible desde el teclado

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ 
- npm o yarn

### Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Ejecutar tests
npm run test:unit

# Compilar para producción
npm run build
```

## 🎯 Cómo Jugar

1. **Selecciona tu idioma**: Haz clic en 🇪🇸 ES o 🇬🇧 EN en la parte superior
2. **Adivina la palabra**: Haz clic en las letras del teclado virtual
3. **Gana o pierde**: 
   - ✅ **Victoria**: Adivina todas las letras antes de 6 errores
   - ❌ **Derrota**: Completa el dibujo del ahorcado (6 errores)
4. **Juega de nuevo**: Haz clic en el botón de reinicio

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes Vue
│   ├── HangmanFigure.vue       # Dibujo SVG del ahorcado
│   ├── WordDisplay.vue         # Visualización de la palabra
│   ├── Keyboard.vue            # Teclado virtual
│   └── LanguageSelector.vue    # Selector de idioma
├── composables/          # Lógica reutilizable
│   └── useHangman.ts           # Lógica principal del juego
├── data/                 # Datos del juego
│   ├── words-es.ts             # Palabras en español
│   └── words-en.ts             # Palabras en inglés
├── styles/               # Estilos globales
│   └── global.css              # CSS global y reset
└── App.vue               # Componente principal
```

## 🧩 Arquitectura

### Componentes

- **HangmanFigure**: Renderiza el dibujo progresivo del ahorcado usando SVG
- **WordDisplay**: Muestra la palabra con letras reveladas y guiones bajos
- **Keyboard**: Teclado virtual interactivo con estados visuales
- **LanguageSelector**: Botones para cambiar entre ES/EN

### Composable

**useHangman** - Gestiona toda la lógica del juego:
- ✅ Selección aleatoria de palabras
- ✅ Validación de letras
- ✅ Detección de victoria/derrota
- ✅ Gestión de estado del juego
- ✅ Cambio de idioma
- ✅ Mensajes multiidioma

## 🧪 Testing

El proyecto incluye tests completos:

```bash
# Ejecutar todos los tests
npm run test:unit

# Ejecutar tests en modo watch
npm run test:unit -- --watch

# Ver cobertura de tests
npm run test:unit -- --coverage
```

### Cobertura de Tests

- ✅ Tests del composable `useHangman`
- ✅ Tests de componentes (HangmanFigure, WordDisplay, Keyboard, LanguageSelector)
- ✅ Tests de integración
- ✅ Tests de accesibilidad

## ♿ Accesibilidad

Esta aplicación sigue las mejores prácticas de accesibilidad:

- 🎯 **Navegación por teclado**: Todos los elementos interactivos son accesibles
- 🔊 **Lectores de pantalla**: Roles y labels ARIA apropiados
- 🎨 **Contraste**: Cumple con WCAG 2.2 Level AA (4.5:1)
- ⚡ **Movimiento reducido**: Respeta `prefers-reduced-motion`
- 🏷️ **Semántica HTML**: Uso correcto de elementos semánticos

## 🎨 Tecnologías

- **Vue 3.5+** - Framework progresivo de JavaScript
- **TypeScript** - Tipado estático
- **Composition API** - Lógica reactiva y reutilizable
- **Vite** - Build tool ultrarrápido
- **Vitest** - Framework de testing
- **Vue Test Utils** - Utilidades para testing de componentes

## 📝 Reglas del Juego

- 📖 Se selecciona una palabra aleatoria del diccionario
- 🔤 Las letras se validan sin distinción de mayúsculas/minúsculas
- 🚫 No se aceptan caracteres no alfabéticos
- 🔁 No se permiten intentos repetidos de la misma letra
- 6️⃣ Máximo de 6 errores antes de perder

## 🛠️ Desarrollo

### Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Compilar para producción
npm run preview      # Preview de la build
npm run test:unit    # Tests unitarios
npm run lint         # Linter ESLint
npm run format       # Formatear código con Prettier
```

### Agregar Nuevas Palabras

Edita los archivos en `src/data/`:
- `words-es.ts` - Palabras en español
- `words-en.ts` - Palabras en inglés

```typescript
export const wordListES: string[] = [
  'NUEVA',
  'PALABRA',
  // ... más palabras
]
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'feat: Add amazing feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

Desarrollado con ❤️ usando Vue 3 y TypeScript

---

¡Disfruta del juego! 🎉
