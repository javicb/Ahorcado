<script setup lang="ts">
defineProps<{
  displayWord: string
  gameStatus: 'playing' | 'won' | 'lost'
}>()
</script>

<template>
  <div class="word-display">
    <div
      class="word-container"
      :class="{
        'won': gameStatus === 'won',
        'lost': gameStatus === 'lost'
      }"
    >
      <span
        v-for="(char, index) in displayWord.split(' ')"
        :key="index"
        class="letter-box"
      >
        {{ char }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.word-display {
  margin: 30px 0;
  padding: 20px;
}

.word-container {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
  transition: all 0.3s ease;
}

.letter-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 50px;
  font-size: 32px;
  font-weight: bold;
  font-family: 'Courier New', monospace;
  border-bottom: 3px solid #333;
  color: #2c3e50;
  transition: all 0.3s ease;
}

.word-container.won .letter-box {
  color: #27ae60;
  border-bottom-color: #27ae60;
  animation: bounce 0.6s ease;
}

.word-container.lost .letter-box {
  color: #e74c3c;
  border-bottom-color: #e74c3c;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Tablet */
@media (max-width: 768px) {
  .word-display {
    margin: 25px 0;
    padding: 15px;
  }

  .letter-box {
    width: 35px;
    height: 45px;
    font-size: 28px;
  }

  .word-container {
    gap: 6px;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .word-display {
    margin: 20px 0;
    padding: 10px;
  }

  .letter-box {
    width: 28px;
    height: 38px;
    font-size: 22px;
    border-bottom-width: 2px;
  }

  .word-container {
    gap: 4px;
  }
}

/* Extra small mobile */
@media (max-width: 359px) {
  .letter-box {
    width: 25px;
    height: 35px;
    font-size: 20px;
  }

  .word-container {
    gap: 3px;
  }
}

/* Landscape mobile */
@media (max-width: 768px) and (orientation: landscape) {
  .word-display {
    margin: 15px 0;
    padding: 10px;
  }

  .letter-box {
    width: 30px;
    height: 40px;
    font-size: 24px;
  }
}
</style>
