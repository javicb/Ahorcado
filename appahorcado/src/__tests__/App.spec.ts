import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'

// Mock de la API de RAE
vi.mock('../services/raeApi', () => ({
  getRandomWord: vi.fn().mockResolvedValue('AGUA')
}))

describe('App', () => {
  beforeEach(() => {
    // Limpiar mocks antes de cada test
    vi.clearAllMocks()
  })

  it('renders the game title', async () => {
    const wrapper = mount(App)

    // Esperar a que termine la inicialización
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.text()).toContain('Juego del Ahorcado')
  })

  it('renders the keyboard', async () => {
    const wrapper = mount(App)

    // Esperar a que termine la inicialización
    await new Promise(resolve => setTimeout(resolve, 150))

    expect(wrapper.text()).toContain('Selecciona una letra')
  })

  it('renders language selector', async () => {
    const wrapper = mount(App)

    // Esperar a que termine la inicialización
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.text()).toContain('ES')
    expect(wrapper.text()).toContain('EN')
  })
})
