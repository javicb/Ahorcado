<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { audioService } from '../services/audioService'

const isEnabled = ref(audioService.isEnabled())

const toggleAudio = () => {
  const newState = audioService.toggle()
  isEnabled.value = newState

  // Reproducir un click como feedback
  if (newState) {
    audioService.playClick()
  }
}

onMounted(() => {
  isEnabled.value = audioService.isEnabled()
})
</script>

<template>
  <button
    type="button"
    class="audio-toggle"
    :class="{ active: isEnabled }"
    :aria-label="isEnabled ? 'Desactivar sonido' : 'Activar sonido'"
    :aria-pressed="isEnabled"
    @click="toggleAudio"
  >
    <span class="audio-icon" aria-hidden="true">
      {{ isEnabled ? '🔊' : '🔇' }}
    </span>
  </button>
</template>

<style scoped>
.audio-toggle {
  background-color: rgba(255, 255, 255, 0.9);
  border: 2px solid transparent;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 45px;
  min-height: 45px;
}

.audio-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  background-color: rgba(255, 255, 255, 1);
}

.audio-toggle:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.audio-toggle.active {
  border-color: #27ae60;
  background-color: rgba(39, 174, 96, 0.1);
}

.audio-icon {
  font-size: 22px;
  line-height: 1;
  display: block;
}

/* Focus styles for accessibility */
.audio-toggle:focus-visible {
  outline: 3px solid #3498db;
  outline-offset: 2px;
}

/* Tablet */
@media (max-width: 768px) {
  .audio-toggle {
    min-width: 42px;
    min-height: 42px;
    padding: 6px 10px;
  }

  .audio-icon {
    font-size: 20px;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .audio-toggle {
    min-width: 40px;
    min-height: 40px;
    padding: 6px 8px;
  }

  .audio-icon {
    font-size: 18px;
  }
}
</style>
