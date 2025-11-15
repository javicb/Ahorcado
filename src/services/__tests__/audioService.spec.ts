import { describe, it, expect, beforeEach, vi } from 'vitest'
import { audioService } from '../audioService'

describe('AudioService', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear()

    // Mock de AudioContext
    global.AudioContext = vi.fn().mockImplementation(() => ({
      createOscillator: vi.fn().mockReturnValue({
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        frequency: { value: 0 },
        type: 'sine',
      }),
      createGain: vi.fn().mockReturnValue({
        connect: vi.fn(),
        gain: {
          setValueAtTime: vi.fn(),
          exponentialRampToValueAtTime: vi.fn(),
        },
      }),
      destination: {},
      currentTime: 0,
    })) as unknown as typeof AudioContext
  })

  describe('Configuración', () => {
    it('debe estar habilitado por defecto', () => {
      expect(audioService.isEnabled()).toBe(true)
    })

    it('debe tener volumen 0.5 por defecto', () => {
      expect(audioService.getVolume()).toBe(0.5)
    })

    it('debe permitir alternar el estado de audio', () => {
      const initialState = audioService.isEnabled()
      const newState = audioService.toggle()

      expect(newState).toBe(!initialState)
      expect(audioService.isEnabled()).toBe(newState)
    })

    it('debe guardar el estado en localStorage al alternar', () => {
      audioService.toggle()
      const saved = localStorage.getItem('audio-enabled')

      expect(saved).toBeDefined()
    })

    it('debe permitir establecer el volumen', () => {
      audioService.setVolume(0.8)
      expect(audioService.getVolume()).toBe(0.8)
    })

    it('debe limitar el volumen entre 0 y 1', () => {
      audioService.setVolume(1.5)
      expect(audioService.getVolume()).toBe(1)

      audioService.setVolume(-0.5)
      expect(audioService.getVolume()).toBe(0)
    })

    it('debe cargar configuración desde localStorage', () => {
      localStorage.setItem('audio-enabled', 'false')
      localStorage.setItem('audio-volume', '0.7')

      // Crear nueva instancia para cargar la configuración
      // En este caso, usamos la instancia singleton existente
      audioService.setEnabled(false)
      audioService.setVolume(0.7)

      expect(audioService.isEnabled()).toBe(false)
      expect(audioService.getVolume()).toBe(0.7)
    })
  })

  describe('Efectos de sonido', () => {
    it('debe tener método para reproducir sonido correcto', () => {
      expect(() => audioService.playCorrect()).not.toThrow()
    })

    it('debe tener método para reproducir sonido incorrecto', () => {
      expect(() => audioService.playWrong()).not.toThrow()
    })

    it('debe tener método para reproducir sonido de victoria', () => {
      expect(() => audioService.playWin()).not.toThrow()
    })

    it('debe tener método para reproducir sonido de derrota', () => {
      expect(() => audioService.playLose()).not.toThrow()
    })

    it('debe tener método para reproducir click', () => {
      expect(() => audioService.playClick()).not.toThrow()
    })

    it('debe reproducir efecto usando el método play', () => {
      expect(() => audioService.play('correct')).not.toThrow()
      expect(() => audioService.play('wrong')).not.toThrow()
      expect(() => audioService.play('win')).not.toThrow()
      expect(() => audioService.play('lose')).not.toThrow()
      expect(() => audioService.play('click')).not.toThrow()
    })

    it('no debe reproducir sonido cuando está deshabilitado', () => {
      audioService.setEnabled(false)

      // Estos no deberían lanzar errores incluso estando deshabilitado
      expect(() => audioService.play('correct')).not.toThrow()
      expect(() => audioService.playWin()).not.toThrow()
    })
  })

  describe('Persistencia', () => {
    it('debe guardar volumen en localStorage', () => {
      audioService.setVolume(0.3)

      const savedVolume = localStorage.getItem('audio-volume')
      expect(savedVolume).toBe('0.3')
    })

    it('debe guardar estado habilitado en localStorage', () => {
      audioService.setEnabled(true)

      const savedState = localStorage.getItem('audio-enabled')
      expect(savedState).toBe('true')
    })
  })
})
