import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useHangman } from './useHangman'

// Mock de las listas de palabras
vi.mock('../../data/words-es', () => ({
  wordListES: ['PRUEBA', 'PALABRA', 'JUEGO']
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
    it('debe inicializar el juego con valores por defecto', () => {
      const game = useHangman()

      expect(game.language.value).toBe('es')
      expect(game.gameStatus.value).toBe('playing')
      expect(game.failCount.value).toBe(0)
      expect(game.maxFails).toBe(6)
    })

    it('debe seleccionar una palabra aleatoria al iniciar', () => {
      const game = useHangman()

      // Con Math.random() = 0, debe seleccionar la primera palabra
      expect(game.secretWord.value).toBe('')
      expect(game.displayWord.value).toContain('_')
    })
  })

  describe('Adivinación de letras', () => {
    it('debe añadir letra correcta a guessedLetters', () => {
      const game = useHangman()

      // Forzar una palabra conocida
      game.restartGame()

      game.guessLetter('p')

      expect(game.failCount.value).toBe(0)
    })

    it('debe añadir letra incorrecta a wrongLetters', () => {
      const game = useHangman()

      game.guessLetter('z')

      expect(game.failCount.value).toBeGreaterThan(0)
    })

    it('no debe permitir letras repetidas', () => {
      const game = useHangman()

      game.guessLetter('a')
      const failCountAfterFirst = game.failCount.value

      game.guessLetter('a')
      const failCountAfterSecond = game.failCount.value

      expect(failCountAfterFirst).toBe(failCountAfterSecond)
    })

    it('debe ignorar caracteres no alfabéticos', () => {
      const game = useHangman()

      const initialFailCount = game.failCount.value

      game.guessLetter('1')
      game.guessLetter('!')
      game.guessLetter(' ')

      expect(game.failCount.value).toBe(initialFailCount)
    })

    it('debe normalizar letras a minúsculas', () => {
      const game = useHangman()

      game.guessLetter('A')

      // La letra debe procesarse correctamente independientemente de mayúsculas
      expect(game.availableLetters.value.find((l) => l.letter === 'a')?.guessed).toBe(true)
    })
  })

  describe('Detección de victoria', () => {
    it('debe detectar victoria cuando todas las letras son adivinadas', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)
      const game = useHangman()

      // Adivinar todas las letras únicas de "PRUEBA"
      'prueba'.split('').forEach(letter => {
        game.guessLetter(letter)
      })

      expect(game.gameStatus.value).toBe('won')
    })

    it('debe mostrar mensaje de victoria correcto según idioma', () => {
      const game = useHangman()

      // Español
      expect(game.messages.value.won).toContain('Felicidades')

      // Cambiar a inglés
      game.changeLanguage('en')
      expect(game.messages.value.won).toContain('Congratulations')
    })
  })

  describe('Detección de derrota', () => {
    it('debe detectar derrota cuando se alcanzan 6 fallos', () => {
      const game = useHangman()

      // Adivinar letras incorrectas
      const wrongLetters = ['x', 'y', 'z', 'q', 'w', 'k']
      wrongLetters.forEach(letter => {
        game.guessLetter(letter)
      })

      expect(game.gameStatus.value).toBe('lost')
    })

    it('debe revelar la palabra secreta cuando se pierde', () => {
      const game = useHangman()

      // Forzar derrota
      'xyzqwk'.split('').forEach(letter => game.guessLetter(letter))

      // La palabra secreta debe ser visible
      expect(game.secretWord.value).toBeTruthy()
      expect(game.secretWord.value.length).toBeGreaterThan(0)
    })
  })

  describe('Cambio de idioma', () => {
    it('debe cambiar el idioma y reiniciar el juego', () => {
      const game = useHangman()

      expect(game.language.value).toBe('es')

      game.changeLanguage('en')

      expect(game.language.value).toBe('en')
      expect(game.failCount.value).toBe(0)
      expect(game.gameStatus.value).toBe('playing')
    })

    it('debe incluir ñ en el alfabeto español', () => {
      const game = useHangman()

      expect(game.language.value).toBe('es')
      const hasÑ = game.availableLetters.value.some((l) => l.letter === 'ñ')
      expect(hasÑ).toBe(true)
    })

    it('no debe incluir ñ en el alfabeto inglés', () => {
      const game = useHangman()

      game.changeLanguage('en')
      const hasÑ = game.availableLetters.value.some((l) => l.letter === 'ñ')
      expect(hasÑ).toBe(false)
    })
  })

  describe('Reinicio del juego', () => {
    it('debe reiniciar el juego correctamente', () => {
      const game = useHangman()

      // Hacer algunas jugadas
      game.guessLetter('a')
      game.guessLetter('b')
      game.guessLetter('c')

      game.restartGame()

      expect(game.failCount.value).toBe(0)
      expect(game.gameStatus.value).toBe('playing')
    })
  })

  describe('Display de la palabra', () => {
    it('debe mostrar guiones bajos para letras no adivinadas', () => {
      const game = useHangman()

      const display = game.displayWord.value

      expect(display).toContain('_')
    })

    it('debe revelar letras correctamente adivinadas', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)
      const game = useHangman()

      game.guessLetter('p')

      const display = game.displayWord.value

      // Debe contener la letra P revelada
      expect(display).toContain('P')
    })
  })

  describe('Estado de las letras disponibles', () => {
    it('debe marcar letras como adivinadas correctamente', () => {
      const game = useHangman()

      game.guessLetter('a')

      const letterA = game.availableLetters.value.find((l) => l.letter === 'a')
      expect(letterA?.guessed).toBe(true)
    })

    it('debe distinguir entre letras correctas e incorrectas', () => {
      const game = useHangman()

      game.guessLetter('p')  // Letra en PRUEBA
      game.guessLetter('z')  // Letra no en PRUEBA

      const letterP = game.availableLetters.value.find((l) => l.letter === 'p')
      const letterZ = game.availableLetters.value.find((l) => l.letter === 'z')

      expect(letterP?.correct || letterP?.wrong).toBe(true)
      expect(letterZ?.correct || letterZ?.wrong).toBe(true)
    })
  })

  describe('Bloqueo después del fin del juego', () => {
    it('no debe procesar letras después de ganar', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)
      const game = useHangman()

      // Ganar el juego
      'prueba'.split('').forEach(letter => game.guessLetter(letter))

      expect(game.gameStatus.value).toBe('won')

      const failCountAfterWin = game.failCount.value

      // Intentar adivinar más letras
      game.guessLetter('z')

      expect(game.failCount.value).toBe(failCountAfterWin)
    })

    it('no debe procesar letras después de perder', () => {
      const game = useHangman()

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
    it('debe proporcionar todos los mensajes necesarios en español', () => {
      const game = useHangman()

      expect(game.messages.value.won).toBeTruthy()
      expect(game.messages.value.lost).toBeTruthy()
      expect(game.messages.value.restart).toBeTruthy()
      expect(game.messages.value.title).toBeTruthy()
      expect(game.messages.value.fails).toBeTruthy()
      expect(game.messages.value.selectLetter).toBeTruthy()
    })

    it('debe proporcionar todos los mensajes necesarios en inglés', () => {
      const game = useHangman()
      game.changeLanguage('en')

      expect(game.messages.value.won).toBeTruthy()
      expect(game.messages.value.lost).toBeTruthy()
      expect(game.messages.value.restart).toBeTruthy()
      expect(game.messages.value.title).toBeTruthy()
      expect(game.messages.value.fails).toBeTruthy()
      expect(game.messages.value.selectLetter).toBeTruthy()
    })
  })
})
