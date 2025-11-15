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
  grid-template-columns: repeat(auto-fit, minmax(45px, 1fr));
  gap: 8px;
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
}

.key {
  width: 100%;
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

@media (max-width: 600px) {
  .keyboard {
    grid-template-columns: repeat(auto-fit, minmax(35px, 1fr));
    gap: 6px;
    padding: 15px;
  }

  .key {
    height: 40px;
    font-size: 16px;
  }
}
</style>
