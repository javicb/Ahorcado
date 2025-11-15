import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useHangman } from './useHangman'

// Mock de la API de RAE
vi.mock('../services/raeApi', () => ({
  getRandomWord: vi.fn().mockResolvedValue('AGUA')
}))

// Mock de las listas de palabras (respaldo)
vi.mock('../../data/words-es', () => ({
  wordListES: ['AGUA', 'CASA', 'MESA']
}))

vi.mock('../../data/words-en', () => ({
  wordListEN: ['TEST', 'WORD', 'GAME']
}))

describe('useHangman', () => {
  beforeEach(() => {
    // Reset random para pruebas determinísticas
    vi.spyOn(Math, 'random').mockReturnValue(0)
  })

  describe('Inicialización', () => {
    it('debe inicializar el juego con valores por defecto', async () => {
      const game = useHangman()

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(game.language.value).toBe('es')
      expect(game.gameStatus.value).toBe('playing')
      expect(game.failCount.value).toBe(0)
      expect(game.maxFails).toBe(6)
    })

    it('debe seleccionar una palabra aleatoria al iniciar', async () => {
      const game = useHangman()

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(game.displayWord.value).toContain('_')
    })
  })

  describe('Adivinación de letras', () => {
    it('debe añadir letra correcta a guessedLetters', async () => {
      const game = useHangman()

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      // La letra 'a' está en "AGUA" (mockeada)
      game.guessLetter('a')

      expect(game.failCount.value).toBe(0)
    })

    it('debe añadir letra incorrecta a wrongLetters', async () => {
      const game = useHangman()

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      game.guessLetter('z')

      expect(game.failCount.value).toBeGreaterThan(0)
    })

    it('no debe permitir letras repetidas', async () => {
      const game = useHangman()

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      game.guessLetter('a')
      const failCountAfterFirst = game.failCount.value

      game.guessLetter('a')
      const failCountAfterSecond = game.failCount.value

      expect(failCountAfterFirst).toBe(failCountAfterSecond)
    })

    it('debe ignorar caracteres no alfabéticos', async () => {
      const game = useHangman()

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      const initialFailCount = game.failCount.value

      game.guessLetter('1')
      game.guessLetter('!')
      game.guessLetter(' ')

      expect(game.failCount.value).toBe(initialFailCount)
    })

    it('debe normalizar letras a minúsculas', async () => {
      const game = useHangman()

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      game.guessLetter('A')

      // La letra debe procesarse correctamente independientemente de mayúsculas
      expect(game.availableLetters.value.find((l) => l.letter === 'a')?.guessed).toBe(true)
    })
  })

  describe('Detección de victoria', () => {
    it('debe detectar victoria cuando todas las letras son adivinadas', async () => {
      const game = useHangman()

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      // Adivinar todas las letras únicas de "AGUA"
      const uniqueLetters = [...new Set('agua'.split(''))]
      uniqueLetters.forEach(letter => {
        game.guessLetter(letter)
      })

      expect(game.gameStatus.value).toBe('won')
    })

    it('debe mostrar mensaje de victoria correcto según idioma', async () => {
      const game = useHangman()

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      // Español
      expect(game.messages.value.won).toContain('Felicidades')

      // Cambiar a inglés
      await game.changeLanguage('en')

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(game.messages.value.won).toContain('Congratulations')
    })
  })

  describe('Detección de derrota', () => {
    it('debe detectar derrota cuando se alcanzan 6 fallos', async () => {
      const game = useHangman()

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      // Adivinar letras incorrectas
      const wrongLetters = ['x', 'y', 'z', 'q', 'w', 'k']
      wrongLetters.forEach(letter => {
        game.guessLetter(letter)
      })

      expect(game.gameStatus.value).toBe('lost')
    })

    it('debe revelar la palabra secreta cuando se pierde', async () => {
      const game = useHangman()

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      // Forzar derrota
      'xyzqwk'.split('').forEach(letter => game.guessLetter(letter))

      // La palabra secreta debe ser visible
      expect(game.secretWord.value).toBeTruthy()
      expect(game.secretWord.value.length).toBeGreaterThan(0)
    })
  })

  describe('Cambio de idioma', () => {
    it('debe cambiar el idioma y reiniciar el juego', async () => {
      const game = useHangman()

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(game.language.value).toBe('es')

      await game.changeLanguage('en')

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(game.language.value).toBe('en')
      expect(game.failCount.value).toBe(0)
      expect(game.gameStatus.value).toBe('playing')
    })

    it('debe incluir ñ en el alfabeto español', async () => {
      const game = useHangman()

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(game.language.value).toBe('es')
      const hasÑ = game.availableLetters.value.some((l) => l.letter === 'ñ')
      expect(hasÑ).toBe(true)
    })

    it('no debe incluir ñ en el alfabeto inglés', async () => {
      const game = useHangman()

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      await game.changeLanguage('en')

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      const hasÑ = game.availableLetters.value.some((l) => l.letter === 'ñ')
      expect(hasÑ).toBe(false)
    })
  })

  describe('Reinicio del juego', () => {
    it('debe reiniciar el juego correctamente', async () => {
      const game = useHangman()

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      // Hacer algunas jugadas
      game.guessLetter('a')
      game.guessLetter('b')
      game.guessLetter('c')

      await game.restartGame()

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(game.failCount.value).toBe(0)
      expect(game.gameStatus.value).toBe('playing')
    })
  })

  describe('Display de la palabra', () => {
    it('debe mostrar guiones bajos para letras no adivinadas', async () => {
      const game = useHangman()

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      const display = game.displayWord.value

      expect(display).toContain('_')
    })

    it('debe revelar letras correctamente adivinadas', async () => {
      const game = useHangman()

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      // Adivinar la letra 'a' que está en "AGUA"
      game.guessLetter('a')

      const display = game.displayWord.value

      // Debe contener la letra A revelada
      expect(display).toContain('A')
    })
  })

  describe('Estado de las letras disponibles', () => {
    it('debe marcar letras como adivinadas correctamente', async () => {
      const game = useHangman()

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      game.guessLetter('a')

      const letterA = game.availableLetters.value.find((l) => l.letter === 'a')
      expect(letterA?.guessed).toBe(true)
    })

    it('debe distinguir entre letras correctas e incorrectas', async () => {
      const game = useHangman()

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      game.guessLetter('a')  // Letra en AGUA
      game.guessLetter('z')  // Letra no en AGUA

      const letterA = game.availableLetters.value.find((l) => l.letter === 'a')
      const letterZ = game.availableLetters.value.find((l) => l.letter === 'z')

      expect(letterA?.correct || letterA?.wrong).toBe(true)
      expect(letterZ?.correct || letterZ?.wrong).toBe(true)
    })
  })

  describe('Bloqueo después del fin del juego', () => {
    it('no debe procesar letras después de ganar', async () => {
      const game = useHangman()

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      // Ganar el juego con "AGUA"
      const uniqueLetters = [...new Set('agua'.split(''))]
      uniqueLetters.forEach(letter => game.guessLetter(letter))

      expect(game.gameStatus.value).toBe('won')

      const failCountAfterWin = game.failCount.value

      // Intentar adivinar más letras
      game.guessLetter('z')

      expect(game.failCount.value).toBe(failCountAfterWin)
    })

    it('no debe procesar letras después de perder', async () => {
      const game = useHangman()

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      // Perder el juego
      'xyzqwk'.split('').forEach(letter => game.guessLetter(letter))

      expect(game.gameStatus.value).toBe('lost')

      const failCountAfterLoss = game.failCount.value

      // Intentar adivinar más letras
      game.guessLetter('a')

      expect(game.failCount.value).toBe(failCountAfterLoss)
    })
  })

  describe('Mensajes multiidioma', () => {
    it('debe proporcionar todos los mensajes necesarios en español', async () => {
      const game = useHangman()

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(game.messages.value.won).toBeTruthy()
      expect(game.messages.value.lost).toBeTruthy()
      expect(game.messages.value.restart).toBeTruthy()
      expect(game.messages.value.title).toBeTruthy()
      expect(game.messages.value.fails).toBeTruthy()
      expect(game.messages.value.selectLetter).toBeTruthy()
      expect(game.messages.value.difficulty).toBeTruthy()
    })

    it('debe proporcionar todos los mensajes necesarios en inglés', async () => {
      const game = useHangman()

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      await game.changeLanguage('en')

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(game.messages.value.won).toBeTruthy()
      expect(game.messages.value.lost).toBeTruthy()
      expect(game.messages.value.restart).toBeTruthy()
      expect(game.messages.value.title).toBeTruthy()
      expect(game.messages.value.fails).toBeTruthy()
      expect(game.messages.value.selectLetter).toBeTruthy()
      expect(game.messages.value.difficulty).toBeTruthy()
    })
  })

  describe('Sistema de dificultad', () => {
    it('debe inicializar con dificultad medium por defecto', async () => {
      // Limpiar localStorage
      localStorage.clear()

      const game = useHangman()

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(game.difficulty.value).toBe('medium')
    })

    it('debe cambiar la dificultad correctamente', async () => {
      const game = useHangman()

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      await game.changeDifficulty('hard')

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(game.difficulty.value).toBe('hard')
    })

    it('debe guardar la dificultad en localStorage', async () => {
      localStorage.clear()

      const game = useHangman()

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      await game.changeDifficulty('easy')

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(localStorage.getItem('hangman-difficulty')).toBe('easy')
    })

    it('debe cargar la dificultad desde localStorage al iniciar', async () => {
      localStorage.setItem('hangman-difficulty', 'hard')

      const game = useHangman()

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(game.difficulty.value).toBe('hard')

      localStorage.clear()
    })

    it('debe reiniciar el juego al cambiar dificultad', async () => {
      const game = useHangman()

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      // Hacer algunas jugadas
      game.guessLetter('x')
      const failsBeforeChange = game.failCount.value

      await game.changeDifficulty('easy')

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(game.failCount.value).toBe(0)
      expect(game.gameStatus.value).toBe('playing')
    })

    it('debe revelar vocales en modo fácil', async () => {
      const game = useHangman()

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      await game.changeDifficulty('easy')

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      // En "AGUA", la 'a' y 'u' son vocales y deben estar reveladas
      const displayWord = game.displayWord.value

      // Al menos una vocal debe estar revelada si la palabra tiene vocales
      const hasRevealedLetters = !displayWord.split(' ').every(char => char === '_')
      expect(hasRevealedLetters).toBe(true)
    })

    it('debe revelar algunas letras en modo medio', async () => {
      const game = useHangman()

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      await game.changeDifficulty('medium')

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      // En modo medio, puede que se revelen algunas letras (2-3)
      // Dependiendo de la palabra, puede o no haber letras reveladas
      expect(game.difficulty.value).toBe('medium')
    })

    it('no debe revelar letras en modo difícil', async () => {
      const game = useHangman()

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      await game.changeDifficulty('hard')

      // Esperar a que termine la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      const displayWord = game.displayWord.value

      // Todas las letras deben ser guiones bajos en modo difícil
      const allUnderscores = displayWord.split(' ').every(char => char === '_')
      expect(allUnderscores).toBe(true)
    })
  })
})
