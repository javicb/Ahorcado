import { ref, computed, readonly } from 'vue'
import { wordListES } from '../data/words-es'
import { wordListEN } from '../data/words-en'
import { getRandomWord } from '../services/raeApi'

export type Language = 'es' | 'en'
export type GameStatus = 'playing' | 'won' | 'lost'

const MAX_FAILS = 6

export function useHangman() {
  // State
  const language = ref<Language>('es')
  const secretWord = ref<string>('')
  const guessedLetters = ref<Set<string>>(new Set())
  const wrongLetters = ref<Set<string>>(new Set())
  const gameStatus = ref<GameStatus>('playing')
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // Computed properties
  const failCount = computed(() => wrongLetters.value.size)

  const displayWord = computed(() => {
    return secretWord.value
      .split('')
      .map(letter => {
        const lowerLetter = letter.toLowerCase()
        return guessedLetters.value.has(lowerLetter) ? letter : '_'
      })
      .join(' ')
  })

  const isWon = computed(() => {
    return secretWord.value
      .toLowerCase()
      .split('')
      .every(letter => guessedLetters.value.has(letter))
  })

  const isLost = computed(() => failCount.value >= MAX_FAILS)

  const availableLetters = computed(() => {
    const alphabet = language.value === 'es'
      ? 'abcdefghijklmnñopqrstuvwxyz'.split('')
      : 'abcdefghijklmnopqrstuvwxyz'.split('')

    return alphabet.map(letter => ({
      letter,
      guessed: guessedLetters.value.has(letter) || wrongLetters.value.has(letter),
      correct: guessedLetters.value.has(letter),
      wrong: wrongLetters.value.has(letter)
    }))
  })

  // Methods
  const selectRandomWord = (lang: Language): string => {
    const wordList = lang === 'es' ? wordListES : wordListEN
    const randomIndex = Math.floor(Math.random() * wordList.length)
    return wordList[randomIndex] || 'PALABRA'
  }

  const initGame = async () => {
    isLoading.value = true
    error.value = null
    guessedLetters.value = new Set()
    wrongLetters.value = new Set()
    gameStatus.value = 'playing'

    try {
      // Intentar obtener palabra desde la API de RAE
      const wordFromApi = await getRandomWord()
      secretWord.value = wordFromApi
    } catch (err) {
      // Si falla la API, usar palabras de respaldo
      console.warn('Error al obtener palabra de RAE API, usando palabras de respaldo:', err)
      error.value = 'No se pudo conectar con RAE API, usando palabras locales'
      secretWord.value = selectRandomWord(language.value)
    } finally {
      isLoading.value = false
    }
  }

  const guessLetter = (letter: string) => {
    if (gameStatus.value !== 'playing') return

    const normalizedLetter = letter.toLowerCase()

    // Validar que sea una letra
    if (!/^[a-zñ]$/i.test(normalizedLetter)) return

    // Evitar letras repetidas
    if (guessedLetters.value.has(normalizedLetter) || wrongLetters.value.has(normalizedLetter)) {
      return
    }

    // Verificar si la letra está en la palabra
    if (secretWord.value.toLowerCase().includes(normalizedLetter)) {
      guessedLetters.value.add(normalizedLetter)
    } else {
      wrongLetters.value.add(normalizedLetter)
    }

    // Actualizar estado del juego
    if (isWon.value) {
      gameStatus.value = 'won'
    } else if (isLost.value) {
      gameStatus.value = 'lost'
    }
  }

  const changeLanguage = async (newLang: Language) => {
    language.value = newLang
    await initGame()
  }

  const restartGame = async () => {
    await initGame()
  }

  // Mensajes según idioma
  const messages = computed(() => {
    if (language.value === 'es') {
      return {
        won: '¡Felicidades! Has ganado 🎉',
        lost: `Has perdido 😢 La palabra era: ${secretWord.value}`,
        restart: 'Jugar de nuevo',
        title: 'Juego del Ahorcado',
        fails: 'Errores',
        selectLetter: 'Selecciona una letra'
      }
    } else {
      return {
        won: 'Congratulations! You won 🎉',
        lost: `You lost 😢 The word was: ${secretWord.value}`,
        restart: 'Play again',
        title: 'Hangman Game',
        fails: 'Fails',
        selectLetter: 'Select a letter'
      }
    }
  })

  // Inicializar el juego
  initGame()

  return {
    // State (readonly para encapsulación)
    language: readonly(language),
    secretWord: computed(() => gameStatus.value !== 'playing' ? secretWord.value : ''),
    displayWord,
    failCount,
    maxFails: MAX_FAILS,
    gameStatus: readonly(gameStatus),
    availableLetters,
    messages,
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Methods
    guessLetter,
    changeLanguage,
    restartGame
  }
}

