import { ref, computed, readonly } from 'vue'
import { wordListES } from '../data/words-es'
import { wordListEN } from '../data/words-en'
import { getRandomWord } from '../services/raeApi'
import { audioService } from '../services/audioService'

export type Language = 'es' | 'en'
export type GameStatus = 'playing' | 'won' | 'lost'
export type Difficulty = 'easy' | 'medium' | 'hard'

const MAX_FAILS = 6
const DIFFICULTY_STORAGE_KEY = 'hangman-difficulty'

export function useHangman() {
  // Load difficulty from localStorage or default to 'medium'
  const loadDifficulty = (): Difficulty => {
    try {
      const stored = localStorage.getItem(DIFFICULTY_STORAGE_KEY)
      if (stored === 'easy' || stored === 'medium' || stored === 'hard') {
        return stored
      }
    } catch (e) {
      console.warn('Failed to load difficulty from localStorage', e)
    }
    return 'medium'
  }

  // State
  const language = ref<Language>('es')
  const secretWord = ref<string>('')
  const guessedLetters = ref<Set<string>>(new Set())
  const wrongLetters = ref<Set<string>>(new Set())
  const gameStatus = ref<GameStatus>('playing')
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const difficulty = ref<Difficulty>(loadDifficulty())

  // Computed properties
  const failCount = computed(() => wrongLetters.value.size)

  const displayWord = computed(() => {
    return secretWord.value
      .split('')
      .map((letter) => {
        const lowerLetter = letter.toLowerCase()
        return guessedLetters.value.has(lowerLetter) ? letter : '_'
      })
      .join(' ')
  })

  const isWon = computed(() => {
    return secretWord.value
      .toLowerCase()
      .split('')
      .every((letter) => guessedLetters.value.has(letter))
  })

  const isLost = computed(() => failCount.value >= MAX_FAILS)

  const availableLetters = computed(() => {
    const alphabet =
      language.value === 'es'
        ? 'abcdefghijklmnñopqrstuvwxyz'.split('')
        : 'abcdefghijklmnopqrstuvwxyz'.split('')

    return alphabet.map((letter) => ({
      letter,
      guessed: guessedLetters.value.has(letter) || wrongLetters.value.has(letter),
      correct: guessedLetters.value.has(letter),
      wrong: wrongLetters.value.has(letter),
    }))
  })

  // Methods
  const selectRandomWord = (lang: Language): string => {
    const wordList = lang === 'es' ? wordListES : wordListEN
    const randomIndex = Math.floor(Math.random() * wordList.length)
    return wordList[randomIndex] || 'PALABRA'
  }

  /**
   * Revela letras iniciales según el nivel de dificultad
   * - Fácil: revela vocales (a, e, i, o, u, á, é, í, ó, ú, ü)
   * - Medio: revela 2-3 letras aleatorias
   * - Difícil: no revela ninguna letra
   */
  const revealInitialLetters = () => {
    const word = secretWord.value.toLowerCase()
    const uniqueLetters = [...new Set(word.split(''))]

    if (difficulty.value === 'hard') {
      // No revelar ninguna letra
      return
    } else if (difficulty.value === 'easy') {
      // Revelar todas las vocales presentes en la palabra
      const vowels = ['a', 'e', 'i', 'o', 'u', 'á', 'é', 'í', 'ó', 'ú', 'ü']
      uniqueLetters.forEach((letter) => {
        if (vowels.includes(letter)) {
          guessedLetters.value.add(letter)
        }
      })
    } else if (difficulty.value === 'medium') {
      // Revelar 2-3 letras aleatorias (excluyendo espacios y caracteres especiales)
      const validLetters = uniqueLetters.filter((letter) => /^[a-zñáéíóúü]$/i.test(letter))
      const numToReveal = Math.min(2, Math.floor(validLetters.length / 3))

      if (numToReveal > 0) {
        const shuffled = [...validLetters].sort(() => Math.random() - 0.5)
        shuffled.slice(0, numToReveal).forEach((letter) => {
          guessedLetters.value.add(letter)
        })
      }
    }
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
      console.warn('API RAE no disponible, usando palabras de respaldo:', err)
      error.value = 'Usando palabras del diccionario local'
      secretWord.value = selectRandomWord(language.value)

      // Limpiar el mensaje de error después de 2 segundos
      setTimeout(() => {
        error.value = null
      }, 2000)
    } finally {
      isLoading.value = false

      // Revelar letras iniciales según la dificultad
      revealInitialLetters()
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
      audioService.play('correct')
    } else {
      wrongLetters.value.add(normalizedLetter)
      audioService.play('wrong')
    }

    // Actualizar estado del juego
    if (isWon.value) {
      gameStatus.value = 'won'
      // Pequeño delay para que se escuche el sonido de letra correcta primero
      setTimeout(() => {
        audioService.play('win')
      }, 300)
    } else if (isLost.value) {
      gameStatus.value = 'lost'
      setTimeout(() => {
        audioService.play('lose')
      }, 300)
    }
  }

  const changeLanguage = async (newLang: Language) => {
    language.value = newLang
    await initGame()
  }

  const restartGame = async () => {
    await initGame()
  }

  const changeDifficulty = async (newDifficulty: Difficulty) => {
    difficulty.value = newDifficulty

    // Guardar en localStorage
    try {
      localStorage.setItem(DIFFICULTY_STORAGE_KEY, newDifficulty)
    } catch (e) {
      console.warn('Failed to save difficulty to localStorage', e)
    }

    // Reiniciar el juego con la nueva dificultad
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
        selectLetter: 'Selecciona una letra',
        difficulty: {
          easy: 'Fácil',
          medium: 'Medio',
          hard: 'Difícil',
        },
      }
    } else {
      return {
        won: 'Congratulations! You won 🎉',
        lost: `You lost 😢 The word was: ${secretWord.value}`,
        restart: 'Play again',
        title: 'Hangman Game',
        fails: 'Fails',
        selectLetter: 'Select a letter',
        difficulty: {
          easy: 'Easy',
          medium: 'Medium',
          hard: 'Hard',
        },
      }
    }
  })

  // Inicializar el juego
  initGame()

  return {
    // State (readonly para encapsulación)
    language: readonly(language),
    difficulty: readonly(difficulty),
    secretWord: computed(() => (gameStatus.value !== 'playing' ? secretWord.value : '')),
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
    restartGame,
    changeDifficulty,
  }
}
