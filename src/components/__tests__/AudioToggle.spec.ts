import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AudioToggle from '../AudioToggle.vue'
import { audioService } from '../../services/audioService'

// Mock del servicio de audio
vi.mock('../../services/audioService', () => ({
  audioService: {
    isEnabled: vi.fn(() => true),
    toggle: vi.fn(() => false),
    playClick: vi.fn(),
  },
}))

describe('AudioToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza el botón de audio', () => {
    const wrapper = mount(AudioToggle)

    expect(wrapper.find('.audio-toggle').exists()).toBe(true)
  })

  it('muestra el icono de sonido activado cuando está habilitado', () => {
    vi.mocked(audioService.isEnabled).mockReturnValue(true)

    const wrapper = mount(AudioToggle)

    expect(wrapper.find('.audio-icon').text()).toBe('🔊')
    expect(wrapper.find('.audio-toggle').classes()).toContain('active')
  })

  it('muestra el icono de sonido desactivado cuando está deshabilitado', async () => {
    vi.mocked(audioService.isEnabled).mockReturnValue(false)

    const wrapper = mount(AudioToggle)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.audio-icon').text()).toBe('🔇')
    expect(wrapper.find('.audio-toggle').classes()).not.toContain('active')
  })

  it('alterna el estado de audio al hacer click', async () => {
    vi.mocked(audioService.toggle).mockReturnValue(false)

    const wrapper = mount(AudioToggle)
    await wrapper.find('.audio-toggle').trigger('click')

    expect(audioService.toggle).toHaveBeenCalled()
  })

  it('reproduce sonido de click al activar el audio', async () => {
    vi.mocked(audioService.toggle).mockReturnValue(true)

    const wrapper = mount(AudioToggle)
    await wrapper.find('.audio-toggle').trigger('click')

    expect(audioService.playClick).toHaveBeenCalled()
  })

  it('no reproduce sonido de click al desactivar el audio', async () => {
    vi.mocked(audioService.toggle).mockReturnValue(false)

    const wrapper = mount(AudioToggle)
    await wrapper.find('.audio-toggle').trigger('click')

    expect(audioService.playClick).not.toHaveBeenCalled()
  })

  it('tiene atributos ARIA correctos', () => {
    const wrapper = mount(AudioToggle)
    const button = wrapper.find('.audio-toggle')

    expect(button.attributes('type')).toBe('button')
    expect(button.attributes('aria-label')).toBeDefined()
    expect(button.attributes('aria-pressed')).toBeDefined()
  })

  it('actualiza el aria-label según el estado', async () => {
    vi.mocked(audioService.isEnabled).mockReturnValue(true)

    const wrapper = mount(AudioToggle)
    const button = wrapper.find('.audio-toggle')

    expect(button.attributes('aria-label')).toContain('Desactivar')

    // Cambiar a desactivado
    vi.mocked(audioService.isEnabled).mockReturnValue(false)
    vi.mocked(audioService.toggle).mockReturnValue(false)

    await button.trigger('click')
    await wrapper.vm.$nextTick()

    expect(button.attributes('aria-label')).toContain('Activar')
  })

  it('tiene la clase active cuando el audio está activado', () => {
    vi.mocked(audioService.isEnabled).mockReturnValue(true)

    const wrapper = mount(AudioToggle)

    expect(wrapper.find('.audio-toggle').classes()).toContain('active')
  })
})
