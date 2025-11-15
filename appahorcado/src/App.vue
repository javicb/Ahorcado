<script setup lang="ts">
import { useHangman } from './composables/useHangman'
import HangmanFigure from './components/HangmanFigure.vue'
import WordDisplay from './components/WordDisplay.vue'
import Keyboard from './components/Keyboard.vue'
import LanguageSelector from './components/LanguageSelector.vue'
import DifficultySelector from './components/DifficultySelector.vue'

const {
  language,
  difficulty,
  displayWord,
  failCount,
  maxFails,
  gameStatus,
  availableLetters,
  messages,
  guessLetter,
  changeLanguage,
  restartGame,
  changeDifficulty,
  secretWord,
  isLoading,
  error
} = useHangman()
</script>

<template>
  <div class="app-container">
    <!-- Header -->
    <header class="header">
      <h1 class="title">{{ messages.title }}</h1>
      <LanguageSelector
        :current-language="language"
        @change-language="changeLanguage"
      />
    </header>

    <!-- Main game area -->
    <main class="game-area">
      <!-- Loading indicator -->
      <div v-if="isLoading" class="loading-container">
        <div class="spinner"></div>
        <p class="loading-text">Obteniendo palabra del diccionario...</p>
      </div>

      <!-- Error message -->
      <div v-if="error && !isLoading" class="error-banner">
        <span class="error-icon">⚠️</span>
        <p class="error-text">{{ error }}</p>
      </div>

      <!-- Difficulty selector -->
      <DifficultySelector
        v-if="!isLoading"
        :current-difficulty="difficulty"
        :current-language="language"
        @change-difficulty="changeDifficulty"
      />

      <!-- Fail counter -->
      <div v-if="!isLoading" class="fail-counter">
        <span class="fail-label">{{ messages.fails }}:</span>
        <span class="fail-count" :class="{ danger: failCount >= maxFails - 1 }">
          {{ failCount }} / {{ maxFails }}
        </span>
      </div>

      <!-- Hangman figure -->
      <HangmanFigure v-if="!isLoading" :fail-count="failCount" />

      <!-- Word display -->
      <WordDisplay
        v-if="!isLoading"
        :display-word="displayWord"
        :game-status="gameStatus"
      />

      <!-- Game status messages -->
      <div v-if="gameStatus !== 'playing' && !isLoading" class="game-message">
        <p
          class="message-text"
          :class="{
            'won-message': gameStatus === 'won',
            'lost-message': gameStatus === 'lost'
          }"
        >
          {{ gameStatus === 'won' ? messages.won : messages.lost }}
        </p>
        <p v-if="gameStatus === 'lost'" class="secret-word">
          {{ secretWord }}
        </p>
        <button
          class="restart-btn"
          @click="restartGame"
          aria-label="Restart game"
        >
          {{ messages.restart }}
        </button>
      </div>

      <!-- Instructions when playing -->
      <p v-else-if="!isLoading" class="instructions">
        {{ messages.selectLetter }}
      </p>

      <!-- Keyboard -->
      <Keyboard
        v-if="!isLoading"
        :letters="availableLetters"
        :disabled="gameStatus !== 'playing'"
        @select-letter="guessLetter"
      />
    </main>

    <!-- Footer -->
    <footer class="footer">
      <p>© 2025 Hangman Game - Built with Vue 3 + TypeScript</p>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header {
  background-color: rgba(255, 255, 255, 0.95);
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.title {
  margin: 0;
  color: #2c3e50;
  font-size: 32px;
  font-weight: 700;
}

.game-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin: 40px 0;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(52, 152, 219, 0.2);
  border-top-color: #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  margin-top: 20px;
  font-size: 18px;
  color: #34495e;
  font-weight: 500;
}

.error-banner {
  background-color: rgba(255, 235, 235, 0.95);
  border: 2px solid #e74c3c;
  border-radius: 8px;
  padding: 15px 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 2px 8px rgba(231, 76, 60, 0.2);
}

.error-icon {
  font-size: 24px;
}

.error-text {
  margin: 0;
  color: #c0392b;
  font-size: 16px;
  font-weight: 500;
}

.fail-counter {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 15px 30px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.fail-label {
  font-size: 18px;
  font-weight: 600;
  color: #34495e;
  margin-right: 10px;
}

.fail-count {
  font-size: 24px;
  font-weight: bold;
  color: #3498db;
  transition: color 0.3s ease;
}

.fail-count.danger {
  color: #e74c3c;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.game-message {
  background-color: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 12px;
  margin: 20px 0;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideDown 0.4s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-text {
  font-size: 28px;
  font-weight: bold;
  margin: 0 0 20px 0;
}

.won-message {
  color: #27ae60;
}

.lost-message {
  color: #e74c3c;
}

.secret-word {
  font-size: 32px;
  font-weight: bold;
  color: #2c3e50;
  margin: 15px 0;
  letter-spacing: 2px;
}

.restart-btn {
  padding: 12px 30px;
  font-size: 18px;
  font-weight: 600;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.restart-btn:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.restart-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.instructions {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 15px 25px;
  border-radius: 8px;
  margin: 20px 0;
  font-size: 18px;
  color: #34495e;
  font-weight: 500;
}

.footer {
  background-color: rgba(0, 0, 0, 0.2);
  color: #fff;
  text-align: center;
  padding: 15px;
  margin-top: auto;
}

.footer p {
  margin: 0;
  font-size: 14px;
}

/* Tablet (481px - 768px) */
@media (max-width: 768px) {
  .header {
    padding: 15px;
  }

  .title {
    font-size: 28px;
  }

  .game-area {
    padding: 15px;
    max-width: 100%;
  }

  .fail-counter {
    padding: 12px 25px;
  }

  .game-message {
    padding: 25px 15px;
  }

  .message-text {
    font-size: 24px;
  }

  .secret-word {
    font-size: 28px;
  }

  .restart-btn {
    padding: 10px 25px;
    font-size: 16px;
  }

  .instructions {
    padding: 12px 20px;
    font-size: 16px;
  }
}

/* Mobile (320px - 480px) */
@media (max-width: 480px) {
  .header {
    flex-direction: column;
    text-align: center;
    padding: 12px;
    gap: 10px;
  }

  .title {
    font-size: 22px;
  }

  .game-area {
    padding: 10px;
  }

  .loading-container {
    padding: 40px 15px;
    margin: 20px 10px;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border-width: 4px;
  }

  .loading-text {
    font-size: 16px;
  }

  .error-banner {
    padding: 12px 15px;
    margin-bottom: 15px;
    font-size: 14px;
  }

  .error-icon {
    font-size: 20px;
  }

  .fail-counter {
    padding: 8px 15px;
  }

  .fail-label {
    font-size: 16px;
  }

  .fail-count {
    font-size: 20px;
  }

  .game-message {
    padding: 20px 12px;
    margin: 15px 0;
  }

  .message-text {
    font-size: 20px;
    margin-bottom: 15px;
  }

  .secret-word {
    font-size: 22px;
    letter-spacing: 1px;
  }

  .restart-btn {
    padding: 10px 20px;
    font-size: 16px;
    width: 100%;
    max-width: 250px;
  }

  .instructions {
    padding: 10px 15px;
    font-size: 15px;
    margin: 15px 0;
  }

  .footer {
    padding: 12px;
  }

  .footer p {
    font-size: 12px;
  }
}

/* Extra small mobile (< 360px) */
@media (max-width: 359px) {
  .title {
    font-size: 20px;
  }

  .message-text {
    font-size: 18px;
  }

  .secret-word {
    font-size: 20px;
  }

  .instructions {
    font-size: 14px;
  }
}

/* Landscape mobile */
@media (max-width: 768px) and (orientation: landscape) {
  .game-area {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .loading-container {
    padding: 30px 20px;
  }

  .game-message {
    padding: 15px 20px;
  }
}
</style>
