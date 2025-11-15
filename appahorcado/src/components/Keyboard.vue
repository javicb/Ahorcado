<script setup lang="ts">
interface LetterInfo {
  letter: string
  guessed: boolean
  correct: boolean
  wrong: boolean
}

defineProps<{
  letters: LetterInfo[]
  disabled: boolean
}>()

const emit = defineEmits<{
  selectLetter: [letter: string]
}>()

const handleClick = (letter: string, guessed: boolean) => {
  if (!guessed) {
    emit('selectLetter', letter)
  }
}
</script>

<template>
  <div class="keyboard">
    <button
      v-for="letterInfo in letters"
      :key="letterInfo.letter"
      class="key"
      :class="{
        'guessed': letterInfo.guessed,
        'correct': letterInfo.correct,
        'wrong': letterInfo.wrong,
        'disabled': disabled
      }"
      :disabled="letterInfo.guessed || disabled"
      @click="handleClick(letterInfo.letter, letterInfo.guessed)"
      :aria-label="`Letter ${letterInfo.letter.toUpperCase()}`"
    >
      {{ letterInfo.letter.toUpperCase() }}
    </button>
  </div>
</template>

<style scoped>
.keyboard {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 8px;
  max-width: 700px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
}

.key {
  width: 100%;
  min-width: 0;
  height: 50px;
  font-size: 18px;
  font-weight: bold;
  border: 2px solid #3498db;
  background-color: #fff;
  color: #3498db;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Arial', sans-serif;
  touch-action: manipulation;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.key:hover:not(.guessed):not(.disabled) {
  background-color: #3498db;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.key:active:not(.guessed):not(.disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.key.guessed {
  cursor: not-allowed;
  opacity: 0.5;
}

.key.correct {
  background-color: #27ae60;
  border-color: #27ae60;
  color: #fff;
}

.key.wrong {
  background-color: #e74c3c;
  border-color: #e74c3c;
  color: #fff;
}

.key.disabled {
  cursor: not-allowed;
  opacity: 0.3;
}

/* Tablet */
@media (max-width: 768px) {
  .keyboard {
    grid-template-columns: repeat(9, 1fr);
    gap: 6px;
    padding: 15px;
  }

  .key {
    height: 45px;
    font-size: 16px;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .keyboard {
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    padding: 10px;
  }

  .key {
    height: 40px;
    font-size: 14px;
    border-width: 1.5px;
  }
}

/* Extra small mobile */
@media (max-width: 359px) {
  .keyboard {
    grid-template-columns: repeat(6, 1fr);
    gap: 3px;
    padding: 8px;
  }

  .key {
    height: 36px;
    font-size: 12px;
  }
}

/* Landscape mobile */
@media (max-width: 768px) and (orientation: landscape) {
  .keyboard {
    grid-template-columns: repeat(13, 1fr);
    max-width: 95%;
    padding: 8px;
  }

  .key {
    height: 32px;
    font-size: 13px;
  }
}
</style>
