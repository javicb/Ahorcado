# Hangman Game Instructions

These instructions are designed to guide GitHub Copilot when generating code and features related to a **Hangman** game inside a **Vue 3** application.

---

## 🎮 Game Objective
Guess a hidden word before the hangman drawing is completed. The player has a limited number of incorrect guesses.

---

## 🧩 Game Mechanics
1. The game selects a random secret word.
2. The player sees the hidden word displayed as underscores (`_`), one for each letter.
3. The player chooses letters:
   - If the letter exists in the word, all matching positions are revealed.
   - If not, the fail counter increases.
4. The game ends when:
   - The player fully guesses the word (**victory**).
   - The fail counter reaches the allowed limit (**defeat**).

---

## ✏️ Specific Rules for Game Logic
- Keep an array of correct letters and another for incorrect guesses.
- Word validation must ignore case sensitivity.
- Non-alphabetic characters must not be accepted.
- Prevent repeated attempts of the same letter.
- The maximum number of fails must be configurable (default: 6).

---

## 🖼️ Suggested Interface
- Display:
  - The hidden word with revealed letters.
  - The number of fails or a progressive hangman drawing.
  - A virtual keyboard or buttons to select letters.
  - Messages for victory or defeat.
- Include a button to restart the game.
- On the top bar, display a button to change the language
   - ES: Change the languagye to Spanish and the words to guess as well
   - EN: Change the language to English and the words to guess as well

---

## 🏗️ Recommendations for Vue 3 Implementation
- Use **Composition API** (`<script setup>`).
- Manage state using `reactive` or `ref`.
- Break down into components:
  - `HangmanFigure.vue`
  - `WordDisplay.vue`
  - `Keyboard.vue`
- Keep game logic inside a composable (`useHangman.js`).

---

## 🚫 Things Copilot Should NOT Do
- Do not generate offensive or inappropriate words.
- Do not modify the DOM directly (use Vue properly).
- Avoid mixing game logic inside UI components when it can be separated.
