# 🔊 Sistema de Audio - Documentación Técnica

## Resumen

El sistema de audio del juego del Ahorcado utiliza la **Web Audio API** para generar tonos de forma programática, sin necesidad de archivos de audio externos. Esto proporciona una experiencia de usuario mejorada con efectos de sonido que responden a las acciones del jugador.

## 🎵 Efectos de Sonido Implementados

### 1. Letra Correcta ✅

- **Frecuencias**: C5 (523 Hz) → E5 (659 Hz)
- **Duración**: 100ms cada tono
- **Tipo de onda**: Sine (onda sinusoidal)
- **Descripción**: Melodía ascendente agradable que indica éxito

### 2. Letra Incorrecta ❌

- **Frecuencias**: G4 (392 Hz) → Eb4 (311 Hz)
- **Duración**: 100ms cada tono
- **Tipo de onda**: Sine (onda sinusoidal)
- **Descripción**: Tonos descendentes que indican error

### 3. Victoria 🎉

- **Frecuencias**: C5 (523 Hz) → E5 (659 Hz) → G5 (784 Hz) → C6 (1047 Hz)
- **Duración**: 150ms cada tono
- **Tipo de onda**: Sine (onda sinusoidal)
- **Descripción**: Secuencia melódica celebratoria ascendente

### 4. Derrota 😢

- **Frecuencias**: G4 (392 Hz) → F4 (349 Hz) → D4 (294 Hz) → C4 (262 Hz)
- **Duración**: 200ms cada tono
- **Tipo de onda**: Sine (onda sinusoidal)
- **Descripción**: Melodía descendente que indica final del juego

### 5. Click 🖱️

- **Frecuencia**: 800 Hz
- **Duración**: 50ms
- **Tipo de onda**: Square (onda cuadrada)
- **Descripción**: Retroalimentación inmediata al activar el audio

## 🏗️ Arquitectura del Sistema

### AudioService (`src/services/audioService.ts`)

Servicio singleton que gestiona toda la funcionalidad de audio:

```typescript
class AudioService {
  // Configuración
  private audioContext: AudioContext
  private isAudioEnabled: boolean
  private volume: number = 0.5

  // API Pública
  play(effect: SoundEffect): void
  toggle(): void
  setEnabled(enabled: boolean): void
  setVolume(volume: number): void
  isEnabled(): boolean

  // Métodos Internos
  private playTone(frequency, duration, type): void
  private playSequence(notes): void
}
```

**Características clave:**

- Patrón Singleton para gestión centralizada
- Persistencia en localStorage
- Control de volumen (0-1)
- Generación dinámica de tonos con OscillatorNode
- Fade-out suave con exponential ramp

### AudioToggle Component (`src/components/AudioToggle.vue`)

Componente de UI para controlar el audio:

```vue
<template>
  <button @click="toggleAudio" :aria-pressed="isAudioEnabled">
    {{ isAudioEnabled ? '🔊' : '🔇' }}
  </button>
</template>
```

**Características clave:**

- Reactive state management
- ARIA accessibility (`aria-label`, `aria-pressed`)
- Diseño responsive (móvil/tablet/escritorio)
- Indicador visual del estado (borde verde cuando activo)

## 🔌 Integración con el Juego

### En `useHangman.ts`:

```typescript
import { audioService } from '../services/audioService'

const guessLetter = (letter: string) => {
  // ... lógica del juego ...

  if (isCorrect) {
    audioService.play('correct')
  } else {
    audioService.play('wrong')
  }

  // Victoria/Derrota con delay de 300ms
  if (hasWon) {
    setTimeout(() => audioService.play('win'), 300)
  }
  if (hasLost) {
    setTimeout(() => audioService.play('lose'), 300)
  }
}
```

**Delay de 300ms**: Permite que el jugador escuche primero el sonido de la letra (correct/wrong) y después el sonido de victoria/derrota.

## 💾 Persistencia

El sistema guarda automáticamente las preferencias del usuario en localStorage:

```typescript
// Claves de localStorage
'hangman-audio-enabled': 'true' | 'false'
'hangman-audio-volume': number (0-1)
```

Esto garantiza que las preferencias del usuario se mantengan entre sesiones.

## ♿ Accesibilidad

- **ARIA Labels**: `aria-label="Toggle sound effects"`
- **ARIA Pressed**: `aria-pressed="true"/"false"` indica el estado actual
- **Focus Visible**: Indicador visual claro del foco del teclado
- **Keyboard Accessible**: Totalmente operable con teclado

## 🧪 Testing

### AudioService Tests (`src/services/__tests__/audioService.spec.ts`)

- 20+ tests cubriendo:
  - Configuración inicial
  - Reproducción de efectos de sonido
  - Persistencia en localStorage
  - Control de volumen
  - Toggle de activación/desactivación

### AudioToggle Tests (`src/components/__tests__/AudioToggle.spec.ts`)

- 11 tests cubriendo:
  - Renderizado del componente
  - Estados del icono (🔊/🔇)
  - Comportamiento al hacer click
  - Atributos ARIA

## 🌐 Compatibilidad del Navegador

La Web Audio API es compatible con:

- ✅ Chrome/Edge (Chromium) 35+
- ✅ Firefox 25+
- ✅ Safari 14.1+ (con webkitAudioContext)
- ✅ Opera 22+

**Fallback para Safari**:

```typescript
const AudioContext =
  window.AudioContext ||
  (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
```

## 🎨 Diseño Responsive

El botón de audio se adapta a diferentes dispositivos:

```scss
// Móvil (< 480px): 36px
// Tablet (480-768px): 40px
// Escritorio (> 768px): 44px
```

## 📊 Ventajas de la Implementación

1. **Sin archivos externos**: No se necesitan archivos MP3/WAV
2. **Peso reducido**: Código JavaScript puro (~5KB)
3. **Personalizable**: Fácil cambiar frecuencias y duraciones
4. **Rendimiento**: Generación de tonos en tiempo real
5. **Mantenible**: Código TypeScript type-safe
6. **Testeable**: Fácil de mockear para tests unitarios

## 🚀 Uso del Sistema

### Para el Usuario:

1. Hacer click en el botón 🔊/🔇 en el header
2. Los sonidos se reproducen automáticamente al jugar
3. La preferencia se guarda automáticamente

### Para el Desarrollador:

```typescript
// Reproducir un efecto
audioService.play('correct')

// Cambiar volumen
audioService.setVolume(0.7) // 70%

// Toggle audio
audioService.toggle()

// Comprobar estado
const enabled = audioService.isEnabled()
```

## 🔧 Configuración Técnica

### Parámetros de Tono:

- **Attack**: 0.01s (fade-in rápido)
- **Release**: 0.01s (fade-out rápido usando exponentialRampToValueAtTime)
- **Base Volume**: 0.5 (50% por defecto)
- **Wave Type**: Sine para melodías, Square para clicks

### Optimizaciones:

- Reutilización del AudioContext
- Liberación automática de nodos después de reproducción
- Control de gain para evitar clipping
- Exponential ramps para transiciones suaves

## 📝 Notas de Implementación

- El delay de 300ms en victoria/derrota es intencional para mejorar UX
- Los tonos están afinados en la escala de Do mayor para armonía
- El volumen por defecto (50%) evita sonidos molestos
- El botón está en el header para fácil acceso
- Los efectos son breves (50-200ms) para no interrumpir el juego

---

**Última actualización**: Enero 2025
**Versión**: 1.0.0
