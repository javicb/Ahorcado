/**
 * Ejemplos de Uso de la API RAE
 *
 * Este archivo contiene ejemplos de cómo usar el servicio raeApi.ts
 * en diferentes escenarios del juego.
 */

import { getRandomWord, getDailyWord } from './services/raeApi'

// =============================================================================
// EJEMPLO 1: Obtener palabra aleatoria básica
// =============================================================================
async function example1_BasicRandomWord() {
  try {
    const word = await getRandomWord()
    console.log('Palabra aleatoria obtenida:', word)
    // Output esperado: "CASA" (o cualquier palabra del diccionario RAE)
  } catch (error) {
    console.error('Error al obtener palabra:', error)
  }
}

// =============================================================================
// EJEMPLO 2: Obtener palabra con manejo de fallback
// =============================================================================
async function example2_WithFallback() {
  const fallbackWords = ['CASA', 'PERRO', 'GATO', 'ÁRBOL']

  try {
    const word = await getRandomWord()
    return word
  } catch (error) {
    console.warn('API no disponible, usando palabra de respaldo')
    const randomIndex = Math.floor(Math.random() * fallbackWords.length)
    return fallbackWords[randomIndex]
  }
}

// =============================================================================
// EJEMPLO 3: Obtener palabra del día
// =============================================================================
async function example3_DailyWord() {
  try {
    const word = await getDailyWord()
    console.log('Palabra del día:', word)
    // La palabra del día es la misma durante todo el día
  } catch (error) {
    console.error('Error al obtener palabra del día:', error)
  }
}

// =============================================================================
// EJEMPLO 4: Uso en un componente Vue (Composition API)
// =============================================================================
/*
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getRandomWord } from './services/raeApi'

const word = ref<string>('')
const isLoading = ref<boolean>(false)
const error = ref<string | null>(null)

async function fetchWord() {
  isLoading.value = true
  error.value = null

  try {
    word.value = await getRandomWord()
  } catch (err) {
    error.value = 'No se pudo obtener la palabra'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchWord()
})
</script>

<template>
  <div v-if="isLoading">Cargando palabra...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else>{{ word }}</div>
</template>
*/

// =============================================================================
// EJEMPLO 5: Uso con Promise.all para múltiples palabras
// =============================================================================
async function example5_MultipleWords() {
  try {
    // Obtener 3 palabras aleatorias en paralelo
    const [word1, word2, word3] = await Promise.all([
      getRandomWord(),
      getRandomWord(),
      getRandomWord()
    ])

    console.log('Palabras obtenidas:', [word1, word2, word3])
    return [word1, word2, word3]
  } catch (error) {
    console.error('Error al obtener múltiples palabras:', error)
    return []
  }
}

// =============================================================================
// EJEMPLO 6: Retry con exponential backoff
// =============================================================================
async function example6_WithRetry(maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const word = await getRandomWord()
      return word
    } catch (error) {
      if (attempt === maxRetries) {
        throw new Error('Máximo de reintentos alcanzado')
      }

      // Esperar antes del siguiente intento (exponential backoff)
      const delay = Math.pow(2, attempt) * 1000 // 2s, 4s, 8s
      console.log(`Reintento ${attempt}/${maxRetries} en ${delay}ms...`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}

// =============================================================================
// EJEMPLO 7: Caché de palabras para reducir llamadas a la API
// =============================================================================
class WordCache {
  private cache: Set<string> = new Set()
  private readonly maxSize = 50

  async getRandomWord(): Promise<string> {
    // Si tenemos palabras en caché, usar una aleatoria
    if (this.cache.size > 0 && Math.random() < 0.7) { // 70% probabilidad de usar caché
      const words = Array.from(this.cache)
      return words[Math.floor(Math.random() * words.length)]
    }

    // Obtener nueva palabra de la API
    try {
      const word = await getRandomWord()

      // Añadir a caché si no está llena
      if (this.cache.size < this.maxSize) {
        this.cache.add(word)
      }

      return word
    } catch (error) {
      // Si falla y tenemos caché, usar caché
      if (this.cache.size > 0) {
        const words = Array.from(this.cache)
        return words[Math.floor(Math.random() * words.length)]
      }
      throw error
    }
  }

  clearCache() {
    this.cache.clear()
  }
}

// Uso del caché
async function example7_WithCache() {
  const wordCache = new WordCache()

  // Obtener varias palabras - algunas desde caché, otras desde API
  const word1 = await wordCache.getRandomWord() // API
  const word2 = await wordCache.getRandomWord() // Posiblemente caché
  const word3 = await wordCache.getRandomWord() // Posiblemente caché

  console.log('Palabras:', [word1, word2, word3])
}

// =============================================================================
// EJEMPLO 8: Uso en tests con mocking
// =============================================================================
/*
import { vi, describe, it, expect } from 'vitest'
import { getRandomWord } from './services/raeApi'

// Mock de la API
vi.mock('./services/raeApi', () => ({
  getRandomWord: vi.fn().mockResolvedValue('AGUA')
}))

describe('useHangman', () => {
  it('debe inicializar con palabra de la API', async () => {
    const word = await getRandomWord()
    expect(word).toBe('AGUA')
  })

  it('debe manejar error de API', async () => {
    // Simular error
    vi.mocked(getRandomWord).mockRejectedValueOnce(new Error('API error'))

    try {
      await getRandomWord()
    } catch (error) {
      expect(error).toBeDefined()
    }
  })
})
*/

// =============================================================================
// EJEMPLO 9: Validación de palabra obtenida
// =============================================================================
async function example9_ValidateWord() {
  const word = await getRandomWord()

  // Validaciones básicas
  const validations = {
    notEmpty: word.length > 0,
    isUpperCase: word === word.toUpperCase(),
    onlyLetters: /^[A-ZÁÉÍÓÚÑÜ]+$/.test(word),
    minLength: word.length >= 3,
    maxLength: word.length <= 20
  }

  const isValid = Object.values(validations).every(v => v)

  if (!isValid) {
    console.error('Palabra inválida:', word, validations)
    throw new Error('La palabra obtenida no cumple los requisitos')
  }

  return word
}

// =============================================================================
// EJEMPLO 10: Uso con diferentes niveles de dificultad
// =============================================================================
async function example10_DifficultyLevels(difficulty: 'easy' | 'medium' | 'hard') {
  const word = await getRandomWord()

  // Filtrar por dificultad basada en longitud
  const difficultyRanges = {
    easy: { min: 3, max: 5 },
    medium: { min: 6, max: 8 },
    hard: { min: 9, max: 15 }
  }

  const range = difficultyRanges[difficulty]

  if (word.length >= range.min && word.length <= range.max) {
    return word
  }

  // Si no cumple, intentar obtener otra palabra
  // (En producción, podrías implementar un retry limitado)
  return example10_DifficultyLevels(difficulty)
}

export {
  example1_BasicRandomWord,
  example2_WithFallback,
  example3_DailyWord,
  example5_MultipleWords,
  example6_WithRetry,
  example7_WithCache,
  example9_ValidateWord,
  example10_DifficultyLevels
}
