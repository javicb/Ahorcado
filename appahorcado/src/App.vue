<script setup lang="ts">
import { useHangman } from './composables/useHangman'
import HangmanFigure from './components/HangmanFigure.vue'
import WordDisplay from './components/WordDisplay.vue'
import Keyboard from './components/Keyboard.vue'
import LanguageSelector from './components/LanguageSelector.vue'

const {
  language,
  displayWord,
  failCount,
  maxFails,
  gameStatus,
  availableLetters,
  messages,
  guessLetter,
  changeLanguage,
  restartGame,
  secretWord
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
      <!-- Fail counter -->
      <div class="fail-counter">
        <span class="fail-label">{{ messages.fails }}:</span>
        <span class="fail-count" :class="{ danger: failCount >= maxFails - 1 }">
          {{ failCount }} / {{ maxFails }}
        </span>
      </div>

      <!-- Hangman figure -->
      <HangmanFigure :fail-count="failCount" />

      <!-- Word display -->
      <WordDisplay
        :display-word="displayWord"
        :game-status="gameStatus"
      />

      <!-- Game status messages -->
      <div v-if="gameStatus !== 'playing'" class="game-message">
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
      <p v-else class="instructions">
        {{ messages.selectLetter }}
      </p>

      <!-- Keyboard -->
      <Keyboard
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

@media (max-width: 600px) {
  .header {
    flex-direction: column;
    text-align: center;
  }

  .title {
    font-size: 24px;
  }

  .fail-counter {
    padding: 10px 20px;
  }

  .fail-label {
    font-size: 16px;
  }

  .fail-count {
    font-size: 20px;
  }

  .message-text {
    font-size: 22px;
  }

  .secret-word {
    font-size: 24px;
  }
}
</style>
