/**
 * Servicio de audio para el juego del Ahorcado
 * Proporciona efectos de sonido para las acciones del juego
 */

export type SoundEffect = 'correct' | 'wrong' | 'win' | 'lose' | 'click'

class AudioService {
  private sounds: Map<SoundEffect, HTMLAudioElement> = new Map()
  private enabled: boolean = true
  private volume: number = 0.5

  constructor() {
    this.initializeSounds()
    this.loadSettings()
  }

  /**
   * Inicializa los efectos de sonido usando Web Audio API
   */
  private initializeSounds() {
    // No cargamos archivos de audio reales, los generaremos programáticamente
    // o usaremos data URIs para sonidos simples
  }

  /**
   * Carga configuración desde localStorage
   */
  private loadSettings() {
    try {
      const enabled = localStorage.getItem('audio-enabled')
      const volume = localStorage.getItem('audio-volume')

      if (enabled !== null) {
        this.enabled = enabled === 'true'
      }

      if (volume !== null) {
        this.volume = parseFloat(volume)
      }
    } catch (e) {
      console.warn('Failed to load audio settings', e)
    }
  }

  /**
   * Guarda configuración en localStorage
   */
  private saveSettings() {
    try {
      localStorage.setItem('audio-enabled', String(this.enabled))
      localStorage.setItem('audio-volume', String(this.volume))
    } catch (e) {
      console.warn('Failed to save audio settings', e)
    }
  }

  /**
   * Genera un tono usando Web Audio API
   */
  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.enabled) return

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const audioContext = new AudioContextClass()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = frequency
      oscillator.type = type

      gainNode.gain.setValueAtTime(this.volume * 0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration)
    } catch (e) {
      console.warn('Failed to play tone', e)
    }
  }

  /**
   * Reproduce secuencia de tonos
   */
  private playSequence(notes: Array<{ frequency: number; duration: number; delay: number }>) {
    if (!this.enabled) return

    notes.forEach((note) => {
      setTimeout(() => {
        this.playTone(note.frequency, note.duration)
      }, note.delay)
    })
  }

  /**
   * Reproduce sonido para letra correcta
   */
  playCorrect() {
    // Tono ascendente agradable
    this.playSequence([
      { frequency: 523.25, duration: 0.1, delay: 0 }, // C5
      { frequency: 659.25, duration: 0.15, delay: 100 }, // E5
    ])
  }

  /**
   * Reproduce sonido para letra incorrecta
   */
  playWrong() {
    // Tono descendente de error
    this.playSequence([
      { frequency: 392, duration: 0.1, delay: 0 }, // G4
      { frequency: 311.13, duration: 0.2, delay: 80 }, // Eb4
    ])
  }

  /**
   * Reproduce sonido de victoria
   */
  playWin() {
    // Melodía de victoria ascendente
    this.playSequence([
      { frequency: 523.25, duration: 0.15, delay: 0 }, // C5
      { frequency: 659.25, duration: 0.15, delay: 120 }, // E5
      { frequency: 783.99, duration: 0.15, delay: 240 }, // G5
      { frequency: 1046.5, duration: 0.3, delay: 360 }, // C6
    ])
  }

  /**
   * Reproduce sonido de derrota
   */
  playLose() {
    // Melodía de derrota descendente
    this.playSequence([
      { frequency: 392, duration: 0.2, delay: 0 }, // G4
      { frequency: 349.23, duration: 0.2, delay: 180 }, // F4
      { frequency: 293.66, duration: 0.2, delay: 360 }, // D4
      { frequency: 261.63, duration: 0.4, delay: 540 }, // C4
    ])
  }

  /**
   * Reproduce sonido de click
   */
  playClick() {
    // Click suave
    this.playTone(800, 0.05, 'square')
  }

  /**
   * Reproduce un efecto de sonido
   */
  play(effect: SoundEffect) {
    switch (effect) {
      case 'correct':
        this.playCorrect()
        break
      case 'wrong':
        this.playWrong()
        break
      case 'win':
        this.playWin()
        break
      case 'lose':
        this.playLose()
        break
      case 'click':
        this.playClick()
        break
    }
  }

  /**
   * Activa o desactiva el sonido
   */
  toggle(): boolean {
    this.enabled = !this.enabled
    this.saveSettings()
    return this.enabled
  }

  /**
   * Establece si el sonido está activado
   */
  setEnabled(enabled: boolean) {
    this.enabled = enabled
    this.saveSettings()
  }

  /**
   * Verifica si el sonido está activado
   */
  isEnabled(): boolean {
    return this.enabled
  }

  /**
   * Establece el volumen (0-1)
   */
  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume))
    this.saveSettings()
  }

  /**
   * Obtiene el volumen actual
   */
  getVolume(): number {
    return this.volume
  }
}

// Exportar instancia singleton
export const audioService = new AudioService()
