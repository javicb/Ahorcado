import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Keyboard from './Keyboard.vue'

describe('Keyboard', () => {
  const mockLetters = [
    { letter: 'a', guessed: false, correct: false, wrong: false },
    { letter: 'b', guessed: true, correct: true, wrong: false },
    { letter: 'c', guessed: true, correct: false, wrong: true },
    { letter: 'd', guessed: false, correct: false, wrong: false }
  ]

  it('debe renderizar todas las letras proporcionadas', () => {
    const wrapper = mount(Keyboard, {
      props: {
        letters: mockLetters,
        disabled: false
      }
    })

    const keys = wrapper.findAll('.key')
    expect(keys.length).toBe(mockLetters.length)
  })

  it('debe emitir evento selectLetter cuando se hace clic en una letra', async () => {
    const wrapper = mount(Keyboard, {
      props: {
        letters: mockLetters,
        disabled: false
      }
    })

    const firstKey = wrapper.findAll('.key')[0]!
    expect(firstKey).toBeDefined()
    await firstKey.trigger('click')

    expect(wrapper.emitted('selectLetter')).toBeTruthy()
    expect(wrapper.emitted('selectLetter')?.[0]).toEqual(['a'])
  })

  it('no debe emitir evento para letras ya adivinadas', async () => {
    const wrapper = mount(Keyboard, {
      props: {
        letters: mockLetters,
        disabled: false
      }
    })

    // La letra 'b' está marcada como guessed
    const secondKey = wrapper.findAll('.key')[1]!
    expect(secondKey).toBeDefined()
    await secondKey.trigger('click')

    // No debe emitirse evento porque está disabled
    expect(wrapper.emitted('selectLetter')).toBeFalsy()
  })

  it('debe aplicar clase "correct" a letras correctas', () => {
    const wrapper = mount(Keyboard, {
      props: {
        letters: mockLetters,
        disabled: false
      }
    })

    const correctKey = wrapper.findAll('.key')[1]!
    expect(correctKey).toBeDefined()
    expect(correctKey.classes()).toContain('correct')
  })

  it('debe aplicar clase "wrong" a letras incorrectas', () => {
    const wrapper = mount(Keyboard, {
      props: {
        letters: mockLetters,
        disabled: false
      }
    })

    const wrongKey = wrapper.findAll('.key')[2]!
    expect(wrongKey).toBeDefined()
    expect(wrongKey.classes()).toContain('wrong')
  })

  it('debe aplicar clase "guessed" a letras adivinadas', () => {
    const wrapper = mount(Keyboard, {
      props: {
        letters: mockLetters,
        disabled: false
      }
    })

    const guessedKeys = wrapper.findAll('.key.guessed')
    expect(guessedKeys.length).toBe(2) // 'b' y 'c' están adivinadas
  })

  it('debe deshabilitar todas las teclas cuando disabled=true', () => {
    const wrapper = mount(Keyboard, {
      props: {
        letters: mockLetters,
        disabled: true
      }
    })

    const keys = wrapper.findAll('.key')
    keys.forEach(key => {
      expect(key.classes()).toContain('disabled')
    })
  })

  it('debe mostrar letras en mayúsculas', () => {
    const wrapper = mount(Keyboard, {
      props: {
        letters: mockLetters,
        disabled: false
      }
    })

    const firstKey = wrapper.findAll('.key')[0]!
    expect(firstKey).toBeDefined()
    expect(firstKey.text()).toBe('A')
  })

  it('debe tener atributos aria-label para accesibilidad', () => {
    const wrapper = mount(Keyboard, {
      props: {
        letters: mockLetters,
        disabled: false
      }
    })

    const firstKey = wrapper.findAll('.key')[0]!
    expect(firstKey).toBeDefined()
    expect(firstKey.attributes('aria-label')).toContain('Letter A')
  })

  it('debe tener botones disabled cuando las letras están adivinadas', () => {
    const wrapper = mount(Keyboard, {
      props: {
        letters: mockLetters,
        disabled: false
      }
    })

    const guessedKey = wrapper.findAll('.key')[1]! // 'b' está adivinada
    expect(guessedKey).toBeDefined()
    expect(guessedKey.attributes('disabled')).toBeDefined()
  })
})
