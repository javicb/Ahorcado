import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WordDisplay from './WordDisplay.vue'

describe('WordDisplay', () => {
  it('debe renderizar el componente correctamente', () => {
    const wrapper = mount(WordDisplay, {
      props: {
        displayWord: '_ _ _ _ _',
        gameStatus: 'playing'
      }
    })

    expect(wrapper.find('.word-display').exists()).toBe(true)
  })

  it('debe mostrar guiones bajos para letras no reveladas', () => {
    const wrapper = mount(WordDisplay, {
      props: {
        displayWord: '_ _ _ _ _',
        gameStatus: 'playing'
      }
    })

    expect(wrapper.text()).toContain('_')
  })

  it('debe mostrar letras reveladas correctamente', () => {
    const wrapper = mount(WordDisplay, {
      props: {
        displayWord: 'P _ _ E B A',
        gameStatus: 'playing'
      }
    })

    expect(wrapper.text()).toContain('P')
    expect(wrapper.text()).toContain('E')
    expect(wrapper.text()).toContain('B')
    expect(wrapper.text()).toContain('A')
  })

  it('debe aplicar clase "won" cuando el juego está ganado', () => {
    const wrapper = mount(WordDisplay, {
      props: {
        displayWord: 'P R U E B A',
        gameStatus: 'won'
      }
    })

    expect(wrapper.find('.word-container.won').exists()).toBe(true)
  })

  it('debe aplicar clase "lost" cuando el juego está perdido', () => {
    const wrapper = mount(WordDisplay, {
      props: {
        displayWord: '_ _ _ _ _ _',
        gameStatus: 'lost'
      }
    })

    expect(wrapper.find('.word-container.lost').exists()).toBe(true)
  })

  it('debe renderizar cada letra en una caja separada', () => {
    const wrapper = mount(WordDisplay, {
      props: {
        displayWord: 'A B C',
        gameStatus: 'playing'
      }
    })

    const letterBoxes = wrapper.findAll('.letter-box')
    expect(letterBoxes.length).toBe(3)
  })

  it('no debe aplicar clases especiales cuando está jugando', () => {
    const wrapper = mount(WordDisplay, {
      props: {
        displayWord: 'A _ C',
        gameStatus: 'playing'
      }
    })

    expect(wrapper.find('.word-container.won').exists()).toBe(false)
    expect(wrapper.find('.word-container.lost').exists()).toBe(false)
  })
})
