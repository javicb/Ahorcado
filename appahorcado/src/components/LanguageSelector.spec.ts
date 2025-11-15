import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LanguageSelector from './LanguageSelector.vue'

describe('LanguageSelector', () => {
  it('debe renderizar dos botones de idioma', () => {
    const wrapper = mount(LanguageSelector, {
      props: {
        currentLanguage: 'es'
      }
    })

    const buttons = wrapper.findAll('.lang-btn')
    expect(buttons.length).toBe(2)
  })

  it('debe marcar como activo el botón del idioma actual (ES)', () => {
    const wrapper = mount(LanguageSelector, {
      props: {
        currentLanguage: 'es'
      }
    })

    const esButton = wrapper.findAll('.lang-btn')[0]!
    expect(esButton).toBeDefined()
    expect(esButton.classes()).toContain('active')
  })

  it('debe marcar como activo el botón del idioma actual (EN)', () => {
    const wrapper = mount(LanguageSelector, {
      props: {
        currentLanguage: 'en'
      }
    })

    const enButton = wrapper.findAll('.lang-btn')[1]!
    expect(enButton).toBeDefined()
    expect(enButton.classes()).toContain('active')
  })

  it('debe emitir evento changeLanguage al hacer clic en ES', async () => {
    const wrapper = mount(LanguageSelector, {
      props: {
        currentLanguage: 'en'
      }
    })

    const esButton = wrapper.findAll('.lang-btn')[0]!
    expect(esButton).toBeDefined()
    await esButton.trigger('click')

    expect(wrapper.emitted('changeLanguage')).toBeTruthy()
    expect(wrapper.emitted('changeLanguage')?.[0]).toEqual(['es'])
  })

  it('debe emitir evento changeLanguage al hacer clic en EN', async () => {
    const wrapper = mount(LanguageSelector, {
      props: {
        currentLanguage: 'es'
      }
    })

    const enButton = wrapper.findAll('.lang-btn')[1]!
    expect(enButton).toBeDefined()
    await enButton.trigger('click')

    expect(wrapper.emitted('changeLanguage')).toBeTruthy()
    expect(wrapper.emitted('changeLanguage')?.[0]).toEqual(['en'])
  })

  it('debe tener atributos aria-pressed correctos', () => {
    const wrapper = mount(LanguageSelector, {
      props: {
        currentLanguage: 'es'
      }
    })

    const esButton = wrapper.findAll('.lang-btn')[0]!
    const enButton = wrapper.findAll('.lang-btn')[1]!

    expect(esButton).toBeDefined()
    expect(enButton).toBeDefined()
    expect(esButton.attributes('aria-pressed')).toBe('true')
    expect(enButton.attributes('aria-pressed')).toBe('false')
  })

  it('debe tener role="group" para accesibilidad', () => {
    const wrapper = mount(LanguageSelector, {
      props: {
        currentLanguage: 'es'
      }
    })

    expect(wrapper.find('[role="group"]').exists()).toBe(true)
  })

  it('debe tener aria-label en el grupo', () => {
    const wrapper = mount(LanguageSelector, {
      props: {
        currentLanguage: 'es'
      }
    })

    const group = wrapper.find('[role="group"]')
    expect(group.attributes('aria-label')).toBe('Language selector')
  })

  it('botones deben tener aria-label descriptivos', () => {
    const wrapper = mount(LanguageSelector, {
      props: {
        currentLanguage: 'es'
      }
    })

    const esButton = wrapper.findAll('.lang-btn')[0]!
    const enButton = wrapper.findAll('.lang-btn')[1]!

    expect(esButton).toBeDefined()
    expect(enButton).toBeDefined()
    expect(esButton.attributes('aria-label')).toContain('español')
    expect(enButton.attributes('aria-label')).toContain('English')
  })
})
