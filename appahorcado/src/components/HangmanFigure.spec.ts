import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HangmanFigure from './HangmanFigure.vue'

describe('HangmanFigure', () => {
  it('debe renderizar el SVG correctamente', () => {
    const wrapper = mount(HangmanFigure, {
      props: { failCount: 0 }
    })

    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('no debe mostrar partes del cuerpo con 0 fallos', () => {
    const wrapper = mount(HangmanFigure, {
      props: { failCount: 0 }
    })

    // La cabeza aparece con failCount >= 1
    expect(wrapper.find('circle').exists()).toBe(false)
  })

  it('debe mostrar la cabeza con 1 fallo', () => {
    const wrapper = mount(HangmanFigure, {
      props: { failCount: 1 }
    })

    expect(wrapper.find('circle').exists()).toBe(true)
  })

  it('debe mostrar 2 partes con 2 fallos (cabeza + cuerpo)', () => {
    const wrapper = mount(HangmanFigure, {
      props: { failCount: 2 }
    })

    const lines = wrapper.findAll('line')
    const circles = wrapper.findAll('circle')

    expect(circles.length).toBe(1) // cabeza
    // Las líneas incluyen estructura + cuerpo
    expect(lines.length).toBeGreaterThan(4)
  })

  it('debe mostrar todas las partes con 6 fallos', () => {
    const wrapper = mount(HangmanFigure, {
      props: { failCount: 6 }
    })

    const circles = wrapper.findAll('circle')
    expect(circles.length).toBe(1) // cabeza

    // Debe tener todas las líneas del cuerpo visibles
    const bodyLines = wrapper.findAll('line.fade-in')
    expect(bodyLines.length).toBe(5) // cuerpo, brazo izq, brazo der, pierna izq, pierna der
  })

  it('debe tener el atributo role="img" para accesibilidad', () => {
    const wrapper = mount(HangmanFigure, {
      props: { failCount: 0 }
    })

    const svg = wrapper.find('svg')
    expect(svg.attributes('role')).toBe('img')
  })

  it('debe tener aria-label para accesibilidad', () => {
    const wrapper = mount(HangmanFigure, {
      props: { failCount: 0 }
    })

    const svg = wrapper.find('svg')
    expect(svg.attributes('aria-label')).toBe('Hangman drawing')
  })
})
