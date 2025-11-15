<script setup lang="ts">
import { computed } from 'vue'
import type { Difficulty, Language } from '../composables/useHangman'

const props = defineProps<{
  currentDifficulty: Difficulty
  currentLanguage?: Language
}>()

const emit = defineEmits<{
  changeDifficulty: [difficulty: Difficulty]
}>()

const labels = computed(() => {
  if (props.currentLanguage === 'en') {
    return {
      title: 'Difficulty:',
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard'
    }
  }
  return {
    title: 'Dificultad:',
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Difícil'
  }
})

const difficulties = computed(() => [
  { value: 'easy' as Difficulty, label: labels.value.easy, icon: '😊', color: '#27ae60' },
  { value: 'medium' as Difficulty, label: labels.value.medium, icon: '😐', color: '#f39c12' },
  { value: 'hard' as Difficulty, label: labels.value.hard, icon: '😤', color: '#e74c3c' }
])

const handleChange = (difficulty: Difficulty) => {
  emit('changeDifficulty', difficulty)
}
</script>

<template>
  <div class="difficulty-selector" role="group" aria-label="Selector de dificultad">
    <label class="difficulty-label" id="difficulty-label">
      {{ labels.title }}
    </label>
    <div class="difficulty-buttons" aria-labelledby="difficulty-label">
      <button
        v-for="diff in difficulties"
        :key="diff.value"
        type="button"
        class="difficulty-btn"
        :class="{ active: currentDifficulty === diff.value }"
        :style="{
          '--btn-color': diff.color,
          borderColor: currentDifficulty === diff.value ? diff.color : 'transparent'
        }"
        :aria-pressed="currentDifficulty === diff.value"
        :aria-label="`Nivel ${diff.label}`"
        @click="handleChange(diff.value)"
      >
        <span class="difficulty-icon" aria-hidden="true">{{ diff.icon }}</span>
        <span class="difficulty-text">{{ diff.label }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.difficulty-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 15px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.difficulty-label {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.difficulty-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.difficulty-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border: 3px solid transparent;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 15px;
  font-weight: 600;
  color: #2c3e50;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.difficulty-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  background-color: rgba(255, 255, 255, 1);
}

.difficulty-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.difficulty-btn.active {
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transform: scale(1.05);
}

.difficulty-btn.active .difficulty-text {
  color: var(--btn-color);
}

.difficulty-icon {
  font-size: 20px;
  line-height: 1;
}

.difficulty-text {
  font-weight: 600;
  transition: color 0.3s ease;
}

/* Focus styles for accessibility */
.difficulty-btn:focus-visible {
  outline: 3px solid #3498db;
  outline-offset: 2px;
}

/* Tablet */
@media (max-width: 768px) {
  .difficulty-selector {
    padding: 12px 15px;
  }

  .difficulty-label {
    font-size: 15px;
  }

  .difficulty-btn {
    padding: 8px 14px;
    font-size: 14px;
  }

  .difficulty-icon {
    font-size: 18px;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .difficulty-selector {
    padding: 10px;
    width: 100%;
  }

  .difficulty-buttons {
    width: 100%;
    gap: 8px;
  }

  .difficulty-btn {
    flex: 1;
    min-width: 90px;
    padding: 8px 10px;
    font-size: 13px;
    gap: 4px;
  }

  .difficulty-icon {
    font-size: 16px;
  }
}

/* Extra small mobile */
@media (max-width: 359px) {
  .difficulty-btn {
    min-width: 80px;
    padding: 6px 8px;
    font-size: 12px;
  }

  .difficulty-icon {
    font-size: 14px;
  }
}
</style>
