import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DifficultySelector from '../DifficultySelector.vue'
import type { Difficulty } from '../../composables/useHangman'

describe('DifficultySelector', () => {
  it('renders difficulty selector with all options', () => {
    const wrapper = mount(DifficultySelector, {
      props: {
        currentDifficulty: 'medium' as Difficulty
      }
    })

    expect(wrapper.find('.difficulty-selector').exists()).toBe(true)
    expect(wrapper.findAll('.difficulty-btn')).toHaveLength(3)
  })

  it('shows Spanish labels by default', () => {
    const wrapper = mount(DifficultySelector, {
      props: {
        currentDifficulty: 'medium' as Difficulty
      }
    })

    expect(wrapper.text()).toContain('Dificultad:')
    expect(wrapper.text()).toContain('Fácil')
    expect(wrapper.text()).toContain('Medio')
    expect(wrapper.text()).toContain('Difícil')
  })

  it('shows English labels when language is en', () => {
    const wrapper = mount(DifficultySelector, {
      props: {
        currentDifficulty: 'medium' as Difficulty,
        currentLanguage: 'en'
      }
    })

    expect(wrapper.text()).toContain('Difficulty:')
    expect(wrapper.text()).toContain('Easy')
    expect(wrapper.text()).toContain('Medium')
    expect(wrapper.text()).toContain('Hard')
  })

  it('marks current difficulty as active', () => {
    const wrapper = mount(DifficultySelector, {
      props: {
        currentDifficulty: 'hard' as Difficulty
      }
    })

    const buttons = wrapper.findAll('.difficulty-btn')
    expect(buttons[0]!.classes()).not.toContain('active') // easy
    expect(buttons[1]!.classes()).not.toContain('active') // medium
    expect(buttons[2]!.classes()).toContain('active') // hard
  })

  it('emits changeDifficulty event when clicking a button', async () => {
    const wrapper = mount(DifficultySelector, {
      props: {
        currentDifficulty: 'medium' as Difficulty
      }
    })

    const easyButton = wrapper.findAll('.difficulty-btn')[0]!
    await easyButton.trigger('click')

    expect(wrapper.emitted('changeDifficulty')).toBeTruthy()
    expect(wrapper.emitted('changeDifficulty')?.[0]).toEqual(['easy'])
  })

  it('has proper ARIA attributes for accessibility', () => {
    const wrapper = mount(DifficultySelector, {
      props: {
        currentDifficulty: 'medium' as Difficulty
      }
    })

    const group = wrapper.find('[role="group"]')
    expect(group.exists()).toBe(true)

    const buttons = wrapper.findAll('.difficulty-btn')
    buttons.forEach((button) => {
      expect(button.attributes('type')).toBe('button')
      expect(button.attributes('aria-pressed')).toBeDefined()
      expect(button.attributes('aria-label')).toBeDefined()
    })
  })

  it('applies correct color styling to active button', () => {
    const wrapper = mount(DifficultySelector, {
      props: {
        currentDifficulty: 'easy' as Difficulty
      }
    })

    const easyButton = wrapper.findAll('.difficulty-btn')[0]!
    const style = easyButton.attributes('style')
    expect(style).toContain('#27ae60') // Easy color
  })

  it('renders icons for each difficulty level', () => {
    const wrapper = mount(DifficultySelector, {
      props: {
        currentDifficulty: 'medium' as Difficulty
      }
    })

    const icons = wrapper.findAll('.difficulty-icon')
    expect(icons).toHaveLength(3)
    expect(icons[0]!.text()).toBe('😊') // easy
    expect(icons[1]!.text()).toBe('😐') // medium
    expect(icons[2]!.text()).toBe('😤') // hard
  })

  it('switches between all difficulty levels', async () => {
    const wrapper = mount(DifficultySelector, {
      props: {
        currentDifficulty: 'medium' as Difficulty
      }
    })

    const buttons = wrapper.findAll('.difficulty-btn')

    // Click easy
    await buttons[0]!.trigger('click')
    expect(wrapper.emitted('changeDifficulty')?.[0]).toEqual(['easy'])

    // Click hard
    await buttons[2]!.trigger('click')
    expect(wrapper.emitted('changeDifficulty')?.[1]).toEqual(['hard'])
  })
})
