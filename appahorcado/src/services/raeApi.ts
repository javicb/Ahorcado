/**
 * Servicio para interactuar con la API de RAE
 * https://rae-api.com/docs/api-reference/
 */

const RAE_API_BASE_URL = 'https://rae-api.com/api'

export interface RaeWord {
  id: string
  word: string
}

/**
 * Obtiene una palabra aleatoria del diccionario de la RAE
 * @returns Promise con la palabra aleatoria
 */
export async function getRandomWord(): Promise<string> {
  try {
    const response = await fetch(`${RAE_API_BASE_URL}/random`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    // La API devuelve un objeto con la propiedad 'word'
    if (data && data.word) {
      return data.word.toUpperCase()
    }

    throw new Error('Formato de respuesta inválido')
  } catch (error) {
    console.error('Error al obtener palabra aleatoria de RAE API:', error)
    throw error
  }
}

/**
 * Obtiene la palabra del día del diccionario de la RAE
 * @returns Promise con la palabra del día
 */
export async function getDailyWord(): Promise<string> {
  try {
    const response = await fetch(`${RAE_API_BASE_URL}/daily`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    if (data && data.word) {
      return data.word.toUpperCase()
    }

    throw new Error('Formato de respuesta inválido')
  } catch (error) {
    console.error('Error al obtener palabra del día de RAE API:', error)
    throw error
  }
}
